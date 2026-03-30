# Build: SPIFFY Portfolio Intelligence Dashboard
# Save as: .claude/commands/build-portfolio-dashboard.md

Before writing any code, read these files in full:
- `app/dashboard/page.tsx` — existing dashboard component
- `portfolio_report_generator.py` — CLI report generator
- Any existing layout, nav, or auth components in `app/`
- `tailwind.config.ts` — existing color/theme config
- `package.json` — existing dependencies

---

## OVERVIEW

Build a production-quality portfolio intelligence dashboard at
https://spiffydocs.ai/dashboard. The existing page shows placeholder
metrics — replace it with real data and a full dashboard layout.

Stack: Next.js 15, TypeScript, Tailwind CSS, NextAuth.js (already set up)
Charting: Add Recharts (npm install recharts)
Auth: Already handled via Google OAuth — do not change auth logic

---

## PHASE 1: CLI JSON OUTPUT (do this first, before any UI work)

Update portfolio_report_generator.py to write a JSON file alongside
the existing markdown, named portfolio_report_latest.json in the same
directory.

Critical additions to every deal object — construct sf_url from the
opportunity ID:
  sf_url = f"https://piano.lightning.force.com/lightning/r/Opportunity/{opp_id}/view"

The JSON should contain these top-level keys, populated from the
existing markdown report data:
  generated_at, period, region,
  attainment (quota, closed_won, attainment_pct, commission, gap),
  pipeline (total, weighted, coverage_ratio, NB/expansion breakdowns),
  performance (win_rate, closed counts, avg deal sizes, sales cycle),
  arr (closed_won_arr, net_arr_impact, open_pipeline_arr),
  se_coverage (overall_pct, by_se array with name/deals/pipeline/weighted/avg/at_risk),
  directors (name, attainment, open_deals, pipeline, top_deals with sf_url),
  closing_this_week (full deal objects with sf_url),
  closing_this_quarter (full deal objects with sf_url),
  stale_deals (account, opportunity, stage, days_in_stage, se, owner, sf_url),
  dark_deals (account, opportunity, stage, last_activity_days, se, owner, sf_url),
  product_mix (closed_won array, pipeline array, acv breakdown),
  nb_vs_expansion (new_business and expansion objects with opps/won/revenue/quota/attainment_pct/win_rate)

Run the generator after changes and confirm the JSON file is written
with all fields populated. Do not proceed to Phase 2 until verified.

---

## PHASE 2: NEXT.JS DATA LAYER

Determine the right data fetching approach:

Option A: Create app/api/portfolio/route.ts that proxies to the
FastAPI backend GET /api/portfolio/latest. Use if FastAPI is reachable
from Vercel.

Option B: Copy portfolio_report_latest.json to public/data/ in the
spiffydocs repo after each CLI run. Fetch from /data/portfolio_report_latest.json
client-side. Use if no backend connectivity.

Check connectivity, choose the right option, document the choice in
a comment at the top of the route or hook file.

Create types/portfolio.ts with TypeScript interfaces for the full
JSON schema. No any types.

Create hooks/usePortfolioData.ts returning { data, isLoading, error, refresh }
where refresh() re-fetches without a page reload.

---

## PHASE 3: DASHBOARD LAYOUT

Replace placeholder content in app/dashboard/page.tsx with the full
dashboard. Do not change auth logic or the existing nav bar structure
— extend it.

Four-tab navigation below the nav bar:
  Overview | Pipeline | Team | Deals

Pill-style tabs. Active: bg-indigo-600 text-white.
Inactive: text-slate-400 hover:text-white hover:bg-slate-700/50.
Mobile: icon only (no label text) using lucide-react icons.

Status/color utilities in lib/status.ts:
  getAttainmentStatus(pct) -> green (>=80), amber (>=50), red (<50)
  getCoverageStatus(ratio) -> green (>=2), amber (>=1), red (<1)
  getDaysColor(days) -> red (>90), amber (>30), yellow (<=30)

Formatter utilities in lib/formatters.ts:
  formatCurrency(n) -> $354K, $1.2M, $22.5K
  formatPct(n) -> 34%
  formatCoverage(n) -> 1.5x

Recharts colors:
  pipeline: #5A67D8 (indigo)
  weighted: #0D9488 (teal)
  positive: #10B981 (emerald)
  negative: #EF4444 (red)

---

## PHASE 4: COMPONENTS (exactly 7, no more in Phase 1)

All in components/dashboard/.

StatCard — label, value (pre-formatted string), subtitle, status color.
  Styling: bg-slate-800/50 border border-slate-700 rounded-xl p-6
  4px left border in status color. text-3xl font-bold for value.

QuotaProgressBar — label, attainmentPct, closedWon, quota, status.
  Full-width bar filled to attainmentPct in status color.
  Vertical quota line marker at 100%.
  Label + pct above bar. Dollar amounts below in slate-400.

DealsTable — reusable sortable table used across all tabs.
  Props: deals array, title, showColumns array, defaultSort, maxRows.
  Click column header to sort asc/desc.
  SE === null: amber cell highlight (bg-amber-500/10 text-amber-400).
  Stage badges: 5-Negotiate=emerald, 4-Propose=blue, 3-Validate=amber,
    1-2=slate, 0=gray.
  Account name: anchor tag linking to sf_url if present, target _blank.
  overflow-x-auto wrapper, min-w-[640px] inner table for mobile scroll.

