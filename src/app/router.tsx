import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@/features/landing/pages/landing-page'
import { NotFoundPage } from '@/features/landing/pages/not-found-page'
import { AdminGuard } from '@/features/admin/auth/admin-guard'
import {
  AdminIndexPage,
  AdminOnly,
} from '@/features/admin/auth/admin-route-guards'
import { AdminShell } from '@/features/admin/layout/admin-shell'
import { ModifiersPageSkeleton } from '@/features/admin/components/skeletons/modifiers-page-skeleton'
import { OrdersPageSkeleton } from '@/features/admin/components/skeletons/orders-page-skeleton'
import { ReportsPageSkeleton } from '@/features/admin/components/skeletons/reports-page-skeleton'
import { TablePageSkeleton } from '@/features/admin/components/skeletons/table-page-skeleton'
import { TablesPageSkeleton } from '@/features/admin/components/skeletons/tables-page-skeleton'
import { SettingsLoading } from '@/features/admin/components/settings-loading'
import {
  AdminLoginSkeleton,
  CustomerMenuSkeleton,
  DisplaySkeleton,
} from '@/components/route-skeletons'

function lazyPage<TModule extends Record<string, unknown>>(
  load: () => Promise<TModule>,
  exportName: keyof TModule,
) {
  return lazy(async () => {
    const module = await load()
    return { default: module[exportName] as ComponentType }
  })
}

interface SuspendedPageProps {
  fallback: ReactNode
  adminOnly?: boolean
  children: ReactNode
}

function SuspendedPage({
  fallback,
  adminOnly = false,
  children,
}: SuspendedPageProps) {
  const content = <Suspense fallback={fallback}>{children}</Suspense>
  return adminOnly ? <AdminOnly>{content}</AdminOnly> : content
}

const CustomerMenuPage = lazyPage(
  () => import('@/features/customer/pages/customer-menu-page'),
  'CustomerMenuPage',
)
const DisplayPage = lazyPage(
  () => import('@/features/display/pages/display-page'),
  'DisplayPage',
)
const AdminLoginPage = lazyPage(
  () => import('@/features/admin/auth/admin-login-page'),
  'AdminLoginPage',
)
const CategoriesPage = lazyPage(
  () => import('@/features/admin/pages/categories-page'),
  'CategoriesPage',
)
const MenuPage = lazyPage(
  () => import('@/features/admin/pages/menu-page'),
  'MenuPage',
)
const ModifiersPage = lazyPage(
  () => import('@/features/admin/pages/modifiers-page'),
  'ModifiersPage',
)
const OrdersPage = lazyPage(
  () => import('@/features/admin/pages/orders-page'),
  'OrdersPage',
)
const ReportsPage = lazyPage(
  () => import('@/features/admin/pages/reports-page'),
  'ReportsPage',
)
const SettingsPage = lazyPage(
  () => import('@/features/admin/pages/settings-page'),
  'SettingsPage',
)
const StaffPage = lazyPage(
  () => import('@/features/admin/pages/staff-page'),
  'StaffPage',
)
const TablesPage = lazyPage(
  () => import('@/features/admin/pages/tables-page'),
  'TablesPage',
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/t/:code',
    element: (
      <SuspendedPage fallback={<CustomerMenuSkeleton />}>
        <CustomerMenuPage />
      </SuspendedPage>
    ),
  },
  {
    path: '/admin/login',
    element: (
      <SuspendedPage fallback={<AdminLoginSkeleton />}>
        <AdminLoginPage />
      </SuspendedPage>
    ),
  },
  {
    path: '/admin',
    element: <AdminGuard />,
    children: [
      {
        element: <AdminShell />,
        children: [
          {
            index: true,
            element: <AdminIndexPage />,
          },
          {
            path: 'catalog/categories',
            element: (
              <SuspendedPage
                adminOnly
                fallback={
                  <TablePageSkeleton
                    eyebrow="Katalog"
                    title="Kategori menu"
                    description="Atur urutan dan status kategori. Kategori nonaktif tidak tampil di menu customer."
                    actionLabel="Tambah kategori"
                    columns={['Nama', 'Urutan', 'Status', 'Aksi']}
                    rows={5}
                  />
                }
              >
                <CategoriesPage />
              </SuspendedPage>
            ),
          },
          {
            path: 'catalog/menu',
            element: (
              <SuspendedPage
                adminOnly
                fallback={
                  <TablePageSkeleton
                    eyebrow="Katalog"
                    title="Menu"
                    description="Kelola item, harga, foto, modifier, dan ketersediaan menu."
                    actionLabel="Tambah menu"
                    columns={[
                      'Menu',
                      'Kategori',
                      'Harga',
                      'Tersedia',
                      'Status',
                      'Aksi',
                    ]}
                    leading
                  />
                }
              >
                <MenuPage />
              </SuspendedPage>
            ),
          },
          {
            path: 'catalog/modifiers',
            element: (
              <SuspendedPage adminOnly fallback={<ModifiersPageSkeleton />}>
                <ModifiersPage />
              </SuspendedPage>
            ),
          },
          {
            path: 'tables',
            element: (
              <SuspendedPage adminOnly fallback={<TablesPageSkeleton />}>
                <TablesPage />
              </SuspendedPage>
            ),
          },
          {
            path: 'staff',
            element: (
              <SuspendedPage
                adminOnly
                fallback={
                  <TablePageSkeleton
                    eyebrow="Restoran"
                    title="Staff"
                    description="Kelola akses ADMIN, CASHIER, dan KITCHEN. API tetap menjadi sumber enforcement."
                    actionLabel="Tambah staff"
                    columns={[
                      'Staff',
                      'Role',
                      'Status',
                      'Login terakhir',
                      'Aksi',
                    ]}
                    rows={5}
                    leading
                  />
                }
              >
                <StaffPage />
              </SuspendedPage>
            ),
          },
          {
            path: 'orders',
            element: (
              <SuspendedPage fallback={<OrdersPageSkeleton />}>
                <OrdersPage />
              </SuspendedPage>
            ),
          },
          {
            path: 'reports',
            element: (
              <SuspendedPage adminOnly fallback={<ReportsPageSkeleton />}>
                <ReportsPage />
              </SuspendedPage>
            ),
          },
          {
            path: 'settings',
            element: (
              <SuspendedPage adminOnly fallback={<SettingsLoading />}>
                <SettingsPage />
              </SuspendedPage>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/display',
    element: (
      <SuspendedPage fallback={<DisplaySkeleton />}>
        <DisplayPage />
      </SuspendedPage>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
