import { QrCode, UserCheck, Search } from 'lucide-react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { DataTable } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export const AbsensiDigital = () => {
  const { data: attendanceData, isLoading, error } = useQuery({
    queryKey: ['attendances'],
    queryFn: async () => {
      const res = await api.get('/attendances?limit=100');
      return res.data;
    }
  });

  if (error) {
    toast.error('Gagal memuat data presensi');
  }

  const attendances = attendanceData?.data || [];
  
  const presentCount = attendances.filter((a: any) => a.attendanceType === 'Event').length;
  const lateCount = attendances.filter((a: any) => a.attendanceType === 'Lainnya').length; // Mock mappings for stats
  const sickCount = 0;
  const permitCount = 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Hadir" value={isLoading ? "..." : presentCount.toString()} subtitle="Kegiatan hari ini" icon={UserCheck} colorClass="bg-green-50 text-ksr-success" />
        <SummaryCard title="Terlambat" value={isLoading ? "..." : lateCount.toString()} icon={UserCheck} colorClass="bg-yellow-50 text-ksr-warning" />
        <SummaryCard title="Izin" value={isLoading ? "..." : permitCount.toString()} icon={UserCheck} colorClass="bg-blue-50 text-ksr-info" />
        <SummaryCard title="Sakit / Alpha" value={isLoading ? "..." : sickCount.toString()} icon={UserCheck} colorClass="bg-red-50 text-ksr-danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">QR Absensi</h3>
          <p className="text-gray-500 text-sm mb-8">Pendidikan Lanjut Spesialisasi Medis</p>
          
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-8 inline-block">
            {/* Placeholder for QR Code */}
            <div className="w-48 h-48 bg-white border-4 border-ksr-primary rounded-xl flex items-center justify-center">
              <QrCode className="w-24 h-24 text-ksr-primary" />
            </div>
          </div>
          
          <button className="bg-ksr-primary hover:bg-red-800 text-white w-full py-3 rounded-lg font-medium transition-colors">
            Generate Ulang QR
          </button>
        </div>

        {/* Data Table Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Daftar Hadir</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ksr-primary/20 focus:border-ksr-primary transition-colors text-sm"
              />
            </div>
          </div>

          <div className="flex-1">
            <DataTable
              data={attendances}
              keyExtractor={(item: any) => item.id}
              columns={[
                { header: 'ID User', accessorKey: 'userId' },
                { header: 'Tipe', accessorKey: 'attendanceType' },
                { header: 'Waktu Presensi', cell: (item: any) => new Date(item.clockIn).toLocaleString('id-ID') },
                { 
                  header: 'Status', 
                  cell: () => {
                    return <StatusBadge status={'success'} label={'Hadir'} />;
                  } 
                }
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
