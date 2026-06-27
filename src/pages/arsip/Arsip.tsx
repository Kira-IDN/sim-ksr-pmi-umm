import { useState } from 'react';
import { FileText, UploadCloud, FileDown, Eye, Trash2, Mail, FileBarChart, CalendarDays } from 'lucide-react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { DataTable } from '@/components/tables/DataTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';

const mockArsip = [
  { id: '1', judul: 'Surat Masuk: Permohonan Donor Darah...', kategori: 'Surat Masuk', tanggal: '2024-04-05', pengunggah: 'Budi Santoso', ukuran: '2.45 MB', status: 'Selesai' },
  { id: '2', judul: 'Surat Keluar: Undangan Kegiatan...', kategori: 'Surat Keluar', tanggal: '2024-04-10', pengunggah: 'Budi Santoso', ukuran: '1.20 KB', status: 'Terkirim' },
  { id: '3', judul: 'Laporan Kegiatan Donor Darah Pelai...', kategori: 'Laporan Kegiatan', tanggal: '2024-03-28', pengunggah: 'Ahmad Fauzi', ukuran: '1.2 MB', status: 'Final' },
  { id: '4', judul: 'Laporan Keuangan Triwulan I 2024', kategori: 'Laporan Keuangan', tanggal: '2024-03-31', pengunggah: 'Dewi Lestari', ukuran: '850 KB', status: 'Final' },
  { id: '5', judul: 'Surat Masuk: Undangan Seminar P...', kategori: 'Surat Masuk', tanggal: '2024-04-12', pengunggah: 'Budi Santoso', ukuran: '320 KB', status: 'Selesai' },
  { id: '6', judul: 'Laporan Kegiatan P3K Maret 2024', kategori: 'Laporan Kegiatan', tanggal: '2024-03-20', pengunggah: 'Eka Prabowo', ukuran: '2.1 MB', status: 'Final' },
  { id: '7', judul: 'Surat Keluar: Permohonan Pinjam...', kategori: 'Surat Keluar', tanggal: '2024-04-15', pengunggah: 'Budi Santoso', ukuran: '756 KB', status: 'Terkirim' },
];

export const Arsip = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');

  const filteredData = mockArsip.filter(item => {
    const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter ? item.kategori === filter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex w-full md:w-auto gap-4">
          <SearchBar 
            placeholder="Cari dokumen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            wrapperClassName="w-full md:w-80"
          />
          <FilterDropdown 
            options={[
              { label: 'Surat Masuk', value: 'Surat Masuk' },
              { label: 'Surat Keluar', value: 'Surat Keluar' },
              { label: 'Laporan Kegiatan', value: 'Laporan Kegiatan' },
              { label: 'Laporan Keuangan', value: 'Laporan Keuangan' },
            ]}
            value={filter}
            onChange={setFilter}
          />
        </div>
        <button disabled title="Segera" className="w-full md:w-auto bg-ksr-primary/50 text-white/70 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
          <UploadCloud className="w-5 h-5" />
          Upload Dokumen (Segera)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Surat Masuk" value="2" subtitle="dokumen" icon={Mail} colorClass="bg-gray-50 text-gray-500" />
        <SummaryCard title="Surat Keluar" value="2" subtitle="dokumen" icon={Mail} colorClass="bg-gray-50 text-gray-500" />
        <SummaryCard title="Laporan Kegiatan" value="2" subtitle="dokumen" icon={CalendarDays} colorClass="bg-gray-50 text-gray-500" />
        <SummaryCard title="Laporan Keuangan" value="1" subtitle="dokumen" icon={FileBarChart} colorClass="bg-gray-50 text-gray-500" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <DataTable
          data={filteredData}
          keyExtractor={(item) => item.id}
          columns={[
            { 
              header: 'Judul Dokumen', 
              cell: (item) => (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 text-ksr-primary rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-gray-800 line-clamp-1 max-w-[200px]">{item.judul}</span>
                </div>
              ) 
            },
            { header: 'Kategori', accessorKey: 'kategori', className: 'text-gray-500 text-sm' },
            { header: 'Tanggal', accessorKey: 'tanggal', className: 'text-gray-500 text-sm' },
            { header: 'Pengunggah', accessorKey: 'pengunggah', className: 'text-gray-500 text-sm' },
            { header: 'Ukuran', accessorKey: 'ukuran', className: 'text-gray-500 text-sm' },
            { 
              header: 'Status', 
              cell: (item) => {
                const map: Record<string, any> = {
                  'Selesai': 'info',
                  'Terkirim': 'info',
                  'Final': 'success'
                };
                return <StatusBadge status={map[item.status]} label={item.status} />;
              } 
            },
            {
              header: 'Aksi',
              cell: () => (
                <div className="flex gap-3">
                  <button disabled title="Lihat Dokumen (Segera)" className="text-gray-400 cursor-not-allowed"><Eye className="w-4 h-4" /></button>
                  <button disabled title="Unduh Dokumen (Segera)" className="text-gray-400 cursor-not-allowed"><FileDown className="w-4 h-4" /></button>
                  <button disabled title="Hapus Dokumen (Segera)" className="text-gray-400 cursor-not-allowed"><Trash2 className="w-4 h-4" /></button>
                </div>
              )
            }
          ]}
        />
      </div>
    </div>
  );
};
