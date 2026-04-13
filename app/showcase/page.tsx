import Link from "next/link"
import { ChevronDown } from "lucide-react"
import showcaseData from "@/public/showcase-data.json"
import { ShowcaseCard, type ShowcaseCardProps, type ShowcaseVoteSlice } from "@/components/showcase-card"
import { ShowcasePipelineTimeline } from "@/components/showcase-pipeline-timeline"
import { ShowcaseScrollProgress } from "@/components/showcase-scroll-progress"

type ShowcaseStep = {
  step: number
  name: string
  status: string
  duration_ms: number | null
  highlight: string
}

/** 引擎原始 steps / step_results 中单步结构（用于读取 quality_passed） */
type RawPipelineStepNode = {
  step?: number
  name?: string
  output?: { quality_passed?: boolean }
  [key: string]: unknown
}

type ShowcaseCase = {
  id: string
  category: string
  category_en: string
  icon: string
  user_input: string
  pipeline_level: string
  models_participated: number | null
  pipeline_duration_seconds: number | null
  steps_summary: ShowcaseStep[]
  /** 部分早期赛道：质检结果在嵌套 output.quality_passed */
  steps?: RawPipelineStepNode[]
  step_results?: RawPipelineStepNode[]
  output: {
    title: string
    body: string
    tags: string[]
    cover_url: string
    illustrations: unknown[]
  }
  discussion_highlights: {
    total_rounds: number | null
    key_debate: string
    vote_distribution: Record<string, number>
    consensus_score: number | null
    consensus_summary: string
  }
  cost: {
    total_usd: number | null
    breakdown: Record<string, number>
  }
}

type ShowcaseDataset = {
  generated_at: string
  engine_version: string
  total_pipelines: number
  cases: ShowcaseCase[]
}

type ShowcaseViewModel = ShowcaseCardProps & {
  id: string
  categoryEn: string
  pipelineLevel: string
  modelsParticipated: number | null
  pipelineDurationSeconds: number | null
  qualityScore: number | null
  status: "ready" | "pending" | "failed"
  statusReason: string
}

function ScrollCue() {
  return (
    <a
      href="#showcase-tracks"
      className="mt-14 inline-flex flex-col items-center gap-2 text-sm text-[#888888] transition-colors hover:text-[#d4a853]"
    >
      <span>向下探索流程与案例</span>
      <ChevronDown className="h-6 w-6 animate-bounce text-[#d4a853]" aria-hidden />
    </a>
  )
}

function toVoteData(voteDistribution: Record<string, number> | undefined): ShowcaseVoteSlice[] {
  type Band = 7 | 8 | 9
  const raw: Partial<Record<Band, number>> = {}
  for (const [key, count] of Object.entries(voteDistribution || {})) {
    const score = Number.parseInt(String(key).replace(/[^\d]/g, ""), 10)
    if (score === 7 || score === 8 || score === 9) {
      const c = Math.max(0, Number(count) || 0)
      raw[score] = (raw[score] || 0) + c
    }
  }
  const bands: Band[] = [7, 8, 9]
  const total = bands.reduce((sum, b) => sum + (raw[b] || 0), 0)
  if (total <= 0) {
    return []
  }
  return bands.map((score) => ({
    score,
    percent: Math.round(((raw[score] || 0) / total) * 100),
  }))
}

function extractQualityScore(steps: ShowcaseStep[]): number | null {
  const qualityStep = steps.find((step) => step.step === 6 || step.name.includes("质检"))
  const source = qualityStep?.highlight || ""
  const match = source.match(/质检\s*([0-9]+(?:\.[0-9]+)?)/)
  if (!match) {
    return null
  }
  const parsed = Number(match[1])
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * 从 steps / step_results 等嵌套结构读取 quality_passed（护肤等早期赛道可能仅有此字段）。
 * 兼容 0-based 下标 5、6（第 6 步质检）及 step===6 / 名称含「质检」。
 */
function extractQualityPassed(item: ShowcaseCase): boolean | null {
  const arrays: RawPipelineStepNode[][] = []
  if (Array.isArray(item.steps)) {
    arrays.push(item.steps)
  }
  if (Array.isArray(item.step_results)) {
    arrays.push(item.step_results)
  }

  for (const arr of arrays) {
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i]
      if (!node || typeof node !== "object") {
        continue
      }
      const stepNum = typeof node.step === "number" ? node.step : Number(node.step)
      const name = String(node.name ?? "")
      const indexLooksQa = i === 5 || i === 6
      const metaLooksQa = stepNum === 6 || name.includes("质检")
      if (!indexLooksQa && !metaLooksQa) {
        continue
      }
      const qp = node.output?.quality_passed
      if (qp === true) {
        return true
      }
      if (qp === false) {
        return false
      }
    }
  }

  return null
}

/** 仅 step≤6 的 pending/running 阻塞展示；用户确认、复盘等后置步骤 pending 仍可展示已通过质检的内容 */
function hasBlockingPendingStep(steps: ShowcaseStep[]): boolean {
  return steps.some((st) => {
    if (st.status !== "pending" && st.status !== "running") {
      return false
    }
    if (typeof st.step === "number" && st.step >= 7) {
      return false
    }
    return true
  })
}

