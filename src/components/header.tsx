"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-xl md:text-2xl text-foreground">
              Strings & Shadows
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#programme"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Programme
            </Link>
            <Link
              href="#artists"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Artists
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="#venues"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Venues
            </Link>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Tickets
            </Button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="flex flex-col p-4 gap-4">
            <Link
              href="#programme"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Programme
            </Link>
            <Link
              href="#artists"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
            <Link
              href="#about"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="#venues"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Venues
            </Link>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full mt-2">
              Get Tickets
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
