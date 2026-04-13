"use client"

import * as React from "react"

import { useWebSocket } from "@/hooks/useWebSocket"
import type {
  ACPWebSocketMessage,
  AIMessage,
  ConsensusResult,
  PipelineStartResponse,
  PipelineStep,
  VoteResult,
} from "@/types/acp"

const DEFAULT_WS_URL = "ws://localhost:3001"
const DEFAULT_API_BASE = "http://localhost:3000"

function resolveApiUrl(pathname: string) {
  const base =
    process.env.NEXT_PUBLIC_NEBRIS_API_BASE?.trim() || DEFAULT_API_BASE
  return `${base}${pathname}`
}

function toAiMessage(message: ACPWebSocketMessage): AIMessage {
  return {
    ...(message as AIMessage),
    type: "ai",
    content:
      typeof message.content === "string"
        ? message.content
        : typeof message.message === "string"
          ? message.message
          : "",
  }
}

export function useACPDiscussion() {
  const {
    isConnected,
    messages,
    sendMessage,
    lastMessage,
  } = useWebSocket(process.env.NEXT_PUBLIC_NEBRIS_WS_URL || DEFAULT_WS_URL)

  const [aiMessages, setAiMessages] = React.useState<AIMessage[]>([])
  const [votes, setVotes] = React.useState<VoteResult[]>([])
  const [consensus, setConsensus] = React.useState<ConsensusResult | null>(null)
  const [pipelineSteps, setPipelineSteps] = React.useState<PipelineStep[]>([])
  const [discussionId, setDiscussionId] = React.useState<string | null>(null)
  const [pipelineId, setPipelineId] = React.useState<string | null>(null)
  const [isRunning, setIsRunning] = React.useState(false)

  React.useEffect(() => {
    if (!lastMessage) {
      return
    }

    const nextDiscussionId =
      typeof lastMessage.discussion_id === "string"
        ? lastMessage.discussion_id
        : null
    const nextPipelineId =
      typeof lastMessage.pipeline_id === "string" ? lastMessage.pipeline_id : null

    if (nextDiscussionId) {
      setDiscussionId(nextDiscussionId)
    }
    if (nextPipelineId) {
      setPipelineId(nextPipelineId)
    }

    if (lastMessage.type === "ai" || lastMessage.type === "ai_message") {
      setAiMessages((prev) => [...prev, toAiMessage(lastMessage)])
      setIsRunning(true)
      return
    }

    if (lastMessage.type === "vote" || lastMessage.type === "vote_update") {
      setVotes((prev) => [...prev, lastMessage as VoteResult])
      return
    }

    if (lastMessage.type === "consensus") {
      setConsensus(lastMessage as ConsensusResult)
      return
    }

    if (lastMessage.type === "pipeline_progress") {
      const step = lastMessage as PipelineStep
      setPipelineSteps((prev) => {
        const next = prev.slice()
        const existingIndex = next.findIndex(
          (item) =>
            String(item.step) === String(step.step) &&
            (item.pipeline_id ?? "") === (step.pipeline_id ?? ""),
        )

        if (existingIndex >= 0) {
          next[existingIndex] = step
          return next
        }

        return [...next, step]
      })
      setIsRunning(step.status === "running" || step.status === "paused")
      return
    }

    if (lastMessage.type === "done") {
      setIsRunning(false)
      return
    }

    if (lastMessage.type === "user_confirm_required") {
      setIsRunning(false)
    }
  }, [lastMessage])

  const resetDiscussionState = React.useEffectEvent(() => {
    setAiMessages([])
    setVotes([])
    setConsensus(null)
    setPipelineSteps([])
    setDiscussionId(null)
    setPipelineId(null)
    setIsRunning(false)
  })

  const startDiscussion = React.useEffectEvent((topic: string, mode = "standard") => {
    const normalizedTopic = topic.trim()
    if (!normalizedTopic) {
      return false
    }

    resetDiscussionState()
    setIsRunning(true)
    return sendMessage({
      type: "start_discussion",
      topic: normalizedTopic,
      level: mode,
    })
  })

  const startPipeline = React.useEffectEvent(
    async (topic: string, level = "standard"): Promise<PipelineStartResponse> => {
      const normalizedTopic = topic.trim()
      if (!normalizedTopic) {
        throw new Error("topic is required")
      }

      resetDiscussionState()
      setIsRunning(true)

      const response = await fetch(resolveApiUrl("/api/pipeline/start"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: normalizedTopic,
          level,
        }),
      })

      const contentType = response.headers.get("content-type") || ""

      if (!response.ok) {
        const errorText = contentType.includes("application/json")
          ? JSON.stringify(await response.json())
          : await response.text()
        throw new Error(errorText || `Pipeline start failed: ${response.status}`)
      }

      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as PipelineStartResponse
        if (typeof payload.pipeline_id === "string") {
          setPipelineId(payload.pipeline_id)
        }
        return payload
      }

      return {
        success: true,
        message: await response.text(),
      }
    },
  )

  const stopDiscussion = React.useEffectEvent(() => {
    setIsRunning(false)
    if (discussionId) {
      return sendMessage({
        type: "stop_discussion",
        discussion_id: discussionId,
      })
    }

    return sendMessage("/stop")
  })

  return {
    isConnected,
    isRunning,
    messages,
    lastMessage,
    aiMessages,
    votes,
    consensus,
    pipelineSteps,
    discussionId,
    pipelineId,
    startDiscussion,
    startPipeline,
    stopDiscussion,
  }
}
