import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#1a0a0a" }}>

      {/* Hero */}
      <section className="flex flex-col items-center px-4 pt-12 pb-12">
        <Image
          src="/images/festival-5.png"
          alt="Wellington Puppetry Festival – Puppets for Peace, 18–20 September 2026"
          width={700}
          height={700}
          className="w-full max-w-2xl rounded-lg"
          priority
        />
      </section>

      {/* Message */}
      <section
        className="relative flex flex-col items-center justify-center text-center px-6 py-20"
        style={{ backgroundImage: "url('/images/festival-banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-xl">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Thanks for your submissions
          </h1>
          <p className="text-yellow-300 text-xl md:text-2xl font-semibold mb-6">
            Full programme announced June 2026
          </p>
          <p className="text-white/80 mb-8">
            Sign up to our mailing list to stay updated
          </p>
          <a
            href="mailto:wellingtonpuppetryfestival@gmail.com"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-8 py-3 rounded-full transition-colors text-lg"
          >
            Sign up for Festival News
          </a>
        </div>
      </section>

      {/* Puppet image */}
      <section className="flex justify-center px-4 py-12" style={{ backgroundColor: "#1a0a0a" }}>
        <Image
          src="/images/festival-1.png"
          alt="Giant Turtle Puppet – Image courtesy of Thomas Kay"
          width={900}
          height={400}
          className="w-full max-w-4xl rounded-lg"
        />
      </section>

      {/* Newsletter */}
      <section className="bg-green-900 px-6 py-16 text-center">
        <h2 className="text-white text-2xl font-bold mb-2">
          Stay updated
        </h2>
        <p className="text-green-200 mb-8">Sign up for news and announcements from Wellington Puppetry Festival</p>
        <form className="flex flex-col gap-3 max-w-md mx-auto mb-4">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="First Name"
              className="flex-1 px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="flex-1 px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-yellow-400"
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-6 py-3 rounded transition-colors text-lg"
          >
            Sign up
          </button>
        </form>
        <p className="text-green-300 text-sm">We will always respect your privacy!</p>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white/40 text-sm px-6 py-8 text-center">
        <p>Wellington Puppetry Festival · 18–20 September 2026 · Wellington, NZ</p>
        <p className="mt-2">
          <a href="mailto:wellingtonpuppetryfestival@gmail.com" className="hover:text-white transition-colors">
            wellingtonpuppetryfestival@gmail.com
          </a>
        </p>
      </footer>
    </main>
  )
}
