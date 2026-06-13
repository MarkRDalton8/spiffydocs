import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const botId = searchParams.get('bot_id')

  if (!botId) {
    return new Response('Missing bot_id', { status: 400 })
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
  const response = await fetch(`${backendUrl}/api/live-call/${botId}/stream`)

  // Stream response with SSE headers
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
