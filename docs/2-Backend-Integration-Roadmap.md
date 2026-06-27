# Backend Integration Roadmap

Tahap selanjutnya adalah menghubungkan modul-modul frontend dengan API Backend. Berikut adalah urutan prioritas dan dependensi integrasi yang direkomendasikan untuk menghindari *blocking* dalam pengembangan.

## Urutan Integrasi & Implementasi (Phases)

### Phase 1: Identity & Access Management (IAM)
* **Modul**: Authentication, Users, Roles
* **Dependensi**: Tidak ada (Ini adalah fondasi sistem)
* **Tugas**:
  1. Integrasi `/login` dengan JWT authentication.
  2. Integrasi Axios interceptors untuk token refresh.
  3. API CRUD Data Anggota (Users) & Roles (Jabatan).
* **Output**: Halaman *Login* dan *Data Anggota* sepenuhnya terhubung ke *live database*.

### Phase 2: Struktur & Profil Organisasi
* **Modul**: Struktur Organisasi, Profil Pengguna
* **Dependensi**: Membutuhkan Phase 1 (Data Anggota & Roles)
* **Tugas**:
  1. API pemetaan anggota berdasarkan `roleId` untuk visualisasi Struktur Organisasi (Hierarki).
  2. Fitur `Update Profile` dan Integrasi Keamanan (Ubah Password).
* **Output**: Halaman Profil Pengguna aktif, halaman Struktur Organisasi memiliki visualisasi pohon organisasi yang dinamis.

### Phase 3: Core Operations (Manajemen Kegiatan & Absensi)
* **Modul**: Kegiatan, Absensi
* **Dependensi**: Membutuhkan Phase 1 (Data Anggota)
* **Tugas**:
  1. API CRUD Kegiatan & Penugasan Anggota.
  2. Modul input dan validasi Kehadiran/Absensi berbasis kegiatan.
* **Output**: Panel kegiatan berfungsi penuh, pendaftaran dan presensi anggota berjalan.

### Phase 4: Dokumen & Persetujuan (Administration & Approvals)
* **Modul**: Arsip, Approval
* **Dependensi**: Membutuhkan Phase 3 (Kegiatan)
* **Tugas**:
  1. API Upload & Manajemen Dokumen (Local storage / Cloud bucket).
  2. State Machine Approval (Pending -> Approved/Rejected).
* **Output**: Sistem persetujuan laporan keuangan dan proposal kegiatan berjalan, dokumen dapat diunggah dan diunduh.

### Phase 5: Resource Management (Keuangan & Inventaris)
* **Modul**: Keuangan, Inventaris (Jika ada)
* **Dependensi**: Phase 4 (Untuk integrasi approval keuangan/pembelian)
* **Tugas**:
  1. API pencatatan mutasi kas (In/Out).
  2. API pelacakan peminjaman alat dan validasi stok.
* **Output**: Transparansi finansial tercatat; manajemen alat logistik aktif.

### Phase 6: Analytical & Global Features
* **Modul**: Laporan & Monitoring (Dashboard), Notifikasi, Pengaduan
* **Dependensi**: Membutuhkan semua modul di atas
* **Tugas**:
  1. API agregasi statistik (Kueri metrik, absensi total, grafik bulanan).
  2. Trigger event Notifikasi realtime atau poling berbasis *user session*.
  3. Form API keluhan.
* **Output**: Dashboard menjadi *Command Center* real-time yang akurat, Notifikasi otomatis berjalan saat ada dokumen menunggu *Approval*.
