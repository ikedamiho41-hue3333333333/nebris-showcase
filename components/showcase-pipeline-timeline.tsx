"use client"

import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"

const PIPELINE_STEPS = [
  { id: "intent", label: "意图解读" },
  { id: "data", label: "数据采集" },
  { id: "strategy", label: "策略制定" },
  { id: "team", label: "AI 组队" },
  { id: "triple", label: "三线并行" },
  { id: "qa", label: "质检封驳" },
  { id: "integrate", label: "整合成品" },
  { id: "retro", label: "数据复盘" },
] as const

const STAGGER_MS = 200

export function ShowcasePipelineTimeline() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
        }
      },
      { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="mx-auto max-w-6xl">
      <h2 className="mb-8 text-center text-xl font-semibold text-[#e0e0e0] md:text-2xl">8 步内容流水线</h2>
      <div className="relative md:static">
        <p className="mb-2 flex items-center justify-center gap-1 text-[11px] text-[#888888] md:hidden">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 animate-pulse text-[#d4a853]" aria-hidden />
          <span>左右滑动查看全流程</span>
        </p>
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-12 items-center justify-end bg-gradient-to-l from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent pr-0.5 md:hidden">
          <ChevronRight className="h-6 w-6 shrink-0 animate-[pulse_1.8s_ease-in-out_infinite] text-[#d4a853]/90" aria-hidden />
        </div>
        <div className="overflow-x-auto pb-2 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:pr-0">
        <div className="min-w-[720px] px-2 md:min-w-0 md:px-0">
          <div className="flex w-full items-center">
            {PIPELINE_STEPS.map((step, i) => (
              <Fragment key={step.id}>
                {i > 0 ? (
                  <div className="relative -mx-px h-0.5 min-w-[12px] flex-1 overflow-hidden rounded-full bg-[#d4a853]/40">
                    <div
                      className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#d4a853] transition-transform duration-700 ease-out"
                      style={{
                        transform: active ? "scaleX(1)" : "scaleX(0)",
                        transitionDelay: `${(i - 1) * STAGGER_MS}ms`,
                      }}
                    />
                  </div>
                ) : null}
                <div className="flex w-11 shrink-0 flex-col items-center gap-2">
                  <div
                    className={[
                      "flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ease-out",
                      active
                        ? "scale-100 bg-[#d4a853] text-[#0a0a0f] shadow-[0_0_20px_rgba(212,168,83,0.45)]"
                        : "scale-90 bg-[#d4a853]/40 text-[#0a0a0f]/70",
                    ].join(" ")}
                    style={{ transitionDelay: `${i * STAGGER_MS}ms` }}
                    aria-hidden
                  >
                    {i + 1}
                  </div>
                  <p
                    className="max-w-[4.75rem] text-center text-xs leading-tight text-[#888888] transition-opacity duration-500 ease-out md:max-w-[5.5rem]"
                    style={{
                      opacity: active ? 1 : 0.35,
                      transitionDelay: `${i * STAGGER_MS}ms`,
                    }}
                  >
                    {step.label}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
