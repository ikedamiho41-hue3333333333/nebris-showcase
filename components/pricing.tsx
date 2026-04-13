"use client"

import { Check, Zap, Star, Sparkles } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Quick",
    nameCn: "快速",
    price: "¥9.9",
    unit: "/ 篇",
    description: "7 模型，快速生成",
    icon: Zap,
    features: ["7 个 AI 模型参与", "快速讨论与成稿", "适合轻量选题与试水"],
    highlight: false,
  },
  {
    name: "Standard",
    nameCn: "标准",
    price: "¥29.9",
    unit: "/ 篇",
    description: "15 模型，标准质量",
    icon: Star,
    features: ["15 个 AI 模型参与", "多轮交叉讨论", "投票与共识收敛"],
    highlight: false,
  },
  {
    name: "Deep",
    nameCn: "深度",
    price: "¥59.9",
    unit: "/ 篇",
    description: "27 模型，最高质量",
    icon: Sparkles,
    features: ["全部 27 个 AI 模型", "最深讨论轮次", "质检与策略全量启用"],
    highlight: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#0A0A0F] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#d4a853]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-sm font-medium tracking-wider uppercase">定价方案</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#EEF2EA] md:text-4xl text-balance">
            按篇计费，透明档位
          </h2>
          <p className="mx-auto max-w-2xl text-[#888888]">
            Quick / Standard / Deep 对应不同模型规模与讨论深度
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl border bg-[#111116] p-6 transition-all hover:bg-[#d4a853]/10 ${
                plan.highlight
                  ? "border-2 border-[#d4a853] shadow-lg shadow-[#d4a853]/15"
                  : "border border-[#d4a853]/30 hover:border-[#d4a853]/50"
              }`}
            >
              {plan.highlight ? (
                <div className="absolute right-4 top-4 rounded-full bg-[#d4a853] px-3 py-1 text-xs font-medium text-[#0A0A0F]">
                  推荐
                </div>
              ) : null}

              <div
                className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                  plan.highlight ? "bg-[#d4a853]/20 text-[#d4a853]" : "bg-[#d4a853]/10 text-[#d4a853]"
                }`}
              >
                <plan.icon className="h-6 w-6" />
              </div>

              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#EEF2EA]">
                  {plan.name}
                  <span className="ml-2 text-sm font-normal text-[#888888]">{plan.nameCn}</span>
                </h3>
                <p className="mt-1 text-sm text-[#888888]">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-[#d4a853]">{plan.price}</span>
                <span className="text-sm text-[#888888]">{plan.unit}</span>
              </div>

              <ul className="mb-6 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[#e0e0e0]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#d4a853]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/chat"
                className={`block w-full rounded-lg py-3 text-center text-sm font-medium transition-all ${
                  plan.highlight
                    ? "bg-[#d4a853] text-[#0A0A0F] hover:bg-[#e0c068]"
                    : "border border-[#d4a853]/30 bg-[#0A0A0F] text-[#EEF2EA] hover:border-[#d4a853]/60"
                }`}
              >
                开始使用
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#888888]">具体权益以产品内说明为准 · 支持企业定制</p>
        </div>
      </div>
    </section>
  )
}
