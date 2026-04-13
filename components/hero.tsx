"use client"

import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { AIDiscussionDemo } from "./ai-discussion-demo"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0A0F] pt-16">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#C9A84C]/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-[400px] w-[400px] rounded-full bg-[#C9A84C]/3 blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-[#C9A84C]" />
            <span className="text-sm text-[#C9A84C]">27个AI模型协同创作</span>
          </div>

          {/* Logo/Mascot */}
          <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-[#C9A84C] via-[#D4B65C] to-[#8B7634] shadow-2xl shadow-[#C9A84C]/30 md:h-40 md:w-40">
            <svg viewBox="0 0 100 100" className="h-20 w-20 md:h-24 md:w-24">
              <defs>
                <linearGradient id="nebrisGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0A0A0F" />
                  <stop offset="100%" stopColor="#1A1A24" />
                </linearGradient>
              </defs>
              {/* Stylized N with AI nodes */}
              <path d="M25 75V25L50 55L75 25V75" stroke="url(#nebrisGrad)" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="25" cy="25" r="6" fill="#0A0A0F"/>
              <circle cx="50" cy="55" r="6" fill="#0A0A0F"/>
              <circle cx="75" cy="25" r="6" fill="#0A0A0F"/>
              <circle cx="25" cy="75" r="6" fill="#0A0A0F"/>
              <circle cx="75" cy="75" r="6" fill="#0A0A0F"/>
            </svg>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-[#EEF2EA]">开翌</span>{" "}
            <span className="bg-gradient-to-r from-[#C9A84C] via-[#E8D48A] to-[#C9A84C] bg-clip-text text-transparent">
              NEBRIS
            </span>
          </h1>

          {/* Tagline */}
          <p className="mb-4 text-xl font-medium text-[#C9A84C] md:text-2xl">
            让全球AI为你全权运营
          </p>

          {/* Description */}
          <p className="mb-8 max-w-2xl text-base text-[#9BA89F] md:text-lg">
            27个AI模型交叉讨论、投票决策，为你创作最优质的内容。
            <br className="hidden md:block" />
            支持42个平台，三层智能架构，让AI为你全权运营。
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/chat"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-3 text-base font-medium text-[#0A0A0F] transition-all hover:bg-[#D4B65C] hover:shadow-lg hover:shadow-[#C9A84C]/30"
            >
              开始创作
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2A2A36] bg-[#12121A] px-6 py-3 text-base font-medium text-[#EEF2EA] transition-all hover:border-[#C9A84C]/50 hover:bg-[#1A1A24]"
            >
              了解更多
            </Link>
          </div>
        </div>

        {/* AI Discussion Demo */}
        <AIDiscussionDemo />
      </div>
    </section>
  )
}
