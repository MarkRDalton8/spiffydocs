import { StatusColor, statusColors } from '@/lib/status'

interface StatCardProps {
  label: string
  value: string
  subtitle?: string
  status: StatusColor
}

export function StatCard({ label, value, subtitle, status }: StatCardProps) {
  const colors = statusColors[status]

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 relative">
      {/* Status indicator - left border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.border} rounded-l-xl`} />

      <div className="text-sm font-medium text-slate-400 mb-2">{label}</div>
      <div className={`text-3xl font-bold ${colors.text} mb-1`}>{value}</div>
      {subtitle && (
        <div className="text-xs text-slate-500">{subtitle}</div>
      )}
    </div>
  )
}
