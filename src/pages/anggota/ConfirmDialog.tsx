import { AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

export const ConfirmDialog = ({ isOpen, onClose, userId, userName }: ConfirmDialogProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Anggota berhasil dihapus');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Gagal menghapus anggota');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-ksr-danger" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Hapus Anggota?</h2>
          <p className="text-sm text-gray-500 mb-6">
            Apakah Anda yakin ingin menghapus <strong>{userName}</strong>? Tindakan ini tidak dapat dibatalkan.
          </p>
          
          <div className="flex w-full gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-gray-600 font-bold bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="flex-1 py-3 rounded-xl bg-ksr-danger text-white font-bold hover:bg-red-700 transition-colors disabled:opacity-70"
            >
              {mutation.isPending ? 'Menghapus...' : 'Hapus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
