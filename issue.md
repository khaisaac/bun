# Planning: Basic Scaffolding Bun + Elysia + Drizzle + MySQL

## Tujuan

Menyiapkan fondasi project backend yang siap jalan dengan Bun, ElysiaJS, Drizzle ORM, dan MySQL.

## Batasan Scope

- Hanya scaffolding dasar project.
- Tidak membuat CRUD.
- Tidak membuat autentikasi.
- Tidak membuat fitur bisnis/domain.

## High-Level Steps

1. Inisialisasi project Bun di folder ini.
2. Install dependency utama: ElysiaJS, Drizzle ORM, MySQL driver.
3. Buat struktur folder minimum (app, db, config).
4. Tambahkan server Elysia sederhana + 1 endpoint health check.
5. Tambahkan setup koneksi database dengan Drizzle.
6. Tambahkan konfigurasi environment dan contoh file env.
7. Validasi server dapat running dengan fondasi siap dikembangkan.

## Basic Scaffolding (Contoh)

### Struktur Folder

- src/
- src/app/
- src/db/
- src/config/

### File Dasar

- src/index.ts: boot server Elysia.
- src/app/server.ts: inisialisasi app dan route health check.
- src/config/env.ts: baca environment variable.
- src/db/client.ts: inisialisasi koneksi MySQL + Drizzle.
- .env.example: template konfigurasi database.

### Endpoint Minimum

- GET /health -> response sederhana bahwa service berjalan.

## Deliverable

- Project Bun berhasil di-bootstrap.
- Dependency inti terpasang.
- Server Elysia baseline berjalan.
- Drizzle + MySQL koneksi baseline tersedia.
- .env.example tersedia untuk setup awal.

## Acceptance Criteria

- Aplikasi dapat dijalankan di local environment.
- Endpoint health check merespons sukses.
- Konfigurasi database terbaca dari env.
- Tidak ada implementasi CRUD.
- Tidak ada implementasi autentikasi.
