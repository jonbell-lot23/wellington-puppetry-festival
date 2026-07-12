'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  writable,
}: {
  pages: { slug: string; title: string }[]
  def: PageDef
  initialContent: PageContent
  initialVersions: ContentVersion[]
  migrationSQL: string | null
  writable: boolean
}) {
  const router = useRouter()
  const [values, setValues] = useState<PageContent>(initialContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('edit')
  // Remounting the iframe (via key) forces it to re-fetch the route. Bumped
  // after a successful save (once revalidatePath has run) and by the manual
  // "Refresh" button so just-saved content shows in the preview.
  const [previewNonce, setPreviewNonce] = useState(0)
  // Mobile-only toggle between the editor and the preview. On wide screens
  // both panes are always shown side by side (lg:block overrides this).
  const [showPreview, setShowPreview] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaveError(null)
    try {
      await savePageContent(def.slug, values)
      setSaved(true)
      router.refresh()
      setPreviewNonce((n) => n + 1)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Toolbar */}
      <div className="admin-toolbar fixed top-0 inset-x-0 z-50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-sm" style={{ color: '#0d5fa8' }}>
            Admin
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab('edit')}
              className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                tab === 'edit'
                  ? 'admin-tab-active'
                  : 'text-[#8a7764] hover:text-[#3b2a17]'
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setTab('history')}
              className={`text-xs font-medium px-3 py-1 rounded transition-colors ${
                tab === 'history'
                  ? 'admin-tab-active'
                  : 'text-[#8a7764] hover:text-[#3b2a17]'
              }`}
            >
              History{initialVersions.length > 0 ? ` (${initialVersions.length})` : ''}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview((s) => !s)}
            className="lg:hidden text-[#8a7764] hover:text-[#0d5fa8] text-xs font-medium transition-colors"
          >
            {showPreview ? 'Show editor' : 'Show preview'}
          </button>
          <a
            href={def.path}
            target="_blank"
            className="text-[#8a7764] hover:text-[#0d5fa8] text-xs transition-colors"
          >
            View page ↗
          </a>
          {tab === 'edit' && (
            <button
              onClick={handleSave}
              disabled={saving || !writable}
              className="admin-btn-primary disabled:opacity-50 px-4 py-1.5 rounded text-sm transition-colors"
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
            </button>
          )}
        </div>
      </div>

      <div className="pt-16 flex">
        {/* Page list */}
        <aside className="admin-sidebar w-56 shrink-0 min-h-screen p-4">
          <p className="text-[#8a7764] text-xs uppercase tracking-wide mb-3 font-medium">
            Pages
          </p>
          <nav className="flex flex-col gap-1">
            {pages.map((p) => (
              <a
                key={p.slug}
                href={`/admin?page=${p.slug}`}
                className={`text-sm px-3 py-2 rounded transition-colors ${
                  p.slug === def.slug
                    ? 'admin-nav-active'
                    : 'text-[#5c4a38] hover:bg-[#fbf6e9]'
                }`}
              >
                {p.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Editor + preview split */}
        <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* Editor / history */}
        <main
          className={`${
            showPreview ? 'hidden' : 'block'
          } lg:block lg:w-[45%] lg:shrink-0 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto p-8`}
        >
          {!writable && (
            <div className="admin-banner-warning rounded-lg px-4 py-3 mb-6 text-sm">
              <p className="font-semibold mb-1">Service role key missing</p>
              <p className="text-xs leading-relaxed">
                Add <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> to{' '}
                <code className="font-mono">.env.local</code> (from your Supabase project
                settings → API) and restart the dev server. Reads work with the anon key; saves
                and history require the service role.
              </p>
            </div>
          )}

          {saveError && (
            <div className="admin-banner-error rounded-lg px-4 py-3 mb-6 text-sm">
              {saveError}
            </div>
          )}

          <h1 className="text-xl font-bold mb-6 text-[#3b2a17]">{def.title}</h1>

          {tab === 'history' ? (
            migrationSQL ? (
              <div className="admin-banner-warning rounded-lg p-4">
                <p className="font-bold text-sm mb-2">DB setup required</p>
                <p className="text-xs mb-3 opacity-90">
                  Run this once in your{' '}
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    className="underline"
                    style={{ color: '#0d5fa8' }}
                  >
                    Supabase SQL editor
                  </a>
                  :
                </p>
                <pre className="text-xs bg-white border border-[#e8dcc8] rounded p-3 overflow-x-auto select-all text-[#3b2a17]">
                  {migrationSQL}
                </pre>
              </div>
            ) : (
              <HistoryPanel
                slug={def.slug}
                versions={initialVersions}
                current={initialContent}
                fields={def.fields}
                writable={writable}
              />
            )
          ) : (
            <div className="flex flex-col gap-5">
              {def.fields.map((f) => (
                <label key={f.key} className="flex flex-col gap-1.5">
                  <span className="text-[#5c4a38] text-xs font-medium">{f.label}</span>
                  {f.multiline ? (
                    <textarea
                      rows={4}
                      value={values[f.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="admin-input px-3 py-2 text-sm"
                    />
                  ) : (
                    <input
                      type="text"
                      value={values[f.key] ?? ''}
                      onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                      className="admin-input px-3 py-2 text-sm"
                    />
                  )}
                </label>
              ))}
            </div>
          )}
        </main>

        {/* Live preview of the public page for this slug */}
        <section
          className={`${
            showPreview ? 'flex' : 'hidden'
          } lg:flex flex-1 min-w-0 flex-col border-t lg:border-t-0 lg:border-l border-[#e8dcc8] bg-white lg:h-[calc(100vh-4rem)]`}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-[#e8dcc8] bg-[#fbf6e9]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[#8a7764] text-xs uppercase tracking-wide font-medium">
                Preview
              </span>
              <span className="text-[#5c4a38] text-xs font-mono truncate">{def.path}</span>
            </div>
            <button
              onClick={() => setPreviewNonce((n) => n + 1)}
              className="admin-btn-secondary text-xs font-medium px-3 py-1 rounded transition-colors shrink-0"
              title="Reload the preview to show the latest saved content"
            >
              ↻ Refresh
            </button>
          </div>
          <iframe
            key={`${def.slug}-${previewNonce}`}
            src={def.path}
            title={`Preview of ${def.title}`}
            className="flex-1 w-full border-0 bg-white min-h-[70vh] lg:min-h-0"
          />
        </section>
        </div>
      </div>
    </div>
  )
}
