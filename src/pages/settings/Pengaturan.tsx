import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';

export const Pengaturan = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [font, setFont] = useState('Normal');
  
  const [notifApproval, setNotifApproval] = useState(() => {
    const saved = localStorage.getItem('ksr_notif_approval');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [notifKegiatan, setNotifKegiatan] = useState(() => {
    const saved = localStorage.getItem('ksr_notif_kegiatan');
    return saved !== null ? saved === 'true' : true;
  });
  
  const [notifStok, setNotifStok] = useState(() => {
    const saved = localStorage.getItem('ksr_notif_stok');
    return saved !== null ? saved === 'true' : false;
  });

  const [language, setLanguage] = useState('Bahasa Indonesia');




  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-6">
      
      {/* Tampilan */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Tampilan</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-6">
            <div>
              <p className="font-bold text-gray-800 mb-1">Mode Gelap</p>
              <p className="text-sm text-gray-500">Aktifkan tema gelap untuk seluruh aplikasi</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`w-14 h-8 rounded-full p-1 transition-colors ${darkMode ? 'bg-[#B71C1C]' : 'bg-gray-200'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-sm transform transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800 mb-1">Ukuran Font</p>
              <p className="text-sm text-gray-500">Sesuaikan ukuran teks aplikasi</p>
            </div>
            <select 
              disabled
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-medium text-gray-400 outline-none cursor-not-allowed"
            >
              <option value="Normal">Normal (Segera)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifikasi */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Notifikasi</h3>
        
        <div className="space-y-6">
          <label className="flex items-start justify-between cursor-pointer border-b border-gray-50 pb-6">
            <div>
              <p className="font-bold text-gray-800 mb-1">Notifikasi Approval</p>
              <p className="text-sm text-gray-500">Notifikasi saat ada permintaan persetujuan baru</p>
            </div>
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                checked={notifApproval}
                onChange={() => {
                  const val = !notifApproval;
                  setNotifApproval(val);
                  localStorage.setItem('ksr_notif_approval', String(val));
                }}
                className="peer w-6 h-6 border-2 border-gray-300 rounded-md appearance-none checked:bg-[#B71C1C] checked:border-[#B71C1C] transition-colors cursor-pointer" 
              />
              <svg className="absolute w-4 h-4 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </label>

          <label className="flex items-start justify-between cursor-pointer border-b border-gray-50 pb-6">
            <div>
              <p className="font-bold text-gray-800 mb-1">Notifikasi Kegiatan</p>
              <p className="text-sm text-gray-500">Pengingat sebelum kegiatan berlangsung</p>
            </div>
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                checked={notifKegiatan}
                onChange={() => {
                  const val = !notifKegiatan;
                  setNotifKegiatan(val);
                  localStorage.setItem('ksr_notif_kegiatan', String(val));
                }}
                className="peer w-6 h-6 border-2 border-gray-300 rounded-md appearance-none checked:bg-[#B71C1C] checked:border-[#B71C1C] transition-colors cursor-pointer" 
              />
              <svg className="absolute w-4 h-4 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </label>

          <label className="flex items-start justify-between cursor-pointer">
            <div>
              <p className="font-bold text-gray-800 mb-1">Notifikasi Stok</p>
              <p className="text-sm text-gray-500">Peringatan saat stok inventaris menipis</p>
            </div>
            <div className="relative flex items-center mt-1">
              <input 
                type="checkbox" 
                checked={notifStok}
                onChange={() => {
                  const val = !notifStok;
                  setNotifStok(val);
                  localStorage.setItem('ksr_notif_stok', String(val));
                }}
                className="peer w-6 h-6 border-2 border-gray-300 rounded-md appearance-none checked:bg-[#B71C1C] checked:border-[#B71C1C] transition-colors cursor-pointer" 
              />
              <svg className="absolute w-4 h-4 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </label>
        </div>
      </div>

      {/* Sistem */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Sistem</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 pb-6">
            <div>
              <p className="font-bold text-gray-800 mb-1">Bahasa</p>
              <p className="text-sm text-gray-500">Bahasa antarmuka aplikasi</p>
            </div>
            <select 
              disabled
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl font-medium text-gray-400 outline-none cursor-not-allowed min-w-[180px]"
            >
              <option value="Bahasa Indonesia">Bahasa Indonesia (Segera)</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};
