import requests
import json
import os
from datetime import datetime
from dotenv import load_dotenv
from discovery_guidance import DISCOVERY_QUESTIONS

load_dotenv()


class OpenWebUIClient:
    """Piano Open WebUI client - same as spiffy-cli"""

    def __init__(self):
        self.endpoint = os.getenv("OPENWEBUI_ENDPOINT", "").rstrip('/')
        self.api_key = os.getenv("OPENWEBUI_API_KEY")
        self.model = os.getenv("OPENWEBUI_MODEL", "claude-3-sonnet")

        if not self.endpoint:
            raise ValueError("OPENWEBUI_ENDPOINT not set in .env")
        if not self.api_key:
            raise ValueError("OPENWEBUI_API_KEY not set in .env")

    def generate(self, prompt: str, temperature: float = 0.1, max_tokens: int = 4000) -> str:
        """Generate using Piano's Open WebUI - same pattern as spiffy-cli"""
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }

        payload = {
            'model': self.model,
            'messages': [
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'temperature': temperature,
            'max_tokens': max_tokens
        }

        try:
            url = f'{self.endpoint}/api/chat/completions'

            response = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=120
            )

            if response.status_code == 200:
                data = response.json()
                return data['choices'][0]['message']['content']
            else:
                raise Exception(
                    f"API error - Status {response.status_code}: {response.text[:200]}"
                )

        except requests.exceptions.Timeout:
            raise Exception(
                "Request timeout (>120s). Try a shorter transcript or different model."
            )
        except Exception as e:
            raise Exception(f"Open WebUI API error: {e}")


async def analyze_transcript(bot_id: str, triggers: list[dict], active_sessions: dict, sse_queues: dict):
    """
    Background task - analyze recent transcript window with Claude.
    Runs every 10 chunks OR when triggers detected.
    """
    session = active_sessions.get(bot_id)
    if not session:
        return

    # Get last N chunks (with 5-chunk overlap for context)
    last_idx = session["last_analyzed_idx"]
    start_idx = max(0, last_idx - 5)
    chunks_to_analyze = session["transcript"][start_idx:]

    if not chunks_to_analyze:
        return

    # Build transcript text
    transcript_text = "\n".join(
        [f"{chunk['speaker']}: {chunk['text']}" for chunk in chunks_to_analyze]
    )

    # Get discovery gaps for context (V2)
    tracker = session["discovery_tracker"]
    coverage = tracker.get_coverage_summary()
    missing_questions = [
        q["question"]
        for q in DISCOVERY_QUESTIONS
        if q["id"] in coverage["missing_high_priority"]
    ]
    missing_text = "\n".join(f"- {q}" for q in missing_questions[:3])

    # Build LLM prompt
    prompt = f"""Analyze this sales call transcript segment.

Transcript:
{transcript_text}

Triggers detected: {', '.join([t.get('keyword', t.get('signal', '')) for t in triggers])}

DISCOVERY GAPS (high-priority questions not yet asked):
{missing_text if missing_text else "All high-priority questions covered ✓"}

Return ONLY valid JSON (no markdown, no explanation):
{{
    "insights": [
        {{
            "type": "competitor|objection|buying_signal|meddpicc|action_item",
            "severity": "high|medium|low",
            "text": "one sentence insight",
            "suggested_response": "one sentence for SE (high severity only, optional)"
        }}
    ],
    "meddpicc_updates": {{
        "metrics": "signal text or null",
        "economic_buyer": "signal text or null",
        "decision_criteria": "signal text or null",
        "decision_process": "signal text or null",
        "paper_process": "signal text or null",
        "identify_pain": "signal text or null",
        "champion": "signal text or null",
        "competition": "signal text or null"
    }}
}}

Rules:
- Max 3 insights
- Only include clear evidence (not generic observations)
- Be specific, cite exact quotes
- Return empty array if nothing noteworthy
- If discovery gap presents opportunity, include as discovery_nudge insight type
"""

    # Call Piano Open WebUI (same as spiffy-cli)
    client = OpenWebUIClient()
    response_text = client.generate(prompt, temperature=0.1, max_tokens=4000)

    # Parse JSON response (strip markdown fences if present)
    result_text = response_text.strip()
    if result_text.startswith("```"):
        # Remove markdown code fences
        lines = result_text.split("\n")
        result_text = "\n".join(lines[1:-1]) if len(lines) > 2 else result_text

    try:
        result = json.loads(result_text)
    except json.JSONDecodeError:
        print(f"Failed to parse Claude response: {result_text[:200]}")
        return

    # Append insights to session
    for insight in result.get("insights", []):
        insight_with_timestamp = {
            **insight,
            "timestamp": datetime.utcnow().isoformat(),
        }
        session["insights"].append(insight_with_timestamp)

        # Push to SSE
        await sse_queues[bot_id].put({"type": "insight", "data": insight_with_timestamp})

    # Update MEDDPICC state
    meddpicc_updates = result.get("meddpicc_updates", {})
    for letter, signal_text in meddpicc_updates.items():
        if signal_text:
            await sse_queues[bot_id].put(
                {"type": "meddpicc_update", "data": {"letter": letter, "signal": signal_text}}
            )

    # Update last analyzed index
    session["last_analyzed_idx"] = len(session["transcript"])
