"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const venues = [
  {
    name: "Opera House",
    address: "111-113 Manners Street",
    capacity: "1,380 seats",
    description: "Historic venue for our largest productions",
  },
  {
    name: "BATS Theatre",
    address: "1 Kent Terrace",
    capacity: "80 seats",
    description: "Intimate space for experimental works",
  },
  {
    name: "Te Papa Marae",
    address: "55 Cable Street",
    capacity: "200 seats",
    description: "Cultural heart for Māori storytelling",
  },
  {
    name: "Circa Theatre",
    address: "1 Taranaki Street",
    capacity: "250 seats",
    description: "Waterfront theatre for evening shows",
  },
]

export function Venues() {
  return (
    <section id="venues" className="py-20 md:py-32 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-3">
            Venues
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
            Across Wellington
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our shows take place in some of Wellington's most beloved venues,
            from grand historic theatres to intimate experimental spaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.name}
              className="bg-card rounded-lg p-6 border border-border hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-1">
                {venue.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-2">
                {venue.address}
              </p>
              <p className="text-secondary text-sm font-medium mb-3">
                {venue.capacity}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {venue.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
          >
            View Interactive Map
          </Button>
        </div>
      </div>
    </section>
  )
}
