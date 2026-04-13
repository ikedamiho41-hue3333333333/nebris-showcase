import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist',
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sc',
});

export const metadata: Metadata = {
  title: "开翌 NEBRIS - 让全球AI为你全权运营",
  description:
    "14个模型端点、27个讨论席位交叉讨论与投票，为你创作内容。平台矩阵分阶段开放，三层智能架构，让AI为你全权运营。",
  generator: "v0.app",
  keywords: ["AI内容运营", "AI写作", "内容创作", "NEBRIS", "开翌"],
}

export const viewport: Viewport = {
  colorScheme: "dark",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className="dark scroll-smooth">
      <head>
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} ${notoSansSC.variable} font-sans antialiased bg-[#0A0A0F] text-[#EEF2EA]`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
