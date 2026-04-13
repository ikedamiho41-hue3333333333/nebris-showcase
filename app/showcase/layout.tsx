import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '开翌 NEBRIS · 真实赛道展示',
  description: '27个AI协作产出的7个赛道真实内容，质检平均92.9分',
  metadataBase: new URL('https://nebris.cc'),
  openGraph: {
    title: '开翌 NEBRIS · 27个AI为你全权运营',
    description: '8个赛道、8步Pipeline、27个AI模型协作——真实内容展示',
    url: 'https://nebris.cc/showcase',
    siteName: '开翌 NEBRIS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '开翌 NEBRIS · 27个AI为你全权运营',
    description: '真实AI协作内容展示',
  },
}

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
