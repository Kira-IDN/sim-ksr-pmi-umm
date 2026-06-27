# Technical Debt & Frontend Maintenance Report

Secara umum struktur UI saat ini sangat bersih, namun ada beberapa hutang teknis (technical debt) dan area yang direkomendasikan untuk *refactor* atau optimalisasi sebelum aplikasi siap diproduksi secara massal.

## 1. Hardcoded Values & Placeholders
- **Profil Pengguna**: Data "Tanggal Bergabung" (1 September 2022) dan agregasi "Statistik Kontribusi" (Poin KSR, Absensi 94%) di halaman `Profil.tsx` masih di-hardcode di HTML. Begitu integrasi API siap, variabel statis ini harus diganti dengan property dari `user` response object.
- **Top Navbar Info**: "Sistem Informasi KSR PMI UMM" adalah sub-header statis. Jika kedepannya konfigurasi aplikasi ini disimpan di database (White-label), maka perlu ditarik dari *Settings Store*.

## 2. Refactor yang Disarankan
- **Komponen Shared Data**: Jika Notifikasi (Top Navbar) dan aktivitas (Dashboard) akan memanggil endpoint yang serupa untuk "Recent Activity", pertimbangkan untuk membuat satu global `useQuery` hook (misal `useRecentActivities`) agar React Query dapat melakukan *caching* dan menghindari pemanggilan API yang redundan di berbagai komponen.
- **Form Schemas**: Validasi Zod saat ini ditempatkan di atas deklarasi komponen (seperti di `UserModal.tsx`). Jika *form logic* semakin kompleks, pindahkan skema Zod ke folder tersendiri (`src/schemas/userSchema.ts`) untuk memisahkan *logic* dari presentasi visual.

## 3. Optimasi Performa
- **Paginasi Tabel API**: Di `DataAnggota.tsx` dan modul lainnya, kueri data saat ini melakukan fetch semua record sekaligus (e.g. `?limit=1000`) dan membiarkan sisi *client* memfilter *length*-nya. Di versi produksi dengan ratusan pengguna dan ribuan log kegiatan, tabel harus di-refactor menggunakan *Server-Side Pagination* via limit/offset atau cursor-based pagination.
- **React Lazy / Suspense**: Seluruh halaman (`Dashboard.tsx`, `DataAnggota.tsx`) di-*import* langsung ke `App.tsx`. Agar loading awal (*Time to Interactive*) aplikasi lebih ringan, gunakan `React.lazy()` pada routing React Router.

## 4. Perbaikan UX/UI Masa Depan
- **Organisasi Interaktif**: Fitur `Struktur Organisasi` sebaiknya direfactor menjadi komponen interaktif visual berjenjang (Diagram Pohon / *Org Chart*) ketika relasi jabatan (Ketua -> Wakil -> Sekretaris -> Anggota) telah terdefinisi secara mutlak di backend.
- **Komponen File Upload**: Jika modul `Arsip` diaktifkan, diperlukan implementasi pustaka UI yang lebih interaktif untuk drag-and-drop file upload dengan bar *progress loading* asinkron menggunakan *multipart/form-data*.
