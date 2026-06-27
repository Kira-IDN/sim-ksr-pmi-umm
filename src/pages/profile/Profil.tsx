import { useAuthStore } from '@/store/authStore';
import { User, Mail, Phone, Calendar, Edit, Shield, Lock, Award, Briefcase } from 'lucide-react';

export const Profil = () => {
  const { user } = useAuthStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-6">
      
      {/* Header Profile Card */}
      <div className="bg-[#B71C1C] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start justify-between shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-white/20 p-1 flex-shrink-0">
            <div className="w-full h-full bg-[#E57373] text-white rounded-xl flex items-center justify-center text-4xl font-bold">
              {user?.name?.substring(0, 2).toUpperCase() || 'AF'}
            </div>
          </div>
          <div className="text-center md:text-left text-white">
            <h2 className="text-3xl font-bold mb-1">{user?.name || 'Ahmad Fauzi'}</h2>
            <p className="text-lg font-medium text-white/90 mb-1">{user?.roleName || 'Ketua Umum'} - KSR PMI UMM</p>
            <p className="text-sm text-white/70">NIA: {user?.nia || '3202300050001'}</p>
          </div>
        </div>
        <button 
          disabled
          className="mt-6 md:mt-0 bg-white/10 text-white/50 px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 cursor-not-allowed border border-white/10"
        >
          <Edit className="w-4 h-4" />
          Edit Profil (Segera)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Informasi Pribadi */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-8">Informasi Pribadi</h3>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-0.5 bg-red-50 p-2 rounded-lg text-[#B71C1C] shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Nama Lengkap</p>
                <p className="font-bold text-gray-800">{user?.name || 'Ahmad Fauzi'}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-0.5 bg-red-50 p-2 rounded-lg text-[#B71C1C] shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Email</p>
                <p className="font-bold text-gray-800">ahmad@umm.ac.id</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-0.5 bg-red-50 p-2 rounded-lg text-[#B71C1C] shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">No. HP</p>
                <p className="font-bold text-gray-800">081234567890</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-0.5 bg-red-50 p-2 rounded-lg text-[#B71C1C] shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Jabatan</p>
                <p className="font-bold text-gray-800">{user?.roleName || 'Ketua Umum'}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-0.5 bg-red-50 p-2 rounded-lg text-[#B71C1C] shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Divisi</p>
                <p className="font-bold text-gray-800">Inti</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="mt-0.5 bg-red-50 p-2 rounded-lg text-[#B71C1C] shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">Bergabung</p>
                <p className="font-bold text-gray-800">1 September 2022</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Statistik & Keamanan */}
        <div className="space-y-6">
          
          {/* Statistik Kontribusi */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Statistik Kontribusi</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <h4 className="text-3xl font-black text-[#B71C1C] mb-1">18</h4>
                <p className="text-xs font-medium text-gray-500">Kegiatan Diikuti</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <h4 className="text-3xl font-black text-[#B71C1C] mb-1">94%</h4>
                <p className="text-xs font-medium text-gray-500">Absensi Hadir</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <h4 className="text-3xl font-black text-[#B71C1C] mb-1">12</h4>
                <p className="text-xs font-medium text-gray-500">Tugas Selesai</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
                <h4 className="text-3xl font-black text-[#B71C1C] mb-1">840</h4>
                <p className="text-xs font-medium text-gray-500">Poin KSR</p>
              </div>
            </div>
          </div>

          {/* Keamanan Akun */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Keamanan Akun</h3>
            
            <div className="space-y-3">
              <button disabled className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed text-left">
                <div className="text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-500">Ubah Password (Segera)</span>
              </button>
              
              <button disabled className="w-full flex items-center gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed text-left">
                <div className="text-gray-400">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-bold text-gray-500">Aktifkan 2FA (Segera)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
