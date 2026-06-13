'use client'

import { StageConversion, BaselineStageConversion } from '@/types/portfolio'

interface StageConversionTableProps {
  stageConversions: Record<string, StageConversion>
  baseline?: Record<string, BaselineStageConversion>
}

export function StageConversionTable({ stageConversions, baseline }: StageConversionTableProps) {
  const stages = [
    { key: '0 - Lead → 1 - Discover', label: '0 - Lead → 1 - Discover' },
    { key: '1 - Discover → 2 - Evaluate', label: '1 - Discover → 2 - Evaluate' },
    { key: '2 - Evaluate → 3 - Validate', label: '2 - Evaluate → 3 - Validate' },
    { key: '3 - Validate → 4 - Propose', label: '3 - Validate → 4 - Propose' },
    { key: '4 - Propose → 5 - Negotiate', label: '4 - Propose → 5 - Negotiate' },
    { key: '5 - Negotiate → Closed Won', label: '5 - Negotiate → Closed Won' },
    { key: '3 - Validate → Closed Won', label: '3 - Validate → Closed Won' },
    { key: '4 - Propose → Closed Won', label: '4 - Propose → Closed Won' }
  ]

  const hasBaseline = baseline && Object.keys(baseline).length > 0

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Stage Conversion Funnel</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">
                Transition
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">
                Last Q - NB
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">
                Last Q - Exp
              </th>
              {hasBaseline && (
                <>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">
                    Baseline - NB
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">
                    Baseline - Exp
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {stages.map((stage) => {
              const data = stageConversions[stage.key]
              const baselineData = hasBaseline ? baseline[stage.key] : null

              if (!data) return null

              return (
                <tr key={stage.key} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-slate-300">{stage.label}</td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {data.last_nb_rate.toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-300">
                    {data.last_exp_rate.toFixed(0)}%
                  </td>
                  {hasBaseline && baselineData && (
                    <>
                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        {baselineData.nb_conversion_rate.toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-slate-300">
                        {baselineData.exp_conversion_rate.toFixed(0)}%
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
