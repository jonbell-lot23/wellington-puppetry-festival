import { redirect } from 'next/navigation'

// Artists page is hidden for now. Bridget wasn't able to gather artist head
// shots in time, so artist bios will live inside the programme listings
// instead. The full component is preserved in git history — to bring the
// page back, restore it from there and re-add the nav link in SiteHeader.
export default function ArtistsPage() {
  redirect('/program')
}
