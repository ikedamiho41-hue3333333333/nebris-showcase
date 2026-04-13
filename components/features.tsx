"use client"

import { Bot, Brain, Cpu, MessageSquare, Network, Sparkles, Vote, Zap } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "14端点·27席位",
    description:
      "DeepSeek、Kimi、Qwen、MiniMax、Gemma、Llama、Nemotron 等已配置端点，多角色复用形成 27 讨论席位，多角度交叉讨论。",
  },
  {
    icon: MessageSquare,
    title: "群体讨论",
    description: "AI模型之间交叉讨论，互相补充、优化、挑战彼此观点，模拟真实团队头脑风暴。",
  },
  {
    icon: Vote,
    title: "投票决策",
    description: "基于共识机制的投票系统，确保最终输出是多数AI认可的最优方案。",
  },
  {
    icon: Zap,
    title: "三种模式",
    description: "Quick快速响应、Standard标准讨论、Deep深度分析，灵活适配不同场景需求。",
  },
  {
    icon: Network,
    title: "平台矩阵",
    description: "Phase 1 图文多平台已接入与规划中，视频与电商阶段陆续开放，一键适配分发。",
  },
  {
    icon: Sparkles,
    title: "智能优化",
    description: "根据平台特性自动调整内容格式、风格、排版，最大化传播效果。",
  },
]

export function Features() {
  return (
    <section id="features" className="bg-[#0A0A0F] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#C9A84C]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-sm font-medium tracking-wider uppercase">功能特性</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#EEF2EA] md:text-4xl text-balance">
            全球AI协同，为你创作
          </h2>
          <p className="mx-auto max-w-2xl text-[#9BA89F]">
            不再是单一 AI 的独白，而是 27 个讨论席位上的交叉讨论与投票，产出经共识收敛的优质内容
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-xl border border-[#2A2A36] bg-[#12121A] p-6 transition-all hover:border-[#C9A84C]/50 hover:bg-[#1A1A24]"
            >
              <div className="absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#C9A84C]/5 blur-3xl transition-all group-hover:bg-[#C9A84C]/10" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#C9A84C]/10 text-[#C9A84C]">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-[#EEF2EA]">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-[#9BA89F]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
