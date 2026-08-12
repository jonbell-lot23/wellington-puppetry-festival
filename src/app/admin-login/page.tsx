import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import '../admin/admin-theme.css'
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  adminAuthConfigured,
  checkPassword,
  issueToken,
} from '@/lib/adminAuth'

export const metadata: Metadata = {
  title: 'Sign in: Wellington Puppetry Festival',
  robots: { index: false, follow: false },
}

// A plain <form> posting to a server action — no client JavaScript, so it
// still works with JS off and there's nothing to hydrate. The failure case
// comes back as ?error=1 rather than through client state.
async function signIn(formData: FormData) {
  'use server'

  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/admin')
  // Only ever bounce back to a path on this site — an open redirect here would
  // be a phishing hop that borrows the festival's domain.
  const target = next.startsWith('/') && !next.startsWith('//') ? next : '/admin'

  if (!checkPassword(password)) {
    redirect(`/admin-login?error=1${next !== '/admin' ? `&next=${encodeURIComponent(next)}` : ''}`)
  }

  const token = issueToken()
  if (token) {
    const jar = await cookies()
    jar.set(ADMIN_COOKIE, token, ADMIN_COOKIE_OPTIONS)
  }
  redirect(target)
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const { error, next } = await searchParams
  const configured = adminAuthConfigured()

  return (
    <div className="admin-root">
      <main id="main" tabIndex={-1} style={{ maxWidth: 380, margin: '0 auto', padding: '4rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Wellington Puppetry Festival
        </h1>
        <p style={{ marginBottom: '2rem', opacity: 0.75 }}>Sign in to edit the site.</p>

        {!configured ? (
          // Fail-closed, and say why. Otherwise this looks like a wrong password
          // and whoever is locked out goes hunting for the wrong problem.
          <p role="alert" style={{ color: '#a1155f', lineHeight: 1.6 }}>
            No admin password is configured on this deployment, so nobody can
            sign in. Set <code>ADMIN_PASSWORD</code> in the environment and
            redeploy.
          </p>
        ) : (
          <form action={signIn}>
            {error && (
              // role="alert" so a screen reader announces the failure instead
              // of leaving it to be discovered by re-reading the page.
              <p role="alert" style={{ color: '#a1155f', marginBottom: '1rem', fontWeight: 600 }}>
                That password didn’t work. Try again.
              </p>
            )}
            <label htmlFor="password" style={{ display: 'block', fontWeight: 700, marginBottom: '0.4rem' }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '0.7rem 0.8rem',
                fontSize: '1rem',
                borderRadius: 8,
                border: '2px solid rgba(0,0,0,0.25)',
                marginBottom: '1.25rem',
              }}
            />
            {next && <input type="hidden" name="next" value={next} />}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '1rem',
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#a1155f',
                border: 0,
                borderRadius: 9999,
                cursor: 'pointer',
              }}
            >
              Sign in
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
