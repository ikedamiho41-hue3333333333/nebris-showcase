"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export type VoteScoreBand = 7 | 8 | 9

export type ShowcaseVoteSlice = {
  /** 分数段：7 / 8 / 9 分，决定柱状颜色 */
  score: VoteScoreBand
  /** 该分数段占比 0–100 */
  percent: number
}

export type ShowcaseCardProps = {
  category: string
  icon: string
  userInput: string
  title: string
  coverImage: string
  body: string
  tags: string[]
  voteData: ShowcaseVoteSlice[]
  consensusSummary: string
  /** 质检未通过 / 生成中：不可展开，半透明 + 底部提示 */
  locked?: boolean
}

function isConsensusApiErrorText(text: string): boolean {
  const lower = text.toLowerCase()
  return lower.includes("unavailable") || lower.includes("error") || lower.includes("failed")
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

const STRONG_OPEN = '<strong class="font-bold text-[#e0e0e0]">'
const STRONG_CLOSE = "</strong>"

/** **…** 支持跨行（dotAll）；先切分再对片段 escape，避免 ** 被整段 escape 掉 */
function applyBoldMarkdown(s: string): string {
  const re = /\*\*(.*?)\*\*/gs
  const out: string[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s)) !== null) {
    out.push(escapeHtml(s.slice(last, m.index)))
    out.push(STRONG_OPEN)
    out.push(escapeHtml(m[1]))
    out.push(STRONG_CLOSE)
    last = re.lastIndex
  }
  out.push(escapeHtml(s.slice(last)))
  return out.join("")
}

/**
 * 轻量 Markdown：### 行 → h3，**x** → strong（可跨行），连续含 | 的行 → pre
 */
function renderConsensusMarkdown(raw: string): string {
  const lines = raw.split(/\r?\n/)
  const parts: string[] = []
  let i = 0

  const h3Class = "text-base font-semibold text-[#d4a853] mt-3 mb-1.5 first:mt-0"
  const pClass = "text-sm leading-relaxed text-[#e0e0e0] my-1"
  const preClass =
    "my-2 overflow-x-auto rounded-md border border-[#d4a853]/30 bg-[#0a0a0f] p-2.5 text-[11px] font-mono leading-snug text-[#e0e0e0]"

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()
    const looksTable = trimmed.length > 0 && /\|/.test(line)

    if (looksTable) {
      const rows: string[] = []
      while (i < lines.length) {
        const L = lines[i]
        const t = L.trim()
        if (t.length === 0 || !/\|/.test(L)) {
          break
        }
        rows.push(escapeHtml(L))
        i += 1
      }
      parts.push(`<pre class="${preClass}">${rows.join("\n")}</pre>`)
      continue
    }

    if (trimmed === "") {
      i += 1
      continue
    }

    const headingMatch = trimmed.match(/^#{3,6}\s*(.*)$/)
    if (headingMatch) {
      const inner = applyBoldMarkdown(headingMatch[1].trim())
      parts.push(`<h3 class="${h3Class}">${inner}</h3>`)
      i += 1
      continue
    }

    const buf: string[] = []
    while (i < lines.length) {
      const L = lines[i]
      const t = L.trim()
      if (t.length === 0) {
        i += 1
        break
      }
      if (t.length > 0 && /\|/.test(L)) {
        break
      }
      if (/^#{3,6}\s/.test(t)) {
        break
      }
      buf.push(L)
      i += 1
    }

    if (buf.length) {
      const joined = buf.join("\n")
      const html = applyBoldMarkdown(joined).replace(/\n/g, "<br />")
      parts.push(`<p class="${pClass}">${html}</p>`)
    }
  }

  return parts.join("")
}

/** 7 分黄 · 8 分绿 · 9 分金（Kimi / NEBRIS 规范） */
function voteBarColorClass(score: VoteScoreBand): string {
  if (score === 7) return "bg-[#facc15]"
  if (score === 8) return "bg-[#22c55e]"
  return "bg-[#d4a853]"
}

