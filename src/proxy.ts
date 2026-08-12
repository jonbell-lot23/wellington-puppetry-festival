// Guards /admin. Renamed from `middleware` in Next 16 — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
//
// This redirects rather than rewrites: with a rewrite the browser would still
// be sitting on /admin while showing the login form, and the form's POST would
// have to pass back through this guard to reach its own action. Redirecting to
// a path the matcher doesn't cover keeps that flow boring.
//
// This is the front door, not the only lock. The mutating server actions check
// the same cookie themselves — see app/actions.ts — because a route guard
// doesn't inherently cover an action invoked by id.
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { ADMIN_COOKIE, verifyToken } from '@/lib/adminAuth'

export function proxy(request: NextRequest) {
  if (verifyToken(request.cookies.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.next()
  }
  const login = new URL('/admin-login', request.url)
  // So a bookmarked deep link still lands where it was going after signing in.
  const { pathname, search } = request.nextUrl
  if (pathname !== '/admin') login.searchParams.set('next', pathname + search)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
