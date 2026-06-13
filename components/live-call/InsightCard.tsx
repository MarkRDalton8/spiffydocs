'use client'

export function InsightCard({ insight, type }: { insight: any; type?: string }) {
  // Discovery nudge gets distinct purple/violet treatment (V2)
  if (type === 'discovery_nudge' || insight.type === 'discovery_nudge') {
    return (
      <div className="border-l-4 border-violet-500 bg-violet-500/10 rounded-r-lg p-4 mb-3 animate-fade-in">
        <div className="flex items-center gap-2 mb-1">
          <span>🎯</span>
          <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider">
            {insight.category} · Ask This
          </span>
          {insight.late_call && (
            <span className="text-amber-400 text-xs">⏱ Running out of time</span>
          )}
        </div>
        <p className="text-white font-medium mb-1">"{insight.suggested_question}"</p>
        {insight.context && <p className="text-slate-400 text-sm italic mb-1">{insight.context}</p>}
        <p className="text-violet-300 text-xs">{insight.why_it_matters}</p>
      </div>
    )
  }

  // Regular insight cards
  const severityColors = {
    high: 'border-red-500 bg-red-500/10',
    medium: 'border-amber-500 bg-amber-500/10',
    low: 'border-blue-500 bg-blue-500/10',
  }

  const severityEmoji = {
    high: '🚨',
    medium: '⚠️',
    low: '💡',
  }

  const severity = insight.severity || 'medium'

  return (
    <div className={`border-l-4 ${severityColors[severity as keyof typeof severityColors]} rounded-r-lg p-4 mb-3`}>
      <div className="flex items-center gap-2 mb-1">
        <span>{severityEmoji[severity as keyof typeof severityEmoji]}</span>
        <span className="text-white text-xs font-semibold uppercase tracking-wider">
          {insight.type}
        </span>
      </div>
      <p className="text-white font-medium mb-1">{insight.text}</p>
      {insight.suggested_response && (
        <p className="text-slate-300 text-sm italic mt-2">💬 Suggested: {insight.suggested_response}</p>
      )}
    </div>
  )
}
