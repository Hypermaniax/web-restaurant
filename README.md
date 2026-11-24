# Web — Rembuk

React web untuk customer QR, admin back-office, dan layar antrian `/display`.

## Setup

```bash
cd apps/web
pnpm install
cp .env.example .env
```

## Menjalankan

```bash
pnpm dev
```

Web berjalan di `http://localhost:5173`. Backend harus berjalan di
`http://localhost:3000` dan sudah mengizinkan origin web lewat `CORS_ORIGINS`.

## Verifikasi

```bash
pnpm lint
pnpm test
pnpm build
```

## Struktur test

- `src/test/unit/` — test logika, hook, store, API client, dan utilitas.
- `src/test/components/` — test komponen dan halaman.
- `src/test/setup.ts` — setup global Vitest.

## Route

| Route          | Keterangan           |
| -------------- | -------------------- |
| `/`            | Landing              |
| `/t/:code`     | Web customer QR      |
| `/admin/login` | Login staff          |
| `/admin/*`     | Admin back-office    |
| `/display`     | Layar antrian publik |

## Auth

Web admin memakai access token di memori dan refresh token httpOnly cookie.
Jangan menyimpan token staff di `localStorage`. Flutter tetap memakai body
response login dan endpoint refresh.

## Task

Ikuti [`docs/tasks/web/`](../../docs/tasks/web/README.md).
