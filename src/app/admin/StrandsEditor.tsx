'use client'

// Structured editor for the programme ('program-schedule' slug). AdminEditor
// swaps this in for that slug instead of the generic field form.
//
// It edits whole strands — the card wording *and* the listings inside it — so
// Bridget can change a card's title, blurb, artist names, times and blurbs
// herself. Edits are serialized back to the single strandsJson field, so the
// normal save / history / revert flow applies unchanged.

import { useState } from 'react'
import {
  ACCESS_STYLE,
  VENUES,
  parseStrands,
  serializeStrands,
  type Access,
  type Strand,
  type StrandEvent,
  type VenueKey,
} from '@/lib/strands'

const EMPTY_EVENT: StrandEvent = { time: '', title: '', venue: 'hall' }
const ACCESS_KEYS = Object.keys(ACCESS_STYLE) as Access[]

const LABEL = 'text-[10px] uppercase tracking-wide text-[#8a7764]'
const INPUT = 'admin-input px-2 py-1.5 text-sm'

function Field({
  label,
  value,
  placeholder,
  onChange,
  className = '',
}: {
  label: string
  value: string
  placeholder?: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className={LABEL}>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
    </label>
  )
}

function TextField({
  label,
  value,
  rows = 2,
  placeholder,
  onChange,
  className = '',
}: {
  label: string
  value: string
  rows?: number
  placeholder?: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1 ${className}`}>
      <span className={LABEL}>{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={INPUT}
      />
    </label>
  )
}

export default function StrandsEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (json: string) => void
}) {
  const [strands, setStrands] = useState<Strand[]>(() => parseStrands(value))
  // Collapsed by default — eight strands of full detail is a wall otherwise.
  const [open, setOpen] = useState<string | null>(null)

  const update = (next: Strand[]) => {
    setStrands(next)
    onChange(serializeStrands(next))
  }

  const updateStrand = (si: number, patch: Partial<Strand>) => {
    const next = structuredClone(strands)
    next[si] = { ...next[si], ...patch }
    update(next)
  }

  const updateEvent = (si: number, ei: number, patch: Partial<StrandEvent>) => {
    const next = structuredClone(strands)
    next[si].events[ei] = { ...next[si].events[ei], ...patch }
    update(next)
  }

  const addEvent = (si: number) => {
    const next = structuredClone(strands)
    next[si].events.push({ ...EMPTY_EVENT })
    update(next)
  }

  const removeEvent = (si: number, ei: number) => {
    const next = structuredClone(strands)
    next[si].events.splice(ei, 1)
    update(next)
  }

  const moveEvent = (si: number, ei: number, dir: -1 | 1) => {
    const target = ei + dir
    if (target < 0 || target >= strands[si].events.length) return
    const next = structuredClone(strands)
    const list = next[si].events
    ;[list[ei], list[target]] = [list[target], list[ei]]
    update(next)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs text-[#8a7764] leading-relaxed flex flex-col gap-2">
        <p>
          Each card on the programme page is one section below: its title and wording, plus the
          shows or workshops listed inside it. Change any of it here.
        </p>
        <p>
          Rows with an empty title are hidden on the public page. Fill in <em>Blurb</em>,{' '}
          <em>Artist bio</em> or <em>Image</em> on a row and it gets its own{' '}
          <strong>More info</strong> page, linked from the listing. Fill in{' '}
          <em>Ticket link</em> and a <strong>Buy tickets</strong> button appears.
        </p>
        <p>
          Image is a URL or a path like <code className="font-mono">/images/show.jpg</code>. Email
          images to{' '}
          <a href="mailto:jb@lot23.com" className="underline" style={{ color: '#0d5fa8' }}>
            Jon
          </a>{' '}
          and he&apos;ll give you the path to paste in.
        </p>
      </div>

      {strands.map((strand, si) => {
        const isOpen = open === strand.id
        return (
          <section key={strand.id} className="border border-[#e8dcc8] rounded-lg bg-white">
            <button
              onClick={() => setOpen(isOpen ? null : strand.id)}
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-3"
            >
              <span className="min-w-0">
                <span className="text-[10px] uppercase tracking-wide text-[#8a7764] block">
                  {strand.day}
                </span>
                <span className="text-sm font-bold text-[#3b2a17] block truncate">
                  {strand.title || '(untitled card)'}
                </span>
              </span>
              <span className="text-xs text-[#8a7764] shrink-0">
                {strand.events.length > 0 && `${strand.events.length} listed · `}
                {isOpen ? 'Close' : 'Edit'}
              </span>
            </button>

            {isOpen && (
              <div className="px-4 pb-4 flex flex-col gap-4 border-t border-[#e8dcc8] pt-4">
                {/* The card itself */}
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Field
                      label="Card title"
                      value={strand.title}
                      onChange={(v) => updateStrand(si, { title: v })}
                      className="sm:col-span-2"
                    />
                    <label className="flex flex-col gap-1">
                      <span className={LABEL}>Entry</span>
                      <select
                        value={strand.access}
                        onChange={(e) => updateStrand(si, { access: e.target.value as Access })}
                        className={INPUT}
                      >
                        {ACCESS_KEYS.map((k) => (
                          <option key={k} value={k}>
                            {ACCESS_STYLE[k].label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <TextField
                    label="Card description"
                    value={strand.blurb}
                    onChange={(v) => updateStrand(si, { blurb: v })}
                  />
                  <Field
                    label="Practical line (optional), e.g. “Pack a picnic”"
                    value={strand.note ?? ''}
                    onChange={(v) => updateStrand(si, { note: v })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Field
                      label="Button label (optional)"
                      value={strand.ctaLabel ?? ''}
                      placeholder="Buy tickets"
                      onChange={(v) => updateStrand(si, { ctaLabel: v })}
                    />
                    <Field
                      label="Button link (optional)"
                      value={strand.ctaUrl ?? ''}
                      placeholder="https://events.humanitix.com/…"
                      onChange={(v) => updateStrand(si, { ctaUrl: v })}
                    />
                  </div>
                </div>

                {/* What's listed inside it */}
                <div className="flex flex-col gap-3 pt-2 border-t border-[#f0e8d8]">
                  <p className="text-[10px] uppercase tracking-wide text-[#8a7764]">
                    Listed in this card
                  </p>

                  {strand.events.map((ev, ei) => (
                    <div key={ei} className="border border-[#e8dcc8] rounded-lg p-3 bg-[#fdfbf5]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        <Field
                          label="Time"
                          value={ev.time}
                          placeholder="10:00–10:30am"
                          onChange={(v) => updateEvent(si, ei, { time: v })}
                        />
                        <Field
                          label="Title"
                          value={ev.title}
                          onChange={(v) => updateEvent(si, ei, { title: v })}
                          className="col-span-2"
                        />
                        <label className="flex flex-col gap-1">
                          <span className={LABEL}>Venue</span>
                          <select
                            value={ev.venue}
                            onChange={(e) =>
                              updateEvent(si, ei, { venue: e.target.value as VenueKey })
                            }
                            className={INPUT}
                          >
                            {(Object.keys(VENUES) as VenueKey[]).map((k) => (
                              <option key={k} value={k}>
                                {VENUES[k].label}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                        <Field
                          label="Artist / by"
                          value={ev.by ?? ''}
                          onChange={(v) => updateEvent(si, ei, { by: v })}
                        />
                        <Field
                          label="Duration"
                          value={ev.duration ?? ''}
                          placeholder="30 mins"
                          onChange={(v) => updateEvent(si, ei, { duration: v })}
                        />
                        <Field
                          label="Ages"
                          value={ev.age ?? ''}
                          placeholder="3+"
                          onChange={(v) => updateEvent(si, ei, { age: v })}
                        />
                        <Field
                          label="Tag"
                          value={ev.note ?? ''}
                          placeholder="BLENNZ"
                          onChange={(v) => updateEvent(si, ei, { note: v })}
                        />
                      </div>

                      <TextField
                        label="One-line detail shown in the listing (optional)"
                        value={ev.detail ?? ''}
                        rows={2}
                        onChange={(v) => updateEvent(si, ei, { detail: v })}
                        className="mb-2"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <Field
                          label="Image (URL or /images/… path)"
                          value={ev.image ?? ''}
                          onChange={(v) => updateEvent(si, ei, { image: v })}
                        />
                        <Field
                          label="Image alt text (for screen readers)"
                          value={ev.imageAlt ?? ''}
                          placeholder={ev.title || 'Describe the photo'}
                          onChange={(v) => updateEvent(si, ei, { imageAlt: v })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <Field
                          label="Ticket link (optional)"
                          value={ev.ticketUrl ?? ''}
                          placeholder="https://events.humanitix.com/…"
                          onChange={(v) => updateEvent(si, ei, { ticketUrl: v })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <TextField
                          label="Blurb, shown on the More info page"
                          value={ev.blurb ?? ''}
                          rows={4}
                          onChange={(v) => updateEvent(si, ei, { blurb: v })}
                        />
                        <TextField
                          label="Artist bio, shown on the More info page"
                          value={ev.bio ?? ''}
                          rows={4}
                          onChange={(v) => updateEvent(si, ei, { bio: v })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                        <Field
                          label="Content warnings (optional)"
                          value={ev.warnings ?? ''}
                          placeholder="Flashing lights. Loud noises."
                          onChange={(v) => updateEvent(si, ei, { warnings: v })}
                        />
                        <TextField
                          label="Creative team, one person per line"
                          value={ev.credits ?? ''}
                          rows={3}
                          placeholder="Jane Doe (she/her), Puppeteer"
                          onChange={(v) => updateEvent(si, ei, { credits: v })}
                        />
                      </div>

                      {/* Photo paths themselves are managed manually outside this
                          editor — only the alt text is edited here. */}
                      <TextField
                        label="Photo alt text, one line per photo, same order"
                        value={(ev.imagesAlt ?? []).join('\n')}
                        rows={3}
                        placeholder={`${ev.title || 'Show'}, photo 1`}
                        onChange={(v) =>
                          updateEvent(si, ei, {
                            imagesAlt: v === '' ? [] : v.split('\n'),
                          })
                        }
                        className="mb-2"
                      />

                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => moveEvent(si, ei, -1)}
                          disabled={ei === 0}
                          className="admin-btn-secondary text-xs px-2 py-1 rounded disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveEvent(si, ei, 1)}
                          disabled={ei === strand.events.length - 1}
                          className="admin-btn-secondary text-xs px-2 py-1 rounded disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeEvent(si, ei)}
                          className="text-xs px-2 py-1 rounded text-[#a1155f] hover:bg-[#fce0ef] transition-colors"
                          title="Remove this row"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addEvent(si)}
                    className="admin-btn-secondary text-xs font-medium px-3 py-2 rounded self-start"
                  >
                    + Add to {strand.title || 'this card'}
                  </button>
                </div>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
