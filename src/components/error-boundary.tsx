import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error', error, info)
  }

  render() {
    if (!this.state.error) {
      return this.props.children
    }

    return (
      <main className="bg-rice text-pine grid min-h-svh place-items-center px-6">
        <section className="border-border bg-card shadow-pine/5 w-full max-w-md rounded-3xl border p-8 shadow-xl">
          <p className="font-display text-chili text-sm font-semibold tracking-[0.18em] uppercase">
            Terjadi kesalahan
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-tight">
            Halaman gagal dimuat
          </h1>
          <p className="text-muted-foreground mt-3 text-sm leading-6">
            Coba muat ulang halaman. Jika masih gagal, hubungi admin restoran.
          </p>
          <Button
            className="mt-6 w-full"
            variant="accent"
            onClick={() => window.location.reload()}
          >
            Muat ulang
          </Button>
        </section>
      </main>
    )
  }
}
