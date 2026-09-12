# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Portal Sekolah SMA/SMK

**Versi:** 1.0
**Status:** MVP Definition
**Platform:** Web Responsive
**Target:** SMA / SMK
**Model Deployment:** 1 sekolah per deployment
**Tech Stack:** Next.js, TypeScript, Tailwind CSS, PostgreSQL, Prisma

---

# 1. Product Overview

Portal Sekolah SMA/SMK adalah aplikasi web yang digunakan sekolah untuk mengelola data akademik dan administrasi sekolah secara terpusat.

Sistem memungkinkan satu admin sekolah mengelola data siswa, guru, kelas, jurusan, mata pelajaran, tahun ajaran, jadwal, absensi, nilai, pengumuman, dan pembayaran SPP.

User yang memperoleh kode akses dari admin dapat login ke portal dan melihat informasi akademiknya.

Produk dirancang agar source code yang sama dapat digunakan untuk sekolah yang berbeda. Setiap sekolah menggunakan deployment dan database masing-masing sehingga data antar sekolah sepenuhnya terpisah.

---

# 2. Problem Statement

Sekolah SMA/SMK memiliki banyak data akademik dan administratif yang harus dikelola secara terstruktur. Data siswa, kelas, jadwal, absensi, nilai, pengumuman, dan pembayaran SPP sering kali dikelola menggunakan dokumen atau sistem yang terpisah.

Hal tersebut menimbulkan beberapa masalah:

1. Admin kesulitan mengelola data sekolah dalam satu tempat.
2. Data akademik sulit dipantau secara terpusat.
3. Siswa tidak memiliki akses mudah terhadap informasi akademiknya.
4. Orang tua atau pihak lain yang diberikan akses oleh sekolah tidak dapat melihat informasi siswa secara langsung.
5. Informasi absensi dan nilai dapat terlambat diterima.
6. Status pembayaran SPP sulit dipantau tanpa menghubungi sekolah.
7. Riwayat akademik siswa dapat sulit dilacak ketika siswa berpindah kelas atau tahun ajaran.

### Pihak yang dirugikan

**Admin sekolah**

* Beban administrasi tinggi.
* Data tersebar.
* Risiko kesalahan input.
* Sulit melakukan monitoring.

**Siswa**

* Sulit mendapatkan informasi akademik terbaru.
* Harus mencari informasi melalui berbagai media.

**Orang tua/wali**

* Tidak memiliki akses langsung terhadap data akademik anak apabila sekolah tidak menyediakan sistem terpusat.

**Sekolah**

* Membutuhkan sistem yang dapat digunakan tanpa harus membangun aplikasi baru dari awal untuk setiap sekolah.

### Problem utama

> Sekolah membutuhkan satu portal web terpusat untuk mengelola data akademik dan administrasi serta memberikan akses informasi kepada user secara cepat, terstruktur, dan aman.

---

# 3. Product Vision

Membangun portal sekolah yang sederhana, terstruktur, responsive, dan dapat digunakan oleh SMA/SMK untuk mengelola informasi akademik serta administrasi sekolah dalam satu sistem.

Produk harus dapat digunakan kembali untuk sekolah lain dengan mengganti konfigurasi dan database tanpa melakukan perubahan besar pada source code.

---

# 4. Target User

Produk memiliki dua kategori utama:

## 4.1 Admin

Hanya terdapat **1 admin per sekolah**.

Admin memiliki akses penuh terhadap sistem.

Admin bertanggung jawab terhadap:

* Data siswa
* Data guru
* Data kelas
* Data jurusan
* Data mata pelajaran
* Tahun ajaran
* Semester
* Jadwal
* Absensi
* Nilai
* Pengumuman
* SPP
* User access code

Tidak ada role admin kedua pada MVP.

## 4.2 User

Semua pengguna selain admin menggunakan kategori `USER`.

Tidak ada role khusus `STUDENT`, `TEACHER`, atau `PARENT` pada authentication layer.

Siapa pun yang memiliki:

```text
Access Code
+
Password
```

dapat login.

Pada MVP, satu user terhubung dengan satu siswa.

---

# 5. Persona

## Persona 1 — Admin Sekolah

**Role:** Administrator sekolah

**Tujuan:**
Mengelola seluruh data sekolah secara terpusat.

**Kebutuhan:**

* Mengelola siswa.
* Mengelola guru.
* Mengelola kelas.
* Mengelola jurusan.
* Mengelola mata pelajaran.
* Mengatur jadwal.
* Mencatat absensi.
* Menginput nilai.
* Membuat pengumuman.
* Mengelola SPP.
* Membuat kode akses user.

**Pain Point:**

* Banyak data harus dikelola.
* Data dapat tersebar.
* Kesalahan input dapat terjadi.
* Membutuhkan akses cepat terhadap data sekolah.

## Persona 2 — User/Siswa

