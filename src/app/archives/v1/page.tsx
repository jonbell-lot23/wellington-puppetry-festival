import Link from 'next/link'
import ImagePlaceholder from '@/components/ImagePlaceholder'

// Frozen snapshot of the homepage exactly as it looked before the TAHI-style
// relaunch (see commit "Match reference typography + spacing on festival
// page"). Content is hardcoded rather than pulled from Supabase/pages.ts so
// this page keeps rendering identically no matter how the live site's
// editable content model changes going forward.
export const dynamic = 'force-static'

export default function ArchivedFestivalPageV1() {
  return (
    <main className="bg-white">
      <section className="relative w-full aspect-square md:aspect-[1440/1207] border border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-gray-400">
        <ImagePlaceholder className="w-16 h-16" />
        <span className="text-xs uppercase tracking-widest">Title image coming soon</span>
      </section>

      <section className="bg-white px-6 py-24 flex items-center justify-center md:min-h-[594px] md:py-0">
        <div className="mx-auto max-w-3xl flex flex-col items-center text-center">
          <h1 className="text-[#2a571d] font-semibold text-[22px] md:text-[25px] leading-[1.7]">
            Thanks for your submissions
          </h1>
          <h2 className="text-[#2a571d] font-semibold text-[22px] md:text-[25px] leading-[1.7]">
            Full programme announced June 2026
          </h2>
          <h2 className="text-[#2a571d] font-semibold text-[22px] md:text-[25px] leading-[1.7] mt-4">
            Sign up to our mailing list to stay updated
          </h2>
          <Link
            href="#footer-signup"
            className="mt-11 inline-block rounded-[10px] bg-black text-white font-light tracking-wide text-[19px] md:text-[20px] px-7 py-5 hover:bg-black/85 transition-colors"
          >
            Sign up for Festival News
          </Link>
        </div>
      </section>

      <section className="relative w-full aspect-[1440/660] border border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 text-gray-400">
        <ImagePlaceholder className="w-16 h-16" />
        <span className="text-xs uppercase tracking-widest">Banner image coming soon</span>
      </section>
    </main>
  )
}
