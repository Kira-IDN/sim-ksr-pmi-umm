import { useState } from 'react';
import { Package, Plus, ArrowRightLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SearchBar } from '@/components/ui/SearchBar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export const Inventaris = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: inventoriesData, isLoading, error } = useQuery({
    queryKey: ['inventories'],
    queryFn: async () => {
      const res = await api.get('/inventories?limit=500');
      return res.data;
    }
  });

  if (error) {
    toast.error('Gagal memuat data inventaris');
  }

  const inventories = inventoriesData?.data || [];
  
  const totalItems = inventories.length;
  const totalStock = inventories.reduce((acc: number, curr: any) => acc + curr.stock, 0);
  const goodCondition = inventories.filter((i: any) => i.condition === 'Baik').length;
  const badCondition = inventories.filter((i: any) => i.condition !== 'Baik').length;

  const filteredBarang = inventories.filter((b: any) => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Jenis Barang" value={isLoading ? "..." : totalItems.toString()} icon={Package} colorClass="bg-blue-50 text-ksr-info" />
        <SummaryCard title="Total Stok" value={isLoading ? "..." : totalStock.toString()} icon={ArrowRightLeft} colorClass="bg-yellow-50 text-ksr-warning" />
        <SummaryCard title="Kondisi Baik" value={isLoading ? "..." : goodCondition.toString()} icon={CheckCircle2} colorClass="bg-green-50 text-ksr-success" />
        <SummaryCard title="Perlu Perbaikan" value={isLoading ? "..." : badCondition.toString()} icon={AlertCircle} colorClass="bg-red-50 text-ksr-danger" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <SearchBar 
            placeholder="Cari kode atau nama barang..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            wrapperClassName="w-full md:w-80"
          />
          <div className="flex w-full md:w-auto gap-3">
            <button className="flex-1 md:flex-none bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors">
              Export
            </button>
            <button className="flex-1 md:flex-none bg-ksr-primary hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              Tambah Barang
            </button>
          </div>
        </div>

        <DataTable
          data={filteredBarang}
          keyExtractor={(item) => item.id}
          columns={[
            { header: 'ID Barang', accessorKey: 'id', className: 'text-xs text-gray-500 font-mono' },
            { header: 'Nama Barang', cell: (item: any) => <span className="font-bold text-gray-800">{item.name}</span> },
            { header: 'Kategori', accessorKey: 'categoryId', className: 'text-xs text-gray-500 font-mono' },
            { 
              header: 'Stok Ketersediaan', 
              cell: (item: any) => (
                <span>
                  <span className="font-bold text-gray-800">{item.stock}</span>
                </span>
              ) 
            },
            { 
              header: 'Kondisi', 
              cell: (item: any) => {
                const map: Record<string, any> = {
                  'Baik': 'success',
                  'Rusak Ringan': 'warning',
                  'Rusak Berat': 'danger'
                };
                return <StatusBadge status={map[item.condition] || 'default'} label={item.condition} />;
              } 
            },
            {
              header: 'Aksi',
              cell: () => (
                <div className="flex gap-2 text-sm font-medium">
                  <button className="text-ksr-info hover:underline">Detail</button>
                  <button className="text-ksr-warning hover:underline">Pinjam</button>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};
