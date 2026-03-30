import { StatusColor, statusColors } from '@/lib/status'
import { formatCurrency } from '@/lib/formatters'

interface QuotaProgressBarProps {
  label: string
  attainmentPct: number
  closedWon: number
  quota: number
  status: StatusColor
}

export function QuotaProgressBar({
  label,
  attainmentPct,
  closedWon,
  quota,
  status
}: QuotaProgressBarProps) {
  const colors = statusColors[status]
  const displayPct = Math.min(attainmentPct, 100)

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-slate-300">{label}</div>
        <div className={`text-lg font-bold ${colors.text}`}>
          {Math.round(attainmentPct)}%
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-8 bg-slate-900 rounded-lg overflow-hidden mb-3">
        {/* Fill */}
        <div
          className={`absolute left-0 top-0 bottom-0 ${colors.bg} border-r-2 ${colors.border} transition-all duration-500`}
          style={{ width: `${displayPct}%` }}
        />

        {/* Quota line marker at 100% */}
        {quota > 0 && (
          <div className="absolute left-full top-0 bottom-0 w-0.5 bg-slate-400 transform -translate-x-px">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
              Target
            </div>
          </div>
        )}
      </div>

      {/* Dollar amounts */}
      <div className="flex items-center justify-between text-sm">
        <span className={colors.text}>{formatCurrency(closedWon)}</span>
        <span className="text-slate-400">of {formatCurrency(quota)}</span>
      </div>
    </div>
  )
}
