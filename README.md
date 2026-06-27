# Sistem Informasi Manajemen - KSR PMI UMM

[![CI Pipeline](https://github.com/Kira-IDN/sim-ksr-pmi-umm/actions/workflows/ci.yml/badge.svg)](https://github.com/Kira-IDN/sim-ksr-pmi-umm/actions/workflows/ci.yml)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)

Sistem Informasi Manajemen untuk Korps Sukarela Palang Merah Indonesia Unit Universitas Muhammadiyah Malang (KSR PMI UMM). Platform ini ditujukan untuk mempermudah administrasi, manajemen data anggota, pengarsipan, persetujuan kegiatan, hingga manajemen operasional lapangan.

## 🚀 Fitur Utama
* **Manajemen Anggota**: Sistem Role-Based Access Control (RBAC) yang membedakan hak akses berdasarkan jabatan organisasi.
* **Dasbor & Analitik**: Panel ringkasan data statistik anggota, kegiatan, dan keuangan secara real-time.
* **Manajemen Kegiatan & Absensi**: Pelacakan kehadiran dan evaluasi program kerja.
* **Sistem Persetujuan (Approval)**: Alur persetujuan dokumen/proposal kegiatan secara digital.
* **Inventaris & Keuangan**: Monitoring kas, pendataan peralatan, dan sistem peminjaman barang.

## 🛠 Tech Stack
**Frontend:**
- React (Vite)
- TypeScript
- Tailwind CSS
- Zustand (Global State)
- React Query (Async Server State)
- React Hook Form + Zod (Form Validation)

**Backend:**
- Node.js / Express
- Prisma ORM
- TypeScript
- SQLite (Development)

## 📦 Panduan Instalasi
1. Kloning repositori ini:
   ```bash
   git clone https://github.com/Kira-IDN/sim-ksr-pmi-umm.git
   cd sim-ksr-pmi-umm
   ```
2. Instalasi Dependensi Frontend:
   ```bash
   npm install
   ```
3. Instalasi Dependensi Backend:
   ```bash
   cd server
   npm install
   ```
4. Setup Database & Jalankan:
   ```bash
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

5. Jalankan Aplikasi:
   - Frontend: `npm run dev` di root folder.
   - Backend: `npm run dev` di folder `/server`.

## 🤝 Kontribusi
Kami menyambut baik segala bentuk kontribusi. Silakan baca [Panduan Kontribusi](CONTRIBUTING.md) sebelum mulai berkontribusi pada repositori ini.

## 📄 Lisensi
Hak Cipta © 2026 KSR PMI UMM. Dikembangkan secara eksklusif untuk kebutuhan internal KSR PMI UMM.
