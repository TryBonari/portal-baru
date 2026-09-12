# AGENTS.md

## Project

Project ini adalah portal sekolah berbasis web untuk SMA/SMK.

Tujuan utama:

* Admin mengelola data sekolah dan data akademik.
* User/siswa dapat melihat data akademik dan administrasi miliknya.
* Source code dirancang agar dapat digunakan kembali untuk sekolah lain dengan database dan konfigurasi sekolah yang berbeda.

Untuk detail requirement produk, selalu gunakan `PRD.md` sebagai sumber utama.

---

## Product Specification

Sebelum mengimplementasikan fitur yang berkaitan dengan requirement produk:

1. Baca `PRD.md`.
2. Identifikasi requirement yang relevan.
3. Jangan membuat asumsi baru jika requirement belum jelas.
4. Jika keputusan memengaruhi database, authentication, authorization, atau business logic, tandai sebagai `OPEN QUESTION` dan tanyakan kepada developer.

Jangan menambahkan fitur di luar MVP tanpa persetujuan.

---

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* PostgreSQL
* Prisma ORM

Gunakan teknologi yang sudah ada di project sebelum menambahkan dependency baru.

Jangan mengganti framework, ORM, atau database tanpa alasan yang jelas dan persetujuan developer.

---

## Architecture

Model deployment MVP:

* 1 deployment = 1 sekolah.
* 1 PostgreSQL database = 1 sekolah.
* 1 deployment hanya memiliki 1 admin.
* Tidak menggunakan multi-tenant architecture.
* Tidak menggunakan `schoolId` pada setiap entity.
* Source code harus tetap reusable untuk deployment sekolah lain.

Authentication:

* Admin menggunakan akun admin.
* User menggunakan `accessCode` + password.
* `accessCode` berfungsi sebagai username.
* 1 User = 1 Student.
* User hanya dapat melihat data miliknya sendiri.

---

## Development Rules

### General

* Gunakan TypeScript.
* Gunakan komponen reusable.
* Hindari duplicate logic.
* Jangan membuat file atau abstraction baru jika solusi dapat menggunakan struktur yang sudah ada.
* Jangan mengubah bagian project yang tidak berhubungan dengan task.
* Jangan menghapus fitur yang sudah berjalan tanpa alasan.
* Pertahankan struktur project yang sudah ada kecuali ada alasan teknis yang kuat.

### Database

* Gunakan Prisma untuk akses database.
* Jangan melakukan query database secara langsung jika dapat menggunakan Prisma.
* Jangan mengubah schema Prisma sembarangan.
* Sebelum mengubah schema, periksa relationship dan model yang sudah ada.
* Hindari perubahan database yang dapat menyebabkan kehilangan data.
* Pastikan constraint database digunakan untuk menjaga integritas data.

### Authentication & Security

* Password wajib disimpan dalam bentuk hash.
* Jangan pernah menyimpan password plaintext.
* Jangan menaruh secret atau credential di source code.
* Gunakan environment variables untuk secret.
* Authentication harus divalidasi di server.
* Authorization harus divalidasi di server.
* Jangan mengandalkan pengecekan frontend untuk keamanan.
* User tidak boleh mengakses data user lain hanya dengan memanipulasi URL atau request.
* User yang tidak aktif tidak boleh login.
* Access code harus unique.

### Validation

Validasi input harus dilakukan di server.

Validasi minimal harus mencakup:

* required fields
* format data
* range angka
* duplicate data
* relationship antar entity
* authorization

Jangan hanya mengandalkan validasi form frontend.

---

## UI/UX

Design direction:

* Professional.
* Sederhana.
* Netral.
* Monochrome dengan aksen dark green.
* Hindari tampilan yang terlalu mencolok atau terlihat seperti template AI.
* Responsive untuk mobile, tablet, dan desktop.

Perhatikan:

* Tidak ada horizontal overflow yang tidak diperlukan.
* Table harus tetap usable pada layar kecil.
* Form harus nyaman digunakan pada mobile.
* Gunakan spacing dan typography yang konsisten.
* Gunakan existing component sebelum membuat component baru.

---

## Admin

