'use client'

import { useState } from 'react'
import { savePageContent, type PageContent, type ContentVersion } from '../actions'
import type { Field } from '@/lib/pages'
import HistoryPanel from './HistoryPanel'

type Tab = 'edit' | 'history'
type PageDef = { slug: string; path: string; title: string; fields: Field[] }

export default function AdminEditor({
  pages,
  def,
  initialContent,
  initialVersions,
  migrationSQL,
}: {
  pages: { slug: string; title: string }[]
  def: PageDef
  initialContent: PageContent
  initialVersions: ContentVersion[]
  migrationSQL: string | null
}) {
  const [values, setValues] = useState<PageContent>(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<Tab>('edit')

  const handleSave = async () => {
    setSaving(true)
    await savePageContent(def.slug, values)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: '#1a0a12' }}>
      {/* Toolbar */}
      <div className="fixed top-0 inset-x-0 z-50 bg-black/90 border-b border-yellow-400/30 px-6 py-3 flex items-center justify-between backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="text-yellow-400 font-bold text-sm">Admin</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab('edit')}
              className={`text-xs font-medium px-3 py-1 rounded ${tab === 'edit' ? 'bg-yellow-400/20 text-yellow-300' : 'text-white/40 hover:text-white'}`}
            >
              Edit
            </button>
            <button
              onClick={() => setTab('history')}
              className={`text-xs font-medium px-3 py-1 rounded ${tab === 'history' ? 'bg-yellow-400/20 text-yellow-300' : 'text-white/40 hover:text-white'}`}
            >
              History{initialVersions.length > 0 ? ` (${initialVersions.length})` : ''}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={def.path} target="_blank" className="text-white/40 hover:text-white text-xs">
            View page ↗
          </a>
          {tab === 'edit' && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold px-4 py-1.5 rounded text-sm"
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
            </button>
          )}
        </div>
      </div>

      <div className="pt-16 flex">
        {/* Page list */}
        <aside className="w-56 shrink-0 border-r border-white/10 min-h-screen p-4">
          <p className="text-white/40 text-xs uppercase tracking-wide mb-3">Pages</p>
          <nav className="flex flex-col gap-1">
            {pages.map((p) => (
              <a
                key={p.slug}
                href={`/admin?page=${p.slug}`}
                className={`text-sm px-3 py-2 rounded ${p.slug === def.slug ? 'bg-yellow-400/15 text-yellow-300' : 'text-white/70 hover:bg-white/5'}`}
              >
                {p.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Editor / history */}
        <main className="flex-1 p-8 max-w-2xl">
          <h1 className="text-xl font-bold mb-6">{def.title}</h1>

          {tab === 'history' ? (
            migrationSQL ? (
              <div className="border border-yellow-400/30 bg-yellow-400/5 rounded-lg p-4">
                <p className="text-yellow-300 font-bold text-sm mb-2">DB setup required</p>
                <p className="text-white/50 text-xs mb-3">
                  Run this once in your{' '}
                  <a href="https://supabase.com/dashboard" target="_blank" className="underline">
                    Supabase SQL editor
                  </a>
                  :
                </p>
                <pre className="text-green-300 text-xs bg-black/40 rounded p-3 overflow-x-auto select-all">{migrationSQL}</pre>
              </div>
            ) : (
              <HistoryPanel slug={def.slug} versions={initialVersions} current={initialContent} fields={def.fields} />
            )
          ) : (
            <div className="flex flex-col gap-5">
              {def.fields.map((f) => (
                <label key={f.key} className="flex flex-col gap-1.5">
                  <span className="text-white/60 text-xs font-medium">{f.label}</span>
                  {f.multiline ? (
                    <textarea
                      rows={4}
                      value={values[f.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[f.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
                    />
                  )}
                </label>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
