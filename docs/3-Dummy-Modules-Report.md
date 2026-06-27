# Dummy Modules Report

Dokumen ini mendata seluruh halaman, komponen, atau UI elemen yang saat ini menggunakan data fiktif (mock data), *placeholder*, atau ditandai sebagai "Coming Soon" (`(Segera)`). Data ini wajib dihubungkan ke respon API saat *backend* terkait tersedia.

## Komponen Menggunakan *Mock Data* (Dummy Array)

1. **Dashboard & Laporan (Statistik)** (`src/pages/dashboard/Dashboard.tsx`, `src/pages/laporan/Laporan.tsx`)
   - **Data Saat Ini**: Grafik Recharts (Tren Kegiatan, Pendonor, Pie Chart Divisi, Bar Chart Keuangan).
   - **Data Backend Dibutuhkan**: JSON array format metrik historikal untuk render chart, termasuk agregasi `count` kegiatan, statistik pasien, dan rekapan saldo keuangan (in/out).
   
2. **Top Navbar (Notifikasi)** (`src/components/navbar/TopNavbar.tsx`)
   - **Data Saat Ini**: State `mockNotifications` disimpan dalam `sessionStorage`.
   - **Data Backend Dibutuhkan**: Endpoint GET `/notifications` untuk *polling* atau interaksi WebSocket. Fitur "Mark all as read" membutuhkan endpoint PUT/PATCH.
   
3. **Approval (Persetujuan)** (`src/pages/approval/Approval.tsx`)
   - **Data Saat Ini**: Variabel array statis `mockApprovals`.
   - **Data Backend Dibutuhkan**: Endpoint yang mereturn state pending/approved/rejected dari dokumen/proposal user, lengkap dengan *foreign key* `user` (yang mengajukan).
   
4. **Arsip & Administrasi** (`src/pages/arsip/Arsip.tsx`)
   - **Data Saat Ini**: Variabel array statis `mockArsip`.
   - **Data Backend Dibutuhkan**: Endpoint untuk *list* dokumen.

5. **Form Pengaduan** (`src/pages/pengaduan/Pengaduan.tsx`)
   - **Data Saat Ini**: Variabel array internal (bila ada) atau API yang belum sepenuhnya diproses di database. Saat ini tombol "Buat Pengaduan" dinonaktifkan.
   
6. **Kegiatan** (`src/pages/kegiatan/Kegiatan.tsx`)
   - **Data Saat Ini**: UI Layout yang dibatasi dengan status *(Segera)*.
   - **Data Backend Dibutuhkan**: CRUD jadwal, absensi acara.

## Fitur Berstatus "Coming Soon" (Tombol Dinonaktifkan)

Komponen berikut secara visual di-*disable* dengan *cursor-not-allowed* dan label `(Segera)` untuk menjaga UX tetap konsisten:

* **Arsip**: Tombol `Upload Dokumen`, dan *Action Icons* (Lihat, Download, Hapus).
* **Approval**: Tombol `Setujui`, `Tolak`, dan ikon `Detail`.
* **Pengaduan**: Tombol `Buat Pengaduan`.
* **Laporan**: Tombol export dokumen (`Export PDF`, `Export Excel`).
* **Profil Pengguna**:
  * `Edit Profil`
  * `Ubah Password`
  * `Aktifkan 2FA`
* **Pengaturan**: Pilihan `Bahasa` (Bahasa Indonesia) dan `Ukuran Font` (Normal).
