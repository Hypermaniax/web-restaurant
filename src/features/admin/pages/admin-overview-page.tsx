import { useDashboard } from '../api/admin-api'
import { useAuthStore } from '@/lib/auth/auth-store'
import { OverviewDisplayCard } from '../components/overview-display-card'
import { OverviewError, OverviewLoading } from '../components/overview-feedback'
import { OverviewHeader } from '../components/overview-header'
import { OverviewLinks } from '../components/overview-links'
import { OverviewShortcuts } from '../components/overview-shortcuts'
import { OverviewStats } from '../components/overview-stats'
import { getErrorMessage } from '../lib/errors'

export function AdminOverviewPage() {
  const user = useAuthStore((state) => state.user)
  const dashboard = useDashboard()

  return (
    <div className="flex flex-col gap-6">
      <OverviewHeader
        userName={user?.name}
        businessDate={dashboard.data?.businessDate}
      />

      {dashboard.isLoading ? (
        <OverviewLoading />
      ) : dashboard.isError ? (
        <OverviewError
          message={getErrorMessage(dashboard.error)}
          onRetry={() => void dashboard.refetch()}
        />
      ) : dashboard.data ? (
        <OverviewStats data={dashboard.data} />
      ) : null}

      <OverviewLinks />
      <OverviewDisplayCard />
      <OverviewShortcuts />
    </div>
  )
}