SEBreakdownChart — horizontal BarChart from Recharts.
  Data: se_coverage.by_se. Two bars: pipeline (indigo) + weighted (teal).
  Custom tooltip with name, pipeline, weighted, avg deal, at-risk count.

DirectorCards — grid grid-cols-1 lg:grid-cols-3.
  Each card: director name, attainment amount, pipeline total/weighted,
  top 3 deals as compact list with stage badge and sf_url link.

ProductMixChart — horizontal BarChart, closed won revenue by product.
  Sorted descending by revenue. Pct label at bar end.

RefreshButton — in nav bar right side.
  Shows "Updated X min ago" (from generated_at timestamp).
  Spinning icon on load. Calls refresh() from data hook.
  Shows "Updated just now" for 10s after refresh completes.

---

## PHASE 5: TAB CONTENT

OVERVIEW TAB:
  Row 1: grid grid-cols-2 lg:grid-cols-4 — 4 StatCards
    Attainment: attainment_pct_total%, status by getAttainmentStatus
    Commission: $commission_earned, status red if < 50% of OTE
    Coverage: coverage_ratio formatted as Nx, status by getCoverageStatus
    This Week: N deals, blue, subtitle = $weighted weighted

  Row 2: grid grid-cols-1 lg:grid-cols-2 — 2 QuotaProgressBars
    New Business: attainment_pct_new_business
    Expansion: attainment_pct_expansion

  Row 3: DealsTable
    title="Closing This Week"
    deals=closing_this_week, defaultSort=weighted
    columns: account, amount, probability, weighted, close_date, se, owner, stage

  Row 4: grid grid-cols-1 lg:grid-cols-2 — 2 compact DealsTable
    Left — Stale Deals: columns: account, stage, days_in_stage, se, owner; maxRows=10
    Right — Dark Deals: columns: account, last_activity_days, stage, se, owner; maxRows=10

PIPELINE TAB:
  Row 1: 3 StatCards — NB Coverage, Total Coverage, Expansion Coverage
  Row 2: 2 QuotaProgressBars — NB and Expansion
  Row 3: ProductMixChart full width
  Row 4: Pipeline by product static table (from product_mix.pipeline)
    Columns: Product, Deals, Pipeline, Weighted, Coverage
    Coverage cell color-coded: >2x green, 1-2x amber, <1x red
  Row 5: NB vs Expansion summary from nb_vs_expansion

TEAM TAB:
  Row 1: StatCard "SE Coverage" showing overall_pct and covered/total
  Row 2: SEBreakdownChart full width (hidden on mobile, text fallback)
  Row 3: DirectorCards (Todd, Colin, Dan)
  Row 4: DealsTable showing deals where se !== null
    columns: se, account, amount, stage, weighted, close_date

DEALS TAB:
  Filter bar: SE dropdown, Stage dropdown, account search input (all client-side)
  SE options: All, Walter Gold, Matt Hinton, Emanuel Prado, Unassigned
  Stage options: All, Early (0-2), Mid (3), Late (4-5)
  DealsTable: closing_this_quarter, no maxRows, defaultSort=weighted
  All columns visible

---

## PHASE 6: MOBILE

Apply throughout — no separate mobile components:
  Stat cards: grid grid-cols-2 lg:grid-cols-4
  Side by side sections: grid grid-cols-1 lg:grid-cols-2
  Charts: hidden lg:block with lg:hidden text fallback
  Tables: overflow-x-auto with min-w-[640px] inner table
  Tab labels: hidden sm:inline

---

## CORS (if using Option A)

Add to backend/app.py:
  CORSMiddleware with allow_origins for spiffydocs.ai, *.vercel.app,
  localhost:3000. Methods: GET, POST.

---

## WHAT NOT TO CHANGE

- NextAuth.js config and Google OAuth setup
- Landing page routes and components
- Existing nav bar structure (extend only)
- Any file outside: app/dashboard/, components/dashboard/,
  hooks/, types/, lib/, backend/app.py

---

## TESTING CHECKLIST

Phase 1:
  [ ] portfolio_report_latest.json written by CLI
  [ ] All deal objects have sf_url
  [ ] JSON validates with no syntax errors

Overview tab:
  [ ] 4 stat cards show real data (not placeholders)
  [ ] Commission: $7,729 of $22.5K OTE
  [ ] NB progress bar 9% red, Expansion 61% amber
  [ ] Closing this week: 15 rows sorted by weighted desc
  [ ] SE=None rows highlighted amber
  [ ] Account names link to Salesforce (new tab)
  [ ] Stale and dark deal tables populated with day pills

Pipeline tab:
  [ ] Coverage cards: 2.5x / 1.5x / 0.48x
  [ ] Product mix chart renders with real data

Team tab:
  [ ] SE chart: Walter / Matt / Ema bars
  [ ] Director cards: 3 cards with top deals linking to SF

Deals tab:
  [ ] SE filter, stage filter, search all work client-side

General:
  [ ] Refresh button spins, updates timestamp
  [ ] tsc --noEmit passes
  [ ] No console errors
  [ ] Mobile: 2x2 stat cards, tables scroll horizontally

---

## REPORT BACK

1. Option A or B for data fetching and why
2. Confirm JSON generated correctly by CLI
3. Description or screenshot of Overview tab with real data
4. Any schema fields that needed adjustment
5. Any Recharts SSR issues and how resolved
6. Confirm sf_url links open correct Salesforce records
