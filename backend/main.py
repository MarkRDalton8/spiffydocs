from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from datetime import datetime
from collections import deque

app = FastAPI(title="Spiffy Live Call Intelligence")

# CRITICAL: CORS must be configured from day one
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://spiffydocs.ai",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Module-level state (Phase 1 in-memory simplicity)
# active_sessions keyed by bot_id
active_sessions: dict[str, dict] = {}

# sse_queues keyed by bot_id
sse_queues: dict[str, asyncio.Queue] = {}

# Keyword lists for trigger detection
COMPETITOR_KEYWORDS = [
    "blueconic", "tealium", "segment", "ga4", "google analytics",
    "mixpanel", "amplitude", "heap", "fullstory", "freshpaint",
    "adobe", "salesforce", "hubspot", "gong", "chorus", "clari"
]

OBJECTION_KEYWORDS = [
    "too expensive", "not in budget", "need to think",
    "let us think", "revisit", "not ready", "not the right time"
]

BUYING_SIGNAL_KEYWORDS = [
    "when can we start", "how do we get started", "next steps",
    "contract", "procurement", "legal review", "send the agreement"
]

MEDDPICC_KEYWORDS = {
    "metrics": ["roi", "revenue", "cost", "savings", "kpi", "target"],
    "economic_buyer": ["cfo", "cto", "budget owner", "decision maker"],
    "decision_criteria": ["requirements", "must have", "evaluation"],
    "decision_process": ["approval", "timeline", "steps", "committee"],
    "paper_process": ["contract", "legal", "procurement", "msa"],
    "identify_pain": ["problem", "challenge", "pain point", "struggling"],
    "champion": ["advocate", "supporter", "champion", "sponsor"],
    "competition": ["evaluating", "alternatives", "competitors", "shortlist"]
}

# Import routers
from webhooks import router as webhooks_router
from sse import router as sse_router

app.include_router(webhooks_router, prefix="/api/live-call")
app.include_router(sse_router, prefix="/api/live-call")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "active_sessions": len(active_sessions)}
