"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A36] bg-[#0A0A0F]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#8B7634]">
            <span className="text-sm font-bold text-[#0A0A0F]">N</span>
          </div>
          <span className="text-lg font-semibold text-[#EEF2EA]">开翌 <span className="text-[#C9A84C]">NEBRIS</span></span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
            功能特性
          </Link>
          <Link href="#architecture" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
            系统架构
          </Link>
          <Link href="#platforms" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
            平台支持
          </Link>
          <Link href="#pricing" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
            定价
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link 
            href="/chat" 
            className="rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-medium text-[#0A0A0F] transition-all hover:bg-[#D4B65C] hover:shadow-lg hover:shadow-[#C9A84C]/20"
          >
            开始创作
          </Link>
        </div>

        <button 
          className="md:hidden text-[#EEF2EA]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-[#2A2A36] bg-[#0A0A0F] md:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <Link href="#features" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              功能特性
            </Link>
            <Link href="#architecture" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              系统架构
            </Link>
            <Link href="#platforms" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              平台支持
            </Link>
            <Link href="#pricing" className="text-sm text-[#9BA89F] transition-colors hover:text-[#EEF2EA]">
              定价
            </Link>
            <Link 
              href="/chat" 
              className="rounded-lg bg-[#C9A84C] px-4 py-2 text-center text-sm font-medium text-[#0A0A0F]"
            >
              开始创作
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
