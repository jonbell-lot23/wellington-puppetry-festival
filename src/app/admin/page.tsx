import { getPageContent, getPageHistory, pagesTableExists } from '../actions'
import { PAGES, getPageDef } from '@/lib/pages'
import AdminEditor from './AdminEditor'

const MIGRATION_SQL = `create table if not exists pages (
  slug text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists page_history (
  id bigint generated always as identity primary key,
  slug text not null,
  data jsonb not null,
  saved_at timestamptz not null default now()
);`

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const slug = getPageDef(page ?? '') ? page! : PAGES[0].slug
  const def = getPageDef(slug)!

  const [content, versions, tableReady] = await Promise.all([
    getPageContent(slug),
    getPageHistory(slug),
    pagesTableExists(),
  ])

  return (
    <AdminEditor
      pages={PAGES.map((p) => ({ slug: p.slug, title: p.title }))}
      def={def}
      initialContent={content}
      initialVersions={versions}
      migrationSQL={tableReady ? null : MIGRATION_SQL}
    />
  )
}
