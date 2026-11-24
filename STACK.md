# Rembuk Web — Tech Stack

Ringkasan tools dan library yang dipakai web Rembuk. Web berupa **React SPA** untuk tiga permukaan:

- Customer QR: `/t/:code`
- Admin back-office: `/admin/*`
- Layar antrian publik: `/display`

## Framework & Build

| Tool                          |  Versi | Fungsi                       |
| ----------------------------- | -----: | ---------------------------- |
| React                         | 19.3.1 | Library UI                   |
| React DOM                     | 19.3.1 | Renderer browser             |
| TypeScript                    | ~7.0.2 | Bahasa dan type checking     |
| Vite                          |  8.3.6 | Dev server dan build         |
| `@vitejs/plugin-react`        |  6.1.2 | Integrasi React dengan Vite  |
| pnpm                          |      — | Package manager              |
| Oxlint                        | 1.90.0 | Lint                         |
| Prettier                      | 3.10.1 | Formatter                    |
| `prettier-plugin-tailwindcss` |  0.8.1 | Urut class Tailwind otomatis |

## UI & Styling

| Library                                    |    Versi | Fungsi                                    |
| ------------------------------------------ | -------: | ----------------------------------------- |
| Tailwind CSS                               |    4.3.5 | Styling utama                             |
| `@tailwindcss/vite`                        |    4.3.5 | Plugin Tailwind untuk Vite                |
| shadcn/ui                                  | new-york | Komponen UI yang dimiliki repo            |
| Radix UI                                   |    1.8.1 | Primitive aksesibel untuk komponen shadcn |
| `@radix-ui/react-slot`                     |    1.5.0 | Komposisi komponen                        |
| `class-variance-authority`                 |    0.7.1 | Variant komponen                          |
| `clsx`                                     |    2.1.1 | Penggabung className                      |
| `tailwind-merge`                           |    3.7.1 | Resolusi konflik className                |
| `tw-animate-css`                           |    1.4.0 | Animasi Tailwind                          |
| `lucide-react`                             |   1.77.0 | Ikon                                      |
| `sonner`                                   |    2.0.8 | Toast notification                        |
| `@fontsource-variable/inter`               |    5.3.0 | Font body                                 |
| `@fontsource-variable/bricolage-grotesque` |    5.3.0 | Font display                              |

## Data, State & Form

| Library                 |   Versi | Fungsi                               |
| ----------------------- | ------: | ------------------------------------ |
| Axios                   |  1.21.1 | HTTP client                          |
| `@tanstack/react-query` | 5.108.2 | Server state, cache, refetch         |
| `zustand`               |   5.1.0 | Client state auth dan cart           |
| `react-router-dom`      |  7.18.6 | Routing SPA                          |
| `react-hook-form`       |  7.92.0 | Form                                 |
| `zod`                   |   4.6.7 | Validasi schema                      |
| `@hookform/resolvers`   |   7.0.8 | Integrasi Zod dengan React Hook Form |

## Realtime & QR

| Library            | Versi | Fungsi                            |
| ------------------ | ----: | --------------------------------- |
| `socket.io-client` | 4.8.4 | Realtime order, meja, dan display |
| `qrcode.react`     | 4.2.0 | QR code pembayaran dan meja       |

## Testing & Quality

| Tool                          |   Versi | Fungsi                    |
| ----------------------------- | ------: | ------------------------- |
| Vitest                        |   5.1.1 | Unit dan component test   |
| jsdom                         |  31.0.1 | Environment DOM           |
| `@testing-library/react`      |  16.3.3 | Render dan query komponen |
| `@testing-library/user-event` | 14.6.13 | Simulasi interaksi user   |
| `@testing-library/jest-dom`   |   8.0.0 | Matcher DOM               |

## Perintah

```bash
cd apps/web

pnpm dev
pnpm build
pnpm lint
pnpm test
pnpm format
```

## Keputusan Teknis

- HTTP client memakai Axios dengan instance di `src/lib/api/client.ts`.
- Refresh token otomatis dilakukan saat request mendapat `401`, sekali per request.
- Access token admin disimpan di memori dan refresh token di cookie `httpOnly`.
- Server state dikelola TanStack Query; client state memakai Zustand.
- shadcn/ui dipakai sebagai kode komponen milik repo, bukan dependency runtime.
- Tidak memakai Next.js, Redux, atau library chart khusus.
- Laporan dan export memakai tabel serta unduhan file.

## Sumber Konfigurasi

- `apps/web/package.json` — dependency dan script
- `apps/web/vite.config.ts` — konfigurasi Vite dan alias `@`
- `apps/web/vitest.config.ts` — konfigurasi test
- `apps/web/components.json` — konfigurasi shadcn/ui
- `apps/web/src/index.css` — token warna, font, dan Tailwind
- `apps/web/src/app/providers.tsx` — QueryClient dan Toaster
- `apps/web/src/app/router.tsx` — route web
- `apps/web/src/lib/env.ts` — environment dan URL API
- `apps/web/src/lib/api/client.ts` — Axios client, auth, dan refresh token
- `apps/web/src/lib/download.ts` — unduhan file via Axios
