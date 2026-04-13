"use client"

const STATS = [
  { value: "14", label: "个模型端点" },
  { value: "≥90%", label: "Pipeline完成率" },
  { value: "92.4", label: "平均质检分" },
  { value: "约2-3分钟", label: "平均生成" },
] as const

export function HomeStats() {
  return (
    <section className="border-y border-[#d4a853]/20 bg-[#0A0A0F] py-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-6 text-center transition-all hover:border-[#d4a853]/50 hover:bg-[#d4a853]/10"
            >
              <div className="text-2xl font-bold text-[#d4a853] md:text-3xl">{item.value}</div>
              <div className="mt-1 text-sm text-[#888888]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
