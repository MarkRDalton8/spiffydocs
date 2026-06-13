'use client'

import { useState } from 'react'

interface SessionControlsProps {
  onJoin: (meetingUrl: string, opportunityId?: string) => Promise<void>
  onStop: () => void
  isLive: boolean
  status?: string
}

export function SessionControls({ onJoin, onStop, isLive, status }: SessionControlsProps) {
  const [meetingUrl, setMeetingUrl] = useState('')
  const [opportunityId, setOpportunityId] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleJoin = async () => {
    if (meetingUrl && !isJoining) {
      setIsJoining(true)
      try {
        await onJoin(meetingUrl, opportunityId || undefined)
      } finally {
        setIsJoining(false)
      }
    }
  }

  if (isLive) {
    return (
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-emerald-400 rounded-full animate-pulse"></span>
            <span className="text-emerald-400 font-semibold">Live Call Active</span>
          </div>
          {status && <span className="text-slate-400 text-sm">{status}</span>}
        </div>
        <button
          onClick={onStop}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Stop Bot
        </button>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Join a Meeting</h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Meeting URL (Zoom, Teams, Meet)"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Opportunity ID (optional)"
          value={opportunityId}
          onChange={(e) => setOpportunityId(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleJoin}
          disabled={!meetingUrl || isJoining}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isJoining ? 'Joining...' : 'Join Meeting'}
        </button>
      </div>
    </div>
  )
}
