import fs from 'node:fs'
import path from 'node:path'
import { getSignups, signupsTableExists } from '../../actions'
import SignupsTable from './SignupsTable'

export const dynamic = 'force-dynamic'

export default async function SignupsPage() {
  const ready = await signupsTableExists()
  const signups = ready ? await getSignups() : []

  // Shown only when the table is missing, the same courtesy /admin already
  // does for `pages`: the SQL to paste into the Supabase editor, read from
  // the migration itself so the two cannot drift apart.
  let migrationSQL: string | null = null
  if (!ready) {
    try {
      migrationSQL = fs.readFileSync(
        path.join(process.cwd(), 'supabase/migrations/004_signups.sql'),
        'utf8',
      )
    } catch {
      migrationSQL = null
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <p className="mb-2">
        <a href="/admin" className="text-sm underline underline-offset-2 text-[#8a7764]">
          ← Back to pages
        </a>
      </p>
      <h1 className="text-2xl font-bold mb-1 text-[#3b2d1f]">Newsletter sign-ups</h1>
      <p className="text-sm text-[#8a7764] mb-6">
        Everyone who has signed up through the form on the homepage or the Contact page.
      </p>

      {!ready ? (
        <div className="rounded border border-[#e8dcc8] bg-[#fbf6e9] p-5">
          <p className="text-sm text-[#5c4a38] mb-3">
            The <code>signups</code> table does not exist yet, so the form has nowhere to put
            anyone. Run this in the Supabase SQL editor, then reload this page.
          </p>
          <pre className="text-xs overflow-x-auto bg-white p-3 rounded border border-[#e8dcc8] whitespace-pre-wrap">
            {migrationSQL ?? 'See supabase/migrations/004_signups.sql'}
          </pre>
        </div>
      ) : (
        <SignupsTable signups={signups} />
      )}
    </div>
  )
}
