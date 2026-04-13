import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { ModelPool } from "@/components/model-pool"
import { Architecture } from "@/components/architecture"
import { Platforms } from "@/components/platforms"
import { HomeStats } from "@/components/home-stats"
import { Pricing } from "@/components/pricing"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0F]">
      <Header />
      <Hero />
      <Features />
      <ModelPool />
      <Architecture />
      <Platforms />
      <HomeStats />
      <Pricing />
      <Footer />
    </main>
  )
}
