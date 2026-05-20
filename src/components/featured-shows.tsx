"use client"

import { useState } from "react"
import { ArrowRight, Clock, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const shows = [
  {
    id: 1,
    title: "The Wandering Soul",
    company: "Teatro dei Pupi",
    country: "Italy",
    type: "Traditional Marionettes",
    duration: "75 min",
    venue: "Opera House",
    audience: "All Ages",
    description:
      "A breathtaking journey through Sicilian folklore featuring intricate hand-carved marionettes and live orchestration.",
    featured: true,
    color: "bg-secondary",
  },
  {
    id: 2,
    title: "Binary Dreams",
    company: "Digital Strings Collective",
    country: "Japan",
    type: "Digital Puppetry",
    duration: "60 min",
    venue: "BATS Theatre",
    audience: "Adults",
    description:
      "Where code meets craft. An experimental exploration of AI-assisted puppetry and motion capture technology.",
    featured: false,
    color: "bg-primary",
  },
  {
    id: 3,
    title: "Little Fox & the Moon",
    company: "Spare Parts Puppet Theatre",
    country: "Australia",
    type: "Hand & Rod Puppets",
    duration: "45 min",
    venue: "Te Papa",
    audience: "Children 3+",
    description:
      "A tender story about friendship and belonging, told through exquisite handcrafted puppets and original music.",
    featured: false,
    color: "bg-secondary",
  },
  {
    id: 4,
    title: "Shadows of Aotearoa",
    company: "Wellington Puppet Trust",
    country: "New Zealand",
    type: "Shadow Theatre",
    duration: "90 min",
    venue: "Circa Theatre",
    audience: "Teens & Adults",
    description:
      "Local stories reimagined through the ancient art of shadow play, featuring Māori mythology and contemporary narratives.",
    featured: true,
    color: "bg-primary",
  },
]

export function FeaturedShows() {
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  return (
    <section id="programme" className="py-20 md:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-3">
              Programme
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground text-balance">
              Featured Shows
            </h2>
          </div>
          <Button
            variant="outline"
            className="self-start md:self-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            View Full Programme
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {shows.map((show) => (
            <article
              key={show.id}
              className={`group relative bg-card rounded-lg overflow-hidden border border-border transition-all duration-500 ${show.featured ? "md:row-span-2" : ""}`}
              onMouseEnter={() => setHoveredId(show.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Color accent bar */}
              <div
                className={`absolute top-0 left-0 w-full h-1 ${show.color}`}
              />

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-secondary/10 text-secondary border-0"
                  >
                    {show.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground"
                  >
                    {show.country}
                  </Badge>
                </div>

                <h3
                  className={`font-serif text-2xl md:text-3xl text-foreground mb-2 transition-colors duration-300 ${hoveredId === show.id ? "text-primary" : ""}`}
                >
                  {show.title}
                </h3>
                <p className="text-muted-foreground font-medium mb-4">
                  {show.company}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {show.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {show.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {show.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {show.audience}
                  </span>
                </div>

                <Button
                  className={`${show.color} text-white hover:opacity-90 transition-opacity`}
                >
                  Book Tickets
                </Button>
              </div>

              {/* Decorative puppet string on hover */}
              <div
                className={`absolute top-0 right-8 w-px bg-gradient-to-b from-primary to-transparent transition-all duration-500 ${hoveredId === show.id ? "h-24 opacity-100" : "h-0 opacity-0"}`}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
