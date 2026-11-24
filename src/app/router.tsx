import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@/features/landing/pages/landing-page'
import { NotFoundPage } from '@/features/landing/pages/not-found-page'
import { AdminGuard } from '@/features/admin/auth/admin-guard'
import {
  AdminIndexPage,
  AdminOnly,
} from '@/features/admin/auth/admin-route-guards'
import { AdminShell } from '@/features/admin/layout/admin-shell'
import {
  ModifiersPageSkeleton,
  OrdersPageSkeleton,
  ReportsPageSkeleton,
  TablePageSkeleton,
  TablesPageSkeleton,
} from '@/features/admin/components/admin-page-skeletons'
import { SettingsLoading } from '@/features/admin/components/settings-loading'
import {
  AdminLoginSkeleton,
  CustomerMenuSkeleton,
  DisplaySkeleton,
} from '@/components/route-skeletons'

const CustomerMenuPage = lazy(() =>
  import('@/features/customer/pages/customer-menu-page').then((module) => ({
    default: module.CustomerMenuPage,
  })),
)
const DisplayPage = lazy(() =>
  import('@/features/display/pages/display-page').then((module) => ({
    default: module.DisplayPage,
  })),
)
const AdminLoginPage = lazy(() =>
  import('@/features/admin/auth/admin-login-page').then((module) => ({
    default: module.AdminLoginPage,
  })),
)
const CategoriesPage = lazy(() =>
  import('@/features/admin/pages/categories-page').then((module) => ({
    default: module.CategoriesPage,
  })),
)
const MenuPage = lazy(() =>
  import('@/features/admin/pages/menu-page').then((module) => ({
    default: module.MenuPage,
  })),
)
const ModifiersPage = lazy(() =>
  import('@/features/admin/pages/modifiers-page').then((module) => ({
    default: module.ModifiersPage,
  })),
)
const OrdersPage = lazy(() =>
  import('@/features/admin/pages/orders-page').then((module) => ({
    default: module.OrdersPage,
  })),
)
const ReportsPage = lazy(() =>
  import('@/features/admin/pages/reports-page').then((module) => ({
    default: module.ReportsPage,
  })),
)
const SettingsPage = lazy(() =>
  import('@/features/admin/pages/settings-page').then((module) => ({
    default: module.SettingsPage,
  })),
)
const StaffPage = lazy(() =>
  import('@/features/admin/pages/staff-page').then((module) => ({
    default: module.StaffPage,
  })),
)
const TablesPage = lazy(() =>
  import('@/features/admin/pages/tables-page').then((module) => ({
    default: module.TablesPage,
  })),
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/t/:code',
    element: (
      <Suspense fallback={<CustomerMenuSkeleton />}>
        <CustomerMenuPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={<AdminLoginSkeleton />}>
        <AdminLoginPage />
      </Suspense>
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
              <AdminOnly>
                <Suspense
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
                </Suspense>
              </AdminOnly>
            ),
          },
          {
            path: 'catalog/menu',
            element: (
              <AdminOnly>
                <Suspense
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
                </Suspense>
              </AdminOnly>
            ),
          },
          {
            path: 'catalog/modifiers',
            element: (
              <AdminOnly>
                <Suspense fallback={<ModifiersPageSkeleton />}>
                  <ModifiersPage />
                </Suspense>
              </AdminOnly>
            ),
          },
          {
            path: 'tables',
            element: (
              <AdminOnly>
                <Suspense fallback={<TablesPageSkeleton />}>
                  <TablesPage />
                </Suspense>
              </AdminOnly>
            ),
          },
          {
            path: 'staff',
            element: (
              <AdminOnly>
                <Suspense
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
                </Suspense>
              </AdminOnly>
            ),
          },
          {
            path: 'orders',
            element: (
              <Suspense fallback={<OrdersPageSkeleton />}>
                <OrdersPage />
              </Suspense>
            ),
          },
          {
            path: 'reports',
            element: (
              <AdminOnly>
                <Suspense fallback={<ReportsPageSkeleton />}>
                  <ReportsPage />
                </Suspense>
              </AdminOnly>
            ),
          },
          {
            path: 'settings',
            element: (
              <AdminOnly>
                <Suspense fallback={<SettingsLoading />}>
                  <SettingsPage />
                </Suspense>
              </AdminOnly>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '/display',
    element: (
      <Suspense fallback={<DisplaySkeleton />}>
        <DisplayPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
