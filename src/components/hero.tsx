"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full bg-secondary/20 blur-3xl transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-48 h-48 md:w-72 md:h-72 rounded-full bg-primary/10 blur-3xl transition-all duration-1000 delay-300 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
        />
      </div>

      {/* Decorative strings */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 Q250,300 500,200 T1000,200"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary"
        />
        <path
          d="M0,400 Q250,500 500,400 T1000,400"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-secondary"
        />
        <path
          d="M0,600 Q250,700 500,600 T1000,600"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          className="text-primary"
        />
      </svg>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-4">
            Wellington, NZ • March 15–22, 2026
          </p>
        </div>

        <h1
          className={`font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-foreground leading-tight mb-6 transition-all duration-700 delay-150 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <span className="block text-balance">Where Imagination</span>
          <span className="block text-secondary italic">Takes Flight</span>
        </h1>

        <p
          className={`max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl mb-10 leading-relaxed transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          Eight days of extraordinary puppetry from around the world.
          Marionettes, shadow play, digital experiments, and stories that move
          audiences of all ages.
        </p>

        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6"
          >
            Explore Programme
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base px-8 py-6 bg-transparent"
          >
            Watch Trailer
          </Button>
        </div>

        {/* Floating puppet hand illustration */}
        <div
          className={`mt-16 transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
        >
          <div className="relative inline-block">
            <svg
              width="120"
              height="180"
              viewBox="0 0 120 180"
              className="text-primary mx-auto"
            >
              {/* Puppet control bar */}
              <rect
                x="10"
                y="0"
                width="100"
                height="8"
                rx="2"
                fill="currentColor"
              />
              {/* Strings */}
              <line
                x1="30"
                y1="8"
                x2="30"
                y2="80"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <line
                x1="60"
                y1="8"
                x2="60"
                y2="60"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              <line
                x1="90"
                y1="8"
                x2="90"
                y2="80"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="4 2"
              />
              {/* Puppet body */}
              <circle cx="60" cy="75" r="15" fill="currentColor" />
              <rect
                x="50"
                y="90"
                width="20"
                height="30"
                rx="4"
                fill="currentColor"
              />
              {/* Arms */}
              <line
                x1="30"
                y1="80"
                x2="50"
                y2="100"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="70"
                y1="100"
                x2="90"
                y2="80"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Legs */}
              <line
                x1="55"
                y1="120"
                x2="45"
                y2="160"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <line
                x1="65"
                y1="120"
                x2="75"
                y2="160"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div
          className={`flex flex-col items-center gap-2 transition-all duration-700 delay-1000 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-xs text-muted-foreground tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent" />
        </div>
      </div>
    </section>
  )
}
