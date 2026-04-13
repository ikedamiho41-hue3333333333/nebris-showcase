"use client"

import modelsConfig from "@/data/27-models.json"

type ModelRow = { id: string; label: string }

function uniqueEndpoints(models: ModelRow[]): ModelRow[] {
  const seen = new Set<string>()
  const out: ModelRow[] = []
  for (const m of models) {
    if (seen.has(m.id)) continue
    seen.add(m.id)
    out.push({ id: m.id, label: m.label })
  }
  return out
}

function bucket(id: string): "bailian" | "openrouter" | "direct" {
  if (id === "deepseek_direct" || id === "kimi_direct") return "direct"
  if (id.startsWith("or_")) return "openrouter"
  return "bailian"
}

const endpoints = uniqueEndpoints(modelsConfig.models as ModelRow[])
const BAILIAN = endpoints.filter((e) => bucket(e.id) === "bailian")
const OPENROUTER = endpoints.filter((e) => bucket(e.id) === "openrouter")
const DIRECT = endpoints.filter((e) => bucket(e.id) === "direct")

export function ModelPool() {
  return (
    <section id="models" className="bg-[#0A0A0F] py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[#d4a853]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-sm font-medium tracking-wider uppercase">模型池</span>
          </div>
          <h2 className="mb-3 text-3xl font-bold text-[#EEF2EA] md:text-4xl">
            <span className="text-[#d4a853]">14</span>个AI模型 ·{" "}
            <span className="text-[#d4a853]">27</span>个讨论席位
          </h2>
          <p className="mx-auto max-w-2xl text-xs text-[#888888] md:text-sm">
            每个模型承担多个专业角色，通过角色复用实现 27 席位交叉讨论。
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-[#888888] md:text-base">
            以下为 <span className="text-[#d4a853]">{endpoints.length}</span> 路独立 API 端点，按接入方式分组展示。
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:gap-10">
          <div className="space-y-8">
            <div className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-6">
              <h3 className="mb-1 text-lg font-semibold text-[#d4a853]">
                国内百炼 <span className="text-[#888888]">({BAILIAN.length} 个端点)</span>
              </h3>
              <p className="mb-4 text-xs text-[#888888]">DeepSeek / Kimi / Qwen / MiniMax 等</p>
              <ul className="grid gap-2 sm:grid-cols-1">
                {BAILIAN.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg border border-[#2A2A36] bg-[#0A0A0F] px-3 py-2 text-sm text-[#e0e0e0]"
                  >
                    {e.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-6">
              <h3 className="mb-1 text-lg font-semibold text-[#d4a853]">
                直连 API <span className="text-[#888888]">({DIRECT.length} 个端点)</span>
              </h3>
              <p className="mb-4 text-xs text-[#888888]">官方 DeepSeek / Kimi 直连</p>
              <ul className="space-y-2">
                {DIRECT.map((e) => (
                  <li
                    key={e.id}
                    className="rounded-lg border border-[#2A2A36] bg-[#0A0A0F] px-3 py-2 text-sm text-[#e0e0e0]"
                  >
                    {e.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-6">
            <h3 className="mb-1 text-lg font-semibold text-[#d4a853]">
              OpenRouter <span className="text-[#888888]">({OPENROUTER.length} 个端点)</span>
            </h3>
            <p className="mb-4 text-xs text-[#888888]">Qwen3-Coder、Gemma、Llama、Nemotron、MiniMax、Free 路由</p>
            <ul className="grid gap-2 sm:grid-cols-1">
              {OPENROUTER.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border border-[#2A2A36] bg-[#0A0A0F] px-3 py-2 text-sm text-[#e0e0e0]"
                >
                  {e.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
