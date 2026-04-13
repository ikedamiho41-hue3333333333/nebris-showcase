"use client"

import { Check, Zap, Star, Sparkles } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Quick",
    nameCn: "快速模式",
    price: "$0.008",
    unit: "/ 每次讨论",
    description: "快速生成，适合简单任务",
    icon: Zap,
    color: "#5EEAD4",
    features: [
      "3-5个AI模型参与",
      "1轮快速讨论",
      "基础内容生成",
      "单平台输出",
      "响应时间 < 10s",
    ],
  },
  {
    name: "Standard",
    nameCn: "标准模式",
    price: "$0.065",
    unit: "/ 每次讨论",
    description: "平衡质量与速度，推荐使用",
    icon: Star,
    color: "#C9A84C",
    popular: true,
    features: [
      "15-20个AI模型参与",
      "3-5轮深度讨论",
      "投票决策机制",
      "多平台适配",
      "内容质量优化",
      "响应时间 < 30s",
    ],
  },
  {
    name: "Deep",
    nameCn: "深度模式",
    price: "$0.174",
    unit: "/ 每次讨论",
    description: "全模型参与，极致质量",
    icon: Sparkles,
    color: "#818CF8",
    features: [
      "全部27个AI模型",
      "6-10轮充分讨论",
      "多轮投票优化",
      "全平台一键发布",
      "SEO深度优化",
      "A/B测试建议",
      "响应时间 < 60s",
    ],
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#0A0A0F] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#C9A84C]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-sm font-medium tracking-wider uppercase">定价方案</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#EEF2EA] md:text-4xl text-balance">
            按需付费，透明定价
          </h2>
          <p className="mx-auto max-w-2xl text-[#9BA89F]">
            根据任务复杂度选择合适的模式，只为实际使用付费
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl border bg-[#12121A] p-6 transition-all hover:bg-[#1A1A24] ${
                plan.popular
                  ? "border-[#C9A84C] shadow-lg shadow-[#C9A84C]/10"
                  : "border-[#2A2A36]"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute right-4 top-4 rounded-full bg-[#C9A84C] px-3 py-1 text-xs font-medium text-[#0A0A0F]">
                  推荐
                </div>
              )}

              {/* Icon */}
              <div
                className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${plan.color}20` }}
              >
                <plan.icon className="h-6 w-6" style={{ color: plan.color }} />
              </div>

              {/* Plan Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#EEF2EA]">
                  {plan.name}
                  <span className="ml-2 text-sm font-normal text-[#9BA89F]">{plan.nameCn}</span>
                </h3>
                <p className="mt-1 text-sm text-[#9BA89F]">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold" style={{ color: plan.color }}>
                  {plan.price}
                </span>
                <span className="text-sm text-[#9BA89F]">{plan.unit}</span>
              </div>

              {/* Features */}
              <ul className="mb-6 space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[#EEF2EA]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: plan.color }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href="/chat"
                className={`block w-full rounded-lg py-3 text-center text-sm font-medium transition-all ${
                  plan.popular
                    ? "bg-[#C9A84C] text-[#0A0A0F] hover:bg-[#D4B65C]"
                    : "border border-[#2A2A36] bg-[#0A0A0F] text-[#EEF2EA] hover:border-[#C9A84C]/50"
                }`}
              >
                开始使用
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#9BA89F]">
            所有模式均包含：API访问 · 数据导出 · 7x24技术支持
          </p>
        </div>
      </div>
    </section>
  )
}
