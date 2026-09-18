import { redirect } from 'next/navigation'

// /programme/v2 was the preview Bridget reviewed in July 2026. She approved the
// structure, so it's now the live /programme. Kept as a redirect because the v2
// URL is in her inbox.
export default function ProgramV2Redirect() {
  redirect('/programme')
}
