import NewTabHint from '@/components/NewTabHint'

// What a crew sheet page shows when there is no snapshot to show: before the
// first sync has run, or if Supabase is unreachable.
//
// It names the spreadsheet and links to it rather than showing an empty page
// or a spinner. Someone opening this at 8am needs a way through, not an
// apology — the Google Sheet is always the fallback, and it is always correct.
export default function MissingSnapshot({ sourceUrl }: { sourceUrl: string }) {
  return (
    <div
      className="rounded-2xl p-7 border border-black/5 bg-[var(--wpf-pink-soft)]"
      style={{ color: 'var(--wpf-ink)' }}
    >
      <h2 className="font-extrabold text-xl mb-2">Nothing has synced yet</h2>
      <p className="leading-relaxed mb-4">
        This page copies the spreadsheet every 30 minutes, and it has not managed to yet. The
        spreadsheet itself is always right — go straight there.
      </p>
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="wpf-btn-primary wpf-btn-focus px-6 py-3"
        style={{ backgroundColor: 'var(--wpf-yellow)', color: 'var(--wpf-ink)' }}
      >
        Open the spreadsheet
        <NewTabHint />
      </a>
    </div>
  )
}
