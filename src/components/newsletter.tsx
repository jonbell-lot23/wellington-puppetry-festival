"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-secondary font-medium tracking-widest uppercase text-sm mb-3">
          Stay Connected
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4 text-balance">
          Join the Strings & Shadows Community
        </h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
          Be the first to know about new shows, artist announcements, and
          exclusive early-bird tickets.
        </p>

        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-muted border-border focus:border-primary"
              required
            />
            <Button
              type="submit"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Subscribe
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-center gap-2 text-primary">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Thank you! You're on the list.
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-xs mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
