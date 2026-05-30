'use client'

import { useState } from 'react'
import { revertToVersion, type ContentVersion, type SiteContent } from '../actions'

const FIELD_LABELS: Record<keyof SiteContent, string> = {
  heroSubheading: 'Hero subheading',
  heroHeading: 'Hero heading',
  badgeTitle: 'Badge title',
  badgeSubtext: 'Badge subtext',
  dateLocation: 'Date & location',
  heroCta: 'Hero CTA',
  formHeading: 'Form heading',
  formSubtext: 'Form subtext',
  signupButton: 'Signup button',
  successHeading: 'Success heading',
  successSubtext: 'Success subtext',
  footerName: 'Footer name',
  footerDate: 'Footer date',
  footerEmail: 'Footer email',
}

function getDiff(a: SiteContent, b: SiteContent): Array<{ field: keyof SiteContent; from: string; to: string }> {
  return (Object.keys(FIELD_LABELS) as Array<keyof SiteContent>)
    .filter(k => a[k] !== b[k])
    .map(k => ({ field: k, from: a[k], to: b[k] }))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-NZ', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function HistoryPanel({
  versions,
  current,
}: {
  versions: ContentVersion[]
  current: SiteContent
}) {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [reverting, setReverting] = useState<number | null>(null)

  if (versions.length === 0) {
    return (
      <div className="text-white/30 text-sm text-center py-8">
        No history yet — save a change to start tracking versions.
      </div>
    )
  }

  async function handleRevert(id: number) {
    setReverting(id)
    await revertToVersion(id)
    setReverting(null)
  }

  return (
    <div className="flex flex-col gap-2">
      {versions.map((version, i) => {
        const prev = versions[i + 1]
        const diffs = prev ? getDiff(prev.data, version.data) : getDiff(version.data, version.data)
        const isCurrentLive = i === 0
        const isExpanded = expanded === version.id

        return (
          <div
            key={version.id}
            className="border border-white/10 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpanded(isExpanded ? null : version.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-white/70 text-sm font-mono">{formatDate(version.saved_at)}</span>
                {isCurrentLive && (
                  <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded font-medium">live</span>
                )}
                {!prev ? (
                  <span className="text-white/30 text-xs">initial save</span>
                ) : diffs.length === 0 ? (
                  <span className="text-white/30 text-xs">no changes</span>
                ) : (
                  <span className="text-white/50 text-xs">{diffs.length} field{diffs.length !== 1 ? 's' : ''} changed</span>
                )}
              </div>
              <span className="text-white/30 text-xs">{isExpanded ? '▲' : '▼'}</span>
            </button>

            {isExpanded && (
              <div className="border-t border-white/10 px-4 py-4">
                {prev && diffs.length > 0 ? (
                  <div className="flex flex-col gap-3 mb-4">
                    {diffs.map(({ field, from, to }) => (
                      <div key={field} className="text-xs">
                        <div className="text-white/40 mb-1">{FIELD_LABELS[field]}</div>
                        <div className="bg-red-900/30 border border-red-700/30 rounded px-2 py-1 text-red-300 line-through mb-1">{from}</div>
                        <div className="bg-green-900/30 border border-green-700/30 rounded px-2 py-1 text-green-300">{to}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/30 text-xs mb-4">Full snapshot — no previous version to diff against.</div>
                )}

                {!isCurrentLive && (
                  <button
                    onClick={() => handleRevert(version.id)}
                    disabled={reverting === version.id}
                    className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white text-xs font-medium px-4 py-2 rounded transition-colors"
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
