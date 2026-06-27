import { useState } from 'react';
import { CalendarDays, Plus, MapPin, Clock } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SearchBar } from '@/components/ui/SearchBar';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export const ManajemenKegiatan = () => {
  const [activeTab, setActiveTab] = useState('Semua');

  const { data, isLoading, error } = useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const res = await api.get('/activities?limit=50');
      return res.data.data;
    }
  });

  if (error) {
    toast.error('Gagal memuat data kegiatan');
  }

  const activities = data || [];
  
  const filteredActivities = activities.filter((k: any) => {
    if (activeTab === 'Semua') return true;
    if (activeTab === 'Akan Datang' && k.status === 'Pending') return true;
    if (activeTab === 'Berjalan' && k.status === 'Approved') return true; // simplified mapping
    if (activeTab === 'Selesai' && k.status === 'Completed') return true;
    return false;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {['Semua', 'Akan Datang', 'Berjalan', 'Selesai'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab ? 'bg-ksr-primary text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <SearchBar placeholder="Cari kegiatan (Segera)..." disabled className="disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-slate-900" />
          <button disabled className="bg-ksr-primary/50 text-white/70 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <Plus className="w-5 h-5" />
            Kegiatan Baru (Segera)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-64 animate-pulse">
               <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
               <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
               <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
               <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredActivities.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            Tidak ada data kegiatan ditemukan.
          </div>
        ) : (
          filteredActivities.map((kegiatan: any) => (
            <div key={kegiatan.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-50 p-3 rounded-xl text-ksr-primary">
                  <CalendarDays className="w-6 h-6" />
                </div>
                <StatusBadge 
                  status={kegiatan.status === 'Completed' ? 'success' : kegiatan.status === 'Approved' ? 'warning' : 'info'} 
                  label={kegiatan.status} 
                />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2">{kegiatan.title}</h3>
              
              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CalendarDays className="w-4 h-4" />
                  <span>{new Date(kegiatan.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(kegiatan.startDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(kegiatan.endDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Markas / Lapangan</span> {/* Placeholder since no location in db */}
                </div>
              </div>
              
              <div className="flex gap-3 mt-auto">
                <button disabled className="flex-1 bg-gray-50 text-gray-400 py-2 rounded-lg font-medium text-sm border border-gray-200 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-gray-500">
                  Detail (Segera)
                </button>
                {kegiatan.status === 'Pending' && (
                  <button disabled className="flex-1 bg-ksr-primary/50 text-white/70 py-2 rounded-lg font-medium text-sm cursor-not-allowed">
                    Approve (Segera)
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
