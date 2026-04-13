"use client"

import { useEffect, useState } from "react"
import { Bot, ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react"

const AI_MODELS = [
  { name: "GPT-4o", color: "#10B981", shortName: "GPT" },
  { name: "Claude 3.5", color: "#8B5CF6", shortName: "CLD" },
  { name: "Gemini Pro", color: "#3B82F6", shortName: "GEM" },
  { name: "DeepSeek", color: "#F59E0B", shortName: "DSK" },
  { name: "Qwen 2.5", color: "#EC4899", shortName: "QWN" },
  { name: "Llama 3", color: "#06B6D4", shortName: "LLA" },
  { name: "Mistral", color: "#EF4444", shortName: "MIS" },
  { name: "Yi-Large", color: "#84CC16", shortName: "YI" },
]

const DISCUSSION_MESSAGES = [
  { model: 0, content: "这篇小红书文案需要更强调产品的独特卖点，建议开头用提问引起共鸣。" },
  { model: 1, content: "同意 GPT-4o 的观点。我补充一点：可以加入一些情感化的表达，让内容更有温度。" },
  { model: 2, content: "从数据分析来看，带有数字的标题点击率高出23%，建议标题加入具体数据。" },
  { model: 3, content: "我来优化一下文案结构：痛点引入 → 解决方案 → 产品展示 → 用户见证。" },
  { model: 4, content: "针对小红书平台特性，建议增加互动性话术，如「你觉得呢？」「评论区告诉我」。" },
  { model: 5, content: "综合以上建议，我来生成最终版本。已整合5个AI的观点。" },
]

export function AIDiscussionDemo() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0)
  const [isVoting, setIsVoting] = useState(false)
  const [votingComplete, setVotingComplete] = useState(false)

  useEffect(() => {
    if (visibleMessages < DISCUSSION_MESSAGES.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else {
      const votingTimer = setTimeout(() => {
        setIsVoting(true)
        setTimeout(() => {
          setVotingComplete(true)
        }, 2000)
      }, 1000)
      return () => clearTimeout(votingTimer)
    }
  }, [visibleMessages])

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-2xl border border-[#2A2A36] bg-[#12121A]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2A36] bg-[#0A0A0F] px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#EF4444]" />
              <div className="h-3 w-3 rounded-full bg-[#F59E0B]" />
              <div className="h-3 w-3 rounded-full bg-[#10B981]" />
            </div>
            <span className="ml-2 text-sm text-[#9BA89F]">AI 协作讨论中...</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9BA89F]">参与模型：</span>
            <div className="flex -space-x-1">
              {AI_MODELS.slice(0, 6).map((model, i) => (
                <div
                  key={i}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#12121A] text-[8px] font-bold text-white"
                  style={{ backgroundColor: model.color }}
                  title={model.name}
                >
                  {model.shortName[0]}
                </div>
              ))}
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#12121A] bg-[#2A2A36] text-[10px] text-[#9BA89F]">
                +21
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="h-[400px] overflow-y-auto p-4 md:h-[350px]">
          <div className="space-y-4">
            {/* Topic */}
            <div className="mb-6 rounded-lg bg-[#1A1A24] p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-[#C9A84C] px-2 py-0.5 text-xs font-medium text-[#0A0A0F]">任务</span>
                <span className="text-sm text-[#9BA89F]">小红书文案创作</span>
              </div>
              <p className="text-[#EEF2EA]">为新款智能手表创作一篇小红书种草文案，目标用户为25-35岁都市白领女性。</p>
            </div>

            {/* Messages */}
            {DISCUSSION_MESSAGES.slice(0, visibleMessages).map((msg, i) => {
              const model = AI_MODELS[msg.model]
              return (
                <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: model.color }}
                  >
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: model.color }}>
                        {model.name}
                      </span>
                    </div>
                    <div className="rounded-lg rounded-tl-none bg-[#1A1A24] p-3">
                      <p className="text-sm text-[#EEF2EA]">{msg.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Typing Indicator */}
            {visibleMessages < DISCUSSION_MESSAGES.length && (
              <div className="flex gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: AI_MODELS[DISCUSSION_MESSAGES[visibleMessages].model].color }}
                >
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-[#1A1A24] px-4 py-3">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[#9BA89F] [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[#9BA89F] [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-[#9BA89F]" />
                </div>
              </div>
            )}

            {/* Voting Phase */}
            {isVoting && (
              <div className="mt-6 rounded-lg border border-[#C9A84C]/30 bg-[#C9A84C]/10 p-4 animate-in fade-in duration-500">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-[#C9A84C]">投票决策中</span>
                  {votingComplete && (
                    <span className="flex items-center gap-1 text-sm text-[#10B981]">
                      <CheckCircle2 className="h-4 w-4" />
                      共识达成
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
                  {AI_MODELS.slice(0, 6).map((model, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-1 rounded-lg bg-[#0A0A0F] p-2"
                    >
                      <div
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: model.color }}
                      >
                        {model.shortName[0]}
                      </div>
                      <div className="flex items-center gap-1">
                        {votingComplete ? (
                          <ThumbsUp className="h-3 w-3 text-[#10B981]" />
                        ) : (
                          <div className="h-3 w-3 animate-pulse rounded-full bg-[#9BA89F]/50" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {votingComplete && (
                  <div className="mt-3 text-center text-sm text-[#9BA89F]">
                    27个AI模型投票完成，最终方案已生成
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#2A2A36] bg-[#0A0A0F] px-4 py-3">
          <div className="flex items-center gap-4 text-xs text-[#9BA89F]">
            <span>讨论轮次: {Math.min(visibleMessages, 6)}/6</span>
            <span>参与模型: 27</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#10B981]/20 px-2 py-1 text-xs text-[#10B981]">
              Standard 模式
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
