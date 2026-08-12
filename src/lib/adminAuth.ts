// The gate on /admin.
//
// This is a shared-password gate, not user accounts: Bridget and Sarah edit
// the site from the same login, and a full auth system would be more moving
// parts than this festival needs. It is enough to keep the CMS off the open
// web, which is the actual requirement.
//
// The password itself is never in this repo — the repo is public. It lives in
// ADMIN_PASSWORD, set in Vercel and in .env.local for local work. With no
// ADMIN_PASSWORD set the gate fails *closed*: an admin tool that lets everyone
// in when its config is missing is worse than one that locks everybody out,
// because nobody notices the first kind.
//
// The cookie is not the password. It is an expiring token signed with the
// password as the key, so the password itself never sits in the browser and a
// stolen cookie stops working after 30 days — or immediately, if the password
// is changed, since that invalidates every signature at once.

import { createHmac, timingSafeEqual } from 'node:crypto'

export const ADMIN_COOKIE = 'wpf_admin'

const MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 days
// Bump this to sign everyone out without changing the password.
const VERSION = 'v1'

function secret(): string | null {
  const password = process.env.ADMIN_PASSWORD
  return password && password.length > 0 ? password : null
}

function sign(expiry: number, key: string): string {
  return createHmac('sha256', key).update(`${VERSION}.${expiry}`).digest('base64url')
}

/** Whether a password gate is configured at all. */
export function adminAuthConfigured(): boolean {
  return secret() !== null
}

/** Constant-time string compare that doesn't leak length via early return. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  // timingSafeEqual throws on length mismatch, so compare a fixed-size digest
  // of each side instead of the raw strings.
  const digest = (buf: Buffer) => createHmac('sha256', 'compare').update(buf).digest()
  return timingSafeEqual(digest(bufA), digest(bufB))
}

/** True if `password` is the configured admin password. */
export function checkPassword(password: string): boolean {
  const key = secret()
  if (!key) return false
  return safeEqual(password, key)
}

/** A signed, expiring token to put in the cookie. */
export function issueToken(): string | null {
  const key = secret()
  if (!key) return null
  const expiry = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS
  return `${expiry}.${sign(expiry, key)}`
}

/** True if `token` is one we issued and it hasn't expired. */
export function verifyToken(token: string | undefined | null): boolean {
  const key = secret()
  if (!key || !token) return false
  const dot = token.indexOf('.')
  if (dot < 1) return false
  const expiry = Number(token.slice(0, dot))
  if (!Number.isFinite(expiry) || expiry <= Math.floor(Date.now() / 1000)) return false
  return safeEqual(token.slice(dot + 1), sign(expiry, key))
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
  secure: process.env.NODE_ENV === 'production',
} as const
