import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MessageSquareWarning, Plus } from 'lucide-react';

export const Pengaduan = () => {
  const { data: complaintsData, isLoading, error } = useQuery({
    queryKey: ['complaints'],
    queryFn: async () => {
      const res = await api.get('/complaints?limit=100');
      return res.data;
    }
  });

  if (error) {
    toast.error('Gagal memuat data pengaduan');
  }

  const complaints = complaintsData?.data || [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-3 rounded-xl text-ksr-primary">
              <MessageSquareWarning className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Daftar Pengaduan</h3>
              <p className="text-sm text-gray-500">Keluhan dan saran dari anggota</p>
            </div>
          </div>
          <button disabled title="Segera" className="bg-ksr-primary/50 text-white/70 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <Plus className="w-5 h-5" />
            Buat Pengaduan (Segera)
          </button>
        </div>

        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Memuat...</div>
        ) : (
          <DataTable
            data={complaints}
            keyExtractor={(item: any) => item.id}
            columns={[
              { header: 'ID', accessorKey: 'id', className: 'text-xs text-gray-500 font-mono' },
              { header: 'Tanggal', cell: (item: any) => new Date(item.createdAt).toLocaleDateString('id-ID') },
              { header: 'Kategori', accessorKey: 'category' },
              { header: 'Deskripsi', cell: (item: any) => <span className="font-medium text-gray-800 line-clamp-2">{item.description}</span> },
              { 
                header: 'Status', 
                cell: (item: any) => {
                  const map: Record<string, any> = {
                    'Open': 'warning',
                    'In Progress': 'info',
                    'Resolved': 'success',
                    'Closed': 'default'
                  };
                  return <StatusBadge status={map[item.status] || 'default'} label={item.status} />;
                } 
              }
            ]}
          />
        )}
      </div>
    </div>
  );
};
