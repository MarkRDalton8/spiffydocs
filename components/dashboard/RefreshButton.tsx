'use client'

import { useState, useEffect } from 'react'
import { formatRelativeTime } from '@/lib/formatters'

interface RefreshButtonProps {
  generatedAt: string
  onRefresh: () => Promise<void>
  isLoading: boolean
}

export function RefreshButton({ generatedAt, onRefresh, isLoading }: RefreshButtonProps) {
  const [justRefreshed, setJustRefreshed] = useState(false)

  const handleRefresh = async () => {
    await onRefresh()
    setJustRefreshed(true)
  }

  useEffect(() => {
    if (justRefreshed) {
      const timer = setTimeout(() => setJustRefreshed(false), 10000)
      return () => clearTimeout(timer)
    }
  }, [justRefreshed])

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-400">
        {justRefreshed ? 'Updated just now' : `Updated ${formatRelativeTime(generatedAt)}`}
      </span>
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-300 rounded-md transition-colors text-sm flex items-center gap-2"
      >
        <svg
          className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh
      </button>
    </div>
  )
}