function inferCaseStatus(item: ShowcaseCase): { status: "ready" | "pending" | "failed"; reason: string } {
  const qualityScore = extractQualityScore(item.steps_summary)
  const qualityPassed = extractQualityPassed(item)
  const hasContent = Boolean(item.output?.title?.trim() && item.output?.body?.trim())
  const blockingPending = hasBlockingPendingStep(item.steps_summary)

  if (!hasContent || blockingPending) {
    return { status: "pending", reason: "生成中..." }
  }

  if (qualityPassed === true) {
    return { status: "ready", reason: "" }
  }

  if (qualityPassed === false) {
    return { status: "failed", reason: "质检未通过" }
  }

  if (qualityScore !== null) {
    if (qualityScore >= 90) {
      return { status: "ready", reason: "" }
    }
    return { status: "failed", reason: `质检未通过（${qualityScore}分）` }
  }

  // 有完整正文且无阻塞步骤，但缺少分数与 quality_passed：仍允许展示（避免误锁历史数据）
  return { status: "ready", reason: "" }
}

const COVER_SLUG_BY_CATEGORY_EN: Record<string, string> = {
  Money: "money",
  Fitness: "fitness",
  Travel: "travel",
  Food: "food",
  Tech: "tech",
  Fashion: "fashion",
  Skincare: "skincare",
}

function showcaseCoverByCategory(categoryEn: string): string {
  const slug = COVER_SLUG_BY_CATEGORY_EN[categoryEn] || categoryEn.toLowerCase()
  return `/showcase-covers/${slug}-cover.jpg`
}

/** 本机绝对路径、引擎 output 路径等无法作为站点 URL，回退到赛道封面 */
function isBrokenCoverUrl(value: string): boolean {
  if (value.startsWith("/Users/") || value.startsWith("/home/")) {
    return true
  }
  if (/^[A-Za-z]:\\/.test(value)) {
    return true
  }
  if (value.includes("nebris-engine") || value.includes("/output/covers/")) {
    return true
  }
  return false
}

function normalizeCoverImage(coverUrl: string | undefined, categoryEn: string): string {
  const value = (coverUrl || "").trim()
  if (!value) {
    return showcaseCoverByCategory(categoryEn)
  }
  if (/^https?:\/\//i.test(value)) {
    return value
  }
  if (value.startsWith("/") && isBrokenCoverUrl(value)) {
    return showcaseCoverByCategory(categoryEn)
  }
  if (value.startsWith("/")) {
    return value
  }
  return showcaseCoverByCategory(categoryEn)
}

function mapCaseToCard(item: ShowcaseCase): ShowcaseViewModel {
  const qualityScore = extractQualityScore(item.steps_summary)
  const inferred = inferCaseStatus(item)

  return {
    id: item.id,
    category: item.category,
    categoryEn: item.category_en,
    icon: item.icon,
    userInput: item.user_input,
    title: item.output?.title?.trim() || "生成中...",
    body: item.output?.body?.trim() || "当前 Pipeline 仍在执行中，内容生成完成后会自动展示在这里。",
    coverImage: normalizeCoverImage(item.output?.cover_url, item.category_en),
    tags: Array.isArray(item.output?.tags) ? item.output.tags : [],
    voteData: toVoteData(item.discussion_highlights?.vote_distribution),
    consensusSummary:
      inferred.status === "failed"
        ? `${item.discussion_highlights?.consensus_summary || ""}\n\n${inferred.reason}`.trim()
        : item.discussion_highlights?.consensus_summary || "",
    pipelineLevel: item.pipeline_level,
    modelsParticipated: item.models_participated,
    pipelineDurationSeconds: item.pipeline_duration_seconds,
    qualityScore,
    status: inferred.status,
    statusReason: inferred.reason,
  }
}

function viewModelToCardProps(item: ShowcaseViewModel): ShowcaseCardProps {
  return {
    category: item.category,
    icon: item.icon,
    userInput: item.userInput,
    title: item.title,
    coverImage: item.coverImage,
    body: item.body,
    tags: item.tags,
    voteData: item.voteData,
    consensusSummary: item.consensusSummary,
  }
}

function buildStats(_dataset: ShowcaseDataset, visibleCards: ShowcaseViewModel[]) {
  const maxModels = visibleCards.reduce((max, item) => Math.max(max, item.modelsParticipated || 0), 0)

  return [
    { value: `${maxModels || 0}+`, label: "交叉讨论的 AI 模型" },
    { value: `${dataset.total_pipelines}`, label: "展示赛道 Pipeline 数" },
    { value: `${visibleCards.length}`, label: "可直接展示的真实案例" },
    { value: "¥3.2/篇 · 27个AI全流程", label: "平均单篇内容成本" },
  ] as const
}

const dataset = showcaseData as ShowcaseDataset
const mappedCards = (dataset.cases || []).map(mapCaseToCard)
const readyCards = mappedCards.filter((item) => item.status === "ready")
const stats = buildStats(dataset, readyCards)

