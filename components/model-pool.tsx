"use client"

/** 可后续替换为 JSON；接入 11+13+5=29 路，产品编排 27 并行讨论席位 */
const OVERSEAS_MODELS = [
  "Llama 3.3 70B Instruct",
  "Google Gemma 4",
  "NVIDIA Nemotron 3",
  "Qwen3 Coder",
  "MiniMax M2.5 (OpenRouter)",
  "OpenRouter 自动选择",
  "Mistral Large (OR)",
  "Claude 3 Haiku (OR)",
  "Gemini 2.0 Flash (OR)",
  "Phi-4 (OpenRouter)",
  "DeepSeek Chat (OR)",
]

const DOMESTIC_MODELS = [
  "通义千问 Plus",
  "通义千问 Turbo",
  "DeepSeek V3.2（百炼）",
  "DeepSeek R1（百炼）",
  "Kimi K2.5（百炼）",
  "MiniMax M2.5（百炼）",
  "文心一言 4.0",
  "讯飞星火 V3.5",
  "腾讯混元",
  "豆包 Pro",
  "百川 Baichuan",
  "零一万物 Yi",
  "阶跃星辰 Step",
]

const LOCAL_MODELS = [
  "DeepSeek Direct",
  "Kimi Direct",
  "Ollama / 本地推理",
  "vLLM 私有化部署",
  "企业内网 RAG 位",
]

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
            <span className="text-[#d4a853]">27</span> 个 AI 模型
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-[#888888] md:text-base">
            海外 11 + 国内 13 + 本地 5 路接入；两栏浏览。编排层统一{" "}
            <span className="text-[#d4a853]">27</span> 个并行讨论席位（含通道冗余）。
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:gap-10">
          <div className="space-y-8">
            <div className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-6">
              <h3 className="mb-1 text-lg font-semibold text-[#d4a853]">
                海外 <span className="text-[#888888]">({OVERSEAS_MODELS.length} 个)</span>
              </h3>
              <p className="mb-4 text-xs text-[#888888]">OpenRouter 与国际模型路由</p>
              <ul className="grid gap-2 sm:grid-cols-1">
                {OVERSEAS_MODELS.map((name) => (
                  <li
                    key={name}
                    className="rounded-lg border border-[#2A2A36] bg-[#0A0A0F] px-3 py-2 text-sm text-[#e0e0e0]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-6">
              <h3 className="mb-1 text-lg font-semibold text-[#d4a853]">
                本地 <span className="text-[#888888]">({LOCAL_MODELS.length} 个)</span>
              </h3>
              <p className="mb-4 text-xs text-[#888888]">直连 API / 私有化与本地推理</p>
              <ul className="space-y-2">
                {LOCAL_MODELS.map((name) => (
                  <li
                    key={name}
                    className="rounded-lg border border-[#2A2A36] bg-[#0A0A0F] px-3 py-2 text-sm text-[#e0e0e0]"
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[#d4a853]/30 bg-[#111116] p-6">
            <h3 className="mb-1 text-lg font-semibold text-[#d4a853]">
              国内 <span className="text-[#888888]">({DOMESTIC_MODELS.length} 个)</span>
            </h3>
            <p className="mb-4 text-xs text-[#888888]">百炼与国内大模型 API</p>
            <ul className="grid max-h-[520px] gap-2 overflow-y-auto pr-1 sm:grid-cols-1">
              {DOMESTIC_MODELS.map((name) => (
                <li
                  key={name}
                  className="rounded-lg border border-[#2A2A36] bg-[#0A0A0F] px-3 py-2 text-sm text-[#e0e0e0]"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
