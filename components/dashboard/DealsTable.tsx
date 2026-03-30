'use client'

import { useState, useMemo } from 'react'
import { Deal } from '@/types/portfolio'
import { formatCurrency, formatShortDate } from '@/lib/formatters'

type SortField = 'account_name' | 'converted_amount' | 'close_date' | 'weighted_value' | 'probability'
type SortDirection = 'asc' | 'desc'

interface DealsTableProps {
  deals: Deal[]
  title: string
  showColumns?: string[]
  defaultSort?: SortField
  maxRows?: number
}

const stageBadgeColors: Record<string, string> = {
  '5 - Negotiate': 'bg-emerald-500/10 text-emerald-400 border-emerald-500',
  '6 - Closed Won': 'bg-emerald-500/10 text-emerald-400 border-emerald-500',
  '4 - Propose': 'bg-blue-500/10 text-blue-400 border-blue-500',
  '3 - Validate': 'bg-amber-500/10 text-amber-400 border-amber-500',
  '2 - Evaluate': 'bg-slate-500/10 text-slate-400 border-slate-500',
  '1 - Discover': 'bg-slate-500/10 text-slate-400 border-slate-500',
  '0 - Lead': 'bg-gray-500/10 text-gray-400 border-gray-500'
}

export function DealsTable({
  deals,
  title,
  showColumns = ['account_name', 'converted_amount', 'probability', 'weighted_value', 'close_date', 'se_lead', 'owner', 'stage'],
  defaultSort = 'weighted_value',
  maxRows
}: DealsTableProps) {
  const [sortField, setSortField] = useState<SortField>(defaultSort)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedDeals = useMemo(() => {
    const sorted = [...deals].sort((a, b) => {
      let aVal: number | string = 0
      let bVal: number | string = 0

      switch (sortField) {
        case 'account_name':
          aVal = a.account_name || ''
          bVal = b.account_name || ''
          break
        case 'converted_amount':
          aVal = a.converted_amount || 0
          bVal = b.converted_amount || 0
          break
        case 'close_date':
          aVal = a.close_date || ''
          bVal = b.close_date || ''
          break
        case 'weighted_value':
          aVal = a.weighted_value || 0
          bVal = b.weighted_value || 0
          break
        case 'probability':
          aVal = a.probability || 0
          bVal = b.probability || 0
          break
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return maxRows ? sorted.slice(0, maxRows) : sorted
  }, [deals, sortField, sortDirection, maxRows])

  const getStageBadge = (stage: string) => {
    const colors = stageBadgeColors[stage] || 'bg-slate-500/10 text-slate-400 border-slate-500'
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${colors}`}>
        {stage}
      </span>
    )
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400 mt-1">{sortedDeals.length} deals</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full">
          <thead className="bg-slate-900/50">
            <tr>
              {showColumns.includes('account_name') && (
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('account_name')}
                >
                  Account {sortField === 'account_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {showColumns.includes('converted_amount') && (
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('converted_amount')}
                >
                  Amount {sortField === 'converted_amount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {showColumns.includes('probability') && (
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('probability')}
                >
                  Prob {sortField === 'probability' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {showColumns.includes('weighted_value') && (
                <th
                  className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('weighted_value')}
                >
                  Weighted {sortField === 'weighted_value' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {showColumns.includes('close_date') && (
                <th
                  className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wider cursor-pointer hover:text-white"
                  onClick={() => handleSort('close_date')}
                >
                  Close {sortField === 'close_date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
              )}
              {showColumns.includes('se_lead') && (
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  SE
                </th>
              )}
              {showColumns.includes('owner') && (
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Owner
                </th>
              )}
              {showColumns.includes('stage') && (
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Stage
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedDeals.map((deal, idx) => (
              <tr key={idx} className="hover:bg-slate-700/30 transition-colors">
                {showColumns.includes('account_name') && (
                  <td className="px-4 py-3">
                    {deal.sf_url ? (
                      <a
                        href={deal.sf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {deal.account_name}
                      </a>
                    ) : (
                      <span className="text-slate-300">{deal.account_name}</span>
                    )}
                  </td>
                )}
                {showColumns.includes('converted_amount') && (
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {formatCurrency(deal.converted_amount)}
                  </td>
                )}
                {showColumns.includes('probability') && (
                  <td className="px-4 py-3 text-center text-slate-300">
                    {deal.probability}%
                  </td>
                )}
                {showColumns.includes('weighted_value') && (
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {formatCurrency(deal.weighted_value)}
                  </td>
                )}
                {showColumns.includes('close_date') && (
                  <td className="px-4 py-3 text-center text-slate-300">
                    {formatShortDate(deal.close_date)}
                  </td>
                )}
                {showColumns.includes('se_lead') && (
                  <td
                    className={`px-4 py-3 ${
                      !deal.se_lead ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300'
                    }`}
                  >
                    {deal.se_lead || 'Unassigned'}
                  </td>
                )}
                {showColumns.includes('owner') && (
                  <td className="px-4 py-3 text-slate-300">{deal.owner}</td>
                )}
                {showColumns.includes('stage') && (
                  <td className="px-4 py-3">{getStageBadge(deal.stage)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {maxRows && deals.length > maxRows && (
        <div className="p-3 bg-slate-900/50 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-400">
            Showing {maxRows} of {deals.length} deals
          </p>
        </div>
      )}
    </div>
  )
}
