import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../sidebar/Sidebar';
import { TopNavbar } from '../navbar/TopNavbar';
import { useAuthStore } from '@/store/authStore';
import { hasModuleAccess } from '@/constants/rbac';

// Map pathnames to display titles
const getPageTitle = (pathname: string) => {
  const titles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/anggota': 'Data Anggota',
    '/organisasi': 'Struktur Organisasi',
    '/kegiatan': 'Manajemen Kegiatan',
    '/absensi': 'Absensi Digital',
    '/inventaris': 'Inventaris & Peminjaman',
    '/pasien': 'Data Pasien & Korban',
    '/keuangan': 'Keuangan Organisasi',
    '/arsip': 'Arsip & Administrasi',
    '/approval': 'Approval Kegiatan & Laporan',
    '/laporan': 'Laporan & Monitoring',
    '/pengaduan': 'Form Pengaduan',
    '/profil': 'Profil Saya',
    '/pengaturan': 'Pengaturan',
  };
  return titles[pathname] || 'Dashboard';
};

export const AppLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Route protection for Pengaturan
  if (location.pathname === '/pengaturan' && !hasModuleAccess((user?.roleName as any) || null, 'Pengaturan')) {
    return <Navigate to="/dashboard" replace />;
  }

  const title = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-ksr-background font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        <TopNavbar title={title} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto pt-8 px-8 pb-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
