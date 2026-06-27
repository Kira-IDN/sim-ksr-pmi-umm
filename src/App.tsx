import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/dashboard/Dashboard';
import { DataAnggota } from './pages/anggota/DataAnggota';
import { StrukturOrganisasi } from './pages/organisasi/StrukturOrganisasi';
import { ManajemenKegiatan } from './pages/kegiatan/ManajemenKegiatan';
import { AbsensiDigital } from './pages/absensi/AbsensiDigital';
import { Inventaris } from './pages/inventaris/Inventaris';
import { DataPasien } from './pages/pasien/DataPasien';
import { Keuangan } from './pages/keuangan/Keuangan';
import { Arsip } from './pages/arsip/Arsip';
import { Approval } from './pages/approval/Approval';
import { Laporan } from './pages/laporan/Laporan';
import { Pengaduan } from './pages/pengaduan/Pengaduan';
import { Profil } from './pages/profile/Profil';
import { Pengaturan } from './pages/settings/Pengaturan';
import { useAuthStore } from './store/authStore';

// Temporary placeholders for other pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-full items-center justify-center text-gray-400">
    Halaman {title} sedang dalam pengembangan.
  </div>
);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="anggota" element={<DataAnggota />} />
          <Route path="organisasi" element={<StrukturOrganisasi />} />
          
          <Route path="kegiatan" element={<ManajemenKegiatan />} />
          <Route path="absensi" element={<AbsensiDigital />} />
          <Route path="inventaris" element={<Inventaris />} />
          <Route path="pasien" element={<DataPasien />} />
          <Route path="buku-tamu" element={<Placeholder title="Buku Tamu" />} />
          <Route path="peminjaman" element={<Placeholder title="Peminjaman Barang" />} />
          
          <Route path="keuangan" element={<Keuangan />} />
          <Route path="arsip" element={<Arsip />} />
          <Route path="approval" element={<Approval />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="rekap" element={<Placeholder title="Rekap Laporan" />} />
          <Route path="pengaduan" element={<Pengaduan />} />
          
          <Route path="profil" element={<Profil />} />
          <Route path="pengaturan" element={<Pengaturan />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
