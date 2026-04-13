export type ACPSocketMessageType =
  | "hello"
  | "system"
  | "ai"
  | "ai_message"
  | "vote"
  | "vote_update"
  | "consensus"
  | "done"
  | "pipeline_progress"
  | "user_confirm_required"
  | "error"
  | string

export interface ACPBaseMessage {
  type: ACPSocketMessageType
  timestamp?: string
  discussion_id?: string
  pipeline_id?: string
  id?: string
  [key: string]: unknown
}

export interface AIMessage extends ACPBaseMessage {
  type: "ai" | "ai_message"
  ai_id?: string
  ai_name?: string
  ai_color?: string
  content: string
  thinking?: string
}

export interface VoteResult extends ACPBaseMessage {
  type: "vote" | "vote_update"
  weighted_avg?: number
  std_dev?: number
  vote_count?: number
  score_distribution?: Record<string, number>
  content?: string
}

export interface ConsensusResult extends ACPBaseMessage {
  type: "consensus"
  content?: string
  summary?: string
  text?: string
  synthesizer?: string
}

export interface PipelineStep extends ACPBaseMessage {
  type: "pipeline_progress"
  step: number | string
  status: "running" | "completed" | "failed" | "paused" | string
  detail?: string
  duration_ms?: number
  step_name?: string
}

export interface UserConfirmRequiredMessage extends ACPBaseMessage {
  type: "user_confirm_required"
  detail?: string
  note_preview?: unknown
  quality?: unknown
}

export interface HelloMessage extends ACPBaseMessage {
  type: "hello"
  content?: string
  message?: string
}

export interface DoneMessage extends ACPBaseMessage {
  type: "done"
  result?: unknown
}

export type ACPWebSocketMessage =
  | AIMessage
  | VoteResult
  | ConsensusResult
  | PipelineStep
  | UserConfirmRequiredMessage
  | HelloMessage
  | DoneMessage
  | ACPBaseMessage

export interface DiscussionStartPayload {
  type: "start_discussion"
  topic: string
  level?: string
}

export interface PipelineStartResponse {
  success?: boolean
  pipeline_id?: string
  discussion_id?: string
  message?: string
  [key: string]: unknown
}
