from fastapi import APIRouter, Request
from sse_starlette import EventSourceResponse
import asyncio
import json

router = APIRouter()


@router.get("/{bot_id}/stream")
async def stream_call_insights(bot_id: str, request: Request):
    """
    SSE endpoint - streams live updates to Next.js frontend.
    Events: connected, status, transcript, insight, meddpicc_update, discovery_nudge, call_ended
    """
    from main import active_sessions, sse_queues

    async def event_generator():
        # Send connection confirmation
        yield {"event": "connected", "data": json.dumps({"bot_id": bot_id})}

        # Send history (existing transcript + insights)
        session = active_sessions.get(bot_id)
        if session:
            yield {
                "event": "history",
                "data": json.dumps(
                    {
                        "transcript": session["transcript"],
                        "insights": session["insights"],
                    }
                ),
            }

        # Stream new events
        queue = sse_queues.get(bot_id)
        if not queue:
            # If no queue yet, wait a bit for session to be created
            await asyncio.sleep(1)
            queue = sse_queues.get(bot_id)
            if not queue:
                yield {"event": "error", "data": json.dumps({"error": "session not found"})}
                return

        last_ping = asyncio.get_event_loop().time()

        while True:
            if await request.is_disconnected():
                break

            try:
                # Wait for next event with timeout
                event = await asyncio.wait_for(queue.get(), timeout=30.0)
                yield {"event": event["type"], "data": json.dumps(event["data"])}
                last_ping = asyncio.get_event_loop().time()

            except asyncio.TimeoutError:
                # Send keepalive ping every 30 seconds
                if asyncio.get_event_loop().time() - last_ping > 30:
                    yield {"event": "ping", "data": "{}"}
                    last_ping = asyncio.get_event_loop().time()

    return EventSourceResponse(event_generator())
