'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLiveCall } from '@/hooks/useLiveCall'
import { InsightCard } from '@/components/live-call/InsightCard'
import { TranscriptFeed } from '@/components/live-call/TranscriptFeed'
import { MEDDPICCScorecard } from '@/components/live-call/MEDDPICCScorecard'
import { SessionControls } from '@/components/live-call/SessionControls'

export default function LiveCallPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [botId, setBotId] = useState<string | null>(null)
  const { transcript, insights, meddpicc, status: callStatus, isLive } = useLiveCall(botId)

  // Read bot_id from URL query params
  useEffect(() => {
    const botIdFromUrl = searchParams.get('bot_id')
    if (botIdFromUrl) {
      setBotId(botIdFromUrl)
    }
  }, [searchParams])

  // Auth pattern from dashboard
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-white mb-2">Live Call Intelligence</h1>
            <p className="text-slate-400 mb-6">Sign in to access live call insights</p>
            <button
              onClick={() => signIn('google', { callbackUrl: '/live-call' })}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleJoinCall = async (meetingUrl: string, opportunityId?: string) => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    try {
      console.log('Joining meeting:', meetingUrl)
      const response = await fetch(`${backendUrl}/api/live-call/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting_url: meetingUrl, opportunity_id: opportunityId }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Backend returned an error
        console.error('Backend error:', data)
        alert(`Failed to join meeting: ${data.detail || data.message || 'Unknown error'}`)
        return
      }

      console.log('Bot started:', data)
      setBotId(data.bot_id)
    } catch (error) {
      console.error('Failed to start call:', error)
      alert(`Failed to join meeting. Error: ${error}`)
    }
  }

  const handleStopCall = async () => {
    if (!botId) return

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    try {
      await fetch(`${backendUrl}/api/live-call/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_id: botId }),
      })
      setBotId(null)
    } catch (error) {
      console.error('Failed to stop call:', error)
    }
  }

  // Count insights by type
  const discoveryNudges = insights.filter((i) => i.type === 'discovery_nudge')
  const meddpiccInsights = insights.filter((i) => i.type === 'meddpicc')
  const competitorInsights = insights.filter((i) => i.type === 'competitor')

  const exportDiscoveryNudges = () => {
    const exportData = discoveryNudges.map((nudge) => ({
      timestamp: nudge.timestamp,
      category: nudge.category,
      question_id: nudge.question_id,
      suggested_question: nudge.suggested_question,
      why_it_matters: nudge.why_it_matters,
      context: nudge.context,
      severity: nudge.severity,
      late_call: nudge.late_call,
      meddpicc_letter: nudge.meddpicc_letter,
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `discovery-nudges-${botId}-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <nav className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Live Call Intelligence
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">{session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SessionControls onJoin={handleJoinCall} onStop={handleStopCall} isLive={isLive} status={callStatus} />

        {isLive && (
          <>
            <div className="mb-6">
              <MEDDPICCScorecard state={meddpicc} />
            </div>

            {/* Discovery Coverage Bar (V2) */}
            <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-white">Discovery Coverage</h4>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs">{discoveryNudges.length} nudges fired</span>
                  {discoveryNudges.length > 0 && (
                    <button
                      onClick={exportDiscoveryNudges}
                      className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1 rounded transition-colors"
                    >
                      Export Nudges
                    </button>
                  )}
                </div>
              </div>
              <p className="text-slate-400 text-xs mb-2">
                Watch for purple cards below for missing discovery questions
              </p>
            </div>

            {/* Two-column insights + transcript */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Live Insights ({insights.length})
                </h3>
                {insights.length === 0 && (
                  <p className="text-slate-400 text-sm">No insights yet. Insights appear as the call progresses...</p>
                )}
                <div className="space-y-3">
                  {insights.map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} type={insight.type} />
                  ))}
                </div>
              </div>

              <div>
                <TranscriptFeed chunks={transcript} />
              </div>
            </div>
          </>
        )}

        {!isLive && !botId && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              Join a meeting above to start receiving live call intelligence.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Or use the replay script to test with a SPIFFY transcript.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
