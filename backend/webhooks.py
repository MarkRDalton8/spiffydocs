from fastapi import APIRouter, BackgroundTasks
from datetime import datetime
import asyncio
from recall_client import RecallClient
from discovery_guidance import DiscoveryTracker
from claude_processor import analyze_transcript

router = APIRouter()


def detect_triggers(text: str, COMPETITOR_KEYWORDS, OBJECTION_KEYWORDS, BUYING_SIGNAL_KEYWORDS, MEDDPICC_KEYWORDS) -> list[dict]:
    """Detect trigger keywords in transcript text"""
    text_lower = text.lower()
    triggers = []

    for keyword in COMPETITOR_KEYWORDS:
        if keyword in text_lower:
            triggers.append({"type": "competitor", "keyword": keyword})

    for keyword in OBJECTION_KEYWORDS:
        if keyword in text_lower:
            triggers.append({"type": "objection", "keyword": keyword})

    for keyword in BUYING_SIGNAL_KEYWORDS:
        if keyword in text_lower:
            triggers.append({"type": "buying_signal", "keyword": keyword})

    for signal, keywords in MEDDPICC_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            triggers.append({"type": "meddpicc", "signal": signal})

    return triggers


@router.post("/webhook/recall")
async def receive_recall_webhook(payload: dict, background_tasks: BackgroundTasks):
    """
    Handle Recall.ai webhook events:
    - bot.joining_call, bot.in_call_recording -> push status to SSE
    - transcript.data -> append to session, detect triggers, maybe analyze
    - bot.done -> push call_ended to SSE
    """
    # Import from main module to access module-level state
    from main import active_sessions, sse_queues, COMPETITOR_KEYWORDS, OBJECTION_KEYWORDS, BUYING_SIGNAL_KEYWORDS, MEDDPICC_KEYWORDS

    event_type = payload.get("event")
    data = payload.get("data", {})
    bot_id = data.get("bot_id")

    if event_type in ["bot.joining_call", "bot.in_call_recording"]:
        # Initialize session on first event
        if bot_id not in active_sessions:
            active_sessions[bot_id] = {
                "transcript": [],
                "insights": [],
                "started_at": datetime.utcnow(),
                "last_analyzed_idx": 0,
                "discovery_tracker": DiscoveryTracker(),
            }
            sse_queues[bot_id] = asyncio.Queue()

        # Push status event to SSE
        await sse_queues[bot_id].put(
            {"type": "status", "data": {"status": event_type, "bot_id": bot_id}}
        )

    elif event_type == "transcript.data":
        session = active_sessions.get(bot_id)
        if not session:
            return {"status": "session not found"}

        # Extract speaker and text from Recall.ai format
        speaker = data.get("data", {}).get("speaker", "Unknown")
        words = data.get("data", {}).get("words", [])
        text = " ".join([w["text"] for w in words])

        # Append to transcript
        session["transcript"].append(
            {"speaker": speaker, "text": text, "timestamp": datetime.utcnow().isoformat()}
        )

        # Push transcript chunk to SSE
        await sse_queues[bot_id].put({"type": "transcript", "data": {"speaker": speaker, "text": text}})

        # Detect triggers
        triggers = detect_triggers(text, COMPETITOR_KEYWORDS, OBJECTION_KEYWORDS, BUYING_SIGNAL_KEYWORDS, MEDDPICC_KEYWORDS)

        # Discovery guidance (V2)
        discovery_nudges = session["discovery_tracker"].process_chunk(text, speaker)
        for nudge in discovery_nudges:
            # Add timestamp
            nudge["timestamp"] = datetime.utcnow().isoformat()
            # Store in session insights
            session["insights"].append(nudge)
            # Send to SSE
            await sse_queues[bot_id].put({"type": "discovery_nudge", "data": nudge})
            # Log for debugging
            print(f"🎯 Discovery nudge fired: {nudge['category']} - {nudge.get('question_id', 'unknown')}")

        # Check for late-call nudges every 10 chunks
        if len(session["transcript"]) % 10 == 0:
            late_nudges = session["discovery_tracker"].get_late_call_nudges()
            for nudge in late_nudges:
                # Add timestamp
                nudge["timestamp"] = datetime.utcnow().isoformat()
                # Store in session insights
                session["insights"].append(nudge)
                # Send to SSE
                await sse_queues[bot_id].put({"type": "discovery_nudge", "data": nudge})

        # Trigger Claude analysis if:
        # - 10+ new chunks since last analysis OR
        # - Triggers found
        new_chunks = len(session["transcript"]) - session["last_analyzed_idx"]
        if new_chunks >= 10 or triggers:
            background_tasks.add_task(analyze_transcript, bot_id, triggers, active_sessions, sse_queues)

    elif event_type == "bot.done":
        # Push call ended event
        if bot_id in sse_queues:
            await sse_queues[bot_id].put({"type": "call_ended", "data": {"bot_id": bot_id}})

    return {"status": "ok"}


@router.post("/start")
async def start_live_call(payload: dict):
    """Start a Recall.ai bot and join meeting"""
    from main import active_sessions, sse_queues
    from fastapi import HTTPException

    meeting_url = payload.get("meeting_url")
    opportunity_id = payload.get("opportunity_id")

    try:
        client = RecallClient()
        bot_data = await client.create_bot(meeting_url)
        bot_id = bot_data["id"]

        # Initialize session
        active_sessions[bot_id] = {
            "transcript": [],
            "insights": [],
            "opportunity_id": opportunity_id,
            "started_at": datetime.utcnow(),
            "last_analyzed_idx": 0,
            "discovery_tracker": DiscoveryTracker(),
        }
        sse_queues[bot_id] = asyncio.Queue()

        return {"bot_id": bot_id, "status": "joining"}
    except Exception as e:
        error_msg = str(e)
        print(f"Error starting bot: {error_msg}")
        raise HTTPException(status_code=400, detail=error_msg)


@router.post("/stop")
async def stop_live_call(payload: dict):
    """Stop a Recall.ai bot"""
    bot_id = payload.get("bot_id")

    client = RecallClient()
    await client.remove_bot(bot_id)

    return {"status": "removed"}


@router.get("/{bot_id}/status")
async def get_call_status(bot_id: str):
    """Get call status including discovery coverage"""
    from main import active_sessions

    session = active_sessions.get(bot_id)
    if not session:
        return {"error": "session not found"}

    client = RecallClient()
    try:
        bot_status = await client.get_bot_status(bot_id)
    except Exception as e:
        bot_status = {"error": str(e)}

    return {
        "bot_status": bot_status,
        "transcript_chunks": len(session["transcript"]),
        "insights_count": len(session["insights"]),
        "discovery_coverage": session["discovery_tracker"].get_coverage_summary(),
    }