**Role:** User yang diberikan kode akses oleh sekolah.

**Tujuan:**
Melihat informasi akademik yang terkait dengan dirinya.

**Kebutuhan:**

* Login dengan kode akses.
* Melihat profil.
* Melihat kelas.
* Melihat jadwal.
* Melihat absensi.
* Melihat nilai.
* Melihat pengumuman.
* Melihat status SPP.

**Pain Point:**

* Tidak mengetahui informasi akademik terbaru.
* Harus menunggu informasi dari sekolah.

---

# 6. Goals

## 6.1 Product Goals

1. Menyediakan portal sekolah berbasis web.
2. Menyediakan dashboard admin.
3. Menyediakan dashboard user.
4. Memusatkan pengelolaan data akademik.
5. Memusatkan informasi pembayaran SPP.
6. Menyediakan akses data akademik kepada user.
7. Menyediakan histori kelas siswa.
8. Memastikan data tersimpan secara persistent di PostgreSQL.
9. Menjamin data user hanya dapat diakses oleh user terkait.
10. Menyediakan responsive UI untuk desktop, tablet, dan mobile.
11. Membuat source code reusable untuk sekolah lain.

## 6.2 MVP Success Goal

MVP dianggap selesai ketika alur berikut berhasil:

```text
Admin Login
      ↓
Membuat Tahun Ajaran
      ↓
Membuat Semester
      ↓
Membuat Jurusan
      ↓
Membuat Kelas
      ↓
Membuat Mata Pelajaran
      ↓
Membuat Guru
      ↓
Membuat Siswa
      ↓
Membuat Access Code + Password
      ↓
User Login
      ↓
User melihat data akademiknya
      ↓
Admin memasukkan absensi
      ↓
User melihat absensi
      ↓
Admin memasukkan nilai
      ↓
User melihat nilai
      ↓
Admin membuat jadwal
      ↓
User melihat jadwal
      ↓
Admin membuat pengumuman
      ↓
User melihat pengumuman
      ↓
Admin mencatat pembayaran SPP
      ↓
User melihat status SPP
```

Seluruh proses harus tersimpan dan terbaca dari PostgreSQL.

---

# 7. Non-Goals

Fitur berikut tidak termasuk MVP:

* Mobile application Android.
* Mobile application iOS.
* Chat realtime.
* Video conference.
* LMS lengkap.
* Ujian online.
* PPDB.
* Perpustakaan.
* Inventaris.
* Payroll.
* Face recognition.
* GPS attendance.
* WhatsApp integration.
* Email notification.
* Payment gateway.
* Online payment.
* Multi-admin.
* Multi-school dalam satu database.
* Multi-tenant architecture.
* Parent account khusus.
* Teacher account khusus.

Fitur tersebut dapat dipertimbangkan untuk V2/V3.

---

# 8. Product Scope

## MVP

### Authentication

* Admin login.
* User login.
* Access code.
* Password.
* Session management.
* Protected routes.

### Master Data

* Siswa.
* Guru.
* Jurusan.
* Kelas.
* Mata pelajaran.
* Tahun ajaran.
* Semester.

### Academic

* Histori kelas.
* Jadwal.
* Absensi.
* Nilai.

### Information

* Pengumuman.
* Profil sekolah.

### Financial

* Konfigurasi SPP.
* Keringanan/beasiswa.
* Pembayaran SPP.

---

# 9. User Stories

## Authentication

### Admin

> Sebagai admin, saya ingin login menggunakan akun admin supaya saya dapat mengelola seluruh data sekolah.

### User

> Sebagai user, saya ingin login menggunakan kode akses dan password supaya saya dapat melihat data akademik saya.

### Access Code

> Sebagai admin, saya ingin membuat kode akses unik supaya setiap siswa memiliki akun untuk mengakses portal.

> Sebagai admin, saya ingin menonaktifkan akses user supaya akun yang tidak boleh digunakan lagi tidak dapat login.

---

# 10. Student Management User Stories

> Sebagai admin, saya ingin menambahkan siswa supaya data siswa tersimpan dalam sistem.

> Sebagai admin, saya ingin mengubah data siswa supaya informasi siswa tetap akurat.

> Sebagai admin, saya ingin menonaktifkan siswa supaya siswa yang sudah tidak aktif tidak muncul sebagai siswa aktif.

> Sebagai user, saya ingin melihat profil saya supaya saya dapat melihat informasi pribadi yang tersimpan.

> Sebagai admin, saya ingin menentukan kelas siswa supaya struktur akademik siswa dapat diketahui sistem.

---

# 11. Teacher Management User Stories

> Sebagai admin, saya ingin menambahkan guru supaya data guru tersedia dalam sistem.

> Sebagai admin, saya ingin mengubah data guru supaya data guru tetap akurat.

