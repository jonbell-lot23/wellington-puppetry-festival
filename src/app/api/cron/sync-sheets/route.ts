import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

import { syncAllSheets } from '@/lib/sync-sheets'

// The half-hourly pull of the crew's Google Sheets. Scheduled by the `crons`
// entry in vercel.json; see src/lib/sync-sheets.ts for what it actually does.
//
// Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when that environment
// variable is set on the project. This route refuses anything else, so the
// endpoint can't be used by a stranger to hammer Google on our behalf. If
// CRON_SECRET is somehow missing in production the route refuses outright
// rather than quietly running unauthenticated — an unprotected write endpoint
// is worse than a sync that stops and says so.
//
// It is a GET because that is what Vercel Cron issues.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')

  if (!secret) {
    // Local development with no secret configured is fine; production is not.
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 500 })
    }
  } else if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const results = await syncAllSheets()

  // Drop the cached pages so the next visitor sees the new snapshot rather
  // than waiting out the 60-second revalidate window.
  if (results.some((r) => r.changed)) {
    revalidatePath('/volunteers/crew/schedule')
    revalidatePath('/volunteers/crew/jobs')
  }

  const failed = results.filter((r) => !r.ok)
  return NextResponse.json(
    {
      syncedAt: new Date().toISOString(),
      changed: results.filter((r) => r.changed).map((r) => r.key),
      results,
    },
    // Only shout if every sheet failed: one flaky sheet shouldn't page anyone,
    // and the pages degrade honestly on their own.
    { status: failed.length === results.length ? 500 : 200 },
  )
}