export function ShowcaseCard({
  category,
  icon,
  userInput,
  title,
  coverImage,
  body,
  tags,
  voteData,
  consensusSummary,
  locked = false,
}: ShowcaseCardProps) {
  const [open, setOpen] = useState(false)
  const expanded = open && !locked

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-xl border border-[#d4a853]/30 bg-[#111116] transition-all duration-300 ease-out",
        locked
          ? "border-[#d4a853]/30"
          : [
              "hover:-translate-y-1 hover:border-[#d4a853]/70 hover:bg-[#d4a853]/20",
              expanded ? "border-[#d4a853]/70" : "",
            ].join(" "),
      ].join(" ")}
    >
      <div className={locked ? "opacity-40" : undefined}>
        <button
          type="button"
          onClick={() => {
            if (locked) return
            setOpen((v) => !v)
          }}
          className={[
            "flex w-full flex-col gap-3 p-4 text-left md:flex-row md:items-start md:gap-4",
            locked ? "cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          aria-expanded={expanded}
          aria-disabled={locked}
        >
        <div className="flex shrink-0 items-center gap-3 md:flex-col md:items-center md:gap-1">
          <span className="text-3xl leading-none" aria-hidden>
            {icon}
          </span>
          <span className="text-sm font-medium uppercase tracking-wider text-[#d4a853]">
            {category}
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="line-clamp-2 text-sm text-[#888888]">{userInput}</p>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[#e0e0e0] md:text-lg">
            {title}
          </h3>
        </div>
        <div className="relative mx-auto h-20 w-full shrink-0 overflow-hidden rounded-lg border border-[#d4a853]/30 md:mx-0 md:h-20 md:w-28">
          <Image
            src={coverImage}
            alt={title}
            fill
            className={
              locked
                ? "object-cover"
                : "object-cover transition-transform duration-300 group-hover:scale-105"
            }
            sizes="(max-width:768px) 100vw, 112px"
          />
        </div>
        {!locked ? (
          <ChevronDown
            className={[
              "h-5 w-5 shrink-0 self-center text-[#d4a853] transition-transform duration-300 md:self-start",
              expanded ? "rotate-180" : "rotate-0",
            ].join(" ")}
            aria-hidden
          />
        ) : (
          <span className="h-5 w-5 shrink-0 md:self-start" aria-hidden />
        )}
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="space-y-4 border-t border-[#d4a853]/20 px-4 pb-5 pt-2">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#e0e0e0]">{body}</p>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#d4a853] px-2.5 py-0.5 text-xs font-medium text-[#0a0a0f]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {voteData.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium text-[#d4a853]">投票结果（按分数段）</p>
                <ul className="space-y-3">
                  {voteData.map((v) => {
                    const pct = Math.min(100, Math.max(0, v.percent))
                    return (
                      <li key={v.score} className="flex items-center gap-3 text-sm">
                        <span className="w-8 shrink-0 tabular-nums font-bold text-[#d4a853]">{v.score}分</span>
                        <div className="relative h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[#d4a853]/20">
                          {/* 宽度用 Tailwind 任意值 + CSS 变量，等价于 w-[XX%] */}
                          <div
                            className={`h-full max-w-full rounded-full transition-[width] duration-500 ease-out w-[length:var(--vote-pct,0%)] ${voteBarColorClass(v.score)}`}
                            style={{ ["--vote-pct" as string]: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 shrink-0 text-right tabular-nums font-bold text-[#d4a853]">{pct}%</span>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-2 text-xs leading-relaxed text-[#888888]">
                  色例：7 分黄 · 8 分绿 · 9 分金
                </p>
              </div>
            )}
            {consensusSummary.trim() ? (
              <div className="rounded-r-lg border-l-4 border-[#d4a853] bg-[#d4a853]/5 py-3 pl-4 pr-3">
                <p className="mb-2 text-sm font-semibold tracking-wide text-[#d4a853]">🤝 27个AI的共识</p>
                {isConsensusApiErrorText(consensusSummary) ? (
                  <p className="text-sm leading-relaxed text-[#888888]">共识详情暂不可用</p>
                ) : (
                  <div
                    className="consensus-md max-w-none"
                    dangerouslySetInnerHTML={{ __html: renderConsensusMarkdown(consensusSummary) }}
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      </div>

      {locked ? (
        <>
          <div
            className="absolute inset-0 z-10 cursor-not-allowed rounded-xl"
            aria-hidden
            role="presentation"
          />
          <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-[#d4a853]/30 bg-[#0a0a0f]/95 py-2.5 text-center text-xs font-medium tracking-wide text-[#d4a853] backdrop-blur-sm">
            AI正在优化中...
          </div>
        </>
      ) : null}
    </article>
  )
}
