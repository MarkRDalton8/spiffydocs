import { Director } from '@/types/portfolio'
import { formatCurrency } from '@/lib/formatters'

interface DirectorCardsProps {
  directors: Director[]
}

const stageBadgeColors: Record<string, string> = {
  '5 - Negotiate': 'bg-emerald-500/10 text-emerald-400',
  '4 - Propose': 'bg-blue-500/10 text-blue-400',
  '3 - Validate': 'bg-amber-500/10 text-amber-400',
  '2 - Evaluate': 'bg-slate-500/10 text-slate-400',
  '1 - Discover': 'bg-slate-500/10 text-slate-400'
}

export function DirectorCards({ directors }: DirectorCardsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {directors.map((director) => (
        <div
          key={director.name}
          className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
        >
          {/* Director name */}
          <h3 className="text-lg font-bold text-white mb-4">{director.name}</h3>

          {/* Metrics */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Attainment</span>
              <span className="font-semibold text-emerald-400">
                {formatCurrency(director.attainment)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Open Deals</span>
              <span className="font-semibold text-slate-300">{director.open_deals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Pipeline</span>
              <span className="font-semibold text-blue-400">
                {formatCurrency(director.pipeline)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-400">Weighted</span>
              <span className="font-semibold text-teal-400">
                {formatCurrency(director.weighted)}
              </span>
            </div>
          </div>

          {/* Top 3 deals */}
          <div className="border-t border-slate-700 pt-4">
            <div className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">
              Top 3 Deals
            </div>
            <div className="space-y-2">
              {director.top_deals.map((deal, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between text-sm gap-2"
                >
                  <div className="flex-1 min-w-0">
                    {deal.sf_url ? (
                      <a
                        href={deal.sf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline truncate block"
                      >
                        {deal.account}
                      </a>
                    ) : (
                      <span className="text-slate-300 truncate block">
                        {deal.account}
                      </span>
                    )}
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                        stageBadgeColors[deal.stage] || 'bg-slate-500/10 text-slate-400'
                      }`}
                    >
                      {deal.stage}
                    </span>
                  </div>
                  <span className="font-mono text-slate-300 whitespace-nowrap">
                    {formatCurrency(deal.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
