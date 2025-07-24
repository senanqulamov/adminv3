import { AdminLayout } from "@/components/layout/admin-layout"
import { OrdersPage } from "@/components/pages/orders-page"

export default function Orders() {
  return (
    <AdminLayout>
      <OrdersPage />
    </AdminLayout>
  )
}
