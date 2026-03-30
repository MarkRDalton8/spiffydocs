'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { SECoverage } from '@/types/portfolio'
import { formatCurrency } from '@/lib/formatters'

interface SEBreakdownChartProps {
  data: SECoverage[]
}

export function SEBreakdownChart({ data }: SEBreakdownChartProps) {
  // Sort by pipeline descending
  const sortedData = [...data].sort((a, b) => b.pipeline - a.pipeline)

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">SE Performance</h3>

      <div className="hidden lg:block">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={90} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                color: '#e2e8f0'
              }}
              formatter={(value, name) => {
                const val = value as number
                const nameStr = name as string
                if (nameStr === 'pipeline') return [formatCurrency(val), 'Pipeline']
                if (nameStr === 'weighted') return [formatCurrency(val), 'Weighted']
                return [val, nameStr]
              }}
              labelFormatter={(label) => {
                const labelStr = String(label)
                const se = sortedData.find(s => s.name === labelStr)
                if (se) {
                  return `${labelStr} • ${se.deals} deals • Avg: ${formatCurrency(se.avg)} • At Risk: ${se.at_risk}`
                }
                return labelStr
              }}
            />
            <Legend />
            <Bar dataKey="pipeline" fill="#5A67D8" name="Pipeline" radius={[0, 4, 4, 0]} />
            <Bar dataKey="weighted" fill="#0D9488" name="Weighted" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile fallback - text list */}
      <div className="lg:hidden space-y-3">
        {sortedData.map((se) => (
          <div key={se.name} className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
            <div className="font-semibold text-white mb-2">{se.name}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-400">Deals:</span> <span className="text-white">{se.deals}</span>
              </div>
              <div>
                <span className="text-slate-400">At Risk:</span> <span className="text-amber-400">{se.at_risk}</span>
              </div>
              <div>
                <span className="text-slate-400">Pipeline:</span> <span className="text-indigo-400">{formatCurrency(se.pipeline)}</span>
              </div>
              <div>
                <span className="text-slate-400">Weighted:</span> <span className="text-teal-400">{formatCurrency(se.weighted)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
