import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Heart, User, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  nia: z.string().min(1, 'NIA atau Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.nia, data.password);
      toast.success('Login berhasil');
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Username/NIA atau Password salah.');
      } else {
        toast.error(error.response?.data?.message || 'Login gagal, periksa kembali kredensial Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Branding Section */}
        <div className="w-full md:w-1/2 bg-[#B71C1C] text-white p-10 md:p-14 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-white/20 p-2 rounded-full">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight">KSR PMI</h2>
                <p className="text-sm text-white/80">Universitas Muhammadiyah Malang</p>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Sistem Informasi<br />KSR PMI UMM
            </h1>
            <p className="text-white/80 text-lg max-w-sm mb-12">
              Platform digital terpadu untuk manajemen organisasi, kegiatan, anggota, inventaris, dan administrasi KSR PMI UMM.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/10 rounded-2xl p-4 border border-white/10">
              <h3 className="text-2xl font-bold">72</h3>
              <p className="text-sm text-white/80">Anggota Aktif</p>
            </div>
            <div className="bg-black/10 rounded-2xl p-4 border border-white/10">
              <h3 className="text-2xl font-bold">24</h3>
              <p className="text-sm text-white/80">Kegiatan 2024</p>
            </div>
            <div className="bg-black/10 rounded-2xl p-4 border border-white/10">
              <h3 className="text-2xl font-bold">47+</h3>
              <p className="text-sm text-white/80">Pasien Ditangani</p>
            </div>
            <div className="bg-black/10 rounded-2xl p-4 border border-white/10">
              <h3 className="text-2xl font-bold">820+</h3>
              <p className="text-sm text-white/80">Pendonor Darah</p>
            </div>
          </div>
        </div>

        {/* Right Login Section */}
        <div className="w-full md:w-1/2 p-10 md:p-14 bg-white flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-500 text-lg">Masuk untuk mengakses dashboard</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Username / NIA</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  {...register('nia')}
                  placeholder="Masukkan username atau NIA"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-800 focus:ring-2 focus:ring-[#B71C1C] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.nia && <span className="text-red-500 text-sm mt-1">{errors.nia.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  {...register('password')}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border border-gray-100 text-gray-800 focus:ring-2 focus:ring-[#B71C1C] focus:border-transparent outline-none transition-all"
                />
              </div>
              {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer w-5 h-5 border-2 border-gray-300 rounded appearance-none checked:bg-[#B71C1C] checked:border-[#B71C1C] transition-colors" />
                  <svg className="absolute w-3 h-3 text-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-gray-600 font-medium text-sm">Ingat saya</span>
              </label>
              <a href="#" className="text-sm font-bold text-[#B71C1C] hover:text-red-900 transition-colors">
                Lupa password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B71C1C] hover:bg-red-800 text-white font-bold py-4 px-4 rounded-2xl transition-colors disabled:opacity-70 mt-4"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-auto pt-10 text-center">
            <p className="text-xs text-gray-400 font-medium">Sistem Informasi KSR PMI UMM &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
