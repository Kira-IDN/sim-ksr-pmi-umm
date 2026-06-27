import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const userSchema = z.object({
  loginId: z.string().min(1, 'ID Login wajib diisi'),
  nia: z.string().min(1, 'NIM / NIA wajib diisi'),
  name: z.string().min(1, 'Nama wajib diisi'),
  password: z.string().optional(),
  division: z.string().min(1, 'Bidang wajib dipilih'),
  position: z.string().min(1, 'Jabatan wajib dipilih'),
  status: z.enum(['Active', 'Inactive', 'Alumni']),
});

type UserForm = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

const mapPositionToRoleName = (position: string) => {
  if (position === 'Ketua Umum') return 'Ketua Umum';
  if (position.includes('Wakil Ketua Umum')) return 'Wakil Ketua Umum';
  if (position.includes('Sekretaris')) return 'Sekretaris';
  if (position.includes('Bendahara')) return 'Bendahara';
  if (position === 'Kepala Bidang') return 'Pengurus Bidang';
  if (position === 'Admin Sistem') return 'Admin Sistem';
  return 'Anggota Biasa';
};

export const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const queryClient = useQueryClient();
  const isEditing = !!user;

  const { data: rolesData } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const res = await api.get('/roles');
      return res.data;
    },
    enabled: isOpen
  });

  const { register, handleSubmit, setError, formState: { errors }, reset, control, setValue } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      loginId: '',
      nia: '',
      name: '',
      password: '',
      division: '',
      position: '',
      status: 'Active',
    }
  });

  const selectedDivision = useWatch({
    control,
    name: 'division'
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        loginId: user.loginId || user.nia,
        nia: user.nia,
        name: user.name,
        division: user.division || '',
        position: user.position || '',
        status: user.status,
        password: ''
      });
    } else if (!user && isOpen) {
      reset({
        loginId: '',
        nia: '',
        name: '',
        password: '',
        division: '',
        position: '',
        status: 'Active',
      });
    }
  }, [user, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UserForm) => {
      const roleName = mapPositionToRoleName(data.position);
      const role = rolesData?.data?.find((r: any) => r.name === roleName);
      
      if (!role) {
        throw new Error(`Role internal '${roleName}' tidak ditemukan di database.`);
      }

      const payload: any = { ...data, roleId: role.id };
      
      if (isEditing) {
        if (!payload.password) delete payload.password;
        await api.put(`/users/${user.id}`, payload);
      } else {
        await api.post('/users', payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Anggota berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}`);
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || err.message || 'Terjadi kesalahan');
    }
  });

  if (!isOpen) return null;

  const getPositionOptions = (div: string) => {
    if (div === 'Pengurus Inti') {
      return ['Ketua Umum', 'Wakil Ketua Umum 1', 'Wakil Ketua Umum 2', 'Sekretaris Umum 1', 'Sekretaris Umum 2', 'Bendahara Umum 1', 'Bendahara Umum 2'];
    }
    if (div === 'Administrasi Sistem') {
      return ['Admin Sistem'];
    }
    if (div) {
      return ['Kepala Bidang', 'Anggota'];
    }
    return [];
  };

  const positionOptions = getPositionOptions(selectedDivision);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Edit Anggota' : 'Tambah Anggota Baru'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit((d) => {
          if (!isEditing && !d.password) {
            setError('password', { type: 'manual', message: 'Password wajib diisi' });
            return;
          }
          if (positionOptions.length > 0 && !positionOptions.includes(d.position)) {
             setError('position', { type: 'manual', message: 'Jabatan tidak valid untuk bidang ini' });
             return;
          }
          mutation.mutate(d);
        })} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">ID Login</label>
              <input 
                {...register('loginId')} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
                placeholder="ID Internal"
              />
              {errors.loginId && <p className="text-red-500 text-xs mt-1">{errors.loginId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">NIA</label>
              <input 
                {...register('nia')} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
                placeholder="NIM / NIA Resmi"
              />
              {errors.nia && <p className="text-red-500 text-xs mt-1">{errors.nia.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
              <input 
                {...register('name')} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
                placeholder="Nama Lengkap"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bidang</label>
              <select 
                {...register('division')} 
                onChange={(e) => {
                  register('division').onChange(e);
                  setValue('position', ''); // Reset position when division changes
                }}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
              >
                <option value="" disabled>Pilih Bidang...</option>
                <option value="Pengurus Inti">Pengurus Inti</option>
                <option value="Dikten">Dikten</option>
                <option value="Bitpen">Bitpen</option>
                <option value="Litbang">Litbang</option>
                <option value="Opdimas">Opdimas</option>
                <option value="Logistik">Logistik</option>
                <option value="Kesra">Kesra</option>
                <option value="Administrasi Sistem">Administrasi Sistem</option>
              </select>
              {errors.division && <p className="text-red-500 text-xs mt-1">{errors.division.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Jabatan</label>
              <select 
                {...register('position')} 
                disabled={!selectedDivision}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none disabled:opacity-50"
              >
                <option value="" disabled>Pilih Jabatan...</option>
                {positionOptions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password {isEditing && '(Opsional)'}</label>
              <input 
                type="password"
                {...register('password')} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
                placeholder="***"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
              <select 
                {...register('status')} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Alumni">Alumni</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={mutation.isPending}
              className="px-6 py-2 rounded-xl bg-ksr-primary text-white font-bold hover:bg-red-800 transition-colors disabled:opacity-70"
            >
              {mutation.isPending ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
