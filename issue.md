# Planning: Implementasi Login User dengan Session Token (Junior/Low-Cost AI Friendly)

## Tujuan

Menambahkan fitur login user dengan endpoint `POST /api/users/login`, termasuk verifikasi password, pembuatan session token (UUID), dan penyimpanan session ke tabel `sessions`.

## Ringkasan Requirement

### 1) Tabel `sessions`

- `id` integer auto increment (primary key)
- `token` varchar(255) not null (berisi UUID token untuk user yang login)
- `user_id` integer not null (foreign key ke tabel users)
- `created_at` timestamp default current_timestamp

### 2) Endpoint Login

- Method: `POST`
- Path: `/api/users/login`

Request body:

```json
{
  "email": "eko@localhost",
  "password": "rahasia"
}
```

Response success (token berhasil dibuat):

```json
{
  "data": "token_value_uuid_di_sini"
}
```

Response error (email atau password salah):

```json
{
  "error": "email atau password salah"
}
```

### 3) Struktur Folder dan File

Di dalam `src`:

- `routes`: untuk routing ElysiaJS
- `services`: untuk logic bisnis aplikasi

Format nama file:

- routes: contoh `users-route.ts` (bisa ditambah logic login di sini atau file terpisah)
- services: contoh `users-service.ts` (bisa ditambah logic login atau file `auth-service.ts`)

## Batasan Scope

- Fokus hanya login user (verifikasi password + buat session token).
- Tidak membuat logout/revoke session.
- Tidak membuat middleware/protect route.
- Tidak membuat refresh token.
- Tidak membuat JWT (hanya UUID token di database).

## Rencana Implementasi Bertahap

### Tahap 1: Persiapan Dependensi

1. Pastikan dependensi sudah tersedia:
   - `uuid` untuk generate token UUID.
   - `bcryptjs` (sudah ada dari registrasi).
   - `drizzle-orm`, `mysql2`, `elysia` (sudah ada).
2. Cek script jalan normal (`dev`, `check`).

Output tahap ini:

- Project bisa dijalankan.
- Semua package penting terpasang.

### Tahap 2: Definisi Schema Database

1. Tambahkan schema `sessions` di layer Drizzle (`src/db/schema.ts`).
2. Pastikan kolom sesuai requirement:
   - `id` autoincrement.
   - `token` varchar(255) unique (opsional tapi recommended).
   - `user_id` foreign key ke tabel `users` dengan ON DELETE CASCADE.
   - `created_at` default current timestamp.
3. Pastikan relasi `sessions -> users` terdefinisi dengan baik.

Output tahap ini:

- Schema `sessions` valid dan siap digenerate/push ke database.

### Tahap 3: Migrasi / Sinkronisasi Database

1. Generate migration (atau push schema) menggunakan Drizzle.
2. Apply ke database lokal.
3. Verifikasi tabel `sessions` benar-benar terbentuk dengan struktur dan relasi yang sesuai.

Output tahap ini:

- Tabel `sessions` sudah ada dan siap dipakai endpoint.

### Tahap 4: Implementasi Service Layer

1. Buat atau update file service untuk login (bisa `src/services/users-service.ts` atau buat `src/services/auth-service.ts` baru).
2. Buat fungsi login user dengan alur:
   - Validasi input minimum (email, password wajib ada).
   - Cari user berdasarkan email di tabel `users`.
   - Jika user tidak ditemukan, kembalikan error `email atau password salah`.
   - Bandingkan password input dengan password hash di database menggunakan bcryptjs `compare`.
   - Jika password tidak cocok, kembalikan error `email atau password salah`.
   - Generate UUID token (gunakan library `uuid`).
   - Simpan token dan user_id ke tabel `sessions`.
   - Return token yang baru dibuat.
3. Pastikan error message tidak membedakan antara "email tidak ada" vs "password salah" (selalu `email atau password salah`).

Output tahap ini:

- Service login siap dipanggil dari route.

### Tahap 5: Implementasi Route Layer

1. Buat atau update file `src/routes/users-route.ts` untuk menambah endpoint login.
2. Daftarkan endpoint `POST /api/users/login`.
3. Forward request body ke service login.
4. Return response sesuai kontrak:
   - sukses: `{ "data": "token_uuid_value" }`
   - error: `{ "error": "email atau password salah" }`
5. Handle error dari service dan return response yang sesuai.

Output tahap ini:

- Endpoint login aktif dan bisa diakses.

### Tahap 6: Validasi Manual Minimum

1. Test login dengan email dan password yang valid -> harus sukses dan return token UUID.
2. Test login dengan email yang tidak ada -> harus error dengan message yang sama.
3. Test login dengan password salah -> harus error dengan message yang sama.
4. Cek data di tabel `sessions`:
   - row tersimpan dengan token UUID.
   - user_id sesuai dengan user yang login.

Output tahap ini:

- Alur login tervalidasi end-to-end.

## Checklist Eksekusi (Untuk Junior/AI Murah)

- [ ] Install `uuid`.
- [ ] Buat/rapikan schema `sessions` dengan foreign key ke users.
- [ ] Jalankan migrate/generate/push schema Drizzle.
- [ ] Buat fungsi login di service (validate email, compare password bcrypt, generate UUID, save session).
- [ ] Buat/update route POST /api/users/login.
- [ ] Pastikan response body sesuai requirement.
- [ ] Uji login sukses, email tidak ada, password salah.
- [ ] Verifikasi token tersimpan di database sebagai UUID.

## Acceptance Criteria

- Endpoint `POST /api/users/login` tersedia.
- Request body sesuai contoh dapat diproses.
- Response sukses tepat: `{ "data": "uuid_token_value" }`.
- Response error tepat: `{ "error": "email atau password salah" }` (untuk email tidak ada dan password salah).
- Token di database adalah UUID yang valid.
- Session record tersimpan dengan user_id yang sesuai.
- Password tidak pernah dibanding secara plain text (selalu gunakan bcryptjs compare).
- Struktur folder mengikuti ketentuan `routes` dan `services`.

## Catatan Implementasi untuk Eksekutor

- Jangan over-engineering.
- Prioritaskan alur sederhana, jelas, dan mudah dibaca.
- Jangan ubah kontrak API response yang sudah ditentukan.
- Gunakan bcryptjs `compare()` function untuk membanding password dengan hash.
- Gunakan library `uuid` untuk generate UUID token (contoh: `import { v4 as uuidv4 }` atau sesuai dokumentasi library).
- Foreign key dan relasi bisa disiapkan di Drizzle schema untuk validasi data.
