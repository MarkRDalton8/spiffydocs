/**
 * Portfolio Intelligence Data Types
 *
 * Data fetching approach: Option B
 * - JSON file copied to public/data/portfolio_report_latest.json after each CLI run
 * - Fetched client-side from /data/portfolio_report_latest.json
 * - No backend API required
 */

export interface Deal {
  opportunity_id: string
  opportunity_name: string
  account_id: string
  account_name: string
  account_type: string
  stage: string
  amount: number
  converted_amount: number
  close_date: string
  probability: number
  owner: string
  owner_email: string
  is_closed: boolean
  is_won: boolean
  created_date: string
  last_activity_date: string | null
  lead_source: string | null
  fiscal: string
  fiscal_quarter: number
  revenue_type: string
  product_family: string
  opportunity_type: string

  // ARR/ACV fields
  arr: number | null
  y1_arr: number | null
  total_net_arr: number | null
  average_arr: number | null
  analytics_acv: number | null
  activation_acv: number | null
  amplifier_acv: number | null
  audience_acv: number | null

  // Enriched fields
  se_lead: string | null
  se_lead_is_lead: boolean
  account_manager: string | null
  has_runbook: boolean
  days_in_current_stage: number
  weighted_value: number

  // Salesforce URL
  sf_url: string | null
}

export interface StaleDeal {
  account: string
  opportunity: string
  stage: string
  days_in_stage: number
  se: string | null
  owner: string
  sf_url: string | null
}

export interface DarkDeal {
  account: string
  opportunity: string
  stage: string
  last_activity_days: number
  se: string | null
  owner: string
  sf_url: string | null
}

export interface SECoverage {
  name: string
  deals: number
  pipeline: number
  weighted: number
  avg: number
  at_risk: number
}

export interface DirectorTopDeal {
  account: string
  amount: number
  stage: string
  sf_url: string | null
}

export interface Director {
  name: string
  attainment: number
  open_deals: number
  pipeline: number
  weighted: number
  top_deals: DirectorTopDeal[]
}

export interface ProductPipelineItem {
  product: string
  count: number
  total: number
  weighted: number
}

export interface ProductMix {
  closed_won: Record<string, number>
  pipeline: ProductPipelineItem[]
  acv: {
    Analytics: number
    Activation: number
    Amplifier: number
    Audience: number
  }
}

export interface TypeMetrics {
  opps: number
  won: number
  revenue: number
  quota: number
  attainment_pct: number
  win_rate: number
  new_logos?: number
}

export interface PortfolioData {
  generated_at: string
  period: string
  region: string

  attainment: {
    quota: number
    closed_won: number
    attainment_pct: number
    commission: number
    gap: number
    nb_quota: number
    nb_closed_won: number
    nb_attainment_pct: number
    exp_quota: number
    exp_closed_won: number
    exp_attainment_pct: number
  }

  pipeline: {
    total: number
    weighted: number
    coverage_ratio: number
    nb_pipeline: number
    nb_weighted: number
    nb_coverage: number
    exp_pipeline: number
    exp_weighted: number
    exp_coverage: number
  }

  performance: {
    win_rate: number
    won_count: number
    lost_count: number
    avg_won_size: number
    avg_lost_size: number
    sales_cycle: number
  }

  arr: {
    closed_won_arr: number
    net_arr_impact: number
    open_pipeline_arr: number
    weighted_y1_arr: number
  }

  se_coverage: {
    overall_pct: number
    covered: number
    total: number
    by_se: SECoverage[]
  }

  directors: Director[]

  closed_this_quarter: Deal[]
  closing_this_week: Deal[]
  closing_this_quarter: Deal[]

  stale_deals: StaleDeal[]
  dark_deals: DarkDeal[]

  product_mix: ProductMix

  nb_vs_expansion: {
    new_business: TypeMetrics
    expansion: TypeMetrics
  }
}
