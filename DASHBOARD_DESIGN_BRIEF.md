# SPIFFY Portfolio Dashboard - Design Brief

## Project Context

SPIFFY is an AI-powered sales intelligence platform that generates executive portfolio reports from Salesforce data and Gong call transcripts. We have a CLI tool that generates comprehensive markdown reports, and now we're building a web dashboard to visualize this data.

**Current Site:** https://spiffydocs.ai
- Landing page: Full SPIFFY marketing site
- Dashboard: `/dashboard` route with Google OAuth authentication
- Tech Stack: Next.js 15, TypeScript, Tailwind CSS, NextAuth.js

## Current Dashboard State

The authenticated dashboard currently shows three placeholder metrics:
- Total Pipeline: $4.8M
- Quota Attainment: 34%
- Open Deals: 65

**Goal:** Replace these with real data from our portfolio intelligence reports.

## Data Source: Portfolio Report Structure

Our CLI generates a comprehensive markdown report with these sections:

### 1. Executive Summary
- Current quarter attainment vs quota
- Win rate percentage
- Pipeline coverage ratio
- ARR metrics (closed won ARR, net ARR impact, open pipeline ARR)

### 2. Current Quarter Attainment
- Revenue by month breakdown
- Quota tracking with percentage
- Commission calculations
- Deals won count

### 3. Deals Closing This Week
- Table of opportunities closing in next 7 days
- Columns: Account, Amount, Probability, Weighted Value, Close Date, SE, Stage
- Total pipeline and weighted pipeline for the week

### 4. Historical Performance / Win-Loss Analysis
- Win/loss breakdown by quarter
- Win rate trends over time
- Total opportunities, won deals, lost deals

### 5. Pipeline Coverage Analysis
- Coverage by stage (early/mid/late)
- Best case / commit / pipeline / weighted totals
- Stage-by-stage breakdown with probabilities

### 6. SE Coverage & SE-Level Breakdown
- Individual SE performance (Walter Gold, Matt Hinton, Emanuel Prado as key direct reports)
- Metrics per SE: deal count, total pipeline, weighted pipeline, average deal size
- At-risk deals (stale/dark) per SE

### 7. Sales Director Pipeline View
- Per-director breakdown (Todd Trippany, Colin Peters, Dan McMenamin)
- Q1 attainment, open pipeline, weighted pipeline
- Top 3 deals per director

### 8. Product Mix
- Revenue by product family (Q1 closed won)
- Pipeline by product family with coverage ratios
- ACV breakdown: Analytics ACV, Activation ACV, Amplifier ACV, Audience ACV

### 9. Stale & Dark Deals
- Stale deals: stuck in stage too long (>30 days mid-stage, >45 days late-stage)
- Dark deals: no activity in >14 days
- Table with account, opportunity, stage, days/last activity, SE, owner

### 10. Sales Efficiency Metrics
- Average sales cycle (days)
- Based on closed deals analysis

### 11. Top Performers
- Top accounts by revenue
- Top SEs by revenue
- Top AEs by revenue
- Historical performance (last N quarters)

### 12. New Business vs Expansion Breakdown
- Separate metrics for New Business and Expansion deals
- Total opportunities, won deals, revenue, quota, attainment %, win rate
- New logos count for New Business

## Sample Data Points

**Executive Metrics:**
- Total Revenue (Current Quarter): $1,868,587
- Quota: $1,607,500
- Attainment: 116%
- Win Rate: 45%
- Pipeline Coverage: 3.2x
- Closed Won ARR: $1.2M
- Net ARR Impact: $1.1M
- Open Pipeline ARR: $3.5M

**SE Performance Example:**
- Walter Gold: 12 deals | $2.4M pipeline | $1.2M weighted | $200K avg deal size | 3 at-risk deals
- Matt Hinton: 8 deals | $1.8M pipeline | $900K weighted | $225K avg | 1 at-risk deal

**Product Mix Example:**
- Core: $800K revenue (53%), 25 deals, $3.2M pipeline
- Analytics: $400K revenue (27%), 15 deals, $2.1M pipeline
- Social: $300K revenue (20%), 8 deals, $900K pipeline

**Deal Example:**
- Account: Acme Corp
- Amount: $500K
- Probability: 80%
- Weighted: $400K
- Close Date: Mar 30
- SE: Walter Gold
- Stage: 5 - Negotiate

