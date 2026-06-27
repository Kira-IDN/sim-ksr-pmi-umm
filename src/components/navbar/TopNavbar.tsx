import { useState, useRef, useEffect } from 'react';
import { Menu, Moon, Bell, LogOut, User as UserIcon, Settings, CheckSquare, Package, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { hasModuleAccess } from '@/constants/rbac';
import { useNavigate } from 'react-router-dom';

interface TopNavbarProps {
  title?: string;
}

const INITIAL_MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'approval',
    title: 'Laporan Kegiatan Baru',
    message: 'Diklat Ruang Angkatan 34 menunggu persetujuan dari Ketua Umum KSR PMI.',
    time: '10 menit yang lalu',
    read: false,
  },
  {
    id: 2,
    type: 'inventory',
    title: 'Peminjaman Alat',
    message: 'Tandu lipat dan tabung oksigen dipinjam oleh Fikes untuk praktikum.',
    time: '1 jam yang lalu',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    title: 'Pembaruan Sistem',
    message: 'Maintenance server pada pukul 23:00 WIB. Harap simpan data Anda sebelum waktu tersebut.',
    time: '1 hari yang lalu',
    read: true,
  }
];

export const TopNavbar = ({ title = 'Dashboard' }: TopNavbarProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  
  const [notifications, setNotifications] = useState(() => {
    const saved = sessionStorage.getItem('mockNotifications');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_NOTIFICATIONS;
  });
  
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  
  const { darkMode, toggleDarkMode } = useThemeStore();
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-400">Sistem Informasi KSR PMI UMM</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleDarkMode}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Moon className="w-5 h-5" />
        </button>
        
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="text-gray-400 hover:text-gray-600 relative p-2"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-ksr-danger text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 dark:bg-slate-800 dark:border-slate-700">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center dark:border-slate-700">
                <h3 className="font-bold text-gray-800 dark:text-gray-100">Notifikasi</h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full dark:bg-slate-700 dark:text-gray-300">Demo</span>
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.map((notif: any) => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-b border-gray-50 cursor-pointer transition-colors flex gap-3 relative dark:border-slate-700 ${notif.read ? 'hover:bg-gray-50 dark:hover:bg-slate-700/50' : 'bg-blue-50/30 hover:bg-blue-50/60 dark:bg-slate-700/30 dark:hover:bg-slate-700/60'}`}
                  >
                    {!notif.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-ksr-primary rounded-full"></div>
                    )}
                    
                    <div className="shrink-0 pt-1">
                      {notif.type === 'approval' ? (
                        <div className="bg-yellow-50 text-yellow-600 p-2 rounded-lg dark:bg-slate-700 dark:text-yellow-400">
                          <CheckSquare className="w-4 h-4" />
                        </div>
                      ) : notif.type === 'inventory' ? (
                        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg dark:bg-slate-700 dark:text-blue-400">
                          <Package className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="bg-gray-100 text-gray-500 p-2 rounded-lg dark:bg-slate-700 dark:text-gray-300">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${notif.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 break-words dark:text-gray-400">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-2 font-medium">
                        {notif.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100 text-center bg-gray-50 dark:bg-slate-800/80 dark:border-slate-700">
                <button 
                  onClick={() => { 
                    const updated = notifications.map((n: any) => ({ ...n, read: true }));
                    setNotifications(updated);
                    sessionStorage.setItem('mockNotifications', JSON.stringify(updated));
                  }}
                  className="text-xs font-bold text-ksr-primary hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                  Tandai semua dibaca
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative border-l border-gray-100 pl-4" ref={profileRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-colors"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-10 h-10 rounded-full bg-ksr-primary text-white flex items-center justify-center font-bold shadow-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.roleName}</p>
            </div>
          </div>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.nia}</p>
              </div>
              <div className="py-2">
                <button onClick={() => { setShowProfileMenu(false); navigate('/profil'); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  Profil Saya
                </button>
                {hasModuleAccess((user?.roleName as any) || null, 'Pengaturan') && (
                  <button onClick={() => { setShowProfileMenu(false); navigate('/pengaturan'); }} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <Settings className="w-4 h-4 text-gray-400" />
                    Pengaturan
                  </button>
                )}
              </div>
              <div className="border-t border-gray-100 py-2">
                <button onClick={handleLogout} className="w-full px-4 py-2 text-left text-sm text-ksr-primary hover:bg-red-50 flex items-center gap-3 font-medium">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
