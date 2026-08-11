import React from 'react'

// Marking te reo Māori with lang="mi" so screen readers switch pronunciation
// instead of reading it as English — WCAG 3.1.2 (Language of Parts).
//
// This is done at render time rather than by hand-tagging the copy, because
// almost all of the text on this site is edited by Bridget in /admin and
// stored in Supabase. Asking her to type markup around every "whānau" would
// guarantee it stops happening the first time someone's in a hurry. The rule
// here is that she writes normally and the site handles pronunciation.
//
// Two deliberate constraints:
//
//  1. Words are matched on word boundaries, so "manu" doesn't fire inside
//     "manual" and "kai" doesn't fire inside "kaiser".
//  2. The list is only words that actually appear on this site. Tagging is
//     not free — a wrong tag makes a screen reader mispronounce something it
//     would otherwise have said correctly, so a short accurate list beats a
//     long speculative one.
//
// Macronless spellings are included on purpose: Bridget writes both "whānau"
// and "whanau", and both should be pronounced as te reo.

const TERMS = [
  // Multi-word phrases first — the alternation is order-sensitive, and
  // "Ngā Maunga Rū" must win over a bare "Ngā".
  'Ngā Maunga Rū',
  'Nga Maunga Ru',
  // Bridget moved the site from "Pōneke" to "Te Whanganui-a-Tara" (Aug 2026).
  // She writes it spaced and macronless; the other spellings stay because
  // older copy and existing Supabase rows still carry them.
  'Te Whanganui-a-Tara',
  'Te Whanganui-ā-Tara',
  'Te-Whanganui-ā-Tara',
  'Toi Whakaari',
  'Te Kura o Tawatawa',
  'Toro Pikopiko',
  'kia ora',

  // Single words.
  'whānau',
  'whanau',
  'Pōneke',
  'Poneke',
  'Aotearoa',
  'karakia',
  'tamariki',
  'taniwha',
  'taniwhas',
  'manu',
  'ruru',
  'maunga',
  'koha',
  'kai',
  'marae',
  'iwi',
]

// No '-' in this set: it's only special inside a character class, and under
// the /u flag "\-" is an invalid identity escape that throws at construction.
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Boundaries are Unicode-aware, not \b. \b is defined against [A-Za-z0-9_],
// so "Ngā Maunga Rū" — which ends in ū — has no \b after it at all and would
// never match. \p{L} counts macron vowels as letters, which is the whole
// point here.
//
// The leading boundary is a captured character rather than a lookbehind:
// lookbehind only reached Safari in 16.4, and this helper is used inside
// client components too, so the regex can run in a browser.
const ALT = [...TERMS].sort((a, b) => b.length - a.length).map(escape).join('|')
const PATTERN = new RegExp(`(^|[^\\p{L}\\p{N}])(${ALT})(?![\\p{L}\\p{N}])`, 'giu')

/**
 * Wrap any te reo Māori in `text` with <span lang="mi">, leaving the rest
 * alone. Returns the original string untouched when there's nothing to mark,
 * so the common case adds no extra DOM.
 */
export function teReo(text: string | undefined | null): React.ReactNode {
  if (!text) return text
  // Cheap bail-out: most strings on the site contain no te reo at all.
  PATTERN.lastIndex = 0
  if (!PATTERN.test(text)) return text

  PATTERN.lastIndex = 0
  const out: React.ReactNode[] = []
  let last = 0
  let m: RegExpExecArray | null

  while ((m = PATTERN.exec(text)) !== null) {
    // m[1] is the boundary character we had to consume to prove the term
    // starts a word — it's ordinary text and goes back verbatim.
    const start = m.index + m[1].length
    if (start > last) out.push(text.slice(last, start))
    out.push(
      <span lang="mi" key={`${start}-${m[2]}`}>
        {m[2]}
      </span>,
    )
    last = start + m[2].length
  }
  if (last < text.length) out.push(text.slice(last))

  return <>{out}</>
}
