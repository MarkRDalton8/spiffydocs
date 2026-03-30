'use client'

import { useState, useEffect, useCallback } from 'react'
import { PortfolioData } from '@/types/portfolio'

interface UsePortfolioDataResult {
  data: PortfolioData | null
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

/**
 * Hook to fetch portfolio data from static JSON file.
 *
 * Data Source: /data/portfolio_report_latest.json (Option B)
 * - JSON file is copied from spiffy-cli after each report generation
 * - Located in public/data/ directory
 * - Fetched client-side (no API needed)
 *
 * Workflow:
 * 1. Run: python3 portfolio_report_generator.py
 * 2. Copy: cp spiffy-cli/data/reports/portfolio_report_latest.json spiffydocs/public/data/
 * 3. Commit/push to trigger Vercel deployment
 */
export function usePortfolioData(): UsePortfolioDataResult {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fetch from public directory
      // Add timestamp to prevent caching
      const timestamp = Date.now()
      const response = await fetch(`/data/portfolio_report_latest.json?t=${timestamp}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio data: ${response.statusText}`)
      }

      const jsonData = await response.json()
      setData(jsonData)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching portfolio data')
      setError(error)
      console.error('Error fetching portfolio data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    refresh: fetchData
  }
}
