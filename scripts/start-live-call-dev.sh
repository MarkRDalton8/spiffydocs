#!/bin/bash
# Start ngrok + FastAPI for live call dev

set -e

echo "🚀 Starting Live Call Dev Environment"
echo "======================================"

# 1. Start ngrok in background
echo "Starting ngrok on port 8000..."
ngrok http 8000 > /dev/null 2>&1 &
NGROK_PID=$!

# 2. Wait for ngrok to initialize
sleep 3

# 3. Fetch ngrok URL
echo "Fetching ngrok URL..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "import sys, json; print(json.load(sys.stdin)['tunnels'][0]['public_url'])")

if [ -z "$NGROK_URL" ]; then
    echo "❌ Failed to get ngrok URL"
    kill $NGROK_PID
    exit 1
fi

echo "✅ ngrok URL: $NGROK_URL"

# 4. Update WEBHOOK_BASE_URL in .env
if [ -f backend/.env ]; then
    sed -i.bak "s|WEBHOOK_BASE_URL=.*|WEBHOOK_BASE_URL=$NGROK_URL|" backend/.env
    echo "✅ Updated backend/.env with WEBHOOK_BASE_URL"
else
    echo "⚠️  backend/.env not found, creating..."
    echo "WEBHOOK_BASE_URL=$NGROK_URL" >> backend/.env
fi

# 5. Start FastAPI
echo "Starting FastAPI on port 8000..."
cd backend
source venv/bin/activate 2>/dev/null || echo "⚠️  No venv found, using system python"
uvicorn main:app --reload --port 8000 &
FASTAPI_PID=$!

echo ""
echo "======================================"
echo "✅ Dev Environment Ready"
echo "======================================"
echo "ngrok URL: $NGROK_URL"
echo "FastAPI: http://localhost:8000"
echo "Next.js: http://localhost:3000/live-call"
echo ""
echo "Configure Recall.ai webhook:"
echo "  $NGROK_URL/api/live-call/webhook/recall"
echo ""
echo "Press Ctrl+C to stop all services"
echo "======================================"

# Wait for Ctrl+C
trap "kill $NGROK_PID $FASTAPI_PID; exit" INT
wait
