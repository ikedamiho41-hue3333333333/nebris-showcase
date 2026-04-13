"use client"

import { useEffect, useState } from "react"

export function ShowcaseScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      const next = scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0
      setPct(Math.min(100, Math.max(0, next)))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  return (
    <div
      className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-0.5 bg-[#1a1a24]/90"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="页面阅读进度"
    >
      <div
        className="h-full bg-gradient-to-r from-[#c9a84c] to-[#d4a853] shadow-[0_0_12px_rgba(212,168,83,0.35)] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
