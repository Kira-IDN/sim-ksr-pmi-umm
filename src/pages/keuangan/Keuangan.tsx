import { ArrowUpRight, ArrowDownRight, Plus, Download } from 'lucide-react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { DataTable } from '@/components/tables/DataTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

const mockChartData = [
  { name: 'Jan', Pemasukan: 8.5, Pengeluaran: 4.2 },
  { name: 'Feb', Pemasukan: 9.2, Pengeluaran: 6.8 },
  { name: 'Mar', Pemasukan: 7.5, Pengeluaran: 5.1 },
  { name: 'Apr', Pemasukan: 12.5, Pengeluaran: 8.25 },
  { name: 'Mei', Pemasukan: 10.8, Pengeluaran: 7.1 },
  { name: 'Jun', Pemasukan: 11.2, Pengeluaran: 6.5 },
];

export const Keuangan = () => {
  const { data: financesData, isLoading, error } = useQuery({
    queryKey: ['finances'],
    queryFn: async () => {
      const res = await api.get('/finances?limit=500');
      return res.data;
    }
  });

  if (error) {
    toast.error('Gagal memuat data keuangan');
  }

  const finances = financesData?.data || [];
  
  let income = 0;
  let expense = 0;
  finances.forEach((f: any) => {
    if (f.type === 'Income') income += Number(f.amount);
    else if (f.type === 'Expense') expense += Number(f.amount);
  });
  const balance = income - expense;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Main Balance Card */}
        <div className="bg-ksr-primary rounded-2xl p-6 shadow-md text-white">
          <p className="text-sm font-medium text-white/80 mb-2 uppercase tracking-wider">Saldo Kas</p>
          <h3 className="text-3xl font-bold mb-4">{isLoading ? '...' : formatRupiah(balance)}</h3>
          <div className="flex justify-between text-sm">
            <div>
              <p className="text-white/70">Pemasukan</p>
              <p className="font-semibold text-green-300">+{isLoading ? '...' : formatRupiah(income)}</p>
            </div>
            <div>
              <p className="text-white/70">Pengeluaran</p>
              <p className="font-semibold text-red-300">-{isLoading ? '...' : formatRupiah(expense)}</p>
            </div>
          </div>
        </div>

        <SummaryCard 
          title="Total Pemasukan" 
          value={isLoading ? "..." : formatRupiah(income)} 
          subtitle="Tercatat di sistem" 
          icon={ArrowUpRight} 
          colorClass="bg-green-50 text-ksr-success" 
        />
        <SummaryCard 
          title="Total Pengeluaran" 
          value={isLoading ? "..." : formatRupiah(expense)} 
          subtitle="Tercatat di sistem" 
          icon={ArrowDownRight} 
          colorClass="bg-red-50 text-ksr-danger" 
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Arus Kas 2024</h3>
            <p className="text-sm text-gray-500">Pemasukan vs Pengeluaran</p>
          </div>
          <button className="bg-red-50 hover:bg-red-100 text-ksr-primary px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} tickFormatter={(val) => `${val}Jt`} />
              <RechartsTooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Pemasukan" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Transaksi Terbaru</h3>
          <button className="bg-ksr-primary hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
            <Plus className="w-5 h-5" />
            Tambah Transaksi
          </button>
        </div>

        <DataTable
          data={finances}
          keyExtractor={(item: any) => item.id}
          columns={[
            { header: 'ID', accessorKey: 'id', className: 'text-xs text-gray-500 font-mono' },
            { header: 'Tanggal', cell: (item: any) => new Date(item.transactionDate).toLocaleDateString('id-ID') },
            { header: 'Keterangan', cell: (item: any) => <span className="font-bold text-gray-800">{item.title}</span> },
            { header: 'Kategori', accessorKey: 'categoryId' },
            { 
              header: 'Tipe', 
              cell: (item: any) => (
                <span className={`flex items-center gap-1 font-medium text-sm ${item.type === 'Income' ? 'text-ksr-success' : 'text-ksr-danger'}`}>
                  {item.type === 'Income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {item.type}
                </span>
              )
            },
            { 
              header: 'Jumlah', 
              className: 'text-right',
              cell: (item: any) => (
                <span className={`font-bold ${item.type === 'Income' ? 'text-ksr-success' : 'text-ksr-danger'}`}>
                  {item.type === 'Income' ? '+' : '-'}{formatRupiah(Number(item.amount))}
                </span>
              ) 
            },
          ]}
        />
      </div>
    </div>
  );
};
