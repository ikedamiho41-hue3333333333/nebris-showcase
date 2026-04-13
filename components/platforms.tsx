"use client"

type PlatformStatus = "live" | "building" | "planned"

const STATUS_STYLES: Record<
  PlatformStatus,
  { label: string; className: string }
> = {
  live: {
    label: "已接入",
    className: "text-[#d4a853]",
  },
  building: {
    label: "开发中",
    className: "text-[#60a5fa]",
  },
  planned: {
    label: "规划中",
    className: "text-[#888888]",
  },
}

function PlatformLine({
  name,
  status,
}: {
  name: string
  status: PlatformStatus
}) {
  const s = STATUS_STYLES[status]
  const icon = status === "live" ? "✅" : status === "building" ? "🔧" : "📋"
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-b border-[#2A2A36] py-2.5 last:border-0">
      <span className="text-[#e0e0e0]">{name}</span>
      <span className={`text-xs font-medium ${s.className}`}>
        {icon}
        {s.label}
      </span>
    </div>
  )
}

const PHASE1 = [
  { name: "小红书", status: "live" as const },
  { name: "公众号", status: "building" as const },
  { name: "微博", status: "building" as const },
  { name: "知乎", status: "building" as const },
  { name: "豆瓣", status: "building" as const },
  { name: "Instagram", status: "planned" as const },
  { name: "头条", status: "planned" as const },
]

const PHASE2 = [
  { name: "抖音", status: "planned" as const },
  { name: "B站", status: "planned" as const },
  { name: "视频号", status: "planned" as const },
  { name: "快手", status: "planned" as const },
]

const PHASE3 = [
  { name: "淘宝", status: "planned" as const },
  { name: "京东", status: "planned" as const },
  { name: "拼多多", status: "planned" as const },
  { name: "小红书电商", status: "planned" as const },
]

export function Platforms() {
  return (
    <section id="platforms" className="bg-[#0A0A0F] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#d4a853]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-sm font-medium tracking-wider uppercase">平台矩阵</span>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-[#EEF2EA] md:text-4xl text-balance">
            分阶段接入 · 全链路分发
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-[#888888] md:text-base">
            Phase 1 图文先行，Phase 2/3 视频与电商陆续开放。已接入
            <span className="text-[#d4a853]"> 金色</span>，开发中
            <span className="text-[#60a5fa]"> 蓝色</span>，规划中
            <span className="text-[#888888]"> 灰色</span>。
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8">
          <div className="rounded-2xl border border-[#d4a853]/30 bg-[#111116] p-6 md:p-8">
            <h3 className="mb-1 text-lg font-bold text-[#d4a853]">
              Phase 1 · 图文平台（7 个）
            </h3>
            <p className="mb-4 text-xs text-[#888888]">小红书 / 双微 / 社区 / 海外图文</p>
            <div>
              {PHASE1.map((p) => (
                <PlatformLine key={p.name} name={p.name} status={p.status} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#d4a853]/30 bg-[#111116] p-6 md:p-8">
            <h3 className="mb-1 text-lg font-bold text-[#e0e0e0]">
              Phase 2 · 视频平台（4 个）
            </h3>
            <p className="mb-4 text-xs text-[#888888]">短视频与中长视频 · 全部规划中</p>
            <div>
              {PHASE2.map((p) => (
                <PlatformLine key={p.name} name={p.name} status={p.status} />
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#d4a853]/30 bg-[#111116] p-6 md:p-8">
            <h3 className="mb-1 text-lg font-bold text-[#e0e0e0]">
              Phase 3 · 电商平台（4 个）
            </h3>
            <p className="mb-4 text-xs text-[#888888]">带货与店铺内容 · 全部规划中</p>
            <div>
              {PHASE3.map((p) => (
                <PlatformLine key={p.name} name={p.name} status={p.status} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
