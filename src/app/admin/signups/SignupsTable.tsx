'use client'

import { useMemo, useState } from 'react'
import type { Signup } from '@/app/actions'

/**
 * The list exists so the sign-ups can leave. A mailing list sitting in a
 * table nobody can get at is the same problem as the form that threw
 * addresses away, one step further down — so the first control on the page
 * is Download CSV, and it is a real file, built in the browser from the rows
 * already on screen. No route, no second fetch, nothing to leak.
 */
function toCsv(rows: Signup[]): string {
  // Quote everything and double any quote inside. A name with a comma in it
  // is ordinary; so, more to the point, is a leading '=' or '+', which Excel
  // and Sheets will happily run as a formula — the apostrophe prefix below
  // is what stops a pasted address becoming a spreadsheet injection.
  const esc = (v: string) => {
    const risky = /^[=+\-@\t\r]/.test(v)
    return `"${(risky ? `'${v}` : v).replace(/"/g, '""')}"`
  }
  const header = ['Email', 'First name', 'Last name', 'Signed up', 'Source']
  const lines = [header.map(esc).join(',')]
  for (const r of rows) {
    lines.push(
      [r.email, r.first_name, r.last_name, r.created_at, r.source].map((v) => esc(v ?? '')).join(','),
    )
  }
  // CRLF and a BOM: Excel on Windows opens a plain UTF-8 CSV as mojibake, and
  // these addresses are going to a spreadsheet, not a parser.
  return '﻿' + lines.join('\r\n')
}

export default function SignupsTable({ signups }: { signups: Signup[] }) {
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return signups
    return signups.filter((s) =>
      `${s.email} ${s.first_name} ${s.last_name}`.toLowerCase().includes(needle),
    )
  }, [signups, q])

  const download = () => {
    const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const stamp = new Date().toISOString().slice(0, 10)
    a.download = `wpf-newsletter-signups-${stamp}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <div className="flex-1 min-w-[12rem]">
          <label htmlFor="signup-search" className="block text-xs font-medium text-[#8a7764] mb-1">
            Search name or email
          </label>
          <input
            id="signup-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full px-3 py-2 rounded border border-[#e8dcc8] text-sm"
          />
        </div>
        <button
          type="button"
          onClick={download}
          disabled={rows.length === 0}
          className="px-4 py-2 rounded text-sm font-semibold bg-[#2d6c0a] text-white disabled:opacity-50"
        >
          Download CSV{q.trim() && rows.length !== signups.length ? ` (${rows.length})` : ''}
        </button>
      </div>

      <p className="text-sm text-[#5c4a38] mb-4">
        {signups.length === 0
          ? 'Nobody has signed up yet.'
          : `${signups.length} sign-up${signups.length === 1 ? '' : 's'}${
              rows.length !== signups.length ? ` · ${rows.length} matching` : ''
            }`}
      </p>

      {rows.length > 0 && (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-[#8a7764] border-b border-[#e8dcc8]">
              <th scope="col" className="py-2 pr-4 font-medium">Email</th>
              <th scope="col" className="py-2 pr-4 font-medium">Name</th>
              <th scope="col" className="py-2 pr-4 font-medium">Signed up</th>
              <th scope="col" className="py-2 font-medium">From</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-[#f0e8d8] align-top">
                <td className="py-2 pr-4">
                  <a href={`mailto:${s.email}`} className="underline underline-offset-2">
                    {s.email}
                  </a>
                </td>
                <td className="py-2 pr-4">{[s.first_name, s.last_name].filter(Boolean).join(' ') || '—'}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{fmt(s.created_at)}</td>
                <td className="py-2 text-[#8a7764]">{s.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
