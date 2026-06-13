'use client'

import { useEffect, useRef } from 'react'
import { TranscriptChunk } from '@/types/live-call'

export function TranscriptFeed({ chunks }: { chunks: TranscriptChunk[] }) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new chunks
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [chunks])

  const highlightKeywords = (text: string) => {
    // Highlight trigger keywords in amber
    const keywords = ['gong', 'chorus', 'salesforce', 'budget', 'contract', 'blueconic', 'tealium']
    let highlighted = text

    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi')
      highlighted = highlighted.replace(
        regex,
        `<mark class="bg-amber-500/30 text-amber-200">$&</mark>`
      )
    })

    return { __html: highlighted }
  }

  return (
    <div
      ref={containerRef}
      className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 h-96 overflow-y-auto"
    >
      <h3 className="text-lg font-semibold text-white mb-4 sticky top-0 bg-slate-800/90 backdrop-blur pb-2">
        Live Transcript
      </h3>
      <div className="space-y-3">
        {chunks.map((chunk, idx) => (
          <div key={idx} className="border-l-2 border-slate-600 pl-3">
            <p className="text-indigo-400 font-semibold text-sm">{chunk.speaker}</p>
            <p className="text-white text-sm mt-1" dangerouslySetInnerHTML={highlightKeywords(chunk.text)} />
            <p className="text-slate-500 text-xs mt-1">
              {new Date(chunk.timestamp).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
