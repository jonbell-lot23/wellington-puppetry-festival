// Manually trigger the crew sheet sync.
//
//   node --env-file=.env.local scripts/sync-sheets.ts            # production
//   node --env-file=.env.local scripts/sync-sheets.ts --local    # localhost:3000
//   node --env-file=.env.local scripts/sync-sheets.ts --url http://localhost:3999
//
// The sync itself runs every 30 minutes on Vercel Cron (see vercel.json) and
// lives in src/lib/sync-sheets.ts. This script deliberately does not reimplement
// any of it — it just calls the same route, so there is no second code path to
// drift out of step with the one that actually runs in production.
//
// Use it when someone has changed the spreadsheet and doesn't want to wait for
// the next half-hour tick.

// No imports, so TypeScript needs telling this is a module before it will
// allow top-level await.
export {}

const args = process.argv.slice(2)

function flag(name: string): string | undefined {
  const i = args.indexOf(`--${name}`)
  return i === -1 ? undefined : args[i + 1]
}

const base = args.includes('--local')
  ? 'http://localhost:3000'
  : (flag('url') ?? 'https://www.wellingtonpuppetryfestival.com')

const secret = process.env.CRON_SECRET

const res = await fetch(`${base}/api/cron/sync-sheets`, {
  headers: secret ? { authorization: `Bearer ${secret}` } : {},
})

const body = await res.text()
let parsed: unknown
try {
  parsed = JSON.parse(body)
} catch {
  console.error(`${res.status} — unexpected response:\n${body.slice(0, 400)}`)
  process.exit(1)
}

console.log(JSON.stringify(parsed, null, 2))

if (!res.ok) {
  if (res.status === 401) {
    console.error(
      '\nUnauthorized. CRON_SECRET must be set locally and match the value on the Vercel project:\n' +
        '  npx vercel env pull .env.local',
    )
  }
  process.exit(1)
}