Admin memiliki akses penuh terhadap data sekolah sesuai dengan requirement di `PRD.md`.

Sebelum membuat halaman admin baru:

1. Periksa struktur `app/admin`.
2. Periksa layout admin yang sudah ada.
3. Gunakan komponen dan pattern yang sudah tersedia.
4. Jangan membuat layout berbeda tanpa alasan.

---

## User

User hanya boleh melihat data miliknya sendiri.

Contoh:

* Profil sendiri.
* Kelas sendiri.
* Jadwal sendiri.
* Absensi sendiri.
* Nilai sendiri.
* SPP sendiri.

Jangan memberikan akses CRUD kepada user kecuali secara eksplisit ditentukan oleh `PRD.md`.

---

## Coding Workflow

Sebelum mengubah kode:

1. Baca `AGENTS.md`.
2. Baca bagian relevan dari `PRD.md`.
3. Periksa struktur folder.
4. Periksa file yang berkaitan dengan task.
5. Periksa schema Prisma jika task berkaitan dengan database.
6. Identifikasi perubahan minimum yang diperlukan.

Saat mengimplementasikan:

1. Gunakan pattern yang sudah ada.
2. Hindari perubahan yang tidak diperlukan.
3. Jangan membuat fitur tambahan tanpa diminta.
4. Jangan mengubah business logic yang tidak berkaitan dengan task.

Setelah implementasi:

1. Periksa TypeScript error.
2. Jalankan lint jika tersedia.
3. Jalankan test jika tersedia.
4. Periksa error runtime yang relevan.
5. Pastikan perubahan tidak merusak fitur sebelumnya.

---

## Database Change Workflow

Jika task membutuhkan perubahan database:

1. Baca model Prisma yang terkait.
2. Periksa relationship yang sudah ada.
3. Pastikan perubahan sesuai dengan `PRD.md`.
4. Ubah `schema.prisma`.
5. Buat migration yang sesuai.
6. Jalankan Prisma generate jika diperlukan.
7. Periksa error TypeScript.
8. Jangan menghapus data production secara sembarangan.

Jika requirement database belum jelas, jangan membuat keputusan sendiri.

---

## Requirement Priority

Urutan sumber kebenaran:

1. Explicit instruction dari developer pada task saat ini.
2. `PRD.md`.
3. `AGENTS.md`.
4. Existing implementation.

Jika terdapat konflik, ikuti sumber dengan prioritas lebih tinggi dan jelaskan konflik tersebut.

---

## Handling Ambiguity

Jika requirement tidak jelas:

* Jangan mengarang business rule.
* Jangan membuat keputusan yang mengubah database tanpa persetujuan.
* Jangan menambahkan fitur hanya karena dianggap "lebih bagus".
* Identifikasi bagian yang ambigu.
* Tanyakan keputusan kepada developer.

Contoh:

`OPEN QUESTION: Apakah finalScore nilai dihitung otomatis atau diinput manual?`

Jangan memilih salah satu sebelum keputusan ditentukan.

---

## Important Constraints

MVP tidak mencakup:

* Multi-school dalam satu database.
* Multi-admin.
* Parent account.
* Teacher account.
* Payment gateway.
* Online payment.
* Chat.
* LMS.
* Online exam.
* PPDB.
* Native mobile application.
* Face recognition.
* GPS attendance.
* WhatsApp notification.

Jangan mengimplementasikan fitur tersebut kecuali developer secara eksplisit memintanya.

---

## Agent Behavior

AI agent harus:

* Memahami project sebelum mengubah kode.
* Membaca requirement yang relevan.
* Memprioritaskan perubahan kecil dan aman.
* Memanfaatkan kode yang sudah ada.
* Tidak melakukan refactoring besar tanpa alasan.
* Tidak membuat asumsi business logic.
* Menjelaskan perubahan penting setelah implementasi.
* Menyebutkan file yang diubah.
* Menyebutkan validasi yang telah dilakukan.
* Jika terdapat error yang tidak dapat diselesaikan, jelaskan penyebab dan bagian yang masih bermasalah.

Jangan mengklaim task selesai jika implementasi belum benar-benar diverifikasi.
