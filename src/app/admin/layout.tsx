import type { Metadata } from 'next'
import './admin-theme.css'

export const metadata: Metadata = {
  title: 'Admin — Wellington Puppetry Festival',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>
}
