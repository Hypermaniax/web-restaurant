import { cn } from '@/lib/utils'

export function DisplayStaleWarning() {
  return (
    <p className="border-chili/35 bg-chili/10 text-rice mt-3 shrink-0 rounded-xl border px-4 py-2 text-sm font-medium">
      Koneksi bermasalah. Layar menampilkan data terakhir dan terus mencoba
      memperbarui.
    </p>
  )
}

export function DisplayLoading() {
  return (
    <div className="mt-4 grid flex-1 gap-3 sm:gap-4 lg:min-h-0 lg:grid-cols-2">
      <LoadingColumn />
      <LoadingColumn accent />
    </div>
  )
}

interface DisplayErrorProps {
  onRetry: () => void
}

export function DisplayError({ onRetry }: DisplayErrorProps) {
  return (
    <div className="border-rice/12 bg-rice/[0.035] mt-4 flex flex-1 flex-col items-center justify-center rounded-[1.75rem] border px-6 py-12 text-center">
      <h2 className="font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
        Antrian belum bisa dimuat
      </h2>
      <p className="text-rice/65 mt-3 max-w-xl text-base leading-7">
        Layar akan mencoba lagi otomatis. Periksa koneksi jaringan bila tampilan
        ini tidak berubah.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="bg-marigold text-pine focus-visible:ring-rice/70 mt-6 rounded-full px-6 py-3 text-sm font-bold transition hover:bg-[#ffc25f] focus-visible:ring-[3px] focus-visible:outline-none"
      >
        Coba lagi
      </button>
    </div>
  )
}

function LoadingColumn({ accent = false }: { accent?: boolean }) {
  return (
    <div
      className={cn(
        'flex min-h-56 flex-col rounded-[1.75rem] border p-4 sm:p-5 xl:p-6',
        accent
          ? 'border-marigold/30 bg-marigold/[0.06]'
          : 'border-rice/12 bg-rice/[0.035]',
      )}
    >
      <div className="bg-rice/10 h-8 w-48 rounded-lg motion-safe:animate-pulse" />
      <div className="bg-rice/10 mt-3 h-4 w-64 max-w-full rounded motion-safe:animate-pulse" />
      <div className="mt-6 flex flex-col gap-2.5">
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className="bg-rice/[0.06] h-20 rounded-2xl motion-safe:animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
