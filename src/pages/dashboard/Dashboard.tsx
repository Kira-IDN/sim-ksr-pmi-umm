import { useAuthStore } from '@/store/authStore';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { 
  Users, 
  CalendarDays, 
  HeartPulse, 
  CircleDollarSign, 
  Activity,
  BellRing
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [usersRes, activitiesRes, financesRes] = await Promise.all([
        api.get('/users?limit=1'),
        api.get('/activities?limit=1'),
        api.get('/finances?limit=1000') // Fetch all to calculate balance
      ]);

      const totalUsers = usersRes.data.data?.length || 0;
      const totalActivities = activitiesRes.data.meta.total || 0;
      
      const finances = financesRes.data.data || [];
      const balance = finances.reduce((acc: number, curr: any) => {
        return curr.type === 'Income' ? acc + Number(curr.amount) : acc - Number(curr.amount);
      }, 0);

      return {
        totalUsers,
        totalActivities,
        balance,
        recentActivities: [] // Placeholder for now
      };
    }
  });

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard 
          title="Total Anggota" 
          value={isLoading ? "..." : stats?.totalUsers?.toString() || "0"} 
          subtitle="Anggota Terdaftar" 
          icon={Users} 
          colorClass="bg-red-50 text-ksr-primary" 
        />
        <SummaryCard 
          title="Total Kegiatan" 
          value={isLoading ? "..." : stats?.totalActivities?.toString() || "0"} 
          subtitle="Tercatat di sistem" 
          icon={CalendarDays} 
          colorClass="bg-blue-50 text-ksr-info" 
        />
        <SummaryCard 
          title="Pasien Bulan Ini" 
          value="0" 
          subtitle="Dalam 0 insiden" 
          icon={HeartPulse} 
          colorClass="bg-green-50 text-ksr-success" 
        />
        <SummaryCard 
          title="Saldo Kas" 
          value={isLoading ? "..." : new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(stats?.balance || 0)} 
          icon={CircleDollarSign} 
          colorClass="bg-yellow-50 text-ksr-warning" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-ksr-primary" />
            Aktivitas Terkini
          </h3>
          <div className="space-y-4">
            {stats?.recentActivities?.length ? stats.recentActivities.map((i: any, index: number) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-ksr-primary"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{i.title}</p>
                  <p className="text-xs text-gray-400">Oleh {i.user} - {i.time}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 py-4 text-center">Belum ada aktivitas terbaru.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BellRing className="w-5 h-5 text-ksr-warning" />
            Perlu Tindakan
          </h3>
          <div className="space-y-3">
            <Link to="/approval" className="block p-3 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors dark:hover:bg-slate-700">
              <p className="text-sm font-medium text-yellow-800">Approval Proposal Diklat</p>
              <p className="text-xs text-yellow-600 mt-1">Batas waktu: Besok</p>
            </Link>
            <Link to="/keuangan" className="block p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors dark:hover:bg-slate-700">
              <p className="text-sm font-medium text-blue-800">Review Laporan Keuangan Q1</p>
              <p className="text-xs text-blue-600 mt-1">Menunggu review</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );



  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Halo, {user?.name}! 👋</h1>
        <p className="text-gray-500">Selamat datang di Sistem Informasi KSR PMI UMM. Ini ringkasan hari ini.</p>
      </div>

      {/* Fallback to Admin Dashboard for everyone for now since role validation changed */}
      {renderAdminDashboard()}
    </div>
  );
};
