import { useAuthStore } from '@/store/authStore';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { 
  Users, 
  CalendarDays, 
  Activity,
  Package,
  Wallet,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats-v2'],
    queryFn: async () => {
      const [usersRes, activitiesRes, inventoriesRes, financesRes] = await Promise.all([
        api.get('/users?limit=1000'), 
        api.get('/activities?limit=100'), // limit 100 for charting
        api.get('/inventories?limit=1'), 
        api.get('/finances?limit=1000') 
      ]);

      const totalUsers = usersRes.data.data?.length || 0;
      const totalActivities = activitiesRes.data.meta?.total || 0;
      const totalInventories = inventoriesRes.data.meta?.total || 0;
      
      const finances = financesRes.data.data || [];
      const balance = finances.reduce((acc: number, curr: any) => {
        return curr.type === 'Income' ? acc + Number(curr.amount) : acc - Number(curr.amount);
      }, 0);

      // Process monthly activities chart data
      const allActivities = activitiesRes.data.data || [];
      const monthCounts: Record<string, number> = {};
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleDateString('id-ID', { month: 'short' });
        monthCounts[monthName] = 0;
      }

      allActivities.forEach((act: any) => {
        if (act.startDate) {
          const d = new Date(act.startDate);
          const monthName = d.toLocaleDateString('id-ID', { month: 'short' });
          if (monthCounts[monthName] !== undefined) {
            monthCounts[monthName]++;
          }
        }
      });

      const chartData = Object.keys(monthCounts).map(key => ({
        name: key,
        kegiatan: monthCounts[key]
      }));

      // Find pending approvals from activities
      const pendingApprovals = allActivities.filter((a: any) => a.status === 'Pending').slice(0, 3);

      return {
        totalUsers,
        totalActivities,
        totalInventories,
        balance,
        recentActivities: allActivities.slice(0, 4),
        chartData,
        pendingApprovals
      };
    }
  });

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  };

  const renderDashboard = () => (
    <>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard 
          title="Total Anggota" 
          value={isLoading ? "..." : stats?.totalUsers?.toString() || "0"} 
          icon={Users} 
          colorClass="bg-red-50 text-ksr-primary" 
        />
        <SummaryCard 
          title="Total Kegiatan" 
          value={isLoading ? "..." : stats?.totalActivities?.toString() || "0"} 
          icon={CalendarDays} 
          colorClass="bg-blue-50 text-ksr-info" 
        />
        <SummaryCard 
          title="Total Inventaris" 
          value={isLoading ? "..." : stats?.totalInventories?.toString() || "0"} 
          icon={Package} 
          colorClass="bg-orange-50 text-orange-500" 
        />
        <SummaryCard 
          title="Total Keuangan" 
          value={isLoading ? "..." : formatRupiah(stats?.balance || 0)} 
          icon={Wallet} 
          colorClass="bg-green-50 text-ksr-success" 
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-ksr-primary" />
          Statistik Aktivitas Bulanan
        </h3>
        <div className="h-72 w-full">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Memuat grafik...</div>
          ) : stats?.chartData?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="kegiatan" 
                  stroke="#ba0000" 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#ba0000' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Belum ada data aktivitas.
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kegiatan Terkini Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-ksr-info" />
              Kegiatan Terkini
            </h3>
            <Link to="/kegiatan" className="text-sm font-medium text-ksr-primary hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4 flex-1">
            {isLoading ? (
              <p className="text-sm text-gray-500 py-4 text-center">Memuat kegiatan...</p>
            ) : stats?.recentActivities?.length ? (
              stats.recentActivities.map((act: any, index: number) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-2 rounded-full bg-ksr-info shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{act.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(act.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} • Status: {act.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-xl w-full">Belum ada kegiatan terbaru.</p>
              </div>
            )}
          </div>
        </div>

        {/* Menunggu Persetujuan Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-ksr-warning" />
              Menunggu Persetujuan
            </h3>
          </div>
          <div className="space-y-3 flex-1">
            {isLoading ? (
              <p className="text-sm text-gray-500 py-4 text-center">Memuat persetujuan...</p>
            ) : stats?.pendingApprovals?.length ? (
              stats.pendingApprovals.map((item: any, i: number) => (
                <div key={i} className="block p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                  <p className="text-sm font-medium text-yellow-800">Proposal Kegiatan: {item.title}</p>
                  <p className="text-xs text-yellow-600 mt-1">Status: Menunggu Persetujuan</p>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-sm text-gray-500 py-4 text-center bg-gray-50 rounded-xl w-full">Saat ini tidak ada persetujuan yang menunggu.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Halo, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Selamat datang di Sistem Informasi Manajemen KSR PMI UMM.</p>
      </div>

      {renderDashboard()}
    </div>
  );
};
