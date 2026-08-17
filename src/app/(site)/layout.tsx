import React from 'react'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { MAIN_HEADING_ID } from '@/lib/site'
import { getPageContent } from '@/app/actions'

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const imageAlts = await getPageContent('image-alt-text')
  return (
    <>
      {/* Points at the page's <h1>, not at <main>. See the .wpf-skip-target
          note in globals.css — <main tabindex="-1"> was making JAWS read the
          entire page as one string on arrival. */}
      <a href={`#${MAIN_HEADING_ID}`} className="wpf-skip-link">
        Skip to content
      </a>
      <SiteHeader logoAlt={imageAlts.logo} />
      {children}
      <SiteFooter />
    </>
  )
}
