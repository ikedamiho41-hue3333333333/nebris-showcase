import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://nebris-showcase.vercel.app"),
  title: "开翌 NEBRIS · 让全球AI为你全权运营",
  description:
    "27个AI交叉讨论、投票、达成共识，自动生成小红书爆款内容。说一句话，AI帮你全部搞定。",
  openGraph: {
    title: "开翌 NEBRIS · 让全球AI为你全权运营",
    description: "27个AI交叉讨论、投票、达成共识，自动生成小红书爆款内容。",
    url: "https://nebris-showcase.vercel.app/showcase",
    siteName: "开翌 NEBRIS",
    type: "website",
    images: [
      {
        url: "/og-showcase.png",
        width: 1200,
        height: 630,
        alt: "开翌 NEBRIS - AI内容创作引擎",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "开翌 NEBRIS · 让全球AI为你全权运营",
    description: "27个AI交叉讨论、投票、达成共识，自动生成小红书爆款内容。",
    images: ["/og-showcase.png"],
  },
}

export default function ShowcaseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