> Sebagai admin, saya ingin menghubungkan guru dengan mata pelajaran supaya jadwal dapat dibuat berdasarkan guru yang mengajar.

---

# 12. Class Management User Stories

> Sebagai admin, saya ingin membuat kelas supaya siswa dapat dikelompokkan berdasarkan tingkat, kelas, dan jurusan.

Contoh:

```text
10 A TKJ
10 B TKJ
11 A RPL
12 B AKL
```

Untuk sekolah yang tidak menggunakan jurusan:

```text
10 A
10 B
11 A
```

---

# 13. Academic Year User Stories

> Sebagai admin, saya ingin membuat tahun ajaran supaya data akademik dapat dipisahkan berdasarkan periode.

Contoh:

```text
2025/2026
2026/2027
2027/2028
```

---

# 14. Semester User Stories

> Sebagai admin, saya ingin menentukan semester supaya nilai dan data akademik dapat dikelompokkan berdasarkan semester.

Minimal:

```text
Semester 1
Semester 2
```

---

# 15. Schedule User Stories

> Sebagai admin, saya ingin membuat jadwal pelajaran supaya siswa mengetahui jadwal belajar mereka.

> Sebagai user, saya ingin melihat jadwal pelajaran supaya saya mengetahui pelajaran yang harus diikuti.

Schedule terdiri dari:

* Hari.
* Jam mulai.
* Jam selesai.
* Kelas.
* Mata pelajaran.
* Guru.
* Ruangan.

---

# 16. Attendance User Stories

> Sebagai admin, saya ingin mencatat absensi siswa supaya kehadiran siswa tersimpan secara digital.

> Sebagai user, saya ingin melihat riwayat absensi supaya saya dapat mengetahui data kehadiran saya.

Absensi dilakukan **satu kali per hari**.

Status:

```text
HADIR
SAKIT
IZIN
ALPA
```

---

# 17. Grade User Stories

> Sebagai admin, saya ingin memasukkan nilai siswa supaya hasil akademik siswa tersimpan.

> Sebagai user, saya ingin melihat nilai saya supaya saya dapat memantau hasil akademik.

Komponen nilai:

```text
Tugas
UTS
UAS
Praktik
```

Bobot nilai belum ditetapkan.

**OPEN QUESTION:** Apakah nilai akhir harus dihitung otomatis berdasarkan bobot tertentu atau dimasukkan secara manual oleh admin?

---

# 18. Announcement User Stories

> Sebagai admin, saya ingin membuat pengumuman supaya informasi sekolah dapat disampaikan kepada seluruh user.

> Sebagai user, saya ingin melihat pengumuman supaya saya mengetahui informasi terbaru dari sekolah.

Requirement:

* Hanya admin dapat membuat pengumuman.
* Semua user dapat melihat pengumuman yang dipublish.
* Tidak ada targeting berdasarkan kelas.
* Tidak ada targeting berdasarkan tipe user.

---

# 19. SPP User Stories

> Sebagai admin, saya ingin menentukan nominal SPP supaya sistem dapat mengetahui jumlah tagihan siswa.

> Sebagai admin, saya ingin memberikan keringanan SPP kepada siswa supaya nominal pembayaran dapat disesuaikan dengan beasiswa atau kondisi khusus.

> Sebagai admin, saya ingin mencatat pembayaran SPP supaya histori pembayaran tersimpan.

> Sebagai user, saya ingin melihat status SPP supaya saya mengetahui pembayaran yang sudah dan belum dilakukan.

Pembayaran dilakukan **offline**.

Tidak ada online payment pada MVP.

---

# 20. Feature Prioritization

| Fitur                    | MVP | V2 | Future |
| ------------------------ | --: | -: | -----: |
| Admin Login              |   ✓ |    |        |
| User Login               |   ✓ |    |        |
| Access Code              |   ✓ |    |        |
| Student Management       |   ✓ |    |        |
| Teacher Management       |   ✓ |    |        |
| Major Management         |   ✓ |    |        |
| Class Management         |   ✓ |    |        |
| Academic Year            |   ✓ |    |        |
| Semester                 |   ✓ |    |        |
| Subject                  |   ✓ |    |        |
| Class History            |   ✓ |    |        |
| Schedule                 |   ✓ |    |        |
| Attendance               |   ✓ |    |        |
| Grade                    |   ✓ |    |        |
| Announcement             |   ✓ |    |        |
| SPP                      |   ✓ |    |        |
| Scholarship/Discount SPP |   ✓ |    |        |
| Responsive UI            |   ✓ |    |        |
| Import Excel             |     |  ✓ |        |
| Export Excel/PDF         |     |  ✓ |        |
| Notification             |     |  ✓ |        |
| Audit Log                |     |  ✓ |        |
| Dashboard Statistics     |     |  ✓ |        |
| Online Payment           |     |  ✓ |        |
| WhatsApp Integration     |     |  ✓ |        |
| Parent Account           |     |  ✓ |        |
| Teacher Account          |     |  ✓ |        |
| PPDB                     |     |    |      ✓ |
| LMS                      |     |    |      ✓ |
| Online Exam              |     |    |      ✓ |
| Mobile App               |     |    |      ✓ |

