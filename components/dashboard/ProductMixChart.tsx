'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ProductMix } from '@/types/portfolio'
import { formatCurrency } from '@/lib/formatters'

interface ProductMixChartProps {
  productMix: ProductMix
}

const COLORS = ['#5A67D8', '#0D9488', '#F59E0B', '#EF4444', '#8B5CF6']

export function ProductMixChart({ productMix }: ProductMixChartProps) {
  // Convert closed_won object to array and sort by revenue
  const chartData = Object.entries(productMix.closed_won)
    .map(([product, revenue]) => ({
      product,
      revenue
    }))
    .sort((a, b) => b.revenue - a.revenue)

  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0)

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Product Mix - Closed Won Revenue
      </h3>

      <div className="hidden lg:block">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 80, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" />
            <YAxis dataKey="product" type="category" stroke="#94a3b8" width={90} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '0.5rem',
                color: '#e2e8f0'
              }}
              formatter={(value) => [formatCurrency(value as number), 'Revenue']}
            />
            <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Percentage labels */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {chartData.map((item, index) => {
          const pct = totalRevenue > 0 ? (item.revenue / totalRevenue) * 100 : 0
          return (
            <div
              key={item.product}
              className="bg-slate-900/50 p-3 rounded-lg border border-slate-600"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-medium text-slate-400">{item.product}</span>
              </div>
              <div className="text-lg font-bold text-white">{Math.round(pct)}%</div>
              <div className="text-xs text-slate-500">{formatCurrency(item.revenue)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
