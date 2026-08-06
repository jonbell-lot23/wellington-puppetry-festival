import React from 'react'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import { getPageContent } from '@/app/actions'

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const imageAlts = await getPageContent('image-alt-text')
  return (
    <>
      <a href="#main" className="wpf-skip-link">
        Skip to content
      </a>
      <SiteHeader logoAlt={imageAlts.logo} />
      {children}
      <SiteFooter />
    </>
  )
}
