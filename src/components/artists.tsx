"use client"

import { useState } from "react"

const artists = [
  {
    id: 1,
    name: "Maria Costello",
    role: "Artistic Director",
    company: "Teatro dei Pupi",
    bio: "Third-generation puppeteer keeping Sicilian marionette traditions alive while pushing into new theatrical territories.",
  },
  {
    id: 2,
    name: "Yuki Tanaka",
    role: "Digital Artist",
    company: "Digital Strings Collective",
    bio: "Pioneer in motion-capture puppetry, blending traditional Japanese aesthetics with cutting-edge technology.",
  },
  {
    id: 3,
    name: "Te Aroha Williams",
    role: "Director & Performer",
    company: "Wellington Puppet Trust",
    bio: "Bringing Māori stories to life through shadow theatre, creating new mythologies for contemporary audiences.",
  },
  {
    id: 4,
    name: "Sophie Chen",
    role: "Lead Puppeteer",
    company: "Spare Parts Puppet Theatre",
    bio: "Award-winning performer specializing in children's theatre that speaks to audiences of all ages.",
  },
]

export function Artists() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="artists" className="py-20 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-3">
            The Artists
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance">
            Masters of Their Craft
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group relative"
              onMouseEnter={() => setHoveredId(artist.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Avatar placeholder with puppet aesthetic */}
              <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Stylized puppet figure */}
                  <svg
                    width="100"
                    height="140"
                    viewBox="0 0 100 140"
                    className={`transition-all duration-500 ${hoveredId === artist.id ? "text-secondary scale-110" : "text-primary/30"}`}
                  >
                    <circle cx="50" cy="30" r="20" fill="currentColor" />
                    <rect
                      x="35"
                      y="55"
                      width="30"
                      height="45"
                      rx="4"
                      fill="currentColor"
                    />
                    <line
                      x1="35"
                      y1="70"
                      x2="15"
                      y2="95"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="65"
                      y1="70"
                      x2="85"
                      y2="95"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="42"
                      y1="100"
                      x2="35"
                      y2="135"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <line
                      x1="58"
                      y1="100"
                      x2="65"
                      y2="135"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Decorative strings from top */}
                <div className="absolute top-0 left-1/3 w-px h-8 bg-gradient-to-b from-primary to-transparent opacity-50" />
                <div className="absolute top-0 left-1/2 w-px h-12 bg-gradient-to-b from-primary to-transparent opacity-50" />
                <div className="absolute top-0 left-2/3 w-px h-8 bg-gradient-to-b from-primary to-transparent opacity-50" />
              </div>

              <div className="text-center">
                <h3 className="font-serif text-xl text-foreground mb-1">
                  {artist.name}
                </h3>
                <p className="text-secondary font-medium text-sm mb-1">
                  {artist.role}
                </p>
                <p className="text-muted-foreground text-sm mb-3">
                  {artist.company}
                </p>
                <p
                  className={`text-muted-foreground text-sm leading-relaxed transition-all duration-300 ${hoveredId === artist.id ? "opacity-100 max-h-24" : "opacity-0 max-h-0 overflow-hidden"}`}
                >
                  {artist.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
