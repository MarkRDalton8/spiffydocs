'use client'

import { useEffect, useState, useRef } from 'react'
import { TranscriptChunk, MEDDPICCState } from '@/types/live-call'

export function useLiveCall(botId: string | null) {
  const [transcript, setTranscript] = useState<TranscriptChunk[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [meddpicc, setMeddpicc] = useState<MEDDPICCState>({})
  const [status, setStatus] = useState<string>('idle')
  const [isLive, setIsLive] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  useEffect(() => {
    if (!botId) return

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const eventSource = new EventSource(`${backendUrl}/api/live-call/${botId}/stream`)

    eventSource.addEventListener('connected', () => {
      setIsLive(true)
    })

    eventSource.addEventListener('history', (event) => {
      const data = JSON.parse(event.data)
      setTranscript(data.transcript || [])
      setInsights(data.insights || [])
    })

    eventSource.addEventListener('transcript', (event) => {
      const data = JSON.parse(event.data)
      setTranscript((prev) => [...prev, data])
    })

    eventSource.addEventListener('insight', (event) => {
      const data = JSON.parse(event.data)
      setInsights((prev) => [data, ...prev])
    })

    eventSource.addEventListener('discovery_nudge', (event) => {
      const data = JSON.parse(event.data)
      console.log('[Discovery Nudge]', data)
      setInsights((prev) => [{ ...data, type: 'discovery_nudge' }, ...prev])
    })

    eventSource.addEventListener('meddpicc_update', (event) => {
      const data = JSON.parse(event.data)
      setMeddpicc((prev) => ({ ...prev, [data.letter]: data.signal }))
    })

    eventSource.addEventListener('status', (event) => {
      const data = JSON.parse(event.data)
      setStatus(data.status)
    })

    eventSource.addEventListener('call_ended', () => {
      setIsLive(false)
      setStatus('ended')
    })

    eventSource.onerror = () => {
      setIsLive(false)
      setStatus('error')
    }

    eventSourceRef.current = eventSource

    return () => {
      eventSource.close()
    }
  }, [botId])

  return { transcript, insights, meddpicc, status, isLive }
}
