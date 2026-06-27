import { Heart, Check, Activity, TriangleAlert, Plus } from 'lucide-react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Pasien {
  id: string;
  name: string;
  age: number;
  gender: 'Laki-laki' | 'Perempuan';
  insiden: string;
  lokasi: string;
  tanggal: string;
  tindakan: string;
  status: 'Pulih' | 'Dirujuk';
  petugas: string;
}

const mockPasien: Pasien[] = [
  { id: 'PAS-001', name: 'Rudi Hartono', age: 21, gender: 'Laki-laki', insiden: 'Pingsan saat Os...', lokasi: 'Lapangan De...', tanggal: '2024-01-15', tindakan: 'Recovery Position, M...', status: 'Pulih', petugas: 'Gilang Ramadhan' },
  { id: 'PAS-002', name: 'Maya Sari', age: 19, gender: 'Perempuan', insiden: 'Luka lecet akibat...', lokasi: 'Koridor GKB 2', tanggal: '2024-02-03', tindakan: 'Pembersihan luka, B...', status: 'Pulih', petugas: 'Fitri Handayani' },
  { id: 'PAS-003', name: 'Dian Pratama', age: 22, gender: 'Laki-laki', insiden: 'Hipoglikemi', lokasi: 'Kantin UMM', tanggal: '2024-02-20', tindakan: 'Pemberian larutan ...', status: 'Dirujuk', petugas: 'Eka Prabowo' },
  { id: 'PAS-004', name: 'Rahma Wulandari', age: 20, gender: 'Perempuan', insiden: 'Asma kambuh', lokasi: 'Perpustakaa...', tanggal: '2024-03-11', tindakan: 'Posisi duduk, inhaler...', status: 'Pulih', petugas: 'Fitri Handayani' },
  { id: 'PAS-005', name: 'Andi Kurniawan', age: 23, gender: 'Laki-laki', insiden: 'Kecelakaan lalu...', lokasi: 'Parkiran Barat', tanggal: '2024-04-05', tindakan: 'Balut luka, Bidai, Eva...', status: 'Dirujuk', petugas: 'Eka Prabowo' },
];

export const DataPasien = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Pasien" value="5" icon={Heart} colorClass="bg-red-50 text-ksr-primary" />
        <SummaryCard title="Pulih" value="3" icon={Check} colorClass="bg-green-50 text-ksr-success" />
        <SummaryCard title="Dirujuk RS" value="2" icon={Activity} colorClass="bg-blue-50 text-ksr-info" />
        <SummaryCard title="Insiden 2024" value="12" icon={TriangleAlert} colorClass="bg-yellow-50 text-ksr-warning" />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Riwayat Penanganan</h2>
        <button className="bg-ksr-primary hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Plus className="w-5 h-5" />
          Laporan Baru
        </button>
      </div>

      <DataTable
        data={mockPasien}
        keyExtractor={(item) => item.id}
        columns={[
          { header: 'ID', accessorKey: 'id', className: 'text-gray-500 text-xs' },
          { 
            header: 'Nama Pasien', 
            cell: (item) => (
              <div>
                <div className="font-bold text-gray-800">{item.name}</div>
                <div className="text-xs text-gray-500 mt-1">{item.age} th - {item.gender}</div>
              </div>
            ) 
          },
          { header: 'Insiden', accessorKey: 'insiden' },
          { header: 'Lokasi', accessorKey: 'lokasi' },
          { header: 'Tanggal', accessorKey: 'tanggal' },
          { header: 'Tindakan', accessorKey: 'tindakan' },
          { 
            header: 'Status', 
            cell: (item) => (
              <StatusBadge 
                status={item.status === 'Pulih' ? 'success' : 'info'} 
                label={item.status} 
              />
            ) 
          },
          { 
            header: 'Petugas', 
            cell: (item) => (
              <span className="text-gray-600 text-sm">{item.petugas}</span>
            ) 
          },
        ]}
      />
    </div>
  );
};
