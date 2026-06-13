# SpiffyDocs Project Runbook

Complete operational guide for running the SpiffyDocs platform.

---

## Table of Contents

1. [Live Call Intelligence](#live-call-intelligence)
2. [Portfolio Dashboard](#portfolio-dashboard)
3. [Production Deployment](#production-deployment)
4. [Troubleshooting](#troubleshooting)

---

## Live Call Intelligence

### Prerequisites

- **Node.js 18+** and **npm** installed
- **Python 3.9+** with **pip**
- **ngrok** account (free tier works): https://ngrok.com
- **Recall.ai** account with API key
- **Claude API** access via OpenWebUI

### Local Development Setup

#### Step 1: Install Dependencies

```bash
# Frontend dependencies
cd /Users/markdalton/code/spiffydocs
npm install

# Backend dependencies
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### Step 2: Configure Environment Variables

Create/update `backend/.env`:

```bash
# Recall.ai (us-west-2 region)
RECALLAI_API_KEY=3b8b234d03c808037569f289050ee7ac7173e2ee
WEBHOOK_BASE_URL=https://[your-ngrok-url].ngrok-free.dev

# Claude AI via OpenWebUI
OPENWEBUI_API_KEY=sk-1AONZfRfXh--OKuG3vnx0A
OPENWEBUI_ENDPOINT=https://llm.de-prod.cxense.com/
OPENWEBUI_MODEL=us.anthropic.claude-opus-4-6-v1

ENVIRONMENT=development
```

Create/update `.env.local` (frontend):

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

#### Step 3: Start Services (3 Terminals)

**Terminal 1: ngrok (Public Tunnel)**

```bash
ngrok http 8000
```

**Copy the ngrok URL** (e.g., `https://abc123.ngrok-free.dev`) and update `backend/.env`:

```bash
WEBHOOK_BASE_URL=https://abc123.ngrok-free.dev
```

**Terminal 2: Backend (FastAPI)**

```bash
cd /Users/markdalton/code/spiffydocs/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

Verify backend is running: http://localhost:8000/health

**Terminal 3: Frontend (Next.js)**

```bash
cd /Users/markdalton/code/spiffydocs
npm run dev
```

Access the app: http://localhost:3000/live-call

#### Step 4: Join a Meeting

1. Navigate to http://localhost:3000/live-call
2. Sign in with Google OAuth
3. Paste a Teams/Zoom/Meet URL
4. Click "Join Meeting"
5. Bot appears as "SPIFFY Guest"

**Note:** Transcription requires additional Recall.ai configuration (see [Transcription Setup](#transcription-setup))

---

### Testing with Replay Script

Test the full pipeline without joining a real meeting using SPIFFY transcripts.

#### Quick Test

```bash
cd /Users/markdalton/code/spiffydocs

# Fast mode (instant replay)
python scripts/replay_transcript.py \
  --transcript /Users/markdalton/code/spiffy-cli/data/transcripts/[company]/[opp-id]/transcripts/[date]_Call.json \
  --delay 0 \
  --bot-id test-bot-001 \
  --webhook-url http://localhost:8000/webhook/recall

# Open in browser:
# http://localhost:3000/live-call?bot_id=test-bot-001
```

#### Realistic Simulation (2s delay)

```bash
python scripts/replay_transcript.py \
  --transcript /Users/markdalton/code/spiffy-cli/data/transcripts/People_Inc.*/006*/transcripts/20260204*.json \
  --delay 2.0 \
  --bot-id test-realtime-001 \
  --webhook-url http://localhost:8000/webhook/recall
```

#### Replay Script Options

```bash
python scripts/replay_transcript.py --help

Options:
  --transcript PATH      Path to SPIFFY transcript JSON file (required)
  --delay FLOAT         Seconds between chunks (0 for instant, 2.0 for realistic)
  --bot-id STRING       Fake bot ID (default: replay-{timestamp})
  --webhook-url URL     FastAPI webhook endpoint (default: http://localhost:8000/webhook/recall)
  --chunk-size INT      Utterances per webhook POST (default: 1)
```

#### Expected Behavior (with People Inc. transcript)

When replaying a real transcript:
- ✅ Competitor mentions trigger instant insights
- ✅ MEDDPICC signals light up scorecard
- ✅ Discovery nudges fire when key questions are missed
- ✅ Transcript appears in real-time on the right panel
- ✅ Insights appear on the left panel with severity colors

---

### Transcription Setup

**Current Status:** Transcription is **disabled** to allow bot joining without configuration.

To enable live transcription:

#### Option 1: Deepgram (Recommended)

1. Go to https://us-west-2.recall.ai/dashboard/transcription
2. Add Deepgram API credentials
3. Update `backend/recall_client.py`:

```python
json={
    "meeting_url": meeting_url,
    "bot_name": bot_name,
    "transcription_options": {"provider": "deepgram"},
    "real_time_transcription": {
        "destination_url": f"{self.webhook_base}/webhook/recall",
        "partial_results": False,
    },
}
```

4. Restart backend

#### Option 2: AssemblyAI

1. Get AssemblyAI API key: https://www.assemblyai.com/
2. Add to Recall.ai dashboard
3. Update `backend/recall_client.py`:

```python
"transcription_options": {"provider": "assembly_ai"},
```

---

### Production Deployment

#### Backend: Railway

**Prerequisites:**
- Railway account: https://railway.app
- GitHub repo connected

**Deployment Steps:**

1. **Create New Project**
   ```bash
   # Push latest code
   git add backend/
   git commit -m "Deploy live call backend"
   git push origin main
   ```

2. **Configure Railway**
   - New Project → Deploy from GitHub
   - Select `spiffydocs` repo
   - Root directory: `backend/`
   - Auto-detects `Procfile`

3. **Set Environment Variables**
   ```
   RECALLAI_API_KEY=3b8b234d03c808037569f289050ee7ac7173e2ee
   OPENWEBUI_API_KEY=sk-1AONZfRfXh--OKuG3vnx0A
   OPENWEBUI_ENDPOINT=https://llm.de-prod.cxense.com/
   OPENWEBUI_MODEL=us.anthropic.claude-opus-4-6-v1
   WEBHOOK_BASE_URL=https://[your-app].railway.app
   ENVIRONMENT=production
   ```

4. **Deploy**
   - Railway auto-deploys on push
   - Get URL: `https://[your-app].railway.app`

5. **Update Recall.ai Webhooks**
   - If using real-time transcription, configure webhook in Recall.ai dashboard
   - Webhook URL: `https://[your-app].railway.app/webhook/recall`

#### Frontend: Vercel

**Prerequisites:**
- Vercel account: https://vercel.com
- GitHub repo connected

**Deployment Steps:**

1. **Connect Repository**
   - Import Git Repository → Select `spiffydocs`
   - Framework: Next.js
   - Root: `/` (project root)

2. **Set Environment Variables**
   ```
   NEXT_PUBLIC_BACKEND_URL=https://[your-app].railway.app
   ```

3. **Deploy**
   - Auto-deploys on push to main
   - Production URL: `https://spiffydocs.ai`

4. **Test Production**
   - Visit: `https://spiffydocs.ai/live-call`
   - Sign in with Google
   - Join a meeting

---

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Live Call Flow                          │
└─────────────────────────────────────────────────────────────┘

1. User Interface (Next.js)
   │
   ├─ http://localhost:3000/live-call (local)
   └─ https://spiffydocs.ai/live-call (production)

2. Backend API (FastAPI)
   │
   ├─ http://localhost:8000 (local via ngrok)
   └─ https://[your-app].railway.app (production)

3. External Services
   │
   ├─ Recall.ai (us-west-2)
   │  ├─ Bot joins meeting
   │  ├─ Records audio/video
   │  ├─ Transcribes (if configured)
   │  └─ Sends webhooks → Backend
   │
   └─ OpenWebUI/Claude
      └─ Processes transcript → Generates insights

4. Data Flow
   │
   User clicks "Join Meeting"
      → Backend creates Recall.ai bot
      → Bot joins Teams/Zoom/Meet
      → Recall.ai sends transcript chunks to webhook
      → Backend processes with Claude
      → Insights stream via SSE to frontend
      → UI displays live insights + MEDDPICC scorecard
```

---

### Key Endpoints

**Backend API:**

- `GET /health` - Health check
- `POST /api/live-call/start` - Start bot and join meeting
- `POST /api/live-call/stop` - Remove bot from meeting
- `GET /api/live-call/{bot_id}/status` - Get call status
- `GET /api/live-call/{bot_id}/stream` - SSE stream for live insights
- `POST /webhook/recall` - Webhook receiver for Recall.ai events

**Frontend Routes:**

- `/` - Landing page
- `/dashboard` - Portfolio intelligence dashboard
- `/live-call` - Live call intelligence interface

---

## Portfolio Dashboard

### Local Development

```bash
cd /Users/markdalton/code/spiffydocs
npm run dev
```

Access: http://localhost:3000/dashboard

### Data Refresh

The dashboard reads from `/public/data/portfolio_report_latest.json`.

To update with fresh data:

```bash
# Generate new report from spiffy-cli
cd /Users/markdalton/code/spiffy-cli
python3 portfolio_report_generator.py

# Copy to spiffydocs
cp data/reports/portfolio_report_latest.json \
   /Users/markdalton/code/spiffydocs/public/data/
```

Or use the automated script:

```bash
cd /Users/markdalton/code/spiffydocs
./update-portfolio-data.sh
```

### Production Deployment

Dashboard is deployed to Vercel alongside the live-call feature. Data updates require:

1. Generate new report in spiffy-cli
2. Copy JSON to `public/data/`
3. Commit and push to GitHub
4. Vercel auto-deploys

**Future Enhancement:** Set up automated daily refresh via GitHub Actions.

---

## Troubleshooting

### Live Call Issues

**Bot won't join meeting**

Check error message in UI:

1. **"403 Forbidden - localhost URL"**
   - ngrok not running or `.env` not updated
   - Fix: Restart ngrok, update `WEBHOOK_BASE_URL` in `.env`, restart backend

2. **"403 Forbidden - authentication"**
   - API key wrong or wrong region
   - Verify: `RECALLAI_API_KEY` in `.env`
   - Current region: `us-west-2`

3. **"400 Bad Request - transcription not configured"**
   - AssemblyAI/Deepgram not set up in Recall.ai
   - Fix: Remove transcription config or configure provider (see [Transcription Setup](#transcription-setup))

**No transcript appearing**

1. Transcription is disabled by default
2. Either:
   - Configure transcription in Recall.ai dashboard
   - Use replay script to test without real meeting

**Insights not appearing**

1. Check backend logs for Claude API errors
2. Verify `OPENWEBUI_API_KEY` is valid
3. Check SSE connection in browser DevTools → Network

**ngrok URL keeps changing**

- This is normal for free tier
- Options:
  - Keep ngrok running (don't restart)
  - Upgrade to ngrok paid ($8/mo) for reserved domain
  - Deploy to Railway for permanent URL

### Dashboard Issues

**"Loading..." never finishes**

1. Check if JSON file exists: `/public/data/portfolio_report_latest.json`
2. Verify JSON is valid (not corrupted)
3. Check browser console for CORS errors

**Data is stale**

- Run `update-portfolio-data.sh` to refresh
- Or manually regenerate from spiffy-cli

**Google OAuth fails**

1. Verify NextAuth is configured in `.env.local`
2. Check callback URLs in Google Cloud Console
3. Development: `http://localhost:3000/api/auth/callback/google`
4. Production: `https://spiffydocs.ai/api/auth/callback/google`

---

## Quick Reference

### Start Everything (Local)

```bash
# Terminal 1: ngrok
ngrok http 8000

# Terminal 2: Backend (update .env with ngrok URL first!)
cd /Users/markdalton/code/spiffydocs/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Terminal 3: Frontend
cd /Users/markdalton/code/spiffydocs
npm run dev

# Open browser:
# http://localhost:3000/live-call
```

### Test with Replay Script

```bash
cd /Users/markdalton/code/spiffydocs
python scripts/replay_transcript.py \
  --transcript /Users/markdalton/code/spiffy-cli/data/transcripts/[path].json \
  --delay 2.0 \
  --bot-id test-001

# Open: http://localhost:3000/live-call?bot_id=test-001
```

### Stop Everything

```bash
# Stop ngrok: Ctrl+C in Terminal 1
# Stop backend: Ctrl+C in Terminal 2
# Stop frontend: Ctrl+C in Terminal 3

# Remove any stuck bots:
curl -X POST https://us-west-2.recall.ai/api/v1/bot/{bot_id}/leave \
  -H "Authorization: Token 3b8b234d03c808037569f289050ee7ac7173e2ee"
```

---

## Additional Resources

- **Recall.ai Docs**: https://docs.recall.ai
- **Recall.ai Dashboard**: https://us-west-2.recall.ai/dashboard
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Live Call Status**: See `LIVE_CALL_STATUS.md` for detailed current state

---

**Last Updated**: April 2, 2026  
**Maintained by**: Mark Dalton
