import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Jon, 14 Aug: the share card was /images/festival-banner.jpg — a 1751×959
// dark maroon blur with nothing in it. Pasted into Messenger it read as a
// black rectangle above the title, which is exactly the slot where a festival
// gets to make its case. This replaces it with a generated card: a real photo
// of a real festival puppet, then the name, the dates and the free-Saturday
// hook in the site's own type and colours.
//
// Generated rather than a flat file so the text stays editable in code and
// stays crisp — Satori lays it out at build time and the PNG is cached.

export const alt =
  'A giant puppet with green eyes and a red korowai towers over a Wellington street beside a tino rangatiratanga flag, above the words “Wellington Puppetry Festival, Puppets for Peace, 18–20 September 2026”.'

// 1200×630 is 1.91:1 — the ratio Facebook and Messenger render a large link
// card at, so the whole card survives with no crop.
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Brand tokens, mirrored from globals.css. Satori can't read CSS variables, so
// these are the literal values of --wpf-ink, --wpf-cream, --wpf-pink and the
// ribbon colours. Keep in step if the palette moves.
const INK = '#3b2a17'
const CREAM = '#fbf6e9'
const PINK = '#d81b7c'
const RIBBON = ['#d81b7c', '#ffce2e', '#2a7708', '#e8772e']

const asDataUri = async (path: string, mime: string) =>
  `data:${mime};base64,${await readFile(join(process.cwd(), path), 'base64')}`

export default async function Image() {
  const [photo, mark, nunitoBold, nunitoExtraBold] = await Promise.all([
    asDataUri('public/images/gallery/wpf-gallery-086.jpg', 'image/jpeg'),
    asDataUri('public/images/wpf-logo.png', 'image/png'),
    readFile(join(process.cwd(), 'assets/Nunito-Bold.ttf')),
    readFile(join(process.cwd(), 'assets/Nunito-ExtraBold.ttf')),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: CREAM,
          fontFamily: 'Nunito',
        }}
      >
        {/* Photo. The source is 1200×800; drawn at natural size and pulled up
            150px so the crop lands on the puppet's face and the flag rather
            than on its feet. */}
        <div style={{ display: 'flex', height: 390, overflow: 'hidden' }}>
          <img src={photo} width={1200} height={800} style={{ marginTop: -150 }} alt="" />
        </div>

        {/* Festival ribbon — the same four accents the site uses, standing in
            for the scalloped edge under the homepage hero (Satori has no
            clip-path, so a flat band does the same job). */}
        <div style={{ display: 'flex', height: 12 }}>
          {RIBBON.map((colour) => (
            <div key={colour} style={{ display: 'flex', flex: 1, backgroundColor: colour }} />
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 60px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: 4,
                color: PINK,
              }}
            >
              PUPPETS FOR PEACE
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 64,
                fontWeight: 800,
                color: INK,
                lineHeight: 1.05,
                marginTop: 6,
              }}
            >
              Wellington Puppetry Festival
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 27,
                fontWeight: 700,
                color: 'rgba(59, 42, 23, 0.72)',
                marginTop: 12,
              }}
            >
              18–20 September 2026 · Free family day on Saturday
            </div>
          </div>

          {/* The bird-on-a-string mark. Natural 565×646, kept to that ratio. */}
          <img src={mark} width={131} height={150} alt="" />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Nunito', data: nunitoBold, style: 'normal', weight: 700 },
        { name: 'Nunito', data: nunitoExtraBold, style: 'normal', weight: 800 },
      ],
    },
  )
}
