import { Users, CalendarDays, HeartPulse, DollarSign, Download, Sheet } from 'lucide-react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const trenData = [
  { name: 'Jan', Kegiatan: 120, Pendonor: 200 },
  { name: 'Feb', Kegiatan: 100, Pendonor: 180 },
  { name: 'Mar', Kegiatan: 150, Pendonor: 240 },
  { name: 'Apr', Kegiatan: 120, Pendonor: 210 },
  { name: 'Mei', Kegiatan: 180, Pendonor: 260 },
  { name: 'Jun', Kegiatan: 140, Pendonor: 220 },
];

const distribusiData = [
  { name: 'Medis', value: 22 },
  { name: 'Operasional', value: 18 },
  { name: 'Humas', value: 15 },
  { name: 'Logistik', value: 12 },
  { name: 'Inti', value: 5 },
];
const COLORS = ['#C62828', '#EF4444', '#FCA5A5', '#FECACA', '#7F1D1D'];

const keuanganData = [
  { name: 'Jan', Pemasukan: 8.5, Pengeluaran: 4.2 },
  { name: 'Feb', Pemasukan: 9.2, Pengeluaran: 6.8 },
  { name: 'Mar', Pemasukan: 7.5, Pengeluaran: 5.1 },
  { name: 'Apr', Pemasukan: 12.5, Pengeluaran: 8.25 },
  { name: 'Mei', Pemasukan: 10.8, Pengeluaran: 7.1 },
  { name: 'Jun', Pemasukan: 11.2, Pengeluaran: 6.5 },
];

const inventarisProgress = [
  { name: 'Tandu Lipat', current: 3, max: 5 },
  { name: 'Tabung Oksigen', current: 7, max: 10 },
  { name: 'Defibrilator AED', current: 2, max: 2 },
  { name: 'Kotak P3K Lengkap', current: 12, max: 15 },
  { name: 'Rompi PMI', current: 26, max: 30 },
];

export const Laporan = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Periode: Januari - Juni 2024</h2>
        </div>
        <div className="flex gap-3">
          <button disabled title="Segera" className="bg-red-50/50 text-ksr-primary/50 px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed">
            <Download className="w-4 h-4" /> Export PDF (Segera)
          </button>
          <button disabled title="Segera" className="bg-ksr-success/50 text-white/70 px-4 py-2 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed">
            <Sheet className="w-4 h-4" /> Export Excel (Segera)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Anggota" value="72" subtitle="+7 dari tahun lalu" icon={Users} colorClass="bg-red-50 text-ksr-primary" />
        <SummaryCard title="Kegiatan Terlaksana" value="19" subtitle="dari 24 direncanakan" icon={CalendarDays} colorClass="bg-blue-50 text-ksr-info" />
        <SummaryCard title="Pasien Ditangani" value="47" subtitle="Jan-Jun 2024" icon={HeartPulse} colorClass="bg-green-50 text-ksr-success" />
        <SummaryCard title="Total Dana" value="Rp 45,75 Jt" subtitle="Saldo akhir" icon={DollarSign} colorClass="bg-yellow-50 text-ksr-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Tren Kegiatan & Pendonor */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Tren Kegiatan & Pendonor</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trenData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="Kegiatan" stroke="#C62828" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Pendonor" stroke="#FCA5A5" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribusi Anggota per Divisi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Distribusi Anggota per Divisi</h3>
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie
                  data={distribusiData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  onClick={() => {}}
                >
                  {distribusiData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-50% flex flex-col justify-center gap-3">
              {distribusiData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Laporan Keuangan Ringkas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Laporan Keuangan Ringkas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keuanganData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip />
                <Bar dataKey="Pemasukan" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="Pengeluaran" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ringkasan Inventaris */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Ringkasan Inventaris</h3>
          <div className="space-y-5">
            {inventarisProgress.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.name}</span>
                  <span className="text-gray-500 font-mono">{item.current}/{item.max}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-ksr-primary h-2 rounded-full" 
                    style={{ width: `${(item.current / item.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
