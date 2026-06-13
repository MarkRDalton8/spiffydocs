export enum InsightType {
  COMPETITOR = "competitor",
  OBJECTION = "objection",
  BUYING_SIGNAL = "buying_signal",
  MEDDPICC = "meddpicc",
  ACTION_ITEM = "action_item",
  DISCOVERY_NUDGE = "discovery_nudge",
}

export interface CallInsight {
  id?: string
  type: InsightType | string
  severity?: "high" | "medium" | "low"
  text?: string
  title?: string
  description?: string
  snippet?: string
  timestamp?: string
  speaker?: string
  suggested_response?: string
  metadata?: {
    signal?: string
    confidence?: "high" | "medium" | "low"
  }
}

export interface TranscriptChunk {
  speaker: string
  text: string
  timestamp: string
}

export interface MEDDPICCState {
  metrics?: string
  economic_buyer?: string
  decision_criteria?: string
  decision_process?: string
  paper_process?: string
  identify_pain?: string
  champion?: string
  competition?: string
}

export interface DiscoveryNudge {
  type: "discovery_nudge"
  severity: "high" | "medium"
  question_id: string
  category: string
  suggested_question: string
  why_it_matters: string
  context: string
  meddpicc_letter: string
  late_call: boolean
}