---

# 21. Functional Requirements

# 21.1 Admin Authentication

### Requirements

Admin harus dapat:

* Login.
* Logout.
* Mempertahankan session.
* Mengakses halaman admin hanya ketika authenticated.

Password harus disimpan menggunakan hashing.

Password plaintext tidak boleh disimpan di database.

### Protected Route

Halaman:

```text
/admin/*
```

harus membutuhkan session admin.

User biasa tidak boleh mengakses halaman admin.

---

# 21.2 User Authentication

User login menggunakan:

```text
Access Code
Password
```

Access code berfungsi sebagai username.

Contoh:

```text
Access Code: A7K92
Password: ********
```

### Requirements

* Access code unique.
* Access code tidak boleh kosong.
* Password wajib.
* User hanya memiliki satu akun.
* Satu siswa hanya dapat memiliki satu user.
* Account dapat diaktifkan/nonaktifkan.
* Password disimpan dalam bentuk hash.
* Session user harus mengidentifikasi siswa yang terkait.

---

# 21.3 Student Management

Admin dapat:

* Create.
* Read.
* Update.
* Deactivate.
* Search.
* Filter.
* Melihat detail.
* Menentukan kelas aktif.
* Membuat access code.

Field minimal:

```text
Student
- id
- studentNumber
- name
- gender
- birthDate
- address
- phone
- admissionYear
- status
- createdAt
- updatedAt
```

NIS dan NISN tidak wajib.

Karena kebutuhan sekolah dapat berbeda, `studentNumber` dapat digunakan sebagai identifier internal jika diperlukan.

---

# 21.4 User Account

Field:

```text
User
- id
- accessCode
- passwordHash
- studentId
- isActive
- createdAt
- updatedAt
```

Constraint:

```text
accessCode UNIQUE
studentId UNIQUE
```

Admin dapat:

* Generate access code.
* Reset password.
* Disable account.
* Enable account.

Access code harus dibuat secara otomatis oleh sistem dan tidak boleh duplicate.

Format access code yang direkomendasikan:

```text
5 karakter
A-Z
0-9
```

Contoh:

```text
A7K92
P82LA
9X2KD
```

---

# 21.5 Teacher Management

Field:

```text
Teacher
- id
- teacherCode
- name
- phone
- email
- status
- createdAt
- updatedAt
```

Admin dapat:

* Create.
* Update.
* Deactivate.
* Search.
* View detail.

Teacher tidak memiliki account login pada MVP.

---

# 21.6 Major Management

Diperlukan terutama untuk SMK.

Contoh:

```text
TKJ
RPL
AKL
MPLB
DKV
```

Field:

```text
Major
- id
- name
- code
- description
- isActive
```

---

# 21.7 Class Management

Field:

```text
Class
- id
- grade
- className
- majorId
- academicYearId
- homeroomTeacherId
- isActive
```

Contoh:

```text
grade = 10
className = A
major = TKJ
```

Frontend:

```text
10 A TKJ
```

Untuk SMA tanpa jurusan:

```text
10 A
```

---

# 21.8 Class History

Siswa dapat berpindah kelas setiap tahun.

Field:

```text
StudentClassHistory
- id
- studentId
- classId
- academicYearId
- startDate
- endDate
```

Tujuan:

Sistem tetap dapat mengetahui:

```text
2025/2026 → 10 A TKJ
2026/2027 → 11 A TKJ
2027/2028 → 12 A TKJ
```

---

# 21.9 Academic Year

Field:

```text
AcademicYear
- id
- name
- startDate
- endDate
- isActive
```

Hanya satu tahun ajaran yang boleh menjadi active pada satu waktu.

---

# 21.10 Semester

Field:

```text
Semester
- id
- academicYearId
- name
- number
- isActive
```

Contoh:

```text
Semester 1
Semester 2
```

---

# 21.11 Subject

Field:

```text
Subject
- id
- code
- name
- majorId
- isActive
```

Mata pelajaran dapat terkait dengan jurusan atau bersifat umum.

---

# 21.12 Schedule

Field:

```text
Schedule
- id
- classId
- subjectId
- teacherId
- day
- startTime
- endTime
- room
- academicYearId
```

Admin dapat:

* Create.
* Update.
* Delete.
* Filter berdasarkan kelas.
* Filter berdasarkan hari.

User hanya melihat jadwal berdasarkan kelasnya.

---

# 21.13 Attendance

Field:

```text
Attendance
- id
- studentId
- date
- status
- note
```

Status:

```text
HADIR
SAKIT
IZIN
ALPA
```

Constraint:

