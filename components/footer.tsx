"use client"

import Link from "next/link"
import { ArrowRight, Github, Twitter, Mail } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer className="border-t border-[#2A2A36] bg-[#0A0A0F]">
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#2A2A36] bg-[#12121A] p-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2 text-[#C9A84C]">
            <span className="text-lg">{"〉"}</span>
            <span className="text-lg font-semibold">保持联系</span>
          </div>
          <p className="mb-6 text-[#9BA89F]">
            获取产品更新、新功能通知和AI内容运营技巧
          </p>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-[#2A2A36] bg-[#0A0A0F] px-4 py-3 text-[#EEF2EA] placeholder-[#9BA89F] outline-none transition-colors focus:border-[#C9A84C]"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#C9A84C] px-6 py-3 font-medium text-[#0A0A0F] transition-all hover:bg-[#D4B65C]"
            >
              订阅
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Links Section */}
      <div className="border-t border-[#2A2A36]">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B7634]">
                  <span className="text-sm font-bold text-[#0A0A0F]">N</span>
                </div>
                <span className="text-lg font-semibold text-[#EEF2EA]">
                  开翌 <span className="text-[#C9A84C]">NEBRIS</span>
                </span>
              </Link>
              <p className="mt-4 text-sm text-[#9BA89F]">
                让全球AI为你全权运营
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#EEF2EA]">产品</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#features" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    功能特性
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    定价方案
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    开始创作
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#EEF2EA]">资源</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    文档
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    博客
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-4 text-sm font-semibold text-[#EEF2EA]">关于</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    关于我们
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    隐私政策
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
                    服务条款
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2A2A36]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6">
          <p className="text-sm text-[#9BA89F]">
            © 2024 开翌 NEBRIS. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
