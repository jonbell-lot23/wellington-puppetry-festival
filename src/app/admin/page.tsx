import { getSiteContent, getContentHistory, historyTableExists } from '../actions'
import AdminEditor from './AdminEditor'

const MIGRATION_SQL = `create table if not exists site_content_history (
  id bigint generated always as identity primary key,
  data jsonb not null,
  saved_at timestamptz not null default now()
);`

export default async function AdminPage() {
  const [content, versions, tableReady] = await Promise.all([
    getSiteContent(),
    getContentHistory(),
    historyTableExists(),
  ])

  return (
    <AdminEditor
      initialContent={content}
      initialVersions={versions}
      migrationSQL={tableReady ? null : MIGRATION_SQL}
    />
  )
}
