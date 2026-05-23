import { getSiteContent } from '../actions'
import AdminEditor from './AdminEditor'

export default async function AdminPage() {
  const content = await getSiteContent()
  return <AdminEditor initialContent={content} />
}
