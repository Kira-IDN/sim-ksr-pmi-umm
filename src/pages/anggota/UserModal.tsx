import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const userSchema = z.object({
  nia: z.string().min(1, 'NIM / NIA wajib diisi'),
  name: z.string().min(1, 'Nama wajib diisi'),
  password: z.string().optional(),
  generation: z.number().min(2000, 'Angkatan wajib dipilih'),
  status: z.enum(['Active', 'Inactive', 'Alumni']),
  roleId: z.string().min(1, 'Role wajib dipilih')
});

type UserForm = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
}

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

  const { register, handleSubmit, setError, formState: { errors }, reset } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nia: '',
      name: '',
      password: '',
      generation: 0,
      status: 'Active',
      roleId: ''
    }
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        nia: user.nia,
        name: user.name,
        generation: user.generation,
        status: user.status,
        roleId: user.roleId,
        password: ''
      });
    } else if (!user && isOpen) {
      reset({
        nia: '',
        name: '',
        password: '',
        generation: 0,
        status: 'Active',
        roleId: ''
      });
    }
  }, [user, isOpen, reset]);

  const mutation = useMutation({
    mutationFn: async (data: UserForm) => {
      if (isEditing) {
        // If password is empty during edit, delete it from payload so we don't overwrite with empty
        const payload = { ...data };
        if (!payload.password) delete payload.password;
        
        await api.put(`/users/${user.id}`, payload);
      } else {
        await api.post('/users', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Anggota berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}`);
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Terjadi kesalahan');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
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
          mutation.mutate(d);
        })} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">NIA</label>
              <input 
                {...register('nia')} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
                placeholder="NIM / NIA"
              />
              {errors.nia && <p className="text-red-500 text-xs mt-1">{errors.nia.message}</p>}
            </div>
            <div>
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
              <label className="block text-sm font-bold text-gray-700 mb-1">Angkatan</label>
              <select 
                {...register('generation', { valueAsNumber: true })} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
              >
                <option value={0} disabled>Pilih Tahun...</option>
                <option value={2020}>2020</option>
                <option value={2021}>2021</option>
                <option value={2022}>2022</option>
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
              {errors.generation && <p className="text-red-500 text-xs mt-1">{errors.generation.message}</p>}
            </div>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Role Jabatan</label>
              <select 
                {...register('roleId')} 
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ksr-primary outline-none"
              >
                <option value="" disabled>Pilih Role...</option>
                {rolesData?.data?.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {errors.roleId && <p className="text-red-500 text-xs mt-1">{errors.roleId.message}</p>}
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