## Target Users

**Primary:** Sales VP/Director reviewing portfolio performance
**Use Cases:**
1. Quick daily check-in: "What's my current attainment? What's closing this week?"
2. Weekly pipeline review: "Where are my gaps? Which deals need attention?"
3. Team management: "How are my SEs and AEs performing?"
4. Executive briefings: "What numbers do I present to leadership?"

## Design Requirements

### Visual Style
- Match the existing SPIFFY dark theme (#0a0e1a background)
- Use the gradient blues/purples from the landing page
- Professional, executive-ready aesthetic
- Clean, modern, data-focused

### Layout Considerations
- Navigation bar with user info and sign-out (already exists)
- Responsive design (desktop primary, mobile secondary)
- Easy scanning of key metrics
- Drill-down capability for details

### Data Visualization Preferences
- Tables for deal lists (sortable, filterable)
- Cards/widgets for key metrics
- Charts for trends (win rate, pipeline coverage, attainment over time)
- Progress bars for quota attainment
- Color coding: green for good, yellow for warning, red for at-risk

### Functional Requirements
- Refresh data on demand
- Date range selection (current quarter default)
- Export capability (PDF, CSV)
- Deep links to Salesforce records
- Mobile-responsive for on-the-go access

## Technical Constraints

**Current Stack:**
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Server Components (default) and Client Components ('use client' when needed)
- No external charting libraries yet (open to suggestions: Recharts, Chart.js, Tremor)

**Data Format:**
- Currently: Markdown files generated by Python CLI
- Future: Could be JSON API, direct Salesforce queries, or parsed markdown
- Location: `/Users/markdalton/code/spiffy-cli/data/reports/portfolio_report_latest.md`

## Design Challenge

**The Question:** How should we structure and visualize this rich dataset in a web dashboard?

**Options to Consider:**
1. Full single-page report (scroll through all sections)
2. Tab-based interface (Executive / Pipeline / Team / Deals)
3. Dashboard + detail views (overview with drill-downs)
4. Customizable widget dashboard (drag-and-drop)

**What We Need:**
- Layout recommendations
- Component hierarchy
- Information architecture
- Visual mockups or descriptions
- Suggested charting libraries
- Interaction patterns

## Example User Flows

**Morning Check-in (2 minutes):**
1. Login → Dashboard loads
2. See: Current attainment (116%), deals closing this week (8 deals, $1.8M)
3. Identify: 2 at-risk deals need attention
4. Action: Click to view details, reach out to SE

**Weekly Pipeline Review (15 minutes):**
1. Navigate to Pipeline Coverage section
2. Review stage-by-stage breakdown
3. Identify gaps in mid-stage pipeline
4. Check SE performance to see who needs support
5. Review stale/dark deals requiring action
6. Export summary for team meeting

**Executive Briefing Prep (5 minutes):**
1. Pull up Executive Summary
2. Review attainment trend (current: 116%, last Q: 95%)
3. Check product mix (which products driving revenue?)
4. Note top performers for recognition
5. Screenshot or export for slide deck

## Current Codebase Reference

**Dashboard Component:** `/Users/markdalton/code/spiffydocs/app/dashboard/page.tsx`
- Uses `useSession` for auth
- Shows loading state
- Shows login form if not authenticated
- Shows dashboard with placeholder metrics if authenticated

**Existing Colors:**
- Background: `#0a0e1a`
- Slate variants: `slate-800/50`, `slate-700`, `slate-600`
- Blue variants: `blue-400`, `blue-500`, `blue-600`
- Purple: `purple-400`
- Green: `green-400`

## Deliverable Request

Please provide:
1. **Information Architecture** - How to organize these 12 sections
2. **Layout Mockup** - Description or ASCII art of the dashboard layout
3. **Component Breakdown** - What React components to build
4. **Charting Recommendations** - Which library for visualizations
5. **Interaction Patterns** - How users navigate and drill down
6. **Mobile Strategy** - How to adapt for smaller screens
7. **Phase 1 Recommendation** - What to build first for maximum impact

---

**Additional Context:**
- This is a real production tool used by sales leadership
- Data updates daily (Salesforce sync)
- Users are sales professionals, not technical
- Clean, fast, and intuitive is more important than feature-rich
- We can iterate - doesn't need to be perfect on day 1
