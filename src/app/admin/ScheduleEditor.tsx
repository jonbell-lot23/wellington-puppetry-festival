'use client'

// Structured editor for the programme schedule ('program-schedule' slug).
// AdminEditor swaps this in for that slug instead of the generic field form.
// Edits are serialized back to the single scheduleJson field, so the normal
// save / history / revert flow applies unchanged.

import { useState } from 'react'
import {
  parseSchedule,
  serializeSchedule,
  VENUES,
  type DaySchedule,
  type ScheduleEvent,
  type VenueKey,
} from '@/lib/schedule'

const EMPTY_EVENT: ScheduleEvent = { time: '', title: '', venue: 'hall' }

export default function ScheduleEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (json: string) => void
}) {
  const [days, setDays] = useState<DaySchedule[]>(() => parseSchedule(value))

  const update = (next: DaySchedule[]) => {
    setDays(next)
    onChange(serializeSchedule(next))
  }

  const updateEvent = (di: number, pi: number, ei: number, patch: Partial<ScheduleEvent>) => {
    const next = structuredClone(days)
    next[di].parts[pi].events[ei] = { ...next[di].parts[pi].events[ei], ...patch }
    update(next)
  }

  const addEvent = (di: number, pi: number) => {
    const next = structuredClone(days)
    next[di].parts[pi].events.push({ ...EMPTY_EVENT })
    update(next)
  }

  const removeEvent = (di: number, pi: number, ei: number) => {
    const next = structuredClone(days)
    next[di].parts[pi].events.splice(ei, 1)
    update(next)
  }

  const moveEvent = (di: number, pi: number, ei: number, dir: -1 | 1) => {
    const events = days[di].parts[pi].events
    const target = ei + dir
    if (target < 0 || target >= events.length) return
    const next = structuredClone(days)
    const list = next[di].parts[pi].events
    ;[list[ei], list[target]] = [list[target], list[ei]]
    update(next)
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-xs text-[#8a7764] leading-relaxed">
        Times, shows and venues for the programme page. Rows with an empty title are hidden on
        the public page. Image is a URL or a path like <code className="font-mono">/images/show.jpg</code> —
        email images to Jon and he&apos;ll give you the path to paste in.
      </p>

      {days.map((day, di) => (
        <section key={day.id}>
          <h2 className="text-base font-bold text-[#3b2a17] mb-1">
            {day.day} <span className="font-normal text-[#8a7764]">— {day.date}</span>
          </h2>

          {day.parts.map((part, pi) => (
            <div key={pi} className="mb-4">
              {part.label && (
                <p className="text-xs font-medium uppercase tracking-wide text-[#8a7764] mt-3 mb-2">
                  {part.label}
                </p>
              )}

              <div className="flex flex-col gap-3">
                {part.events.map((ev, ei) => (
                  <div key={ei} className="border border-[#e8dcc8] rounded-lg p-3 bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Time</span>
                        <input
                          type="text"
                          value={ev.time}
                          placeholder="10:00–10:30am"
                          onChange={(e) => updateEvent(di, pi, ei, { time: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1 col-span-2">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Title</span>
                        <input
                          type="text"
                          value={ev.title}
                          onChange={(e) => updateEvent(di, pi, ei, { title: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Venue</span>
                        <select
                          value={ev.venue}
                          onChange={(e) => updateEvent(di, pi, ei, { venue: e.target.value as VenueKey })}
                          className="admin-input px-2 py-1.5 text-sm"
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
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Artist / by</span>
                        <input
                          type="text"
                          value={ev.by ?? ''}
                          onChange={(e) => updateEvent(di, pi, ei, { by: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Duration</span>
                        <input
                          type="text"
                          value={ev.duration ?? ''}
                          placeholder="30 mins"
                          onChange={(e) => updateEvent(di, pi, ei, { duration: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Ages</span>
                        <input
                          type="text"
                          value={ev.age ?? ''}
                          placeholder="3+"
                          onChange={(e) => updateEvent(di, pi, ei, { age: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Tag</span>
                        <input
                          type="text"
                          value={ev.note ?? ''}
                          placeholder="BLENNZ"
                          onChange={(e) => updateEvent(di, pi, ei, { note: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Image (URL or /images/… path)</span>
                        <input
                          type="text"
                          value={ev.image ?? ''}
                          onChange={(e) => updateEvent(di, pi, ei, { image: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wide text-[#8a7764]">Info / bio</span>
                        <textarea
                          rows={2}
                          value={ev.detail ?? ''}
                          onChange={(e) => updateEvent(di, pi, ei, { detail: e.target.value })}
                          className="admin-input px-2 py-1.5 text-sm"
                        />
                      </label>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => moveEvent(di, pi, ei, -1)}
                        disabled={ei === 0}
                        className="admin-btn-secondary text-xs px-2 py-1 rounded disabled:opacity-30"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveEvent(di, pi, ei, 1)}
                        disabled={ei === part.events.length - 1}
                        className="admin-btn-secondary text-xs px-2 py-1 rounded disabled:opacity-30"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => removeEvent(di, pi, ei)}
                        className="text-xs px-2 py-1 rounded text-[#a1155f] hover:bg-[#fce0ef] transition-colors"
                        title="Remove this row"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addEvent(di, pi)}
                  className="admin-btn-secondary text-xs font-medium px-3 py-2 rounded self-start"
                >
                  + Add event{part.label ? ` (${day.day} ${part.label.toLowerCase()})` : ` (${day.day})`}
                </button>
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}
