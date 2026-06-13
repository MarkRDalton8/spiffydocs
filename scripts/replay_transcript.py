#!/usr/bin/env python3
"""
Replay a SPIFFY transcript JSON file against local FastAPI webhook.
Simulates Recall.ai streaming for testing without live meetings.

Usage:
  python scripts/replay_transcript.py \
    --transcript data/transcripts/People_Inc/006.../transcripts/20260304_Call.json \
    --delay 2.0 \
    --bot-id test-bot-001 \
    --webhook-url http://localhost:8000/api/live-call/webhook/recall
"""

import argparse
import asyncio
import httpx
import json
import time
from datetime import datetime


async def replay_transcript(
    transcript_path: str, delay: float, bot_id: str, webhook_url: str, chunk_size: int
):
    """Read SPIFFY transcript and replay against webhook"""

    # Read transcript JSON
    with open(transcript_path) as f:
        data = json.load(f)

    # Extract utterances from SPIFFY format
    # Handle two formats: array of objects OR plain string
    utterances = []
    raw_data = data.get("transcript_data", {}).get("raw", [])

    if isinstance(raw_data, list):
        # Format 1: Array of {speakerId, topic, sentences} (People Inc)
        for block in raw_data:
            speaker_id = block.get("speakerId", "Unknown")
            for sentence in block.get("sentences", []):
                utterances.append(
                    {
                        "speaker_id": speaker_id,
                        "text": sentence.get("text", ""),
                        "start": sentence.get("start", 0),
                    }
                )
    elif isinstance(raw_data, str):
        # Format 2: Plain string (Endeavor) - split by sentences
        # Use the formatted version instead which has better structure
        formatted = data.get("transcript_data", {}).get("formatted", "")
        if formatted:
            # Split by newlines and create simple utterances
            lines = [line.strip() for line in formatted.split('\n') if line.strip()]
            for i, line in enumerate(lines):
                # Try to extract speaker from "Speaker: text" format
                if ':' in line:
                    parts = line.split(':', 1)
                    speaker = parts[0].strip()
                    text = parts[1].strip() if len(parts) > 1 else line
                else:
                    speaker = "Unknown"
                    text = line

                utterances.append({
                    "speaker_id": speaker,
                    "text": text,
                    "start": i * 1000  # Simple timing
                })
        else:
            # Fallback: treat raw string as single utterance
            utterances.append({
                "speaker_id": "Unknown",
                "text": raw_data[:500],  # Limit length
                "start": 0
            })
    else:
        print("⚠️  Unrecognized transcript format")
        return

    print(f"🎬 Replaying transcript: {len(utterances)} utterances")
    print(f"🤖 Bot ID: {bot_id}")
    print(f"📡 Webhook: {webhook_url}")
    print(f"⏱️  Delay: {delay}s per chunk")
    print(f"🌐 Open: http://localhost:3000/live-call?bot_id={bot_id}")
    print("-" * 60)

    async with httpx.AsyncClient() as client:
        # 1. Send bot.joining_call event
        await client.post(
            webhook_url,
            json={
                "event": "bot.joining_call",
                "data": {"bot_id": bot_id, "meeting_url": "replay://test"},
            },
        )
        print("✓ Sent bot.joining_call")

        # 2. Wait 1 second
        await asyncio.sleep(1)

        # 3. Send bot.in_call_recording event
        await client.post(
            webhook_url,
            json={"event": "bot.in_call_recording", "data": {"bot_id": bot_id}},
        )
        print("✓ Sent bot.in_call_recording")

        # 4. Stream transcript chunks
        start_time = time.time()
        for idx, utterance in enumerate(utterances, 1):
            # Format as Recall.ai transcript.data payload
            words = [
                {"text": word, "start_time": utterance["start"] + i * 0.2}
                for i, word in enumerate(utterance["text"].split())
            ]

            payload = {
                "event": "transcript.data",
                "data": {
                    "bot_id": bot_id,
                    "data": {"speaker": utterance["speaker_id"], "words": words},
                },
            }

            # POST to webhook
            try:
                response = await client.post(webhook_url, json=payload)
                if response.status_code != 200:
                    print(f"⚠️  Chunk {idx}/{len(utterances)}: HTTP {response.status_code}")
            except Exception as e:
                print(f"⚠️  Chunk {idx}/{len(utterances)}: Error: {e}")
                continue

            # Print progress
            preview = (
                utterance["text"][:60] + "..."
                if len(utterance["text"]) > 60
                else utterance["text"]
            )
            print(f"Chunk {idx}/{len(utterances)}: {utterance['speaker_id']}: {preview}")

            # Sleep for delay
            if delay > 0:
                await asyncio.sleep(delay)

        # 5. Send bot.done event
        await client.post(
            webhook_url,
            json={"event": "bot.done", "data": {"bot_id": bot_id}},
        )
        print("✓ Sent bot.done")

        elapsed = time.time() - start_time
        print("-" * 60)
        print(f"✅ Replay complete: {len(utterances)} chunks in {elapsed:.1f}s")
        print(f"🌐 View at: http://localhost:3000/live-call?bot_id={bot_id}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Replay SPIFFY transcript against FastAPI webhook"
    )
    parser.add_argument(
        "--transcript", required=True, help="Path to SPIFFY transcript JSON file"
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=2.0,
        help="Seconds between chunks (0 for instant)",
    )
    parser.add_argument(
        "--bot-id", default=f"replay-{int(time.time())}", help="Fake bot ID"
    )
    parser.add_argument(
        "--webhook-url",
        default="http://localhost:8000/api/live-call/webhook/recall",
        help="FastAPI webhook endpoint",
    )
    parser.add_argument(
        "--chunk-size", type=int, default=1, help="Utterances per webhook POST"
    )

    args = parser.parse_args()

    asyncio.run(
        replay_transcript(
            transcript_path=args.transcript,
            delay=args.delay,
            bot_id=args.bot_id,
            webhook_url=args.webhook_url,
            chunk_size=args.chunk_size,
        )
    )
