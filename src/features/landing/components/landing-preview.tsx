export function LandingPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="bg-marigold/70 absolute -top-5 -right-3 h-24 w-24 rotate-6 rounded-3xl blur-sm" />
      <div className="border-pine/10 shadow-pine/10 relative rounded-[2rem] border bg-white/80 p-4 shadow-2xl backdrop-blur">
        <div className="bg-pine text-rice rounded-[1.5rem] p-5">
          <div className="text-rice/60 flex items-center justify-between text-xs font-semibold tracking-[0.16em] uppercase">
            <span>Pesan dari meja</span>
            <span>QR</span>
          </div>
          <p className="font-display mt-10 text-4xl leading-tight font-bold tracking-[-0.05em]">
            Scan. Pilih.
            <br />
            Bayar.
          </p>
          <p className="text-rice/70 mt-3 text-sm">
            Satu alur dari meja ke dapur, tanpa membuat akun.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-2">
            {['QR meja', 'Bayar', 'Antri'].map((step, index) => (
              <div
                key={step}
                className="bg-rice/10 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <span className="text-rice/50 block text-[10px]">
                  0{index + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="border-pine/10 bg-rice rounded-2xl border p-4">
            <p className="text-pine/50 text-xs font-semibold tracking-[0.12em] uppercase">
              Akses
            </p>
            <p className="font-display mt-2 text-xl font-bold">Tanpa login</p>
          </div>
          <div className="border-pine/10 bg-mint rounded-2xl border p-4">
            <p className="text-pine/50 text-xs font-semibold tracking-[0.12em] uppercase">
              Update
            </p>
            <p className="font-display mt-2 text-xl font-bold">Realtime</p>
          </div>
        </div>
      </div>
    </div>
  )
}
