import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasModuleAccess, Module } from '@/constants/rbac';
import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  Users,
  Network,
  CalendarDays,
  UserCheck,
  Package,
  HeartPulse,
  CircleDollarSign,
  Archive,
  CheckSquare,
  BarChart3,
  User,
  Settings,
  LogOut,
  MessageSquareWarning,
  FileSpreadsheet,
  BookOpen,
  ArrowRightLeft,
  Heart,
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  module: Module;
}

const SidebarItem = ({ to, icon: Icon, label, module }: SidebarItemProps) => {
  const { user } = useAuthStore();
  if (!hasModuleAccess((user?.roleName as any) || null, module)) return null;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-2.5 rounded-2xl my-0.5 mx-2 transition-all duration-150 text-sm',
          isActive
            ? 'bg-[#B71C1C] text-white font-semibold shadow-sm'
            : 'text-gray-500 hover:bg-red-50 hover:text-[#B71C1C] dark:text-gray-400 dark:hover:bg-slate-800/50 dark:hover:text-red-400'
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </NavLink>
  );
};

const SectionLabel = ({ label }: { label: string }) => (
  <h2 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 mt-5 px-6">
    {label}
  </h2>
);

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Wrapper */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 h-screen overflow-hidden flex-shrink-0 transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0 w-60" : "-translate-x-full w-60 md:translate-x-0 md:w-0"
      )}>
        <aside className="w-60 h-full bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 h-20 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <div className="bg-[#B71C1C] text-white p-1.5 rounded-xl">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 dark:text-gray-100 text-sm leading-tight">UMM</h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">KSR PMI</p>
            </div>
          </div>

          {/* Navigation — scrollable */}
          <nav className="flex-1 overflow-y-auto py-3 custom-scrollbar">

            {/* UTAMA */}
            <SectionLabel label="Utama" />
            <SidebarItem to="/dashboard"   icon={LayoutDashboard} label="Dashboard"           module="Dashboard" />
            <SidebarItem to="/anggota"     icon={Users}           label="Data Anggota"        module="Data Anggota" />
            <SidebarItem to="/organisasi"  icon={Network}         label="Struktur Organisasi" module="Struktur Organisasi" />

            {/* OPERASIONAL */}
            <SectionLabel label="Operasional" />
            <SidebarItem to="/kegiatan"    icon={CalendarDays}    label="Manajemen Kegiatan"  module="Manajemen Kegiatan" />
            <SidebarItem to="/absensi"     icon={UserCheck}       label="Absensi Digital"     module="Absensi Digital" />
            <SidebarItem to="/inventaris"  icon={Package}         label="Inventaris"          module="Inventaris" />
            <SidebarItem to="/pasien"      icon={HeartPulse}      label="Data Pasien & Korban" module="Data Pasien & Korban" />
            <SidebarItem to="/buku-tamu"   icon={BookOpen}        label="Buku Tamu Digital"   module="Buku Tamu Digital" />
            <SidebarItem to="/peminjaman"  icon={ArrowRightLeft}  label="Peminjaman Barang"   module="Peminjaman Barang" />

            {/* ADMINISTRASI */}
            <SectionLabel label="Administrasi" />
            <SidebarItem to="/keuangan"    icon={CircleDollarSign} label="Keuangan"           module="Keuangan" />
            <SidebarItem to="/arsip"       icon={Archive}          label="Arsip & Administrasi" module="Arsip & Administrasi" />
            <SidebarItem to="/approval"    icon={CheckSquare}      label="Approval"            module="Approval" />
            <SidebarItem to="/laporan"     icon={BarChart3}        label="Laporan & Monitoring" module="Laporan & Monitoring" />
            <SidebarItem to="/rekap"       icon={FileSpreadsheet}  label="Rekap Laporan"        module="Rekap Laporan" />
            <SidebarItem to="/pengaduan"   icon={MessageSquareWarning} label="Form Pengaduan"  module="Form Pengaduan" />

          </nav>

          {/* Footer — Profile, Settings, Logout */}
          <div className="border-t border-gray-100 dark:border-slate-800 py-3 shrink-0">
            <SidebarItem to="/profil"      icon={User}     label="Profil Saya" module="Profil Saya" />
            <SidebarItem to="/pengaturan"  icon={Settings} label="Pengaturan"  module="Pengaturan" />

            {user?.roleName !== 'Tamu' && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-2xl w-[calc(100%-16px)] text-left text-[#B71C1C] hover:bg-red-50 dark:text-red-400 dark:hover:bg-slate-800/50 transition-all duration-150 text-sm font-medium mt-0.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </>
  );
};
