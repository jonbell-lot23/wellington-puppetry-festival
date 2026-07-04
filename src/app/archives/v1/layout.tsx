import React from 'react'
import ArchivedSiteHeaderV1 from '@/components/archived/ArchivedSiteHeaderV1'
import ArchivedSiteFooterV1 from '@/components/archived/ArchivedSiteFooterV1'

// Standalone layout for the archived pre-redesign site. Deliberately does not
// use the live (site) route group's header/footer, so this snapshot keeps
// rendering correctly even as the live site's nav/branding keeps changing.
export default function ArchiveV1Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <ArchivedSiteHeaderV1 />
      {children}
      <ArchivedSiteFooterV1 />
    </>
  )
}
