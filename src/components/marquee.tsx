"use client"

export function Marquee() {
  const items = [
    "Marionettes",
    "Shadow Theatre",
    "Hand Puppets",
    "Bunraku",
    "Digital Puppetry",
    "Object Theatre",
    "Rod Puppets",
    "Black Light",
  ]

  return (
    <div className="bg-primary py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, index) => (
          <span
            key={index}
            className="mx-8 text-primary-foreground font-medium text-sm md:text-base tracking-widest uppercase flex items-center gap-4"
          >
            <span className="w-2 h-2 rounded-full bg-secondary" />
            {item}
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  )
}
