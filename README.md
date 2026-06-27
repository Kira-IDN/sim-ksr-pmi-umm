# Sistem Informasi Manajemen - KSR PMI UMM

[![CI Pipeline](https://github.com/Kira-IDN/sim-ksr-pmi-umm/actions/workflows/ci.yml/badge.svg)](https://github.com/Kira-IDN/sim-ksr-pmi-umm/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

Sistem Informasi Manajemen untuk **Korps Sukarela Palang Merah Indonesia Unit Universitas Muhammadiyah Malang (KSR PMI UMM)**. Platform terpadu ini ditujukan untuk memodernisasi dan mendigitalisasi administrasi, manajemen data anggota, pengarsipan, persetujuan kegiatan, hingga manajemen operasional lapangan yang selama ini dilakukan secara manual.

---

## 🚀 Status Modul & Fitur

Pembangunan sistem saat ini telah menyelesaikan fase **Frontend MVP (Minimum Viable Product)**.

### ✅ Selesai (Completed)
- **Autentikasi (IAM)**: Halaman Login responsif dengan proteksi rute berbasis JWT (disimulasikan di frontend).
- **Dashboard & Analitik**: Panel ringkasan data statistik anggota, kegiatan, dan notifikasi persetujuan (dark mode didukung).
- **Manajemen Data Anggota**: CRUD lengkap (Create, Read, Update, Delete) informasi anggota, form validasi dengan Zod, dan tabel dengan filter dinamis.
- **Profil Pengguna & Pengaturan**: Halaman Read-Only profil dan Pengaturan Tema/Notifikasi, terisolasi sesuai hak akses.
- **Navigasi Dinamis**: Top Navbar & Sidebar Responsif yang otomatis merender menu berdasarkan *Role* pengguna.
- **Design System & Dark Mode**: Implementasi warna sesuai *brand guidelines* KSR PMI UMM dengan integrasi *Dark Mode* persisten (`Zustand` + `localStorage`).

### 🚧 Segera Hadir (Coming Soon / Tahap Backend)
Fitur berikut antarmukanya sudah disiapkan dengan status `(Segera)`, siap untuk diintegrasikan pada tahap pengembangan selanjutnya:
- Struktur Organisasi (Hierarki interaktif)
- Manajemen Kegiatan & Absensi Digital (QR Code/Geolocation)
- Inventaris & Peminjaman Barang
- Data Pasien & Korban
- Manajemen Keuangan & Kas
- Arsip, Administrasi & Approval Berjenjang
- Laporan, Monitoring, dan Buku Tamu Digital

---

## 🔐 Sistem Hak Akses (RBAC)

Aplikasi ini menggunakan sistem **Role-Based Access Control (RBAC)** ketat untuk menjaga kerahasiaan data organisasi.
Proteksi telah diimplementasikan pada tingkat menu (Sidebar/Navbar) dan tingkat URL (Route Protection).

**Daftar Role Utama:**
1. **Admin Sistem / Administrator**: Memiliki akses penuh (CRUD) ke seluruh modul, manajemen peran, dan menu Pengaturan (pusat manajemen akun).
2. **Ketua Umum & Wakil Ketua Umum**: Memiliki visibilitas penuh terhadap pelaporan, manajemen kegiatan, serta memiliki hak *Approval* umum.
3. **Sekretaris**: Menguasai modul Arsip & Administrasi, Rekap Laporan, dan Absensi Digital.
4. **Bendahara**: Menguasai modul Keuangan dan *Financial Approval*.
5. **Pengurus Bidang**: Memegang akses khusus Inventaris, Buku Tamu, dan Data Anggota.
6. **Pengurus Kegiatan Lapangan**: Akses utama pada Manajemen Kegiatan dan Data Pasien/Korban.
7. **Anggota Organisasi**: Visibilitas terbatas pada Struktur Organisasi, Absensi, dan Profil Pribadi.

---

## 🛠 Tech Stack

**Frontend:**
- **Core**: React 18 (Vite), TypeScript 5
- **Styling**: Tailwind CSS + `clsx` & `tailwind-merge`
- **State Management**: Zustand (Global UI State), React Query (Async Server State)
- **Form Handling**: React Hook Form + Zod Resolver
- **UI Components**: Lucide React (Icons), Radix UI (Primitives)
- **Code Quality**: ESLint, Prettier, TypeScript Strict Mode

**Backend (Dalam Pengembangan):**
- **Core**: Node.js, Express.js
- **Database ORM**: Prisma ORM
- **Database Engine**: SQLite (Development) -> MySQL/PostgreSQL (Production)
- **Security**: bcrypt (Hashing), jsonwebtoken (JWT Auth)

---

## 📁 Struktur Direktori Utama

```
sim-ksr-pmi-umm/
├── .github/                  # Konfigurasi GitHub Actions & Issue Templates
├── docs/                     # Dokumentasi arsitektur dan laporan QA proyek
├── server/                   # Backend API Node.js/Express
│   ├── prisma/               # Skema Database & Seeders
│   └── src/
│       ├── controllers/      # Logika bisnis API
│       ├── middlewares/      # Interceptor (Auth, RBAC, Error Handler)
│       ├── routes/           # Definisi endpoint API
│       └── services/         # Layanan database (Prisma client)
└── src/                      # Frontend React (Vite) Aplikasi Utama
    ├── components/           # Komponen UI Reusable (Cards, UI, Layouts)
    ├── constants/            # Variabel konstan (RBAC Matrix, Role config)
    ├── pages/                # Komponen level Halaman (Dashboard, Login, dll)
    ├── store/                # Konfigurasi Global State (Zustand)
    └── utils/                # Helper functions (API Axios instansi, cn)
```

---

## 📦 Panduan Instalasi & Menjalankan Aplikasi

**Prasyarat:** Node.js (v18+) dan npm/yarn terpasang di sistem.

1. **Kloning Repositori:**
   ```bash
   git clone https://github.com/Kira-IDN/sim-ksr-pmi-umm.git
   cd sim-ksr-pmi-umm
   ```

2. **Setup Frontend:**
   Buka terminal di *root directory* repositori.
   ```bash
   npm install
   npm run dev
   ```
   Aplikasi frontend akan berjalan di `http://localhost:5173`.

3. **Setup Backend (API Server):**
   Buka jendela terminal baru, masuk ke direktori `server/`.
   ```bash
   cd server
   npm install
   npx prisma db push
   npx ts-node prisma/seed.ts   # Memasukkan data dummy awal (termasuk akun Administrator)
   npm run dev
   ```
   Server backend akan berjalan di `http://localhost:3000`.

*Gunakan akun `ADMIN001` dengan password `password123` untuk login sebagai Administrator.*

---

## 🤝 Kontribusi

Kami menyambut baik segala bentuk kontribusi. Silakan baca [Panduan Kontribusi](CONTRIBUTING.md) untuk memahami *workflow* pembuatan *branch*, penulisan *commit message*, dan prosedur *Pull Request* sebelum berkontribusi pada repositori ini.

## 📄 Lisensi

Hak Cipta © 2026 KSR PMI UMM.
Dikembangkan secara eksklusif untuk kebutuhan internal KSR PMI UMM. Hak cipta dilindungi.
