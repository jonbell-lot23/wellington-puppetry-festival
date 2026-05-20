import Link from "next/link"
import { Globe, Share2, MessageCircle, Play } from "lucide-react"

const footerLinks = {
  festival: [
    { label: "Programme", href: "#programme" },
    { label: "Artists", href: "#artists" },
    { label: "Venues", href: "#venues" },
    { label: "Tickets", href: "#" },
  ],
  info: [
    { label: "About Us", href: "#about" },
    { label: "Press", href: "#" },
    { label: "Volunteers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  support: [
    { label: "Accessibility", href: "#" },
    { label: "FAQs", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
  ],
}

const socialLinks = [
  { icon: Share2, href: "#", label: "Instagram" },
  { icon: Globe, href: "#", label: "Facebook" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Play, href: "#", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl text-background">
                Strings & Shadows
              </span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed mb-6 max-w-xs">
              Wellington's premier puppetry festival. Where imagination takes
              flight.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-background" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-medium text-background mb-4">Festival</h4>
            <ul className="space-y-3">
              {footerLinks.festival.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/60 text-sm hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Info</h4>
            <ul className="space-y-3">
              {footerLinks.info.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/60 text-sm hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-background mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/60 text-sm hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-sm">
            © 2026 Strings & Shadows Festival. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-background/40 text-sm">
            <span>Supported by</span>
            <span className="font-medium text-background/60">
              Creative NZ
            </span>
            <span>•</span>
            <span className="font-medium text-background/60">
              Wellington City Council
            </span>
          </div>
        </div>

        {/* Large decorative logo */}
        <div className="mt-16 text-center overflow-hidden">
          <span className="font-serif text-[8rem] md:text-[12rem] lg:text-[16rem] text-background/5 leading-none select-none">
            S&S
          </span>
        </div>
      </div>
    </footer>
  )
}
