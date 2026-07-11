'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { revertToVersion, type ContentVersion, type PageContent } from '../actions'
import type { Field } from '@/lib/pages'

function getDiff(
  labels: Record<string, string>,
  a: PageContent,
  b: PageContent,
): Array<{ field: string; from: string; to: string }> {
  return Object.keys(labels)
    .filter((k) => (a[k] ?? '') !== (b[k] ?? ''))
    .map((k) => ({ field: k, from: a[k] ?? '', to: b[k] ?? '' }))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryPanel({
  slug,
  versions,
  fields,
  writable,
}: {
  slug: string
  versions: ContentVersion[]
  current: PageContent
  fields: Field[]
  writable: boolean
}) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<number | null>(null)
  const [reverting, setReverting] = useState<number | null>(null)
  const [revertError, setRevertError] = useState<string | null>(null)
  const labels: Record<string, string> = Object.fromEntries(fields.map((f) => [f.key, f.label]))

  if (versions.length === 0) {
    return (
      <div className="text-[#8a7764] text-sm text-center py-8 admin-card px-4">
        No history yet — save a change to start tracking versions.
      </div>
    )
  }

  async function handleRevert(id: number) {
    setReverting(id)
    setRevertError(null)
    try {
      await revertToVersion(slug, id)
      router.refresh()
    } catch (err) {
      setRevertError(err instanceof Error ? err.message : 'Revert failed')
    } finally {
      setReverting(null)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {revertError && (
        <div className="admin-banner-error rounded-lg px-4 py-3 text-sm">{revertError}</div>
      )}

      {versions.map((version, i) => {
        const prev = versions[i + 1]
        const diffs = prev
          ? getDiff(labels, prev.data, version.data)
          : getDiff(labels, version.data, version.data)
        const isCurrentLive = i === 0
        const isExpanded = expanded === version.id

        return (
          <div key={version.id} className="admin-card overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : version.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#fbf6e9] transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-[#3b2a17] text-sm font-mono">
                  {formatDate(version.saved_at)}
                </span>
                {isCurrentLive && (
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ background: 'rgba(255, 206, 46, 0.35)', color: '#3b2a17' }}
                  >
                    live
                  </span>
                )}
                {!prev ? (
                  <span className="text-[#8a7764] text-xs">initial save</span>
                ) : diffs.length === 0 ? (
                  <span className="text-[#8a7764] text-xs">no changes</span>
                ) : (
                  <span className="text-[#5c4a38] text-xs">
                    {diffs.length} field{diffs.length !== 1 ? 's' : ''} changed
                  </span>
                )}
              </div>
              <span className="text-[#8a7764] text-xs">{isExpanded ? '▲' : '▼'}</span>
            </button>

            {isExpanded && (
              <div className="border-t border-[#e8dcc8] px-4 py-4 bg-white">
                {prev && diffs.length > 0 ? (
                  <div className="flex flex-col gap-3 mb-4">
                    {diffs.map(({ field, from, to }) => (
                      <div key={field} className="text-xs">
                        <div className="text-[#8a7764] mb-1 font-medium">{labels[field]}</div>
                        <div className="admin-diff-removed rounded px-2 py-1 line-through mb-1">
                          {from}
                        </div>
                        <div className="admin-diff-added rounded px-2 py-1">{to}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[#8a7764] text-xs mb-4">
                    Full snapshot — no previous version to diff against.
                  </div>
                )}

                {!isCurrentLive && (
                  <button
                    onClick={() => handleRevert(version.id)}
                    disabled={reverting === version.id || !writable}
                    className="admin-btn-secondary disabled:opacity-50 text-xs font-medium px-4 py-2 rounded transition-colors"
                  >
                    {reverting === version.id ? 'Reverting…' : 'Revert to this version'}
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
