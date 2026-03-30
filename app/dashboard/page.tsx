'use client'

import { useState, useMemo } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
import { usePortfolioData } from '@/hooks/usePortfolioData'
import { formatRelativeTime, formatCurrency, formatPct, formatCoverage } from '@/lib/formatters'
import { getAttainmentStatus, getCoverageStatus } from '@/lib/status'
import { StatCard } from '@/components/dashboard/StatCard'
import { QuotaProgressBar } from '@/components/dashboard/QuotaProgressBar'
import { DealsTable } from '@/components/dashboard/DealsTable'
import { SEBreakdownChart } from '@/components/dashboard/SEBreakdownChart'
import { DirectorCards } from '@/components/dashboard/DirectorCards'
import { ProductMixChart } from '@/components/dashboard/ProductMixChart'
import { RefreshButton } from '@/components/dashboard/RefreshButton'

type Tab = 'overview' | 'pipeline' | 'team' | 'deals'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const { data: portfolioData, isLoading: dataLoading, error: dataError, refresh } = usePortfolioData()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  // Deals tab filters
  const [seFilter, setSeFilter] = useState<string>('All')
  const [stageFilter, setStageFilter] = useState<string>('All')
  const [accountSearch, setAccountSearch] = useState<string>('')

  // Filtered deals for Deals tab
  const filteredDeals = useMemo(() => {
    if (!portfolioData) return []

    let deals = portfolioData.closing_this_quarter

    // SE filter
    if (seFilter === 'Unassigned') {
      deals = deals.filter(d => !d.se_lead)
    } else if (seFilter !== 'All') {
      deals = deals.filter(d => d.se_lead === seFilter)
    }

    // Stage filter
    if (stageFilter === 'Early') {
      deals = deals.filter(d => d.stage.startsWith('0') || d.stage.startsWith('1') || d.stage.startsWith('2'))
    } else if (stageFilter === 'Mid') {
      deals = deals.filter(d => d.stage.startsWith('3'))
    } else if (stageFilter === 'Late') {
      deals = deals.filter(d => d.stage.startsWith('4') || d.stage.startsWith('5'))
    }

    // Account search
    if (accountSearch) {
      deals = deals.filter(d =>
        d.account_name.toLowerCase().includes(accountSearch.toLowerCase())
      )
    }

    return deals
  }, [portfolioData, seFilter, stageFilter, accountSearch])

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    )
  }

  // Not authenticated - show login page
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Portfolio Dashboard
              </h1>
              <p className="text-slate-400">
                Sign in to access your portfolio reports
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>

            <p className="text-xs text-center text-slate-500 mt-6">
              Secure authentication powered by Google OAuth
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated - show dashboard
  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Portfolio Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {portfolioData && (
                <RefreshButton
                  generatedAt={portfolioData.generated_at}
                  onRefresh={refresh}
                  isLoading={dataLoading}
                />
              )}
              <span className="text-slate-300 hidden sm:inline">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="border-b border-slate-700 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview' as Tab, label: 'Overview', icon: '📊' },
              { id: 'pipeline' as Tab, label: 'Pipeline', icon: '📈' },
              { id: 'team' as Tab, label: 'Team', icon: '👥' },
              { id: 'deals' as Tab, label: 'Deals', icon: '💼' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-indigo-600 text-white bg-indigo-600/10'
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }
                  flex items-center gap-2 rounded-t-lg px-4
                `}
              >
                <span className="hidden sm:inline">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.icon}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Loading State */}
        {dataLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-slate-400">Loading portfolio data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {dataError && (
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Data</h3>
            <p className="text-slate-400 mb-4">{dataError.message}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {!dataLoading && !dataError && portfolioData && (
          <div className="space-y-6">
            {/* Data freshness indicator */}
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>
                {portfolioData.period} • {portfolioData.region}
              </span>
              <div className="flex items-center gap-4">
                <span>Updated {formatRelativeTime(portfolioData.generated_at)}</span>
                <button
                  onClick={refresh}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors text-xs"
                >
                  Refresh
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Row 1: 4 StatCards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Attainment"
                    value={formatPct(portfolioData.attainment.attainment_pct)}
                    subtitle={`${formatCurrency(portfolioData.attainment.closed_won)} / ${formatCurrency(portfolioData.attainment.quota)}`}
                    status={getAttainmentStatus(portfolioData.attainment.attainment_pct)}
                  />
                  <StatCard
                    label="Commission"
                    value={formatCurrency(portfolioData.attainment.commission)}
                    subtitle={`${formatPct((portfolioData.attainment.commission / 22500) * 100)} of OTE`}
                    status={portfolioData.attainment.commission >= 11250 ? 'green' : 'amber'}
                  />
                  <StatCard
                    label="Coverage"
                    value={formatCoverage(portfolioData.pipeline.coverage_ratio)}
                    subtitle={`${formatCurrency(portfolioData.pipeline.weighted)} weighted`}
                    status={getCoverageStatus(portfolioData.pipeline.coverage_ratio)}
                  />
                  <StatCard
                    label="This Week"
                    value={`${portfolioData.closing_this_week.length} deals`}
                    subtitle={`${formatCurrency(portfolioData.closing_this_week.reduce((sum, d) => sum + d.weighted_value, 0))} weighted`}
                    status="green"
                  />
                </div>

                {/* Row 2: 2 QuotaProgressBars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <QuotaProgressBar
                    label="New Business"
                    attainmentPct={portfolioData.attainment.nb_attainment_pct}
                    closedWon={portfolioData.attainment.nb_closed_won}
                    quota={portfolioData.attainment.nb_quota}
                    status={getAttainmentStatus(portfolioData.attainment.nb_attainment_pct)}
                  />
                  <QuotaProgressBar
                    label="Expansion"
                    attainmentPct={portfolioData.attainment.exp_attainment_pct}
                    closedWon={portfolioData.attainment.exp_closed_won}
                    quota={portfolioData.attainment.exp_quota}
                    status={getAttainmentStatus(portfolioData.attainment.exp_attainment_pct)}
                  />
                </div>

                {/* Row 3: Deals Closed This Quarter */}
                <DealsTable
                  deals={portfolioData.closed_this_quarter}
                  title="Deals Closed This Quarter"
                  showColumns={['account_name', 'converted_amount', 'close_date', 'se_lead', 'owner', 'revenue_type']}
                  defaultSort="close_date"
                  maxRows={20}
                />

                {/* Row 4: Closing This Week */}
                <DealsTable
                  deals={portfolioData.closing_this_week}
                  title="Closing This Week"
                  showColumns={['account_name', 'converted_amount', 'probability', 'weighted_value', 'close_date', 'se_lead', 'owner', 'stage', 'revenue_type']}
                  defaultSort="weighted_value"
                />

                {/* Row 5: Slipped Deals */}
                {portfolioData.slipped_deals && portfolioData.slipped_deals.length > 0 && (
                  <DealsTable
                    deals={portfolioData.slipped_deals}
                    title="Slipped Deals"
                    showColumns={['account_name', 'converted_amount', 'probability', 'weighted_value', 'close_date', 'se_lead', 'owner', 'stage', 'revenue_type']}
                    defaultSort="weighted_value"
                  />
                )}

                {/* Row 4: Stale & Dark Deals */}
                {(portfolioData.stale_deals.length > 0 || portfolioData.dark_deals.length > 0) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {portfolioData.stale_deals.length > 0 && (
                      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          ⚠️ Stale Deals ({portfolioData.stale_deals.length})
                        </h3>
                        <div className="space-y-3">
                          {portfolioData.stale_deals.slice(0, 10).map((deal, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm">
                              <div className="flex-1">
                                {deal.sf_url ? (
                                  <a href={deal.sf_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    {deal.account}
                                  </a>
                                ) : (
                                  <span className="text-slate-300">{deal.account}</span>
                                )}
                                <div className="text-xs text-slate-500">{deal.stage} • {deal.se || 'No SE'}</div>
                              </div>
                              <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs">
                                {deal.days_in_stage}d
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {portfolioData.dark_deals.length > 0 && (
                      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">
                          🌑 Dark Deals ({portfolioData.dark_deals.length})
                        </h3>
                        <div className="space-y-3">
                          {portfolioData.dark_deals.slice(0, 10).map((deal, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm">
                              <div className="flex-1">
                                {deal.sf_url ? (
                                  <a href={deal.sf_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                    {deal.account}
                                  </a>
                                ) : (
                                  <span className="text-slate-300">{deal.account}</span>
                                )}
                                <div className="text-xs text-slate-500">{deal.stage} • {deal.se || 'No SE'}</div>
                              </div>
                              <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-xs">
                                {deal.last_activity_days}d
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pipeline' && (
              <div className="space-y-6">
                {/* Row 1: 3 StatCards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    label="NB Coverage"
                    value={formatCoverage(portfolioData.pipeline.nb_coverage)}
                    subtitle={`${formatCurrency(portfolioData.pipeline.nb_weighted)} weighted`}
                    status={getCoverageStatus(portfolioData.pipeline.nb_coverage)}
                  />
                  <StatCard
                    label="Total Coverage"
                    value={formatCoverage(portfolioData.pipeline.coverage_ratio)}
                    subtitle={`${formatCurrency(portfolioData.pipeline.weighted)} weighted`}
                    status={getCoverageStatus(portfolioData.pipeline.coverage_ratio)}
                  />
                  <StatCard
                    label="Expansion Coverage"
                    value={formatCoverage(portfolioData.pipeline.exp_coverage)}
                    subtitle={`${formatCurrency(portfolioData.pipeline.exp_weighted)} weighted`}
                    status={getCoverageStatus(portfolioData.pipeline.exp_coverage)}
                  />
                </div>

                {/* Row 2: 2 QuotaProgressBars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <QuotaProgressBar
                    label="New Business"
                    attainmentPct={portfolioData.attainment.nb_attainment_pct}
                    closedWon={portfolioData.attainment.nb_closed_won}
                    quota={portfolioData.attainment.nb_quota}
                    status={getAttainmentStatus(portfolioData.attainment.nb_attainment_pct)}
                  />
                  <QuotaProgressBar
                    label="Expansion"
                    attainmentPct={portfolioData.attainment.exp_attainment_pct}
                    closedWon={portfolioData.attainment.exp_closed_won}
                    quota={portfolioData.attainment.exp_quota}
                    status={getAttainmentStatus(portfolioData.attainment.exp_attainment_pct)}
                  />
                </div>

                {/* Row 3: Product Mix Chart */}
                <ProductMixChart productMix={portfolioData.product_mix} />

                {/* Row 4: Pipeline by Product Table */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Pipeline by Product</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-900/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Product</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Deals</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Pipeline</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Weighted</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Coverage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {portfolioData.product_mix.pipeline.map((item) => {
                          const coverage = item.weighted / (portfolioData.attainment.quota / 4)
                          const coverageStatus = getCoverageStatus(coverage)
                          return (
                            <tr key={item.product} className="hover:bg-slate-700/30">
                              <td className="px-4 py-3 text-slate-300">{item.product}</td>
                              <td className="px-4 py-3 text-right text-slate-300">{item.count}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-300">{formatCurrency(item.total)}</td>
                              <td className="px-4 py-3 text-right font-mono text-slate-300">{formatCurrency(item.weighted)}</td>
                              <td className={`px-4 py-3 text-right font-semibold ${
                                coverageStatus === 'green' ? 'text-emerald-400' :
                                coverageStatus === 'amber' ? 'text-amber-400' : 'text-red-400'
                              }`}>
                                {formatCoverage(coverage)}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Row 5: NB vs Expansion Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">New Business</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Opps</span>
                        <span className="text-white font-semibold">{portfolioData.nb_vs_expansion.new_business.opps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Won</span>
                        <span className="text-white font-semibold">{portfolioData.nb_vs_expansion.new_business.won}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Revenue</span>
                        <span className="text-emerald-400 font-semibold">{formatCurrency(portfolioData.nb_vs_expansion.new_business.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Win Rate</span>
                        <span className="text-white font-semibold">{formatPct(portfolioData.nb_vs_expansion.new_business.win_rate)}</span>
                      </div>
                      {portfolioData.nb_vs_expansion.new_business.new_logos !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">New Logos</span>
                          <span className="text-blue-400 font-semibold">{portfolioData.nb_vs_expansion.new_business.new_logos}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Expansion</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Opps</span>
                        <span className="text-white font-semibold">{portfolioData.nb_vs_expansion.expansion.opps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Won</span>
                        <span className="text-white font-semibold">{portfolioData.nb_vs_expansion.expansion.won}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Revenue</span>
                        <span className="text-emerald-400 font-semibold">{formatCurrency(portfolioData.nb_vs_expansion.expansion.revenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Win Rate</span>
                        <span className="text-white font-semibold">{formatPct(portfolioData.nb_vs_expansion.expansion.win_rate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                {/* Row 1: SE Coverage StatCard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <StatCard
                    label="SE Coverage"
                    value={formatPct(portfolioData.se_coverage.overall_pct)}
                    subtitle={`${portfolioData.se_coverage.covered} of ${portfolioData.se_coverage.total} deals`}
                    status={portfolioData.se_coverage.overall_pct >= 50 ? 'green' : portfolioData.se_coverage.overall_pct >= 25 ? 'amber' : 'red'}
                  />
                </div>

                {/* Row 2: SE Breakdown Chart */}
                {portfolioData.se_coverage.by_se.length > 0 && (
                  <SEBreakdownChart data={portfolioData.se_coverage.by_se} />
                )}

                {/* Row 3: Director Cards */}
                {portfolioData.directors.length > 0 && (
                  <DirectorCards directors={portfolioData.directors} />
                )}

                {/* Row 4: Deals with SE assigned */}
                <DealsTable
                  deals={portfolioData.closing_this_quarter.filter(d => d.se_lead)}
                  title="Deals with SE Assigned"
                  showColumns={['se_lead', 'account_name', 'converted_amount', 'stage', 'weighted_value', 'close_date', 'revenue_type']}
                  defaultSort="weighted_value"
                  maxRows={20}
                />
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-6">
                {/* Filter Bar */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* SE Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        SE
                      </label>
                      <select
                        value={seFilter}
                        onChange={(e) => setSeFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="All">All SEs</option>
                        <option value="Walter Gold">Walter Gold</option>
                        <option value="Matt Hinton">Matt Hinton</option>
                        <option value="Emanuel Prado">Emanuel Prado</option>
                        <option value="Unassigned">Unassigned</option>
                      </select>
                    </div>

                    {/* Stage Filter */}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Stage
                      </label>
                      <select
                        value={stageFilter}
                        onChange={(e) => setStageFilter(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="All">All Stages</option>
                        <option value="Early">Early (0-2)</option>
                        <option value="Mid">Mid (3)</option>
                        <option value="Late">Late (4-5)</option>
                      </select>
                    </div>

                    {/* Account Search */}
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Account
                      </label>
                      <input
                        type="text"
                        placeholder="Search accounts..."
                        value={accountSearch}
                        onChange={(e) => setAccountSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 text-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Active filters indicator */}
                  {(seFilter !== 'All' || stageFilter !== 'All' || accountSearch) && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-sm text-slate-400">Active filters:</span>
                      {seFilter !== 'All' && (
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs">
                          SE: {seFilter}
                        </span>
                      )}
                      {stageFilter !== 'All' && (
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs">
                          Stage: {stageFilter}
                        </span>
                      )}
                      {accountSearch && (
                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded text-xs">
                          Account: {accountSearch}
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSeFilter('All')
                          setStageFilter('All')
                          setAccountSearch('')
                        }}
                        className="text-xs text-slate-400 hover:text-white underline ml-2"
                      >
                        Clear all
                      </button>
                    </div>
                  )}
                </div>

                {/* Deals Table */}
                <DealsTable
                  deals={filteredDeals}
                  title={`All Deals (${filteredDeals.length})`}
                  showColumns={['account_name', 'converted_amount', 'probability', 'weighted_value', 'close_date', 'se_lead', 'owner', 'stage', 'revenue_type']}
                  defaultSort="weighted_value"
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
