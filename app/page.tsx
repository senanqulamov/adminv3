import { AdminLayout } from "@/components/layout/admin-layout"
import { UsersPage } from "@/components/pages/users-page"

export default function Home() {
  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  )
}