```text
UNIQUE(studentId, date)
```

Karena absensi hanya satu kali per hari.

Admin dapat:

* Membuat absensi.
* Mengubah absensi.
* Melihat histori.
* Filter berdasarkan tanggal.
* Filter berdasarkan kelas.

User dapat:

* Melihat histori absensi.
* Melihat ringkasan jumlah:

  * Hadir
  * Sakit
  * Izin
  * Alpa

---

# 21.14 Grade

Komponen nilai fixed:

```text
Tugas
UTS
UAS
Praktik
```

Field:

```text
Grade
- id
- studentId
- subjectId
- academicYearId
- semesterId
- assignmentScore
- utsScore
- uasScore
- practiceScore
- finalScore
```

Nilai harus berada pada range:

```text
0 - 100
```

Nilai kosong berarti belum diinput.

Nilai `0` tetap merupakan nilai valid.

**OPEN QUESTION:** Bobot masing-masing komponen belum ditentukan.

---

# 21.15 Announcement

Field:

```text
Announcement
- id
- title
- content
- isPublished
- publishedAt
- createdAt
- updatedAt
```

Admin dapat:

* Create.
* Update.
* Publish.
* Unpublish.
* Delete.

User dapat melihat semua announcement yang published.

Tidak ada targeting kelas/user pada MVP.

---

# 21.16 SPP Configuration

Nominal SPP dapat berbeda berdasarkan tahun masuk dan dapat mengalami perubahan karena beasiswa/keringanan.

Model dasar:

```text
SPPConfiguration
- id
- name
- amount
- effectiveFrom
- effectiveUntil
- academicYearId
```

Contoh:

```text
SPP Normal
Rp200.000
```

---

# 21.17 Student SPP Override

Karena setiap siswa dapat memiliki keringanan berbeda, diperlukan konfigurasi khusus siswa.

```text
StudentSPP
- id
- studentId
- sppConfigurationId
- customAmount
- reason
- effectiveFrom
- effectiveUntil
```

Contoh:

```text
Siswa A
Normal: Rp200.000
Beasiswa 50%
Bayar: Rp100.000

Siswa B
Beasiswa penuh
Bayar: Rp0
```

---

# 21.18 Payment

Pembayaran dilakukan secara offline dan dicatat oleh admin.

Field:

```text
Payment
- id
- studentId
- billingMonth
- billingYear
- amount
- paidAt
- status
- note
```

Status minimal:

```text
PAID
```

Status `UNPAID` tidak wajib disimpan sebagai transaksi karena dapat dihitung berdasarkan tagihan.

Admin dapat:

* Mencatat pembayaran.
* Melihat pembayaran.
* Melihat histori pembayaran.

User dapat:

* Melihat status pembayaran.
* Melihat nominal.
* Melihat bulan pembayaran.
* Melihat tanggal pembayaran.

---

# 22. Dashboard Admin

Dashboard harus menampilkan overview sekolah.

Minimal:

```text
Total Siswa
Total Guru
Total Kelas
Tahun Ajaran Aktif
```

Ringkasan tambahan:

```text
Absensi hari ini
Pembayaran SPP
Pengumuman terbaru
```

Dashboard bukan tempat utama CRUD.

Admin diarahkan ke halaman management masing-masing.

---

# 23. Dashboard User

Dashboard user minimal menampilkan:

```text
Nama siswa
Kelas aktif
Tahun ajaran
```

Menu:

```text
Dashboard
Profil
Jadwal
Absensi
Nilai
Pengumuman
SPP
```

Dashboard harus responsive.

---

# 24. Navigation Structure

## Admin

```text
/admin
│
├── dashboard
├── siswa
├── guru
├── jurusan
├── kelas
├── mata-pelajaran
├── tahun-ajaran
├── semester
├── jadwal
├── absensi
├── nilai
├── spp
├── pengumuman
├── pengguna
└── pengaturan
```

## User

```text
/dashboard
│
├── profil
├── jadwal
├── absensi
├── nilai
├── pengumuman
└── spp
```

---

# 25. Data Model

Entitas utama:

```text
Admin
User
Student
Teacher
Major
Class
StudentClassHistory
AcademicYear
Semester
Subject
Schedule
Attendance
Grade
Announcement
SPPConfiguration
StudentSPP
Payment
```

Relasi:

```text
User 1 ─── 1 Student

Student 1 ─── N StudentClassHistory
StudentClassHistory N ─── 1 Class

Class N ─── 1 Major
Class N ─── 1 AcademicYear
Class N ─── 1 Teacher

Subject N ─── 1 Major

Schedule N ─── 1 Class
Schedule N ─── 1 Subject
Schedule N ─── 1 Teacher
Schedule N ─── 1 AcademicYear

Attendance N ─── 1 Student

Grade N ─── 1 Student
Grade N ─── 1 Subject
Grade N ─── 1 AcademicYear
Grade N ─── 1 Semester

Semester N ─── 1 AcademicYear

StudentSPP N ─── 1 Student
StudentSPP N ─── 1 SPPConfiguration

Payment N ─── 1 Student
```

