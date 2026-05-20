import { Award, Globe, Heart, Sparkles } from "lucide-react"

const stats = [
  { number: "8", label: "Days of Magic" },
  { number: "24", label: "Shows" },
  { number: "12", label: "Countries" },
  { number: "50+", label: "Artists" },
]

const values = [
  {
    icon: Globe,
    title: "Global Voices",
    description:
      "Bringing puppetry traditions from every corner of the world to Wellington's stages.",
  },
  {
    icon: Heart,
    title: "For All Ages",
    description:
      "From toddler-friendly tales to challenging adult theatre—stories that resonate across generations.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description:
      "Pushing boundaries where ancient craft meets digital artistry and experimental forms.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "Curated with care, featuring award-winning companies and emerging talents.",
  },
]

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 md:mb-28">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-serif text-5xl md:text-6xl lg:text-7xl text-secondary mb-2">
                {stat.number}
              </div>
              <div className="text-primary-foreground/80 text-sm md:text-base tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* About content */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-3">
              About the Festival
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-primary-foreground mb-6 text-balance">
              Celebrating the Art of Animation
            </h2>
            <div className="space-y-4 text-primary-foreground/80 leading-relaxed">
              <p>
                Strings & Shadows was born from a simple belief: that puppetry is
                one of humanity's most profound art forms—capable of stirring
                emotions, sparking wonder, and telling stories that linger long
                after the curtain falls.
              </p>
              <p>
                Now in its fifth year, our festival has become a gathering place
                for puppeteers, artists, and audiences who share this passion.
                From traditional marionettes to cutting-edge digital experiments,
                we celebrate every form of the animated arts.
              </p>
              <p>
                Wellington's vibrant cultural scene provides the perfect backdrop
                for this celebration of craft, creativity, and the magic of
                bringing inanimate objects to life.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-primary-foreground/5 backdrop-blur-sm rounded-lg p-6 border border-primary-foreground/10"
              >
                <value.icon className="w-8 h-8 text-secondary mb-4" />
                <h3 className="font-serif text-lg text-primary-foreground mb-2">
                  {value.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
