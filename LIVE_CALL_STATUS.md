# Live Call Intelligence - Current Status

## ✅ What's Working

1. **Backend Infrastructure**
   - FastAPI backend running on port 8000
   - Recall.ai API integration (us-west-2 region)
   - ngrok tunnel for webhook URLs: `https://uncitied-hyacinth-malleably.ngrok-free.dev`
   - CORS configured correctly

2. **Bot Joining**
   - Successfully joins Microsoft Teams meetings
   - Appears as "SPIFFY Guest" in the meeting
   - Creates recording (video MP4)
   - Tracks participant events

3. **Frontend**
   - Next.js UI at http://localhost:3000/live-call
   - Google OAuth authentication working
   - "Join Meeting" button functional
   - Error messages display correctly

## ❌ What's NOT Working Yet

1. **Live Transcription**
   - Transcript comes back as `null` from Recall.ai
   - Removed transcription config to get bot to join successfully
   - Need to configure transcription provider

2. **Real-time Insights**
   - No transcript = no insights
   - Claude processor not receiving data
   - SSE stream not receiving events

## 🔧 What Needs To Be Done

### Step 1: Configure Recall.ai Transcription

**Option A: Use Recall.ai's built-in transcription**
1. Go to: https://us-west-2.recall.ai/dashboard/transcription
2. Configure a transcription provider (Deepgram recommended)
3. Update `recall_client.py` to include transcription config:
   ```python
   "transcription_options": {"provider": "deepgram"},
   ```

**Option B: Use AssemblyAI**
1. Get AssemblyAI API key
2. Add to Recall.ai dashboard: https://us-west-2.recall.ai/dashboard/transcription
3. Update `recall_client.py`:
   ```python
   "transcription_options": {"provider": "assembly_ai"},
   ```

### Step 2: Enable Real-time Webhooks

Once transcription is configured, add back the webhook config in `recall_client.py`:

```python
"real_time_transcription": {
    "destination_url": f"{self.webhook_base}/webhook/recall",
    "partial_results": False,
},
```

### Step 3: Test End-to-End

1. Start ngrok: `ngrok http 8000`
2. Update `.env` with new ngrok URL
3. Restart backend
4. Join a Teams meeting
5. Make test comments about competitors
6. Verify insights appear in real-time

## 📝 Important Notes

### ngrok URL Changes
- **Current URL**: `https://uncitied-hyacinth-malleably.ngrok-free.dev`
- **Important**: This URL changes every time ngrok restarts!
- **Must update** `/Users/markdalton/code/spiffydocs/backend/.env` with new URL
- **Restart backend** after updating .env

### Environment Variables

Required in `/Users/markdalton/code/spiffydocs/backend/.env`:
```bash
RECALLAI_API_KEY=3b8b234d03c808037569f289050ee7ac7173e2ee
WEBHOOK_BASE_URL=https://[your-ngrok-url].ngrok-free.dev
OPENWEBUI_API_KEY=sk-1AONZfRfXh--OKuG3vnx0A
OPENWEBUI_ENDPOINT=https://llm.de-prod.cxense.com/
OPENWEBUI_MODEL=us.anthropic.claude-opus-4-6-v1
```

### Startup Commands

**Terminal 1: ngrok**
```bash
ngrok http 8000
# Copy the URL and update .env
```

**Terminal 2: Backend**
```bash
cd /Users/markdalton/code/spiffydocs/backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

**Terminal 3: Frontend**
```bash
cd /Users/markdalton/code/spiffydocs
npm run dev
# Open http://localhost:3000/live-call
```

## 🧪 Alternative: Test with Replay Script

If you want to test the full pipeline without configuring Recall.ai:

```bash
cd /Users/markdalton/code/spiffydocs
python scripts/replay_transcript.py \
  --transcript /Users/markdalton/code/spiffy-cli/data/transcripts/[path-to-transcript].json \
  --delay 2.0 \
  --bot-id test-bot-001 \
  --webhook-url http://localhost:8000/webhook/recall
```

Then open: http://localhost:3000/live-call?bot_id=test-bot-001

## 📋 Today's Test Results

**Test Meeting Details:**
- Bot ID: `85061f9c-5f47-485f-bc8b-ba13cf2395ec`
- Recording ID: `4876ce2c-9d44-432c-a706-62af528620b9`
- Platform: Microsoft Teams Live
- Duration: ~3 minutes (20:35 - 20:38 UTC)
- Video: Available (MP4 download link in Recall.ai)
- Transcript: **null** (transcription not configured)

**What We Tested:**
- ✅ Bot joins Teams meeting successfully
- ✅ No errors in UI
- ✅ Recording captured
- ❌ No transcript (expected - transcription disabled)
- ❌ No live insights (expected - no transcript data)

## 🎯 Next Session Goals

1. Configure transcription provider in Recall.ai dashboard
2. Test with real Teams meeting + live transcription
3. Verify insights appear in real-time as you speak
4. Test competitor/MEDDPICC detection with live data
5. Export discovery nudges feature

---

**Last Updated**: April 2, 2026  
**Status**: Ready for transcription configuration