---

# 26. Important Database Constraints

Database harus menerapkan constraint, bukan hanya validasi frontend.

## User

```text
accessCode UNIQUE
studentId UNIQUE
```

## Academic Year

Hanya satu active academic year.

## Attendance

```text
UNIQUE(studentId, date)
```

## Grade

Satu siswa tidak boleh memiliki dua record nilai untuk kombinasi:

```text
student
+
subject
+
academicYear
+
semester
```

Sehingga:

```text
UNIQUE(
    studentId,
    subjectId,
    academicYearId,
    semesterId
)
```

## Payment

Untuk pembayaran bulanan, satu siswa tidak boleh memiliki dua transaksi pembayaran untuk bulan dan tahun tagihan yang sama jika sistem tidak mendukung cicilan.

Jika cicilan akan didukung, constraint tersebut harus berbeda.

**OPEN QUESTION:** Apakah satu tagihan SPP dapat dibayar secara cicilan?

---

# 27. Edge Cases

## Authentication

### Access code salah

```text
Login gagal.
```

Jangan memberi informasi apakah username tersebut terdaftar.

### Password salah

```text
Login gagal.
```

### Account inactive

```text
Login ditolak.
```

### Session expired

```text
Redirect ke login.
```

---

# 28. Student Edge Cases

### Siswa belum memiliki kelas

Tidak boleh terjadi jika `class` merupakan requirement wajib.

Admin harus menentukan kelas sebelum siswa dianggap aktif.

### Siswa pindah kelas

Jangan overwrite histori.

Buat record baru pada:

```text
StudentClassHistory
```

### Siswa nonaktif

Akun user terkait harus tidak dapat digunakan jika siswa sudah tidak aktif.

---

# 29. Attendance Edge Cases

### Duplicate attendance

Ditolak database.

### Absensi tanggal sama

Tidak boleh ada dua absensi untuk siswa yang sama pada tanggal yang sama.

### Absensi tanpa siswa

Ditolak.

### Status invalid

Ditolak.

---

# 30. Grade Edge Cases

### Nilai > 100

Ditolak.

### Nilai < 0

Ditolak.

### Nilai belum diinput

Tampilkan:

```text
Belum tersedia
```

bukan:

```text
0
```

### Duplicate grade

Ditolak berdasarkan unique constraint.

---

# 31. Schedule Edge Cases

### Jadwal bertabrakan

Sistem sebaiknya memberikan warning jika:

* Guru mengajar dua kelas pada waktu yang sama.
* Kelas memiliki dua mata pelajaran pada waktu yang sama.

**[OPEN QUESTION]** Apakah sistem harus memblokir konflik jadwal atau hanya memberikan warning?

---

# 32. SPP Edge Cases

### Nominal berubah

Pembayaran lama tidak boleh berubah.

### Siswa mendapat beasiswa

Gunakan `StudentSPP`.

### Siswa mendapat keringanan sementara

Gunakan:

```text
effectiveFrom
effectiveUntil
```

### Beasiswa berakhir

Sistem kembali menggunakan tarif normal.

### Pembayaran lebih besar dari tagihan

Ditolak kecuali sekolah secara eksplisit mendukung pembayaran lebih.

### Pembayaran duplicate

Harus dicegah.

### Pembayaran dihapus

Tidak disarankan melakukan hard delete.

Lebih aman menggunakan status pembatalan jika audit trail sudah diterapkan.

---

# 33. Security Requirements

Minimal:

1. Password wajib di-hash.
2. Tidak ada password plaintext.
3. Admin route harus protected.
4. User hanya dapat membaca data miliknya.
5. API/server action harus melakukan authorization.
6. Jangan hanya mengandalkan proteksi frontend.
7. Access code harus unique.
8. Database credentials tidak boleh masuk client bundle.
9. `.env` tidak boleh di-commit.
10. Input user harus divalidasi server-side.
11. SQL injection harus dicegah melalui Prisma/query parameterization.
12. Session harus memiliki expiration.
13. User inactive tidak boleh login.
14. Admin tidak dapat diakses oleh user biasa.

---

# 34. Responsive Requirements

UI harus mendukung:

```text
Mobile
Tablet
Desktop
```

Minimal breakpoint:

```text
Mobile
Tablet
Desktop
```

Tidak boleh terdapat:

* Horizontal overflow yang tidak diperlukan.
* Tabel desktop yang tidak usable di mobile.
* Button terlalu kecil untuk touch.
* Text terpotong.
* Navigation yang tidak dapat digunakan pada mobile.

Untuk tabel besar, gunakan:

* Responsive table.
* Horizontal scroll pada container.
* Card layout jika diperlukan.

