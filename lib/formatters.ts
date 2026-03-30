/**
 * Formatting utilities for dashboard display
 */

/**
 * Format currency values with K/M suffixes
 * @param value Number to format
 * @returns Formatted string like "$354K", "$1.2M", "$22.5K"
 */
export function formatCurrency(value: number): string {
  const absValue = Math.abs(value)
  const sign = value < 0 ? '-' : ''

  if (absValue >= 1_000_000) {
    const millions = absValue / 1_000_000
    return `${sign}$${millions.toFixed(1)}M`
  } else if (absValue >= 1_000) {
    const thousands = absValue / 1_000
    // Round to nearest K if < 10K, otherwise show decimal
    if (absValue < 10_000) {
      return `${sign}$${Math.round(thousands)}K`
    }
    return `${sign}$${thousands.toFixed(1)}K`
  } else {
    return `${sign}$${Math.round(absValue)}`
  }
}

/**
 * Format percentage
 * @param value Percentage value (0-100)
 * @returns Formatted string like "34%"
 */
export function formatPct(value: number): string {
  return `${Math.round(value)}%`
}

/**
 * Format coverage ratio
 * @param value Coverage ratio
 * @returns Formatted string like "1.5x"
 */
export function formatCoverage(value: number): string {
  return `${value.toFixed(1)}x`
}

/**
 * Format date relative to now
 * @param dateString ISO date string
 * @returns Formatted string like "2 days ago", "just now"
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

/**
 * Format date as MM/DD
 * @param dateString ISO date string or YYYY-MM-DD
 * @returns Formatted string like "03/30"
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}/${day}`
}