const sortedShowcaseCards = [...mappedCards].sort((a, b) => {
  const rank = (item: (typeof mappedCards)[0]) => (item.status === "ready" ? 0 : 1)
  return rank(a) - rank(b)
})

export default function ShowcasePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0]">
      <ShowcaseScrollProgress />
      <header className="sticky top-0 z-40 border-b border-[#d4a853]/20 bg-[#0a0a0f]/90 backdrop-blur-md">
        <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 md:gap-4 md:px-6">
          <Link
            href="/"
            className="justify-self-start text-sm font-medium text-[#e0e0e0] transition-colors hover:bg-[#d4a853]/20 hover:text-[#d4a853]"
          >
            ← 返回首页
          </Link>
          <span className="max-w-[11rem] truncate text-center text-xs tabular-nums text-[#d4a853] sm:max-w-none md:text-sm">
            {readyCards.length}/{mappedCards.length} 赛道已就绪
          </span>
          <span className="justify-self-end text-xs text-[#888888]">/showcase</span>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#d4a853]/[0.07] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#d4a853]">NEBRIS · Showcase</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#d4a853] md:text-6xl">
            开翌 NEBRIS
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-[#888888] md:text-lg">
            你说需求，剩下27个AI搞定
          </p>
          <ScrollCue />
        </div>
      </section>

      <section className="border-y border-[#d4a853]/20 bg-[#0a0a0f] px-4 py-12 md:px-6">
        <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-[#888888] md:text-base">
          好内容不是瞬间生成的。27个AI吵八轮，比单打独斗更可靠。
        </p>
        <ShowcasePipelineTimeline />
      </section>

      <section id="showcase-tracks" className="scroll-mt-20 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-2 text-center text-xl font-semibold text-[#e0e0e0] md:text-2xl">真实赛道 · Pipeline 展示</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-[#888888]">
            下面的标题和文案，是27个AI刚才真实讨论写出来的。不是人改的，也不是模板套的。
          </p>

          {mappedCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {sortedShowcaseCards.map((item) => (
                <ShowcaseCard
                  key={item.id}
                  {...viewModelToCardProps(item)}
                  locked={item.status !== "ready"}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d4a853]/30 bg-[#111116] p-8 text-center text-sm text-[#888888]">
              真实案例还在同步中，稍后刷新即可看到最新 Pipeline 产出。
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-[#d4a853]/20 bg-[#0a0a0f] px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-xl font-semibold text-[#e0e0e0] md:text-2xl">透明账本</h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm text-[#888888] md:text-base">
            每次产出消耗多少AI、多少钱，全给你算清楚
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-5 text-center transition-all hover:-translate-y-1 hover:border-[#d4a853]/70 hover:bg-[#d4a853]/20"
              >
                <p className="text-3xl font-bold text-[#d4a853]">{s.value}</p>
                <p className="mt-2 text-xs text-[#888888] md:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#d4a853]/20 px-4 py-16 md:px-6 md:py-24">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#d4a853]/30 bg-[#111116] p-8 md:p-10">
          <h2 className="mb-4 text-lg font-semibold text-[#d4a853] md:text-xl">关于开翌 NEBRIS</h2>
          <p className="text-sm leading-relaxed text-[#e0e0e0] md:text-base">
            开翌=NEBRIS=27个AI的脑暴会。你提需求，AI们吵架、写作、检查、发布，一条龙搞定。给想省心的内容创作者。
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/"
              className="rounded-lg border border-[#d4a853]/30 bg-[#d4a853]/20 px-5 py-2.5 text-sm font-medium text-[#d4a853] transition-all hover:border-[#d4a853]/70 hover:bg-[#d4a853]/30"
            >
              返回官网首页
            </Link>
            <Link
              href="/chat"
              className="rounded-lg border border-[#d4a853]/30 px-5 py-2.5 text-sm text-[#888888] transition-colors hover:border-[#d4a853]/70 hover:bg-[#d4a853]/20 hover:text-[#e0e0e0]"
            >
              开始创作
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#d4a853]/20 bg-[#0a0a0f] px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="mb-2 text-lg font-semibold text-[#d4a853] md:text-xl">联系我们</h2>
          <p className="mb-8 text-sm text-[#888888] md:text-base">想体验完整版？留下联系方式</p>
          <div className="space-y-4 rounded-2xl border border-[#d4a853]/30 bg-[#111116] p-8 text-left text-sm text-[#e0e0e0]">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="shrink-0 text-[#888888]">商务邮箱</span>
              <a
                href="mailto:hello@nebris.ai"
                className="break-all text-[#d4a853] underline-offset-2 transition-colors hover:underline"
              >
                hello@nebris.ai
              </a>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <span className="shrink-0 text-[#888888]">微信</span>
              <span className="font-mono text-[#e0e0e0]">NEBRIS_2026</span>
            </div>
            <p className="border-t border-[#d4a853]/20 pt-4 text-xs leading-relaxed text-[#888888]">
              以上为展示用占位信息，正式联络方式以官网与产品内公告为准。
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#d4a853]/20 px-4 py-8 text-center text-xs text-[#888888]">
        © 2026 开翌 NEBRIS · Showcase
      </footer>
    </main>
  )
}