---

# 35. Non-Functional Requirements

## Performance

Halaman utama harus memiliki response yang cepat dalam kondisi penggunaan normal.

Database query harus menggunakan indexing pada field yang sering digunakan untuk:

* Login.
* Student lookup.
* Attendance.
* Grade.
* Payment.
* Class.

## Reliability

Data yang telah disimpan tidak boleh hilang akibat refresh atau perpindahan halaman.

## Maintainability

Code harus:

* TypeScript strict.
* Modular.
* Tidak memiliki duplicate logic yang tidak diperlukan.
* Menggunakan reusable components.
* Memisahkan business logic dari UI jika memungkinkan.

## Scalability

Walaupun satu deployment hanya digunakan satu sekolah, desain harus mampu menangani:

* Ribuan siswa.
* Ratusan guru.
* Banyak kelas.
* Bertahun-tahun data akademik.

---

# 36. Technical Requirements

## Frontend

```text
Next.js
TypeScript
Tailwind CSS
```

## Backend

Menggunakan kemampuan server-side Next.js.

## Database

```text
PostgreSQL
```

## ORM

```text
Prisma
```

## Deployment

Deployment target belum ditentukan.

**[OPEN QUESTION]** Platform deployment production belum ditentukan.

---

# 37. Recommended Project Structure

Struktur awal yang disarankan:

