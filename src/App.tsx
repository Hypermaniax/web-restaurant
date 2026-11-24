import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AppProviders } from '@/app/providers'
import { router } from '@/app/router'
import { ErrorBoundary } from '@/components/error-boundary'
import { RouteLoading } from '@/components/route-loading'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <Suspense fallback={<RouteLoading />}>
          <RouterProvider router={router} />
        </Suspense>
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
