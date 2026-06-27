import { useAuthStore } from '@/store/authStore';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { 
  Users, 
  CalendarDays, 
  Activity,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';

export const Dashboard = () => {
  const { user } = useAuthStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [usersRes, activitiesRes] = await Promise.all([
        api.get('/users?limit=1000'), // Get all users to count
        api.get('/activities?limit=5') // Get latest activities and total
      ]);

      const totalUsers = usersRes.data.data?.length || 0;
      const totalActivities = activitiesRes.data.meta?.total || 0;
      
      return {
        totalUsers,
        totalActivities,
        recentActivities: activitiesRes.data.data || []
      };
    }
  });

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-ksr-primary" />
            Kegiatan Terkini
          </h3>
          <div className="space-y-4">
            {stats?.recentActivities?.length ? stats.recentActivities.map((act: any, index: number) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-ksr-primary"></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{act.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(act.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} - Status: {act.status}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-gray-500 py-4 text-center">Belum ada kegiatan terbaru.</p>
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
        <p className="text-gray-500">Selamat datang di Sistem Informasi KSR PMI UMM. Ini ringkasan organisasi saat ini.</p>
      </div>

      {renderDashboard()}
    </div>
  );
};
