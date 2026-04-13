"use client"

import { Brain, Cog, GraduationCap, ArrowDown, Sparkles } from "lucide-react"

const layers = [
  {
    name: "思维层",
    nameEn: "Brain Layer",
    icon: Brain,
    engine: "ACP Engine",
    description: "14 个模型端点承载 27 个讨论席位，交叉讨论、分析、投票决策",
    color: "#C9A84C",
    features: ["多模型协同", "共识投票", "质量控制"],
  },
  {
    name: "执行层",
    nameEn: "Execution Layer",
    icon: Cog,
    engine: "OpenClaw Skills",
    description: "内容生成、格式优化、平台适配",
    color: "#5EEAD4",
    features: ["内容生成", "格式转换", "平台发布"],
  },
  {
    name: "学习层",
    nameEn: "Learning Layer",
    icon: GraduationCap,
    engine: "Hermes Agent",
    description: "数据反馈、效果分析、持续优化",
    color: "#818CF8",
    features: ["效果追踪", "策略优化", "智能学习"],
  },
]

export function Architecture() {
  return (
    <section id="architecture" className="bg-[#0A0A0F] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#C9A84C]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-sm font-medium tracking-wider uppercase">系统架构</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#EEF2EA] md:text-4xl text-balance">
            三层智能架构
          </h2>
          <p className="mx-auto max-w-2xl text-[#9BA89F]">
            思维-执行-学习闭环，让AI不只是生成内容，更能持续优化和进化
          </p>
        </div>

        {/* Architecture Diagram */}
        <div className="relative mx-auto max-w-3xl">
          {layers.map((layer, i) => (
            <div key={i} className="relative">
              {/* Layer Card */}
              <div
                className="group relative overflow-hidden rounded-2xl border bg-[#12121A] p-6 transition-all hover:bg-[#1A1A24] md:p-8"
                style={{ borderColor: `${layer.color}30` }}
              >
                {/* Glow Effect */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle at center, ${layer.color}08 0%, transparent 70%)` }}
                />

                <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
                  {/* Icon */}
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${layer.color}20` }}
                  >
                    <layer.icon className="h-8 w-8" style={{ color: layer.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-[#EEF2EA]">{layer.name}</h3>
                      <span className="text-sm text-[#9BA89F]">{layer.nameEn}</span>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: `${layer.color}20`, color: layer.color }}
                      >
                        {layer.engine}
                      </span>
                      {layer.engine === "Hermes Agent" ? (
                        <span className="rounded-full border border-[#818CF8]/40 bg-[#818CF8]/10 px-2.5 py-0.5 text-xs font-medium text-[#a5b4fc]">
                          即将上线
                        </span>
                      ) : null}
                    </div>
                    <p className="mb-4 text-[#9BA89F]">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.features.map((feature, j) => (
                        <span
                          key={j}
                          className="rounded-lg bg-[#0A0A0F] px-3 py-1.5 text-xs text-[#EEF2EA]"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {i < layers.length - 1 && (
                <div className="flex justify-center py-4">
                  <div className="flex flex-col items-center">
                    <div className="h-4 w-px bg-gradient-to-b from-[#2A2A36] to-transparent" />
                    <ArrowDown className="h-5 w-5 text-[#9BA89F]" />
                    <div className="h-4 w-px bg-gradient-to-b from-transparent to-[#2A2A36]" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Feedback Loop */}
          <div className="mt-8 rounded-xl border border-dashed border-[#2A2A36] bg-[#12121A]/50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[#9BA89F]">
              <Sparkles className="h-4 w-4 text-[#C9A84C]" />
              <span>学习层数据反馈至思维层，形成持续优化闭环</span>
              <Sparkles className="h-4 w-4 text-[#C9A84C]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