```text
app/
├── admin/
│   ├── login/
│   ├── dashboard/
│   ├── siswa/
│   ├── guru/
│   ├── jurusan/
│   ├── kelas/
│   ├── mata-pelajaran/
│   ├── tahun-ajaran/
│   ├── semester/
│   ├── jadwal/
│   ├── absensi/
│   ├── nilai/
│   ├── spp/
│   ├── pengumuman/
│   ├── pengguna/
│   └── pengaturan/
│
├── login/
│
├── dashboard/
│   ├── profil/
│   ├── jadwal/
│   ├── absensi/
│   ├── nilai/
│   ├── pengumuman/
│   └── spp/
│
├── api/
│
├── components/
├── lib/
└── generated/

prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

Struktur final dapat berubah mengikuti implementasi Next.js.

---

# 38. MVP Acceptance Criteria

MVP dianggap selesai apabila:

## Authentication

* [ ] Admin dapat login.
* [ ] Admin dapat logout.
* [ ] User dapat login menggunakan access code + password.
* [ ] User dengan password salah ditolak.
* [ ] User inactive ditolak.
* [ ] Protected routes bekerja.

## Student

* [ ] Admin dapat membuat siswa.
* [ ] Admin dapat mengubah siswa.
* [ ] Admin dapat menonaktifkan siswa.
* [ ] Admin dapat membuat access code.
* [ ] Siswa memiliki satu user account.

## Teacher

* [ ] Admin dapat membuat guru.
* [ ] Admin dapat mengubah guru.
* [ ] Admin dapat menonaktifkan guru.

## Class

* [ ] Admin dapat membuat jurusan.
* [ ] Admin dapat membuat kelas.
* [ ] Kelas dapat memiliki tingkat.
* [ ] Kelas dapat memiliki jurusan.
* [ ] Siswa dapat dikaitkan dengan kelas.
* [ ] Histori kelas tersimpan.

## Academic

* [ ] Admin dapat membuat tahun ajaran.
* [ ] Admin dapat membuat semester.
* [ ] Admin dapat membuat mata pelajaran.
* [ ] Admin dapat membuat jadwal.
* [ ] User dapat melihat jadwal.

## Attendance

* [ ] Admin dapat mencatat absensi.
* [ ] Satu siswa tidak dapat memiliki dua absensi pada tanggal yang sama.
* [ ] User dapat melihat absensi.
* [ ] Sistem menampilkan ringkasan kehadiran.

## Grade

* [ ] Admin dapat memasukkan Tugas.
* [ ] Admin dapat memasukkan UTS.
* [ ] Admin dapat memasukkan UAS.
* [ ] Admin dapat memasukkan Praktik.
* [ ] User dapat melihat nilai.
* [ ] Nilai invalid ditolak.

## Announcement

* [ ] Admin dapat membuat announcement.
* [ ] Admin dapat publish/unpublish.
* [ ] User dapat melihat announcement yang published.

## SPP

* [ ] Admin dapat menentukan tarif.
* [ ] Admin dapat menentukan keringanan.
* [ ] Admin dapat mencatat pembayaran offline.
* [ ] Histori pembayaran tersimpan.
* [ ] User dapat melihat status SPP.

## Responsive

* [ ] Dashboard usable di mobile.
* [ ] Dashboard usable di tablet.
* [ ] Dashboard usable di desktop.
* [ ] Tidak ada layout overflow yang mengganggu.

## Database

* [ ] PostgreSQL terhubung.
* [ ] Prisma migration berhasil.
* [ ] Prisma Client berhasil generate.
* [ ] Semua data utama tersimpan di database.
* [ ] Relasi database berjalan.
* [ ] Constraint penting diterapkan.

---

# 39. Success Metrics

MVP tidak hanya dianggap selesai karena halaman sudah dibuat.

### Functional Success

Target:

**100% critical user flow berhasil end-to-end.**

Critical flow:

```text
Admin
→ Login
→ Create student
→ Create class
→ Create subject
→ Create teacher
→ Create user access
→ Create schedule
→ Record attendance
→ Record grade
→ Create announcement
→ Record payment
```

Kemudian:

```text
User
→ Login
→ View profile
→ View class
→ View schedule
→ View attendance
→ View grade
→ View announcement
→ View SPP
```

### Data Integrity

Target:

* 0 duplicate access code.
* 0 duplicate student account.
* 0 duplicate attendance per student/date.
* 0 invalid grade.
* 0 unauthorized access terhadap data user lain.
* 0 akses user terhadap admin dashboard.

### Usability

Admin harus dapat menjalankan workflow utama tanpa bantuan developer setelah sistem selesai.

### Responsive

Seluruh fitur utama dapat digunakan pada:

* Mobile.
* Tablet.
* Desktop.

---

# 40. V2

Setelah MVP stabil, prioritas V2:

## Data Management

* Import siswa dari Excel.
* Import guru.
* Import nilai.
* Export Excel.
* Export PDF.

## Reporting

* Rekap absensi.
* Rekap nilai.
* Rekap SPP.
* Laporan siswa.
* Statistik akademik.

## Notification

* Email notification.
* WhatsApp notification.
* Pengumuman notification.

## Authentication

* Password reset.
* Account recovery.
* Teacher account.
* Parent account.

## SPP

* Online payment.
* Payment gateway.
* Invoice.
* Bukti pembayaran.

## Administration

* Audit log.
* Riwayat perubahan data.
* Backup/restore.

---

# 41. Future Features

Fitur jangka panjang:

* PPDB online.
* LMS.
* Materi pembelajaran.
* Tugas online.
* Ujian online.
* Bank soal.
* Mobile app.
* Push notification.
* Face recognition attendance.
* GPS attendance.
* Parent monitoring.
* Integrasi WhatsApp.
* Integrasi payment gateway.
* Multi-school SaaS architecture.

---

# 42. Open Questions

Requirement berikut belum dikunci dan tidak boleh diasumsikan oleh developer:

### Nilai

1. Apakah `finalScore` dihitung otomatis?
2. Jika otomatis, berapa bobot:

   * Tugas?
   * UTS?
   * UAS?
   * Praktik?

### SPP

3. Apakah nominal SPP yang berubah karena beasiswa berlaku sampai tanggal tertentu?
4. Apakah siswa dapat memiliki lebih dari satu perubahan keringanan sepanjang masa sekolah?
5. Apakah pembayaran SPP boleh dicicil?

### Jadwal

6. Apakah konflik jadwal harus diblokir atau hanya diberi warning?

### Deployment

7. Platform deployment production apa yang akan digunakan?

### Branding

8. Apakah setiap deployment sekolah dapat mengubah:

   * Nama sekolah?
   * Logo?
   * Alamat?
   * Nomor telepon?
   * Warna/branding?

---

# 43. Final MVP Boundary

MVP **BUKAN** sistem administrasi sekolah lengkap.

MVP adalah:

> Sistem portal sekolah yang memungkinkan satu admin mengelola data siswa, guru, jurusan, kelas, mata pelajaran, tahun ajaran, semester, jadwal, absensi, nilai, pengumuman, dan SPP; kemudian memberikan setiap siswa satu kode akses + password sehingga siswa dapat login dan melihat informasi akademik serta administrasinya.

Arsitektur deployment:

```text
1 Sekolah
     │
     ├── 1 Admin
     │
     ├── PostgreSQL Database
     │
     └── Users
          │
          ├── Student A
          ├── Student B
          ├── Student C
          └── ...
```

Tidak ada multi-school dalam satu database.

Tidak ada multi-admin.

Tidak ada role teacher/parent/student pada authentication layer.

Tidak ada online payment pada MVP.

Pembayaran SPP dicatat secara offline oleh admin.

Setiap siswa memiliki satu user account.

Access code berfungsi sebagai username.

Password menjadi password account.

Data akademik terhubung dengan tahun ajaran dan semester.

Riwayat kelas disimpan dan tidak boleh hilang ketika siswa berpindah kelas.

Absensi dilakukan satu kali per hari.

Nilai terdiri dari Tugas, UTS, UAS, dan Praktik.

SPP dapat berbeda antar siswa karena beasiswa/keringanan.

Seluruh fitur utama harus terhubung dengan PostgreSQL dan dapat diuji end-to-end.