/**
 * Status and color utilities for dashboard metrics
 */

export type StatusColor = 'green' | 'amber' | 'red' | 'yellow'

/**
 * Get status color based on attainment percentage
 * @param pct Attainment percentage (0-100+)
 * @returns Status color: green (>=80), amber (>=50), red (<50)
 */
export function getAttainmentStatus(pct: number): StatusColor {
  if (pct >= 80) return 'green'
  if (pct >= 50) return 'amber'
  return 'red'
}

/**
 * Get status color based on pipeline coverage ratio
 * @param ratio Coverage ratio (e.g., 2.5 for 2.5x)
 * @returns Status color: green (>=2), amber (>=1), red (<1)
 */
export function getCoverageStatus(ratio: number): StatusColor {
  if (ratio >= 2) return 'green'
  if (ratio >= 1) return 'amber'
  return 'red'
}

/**
 * Get color based on days in stage
 * @param days Number of days
 * @returns Status color: red (>90), amber (>30), yellow (<=30)
 */
export function getDaysColor(days: number): StatusColor {
  if (days > 90) return 'red'
  if (days > 30) return 'amber'
  return 'yellow'
}

/**
 * Get Tailwind CSS classes for status colors
 */
export const statusColors = {
  green: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500',
    ring: 'ring-emerald-500/20'
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500',
    ring: 'ring-amber-500/20'
  },
  red: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500',
    ring: 'ring-red-500/20'
  },
  yellow: {
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500',
    ring: 'ring-yellow-500/20'
  }
} as const
