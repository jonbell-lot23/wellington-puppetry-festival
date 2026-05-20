import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Marquee } from "@/components/marquee"
import { FeaturedShows } from "@/components/featured-shows"
import { Artists } from "@/components/artists"
import { About } from "@/components/about"
import { Venues } from "@/components/venues"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Marquee />
      <FeaturedShows />
      <Artists />
      <About />
      <Venues />
      <Newsletter />
      <Footer />
    </main>
  )
}
