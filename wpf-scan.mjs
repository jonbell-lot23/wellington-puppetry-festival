import { createClient } from '@supabase/supabase-js'
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const db = createClient(url, key)
const { data, error } = await db.from('pages').select('slug, data')
if (error) { console.error(error.message); process.exit(1) }
const RX = /(glass of wine|wine|beer|alcohol|licensed bar|\bbar\b|BYO|drinks)/i
console.log(`pages in DB: ${data.length}\n`)
for (const row of data) {
  for (const [k, v] of Object.entries(row.data ?? {})) {
    if (typeof v !== 'string') continue
    if (RX.test(v)) console.log(`[${row.slug}] ${k}\n   ${v.replace(/\s+/g,' ').trim()}\n`)
  }
}
