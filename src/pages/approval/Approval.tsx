import { useState } from 'react';
import { Clock, CheckCircle2, XCircle, FileText } from 'lucide-react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

const mockApprovals = [
  { id: '1', title: 'Proposal Kegiatan Siaga Bencana', priority: 'High', diajukan: 'Eka Prabowo', tanggal: '2024-04-15', tipe: 'Kegiatan', status: 'Pending' },
  { id: '2', title: 'Laporan Keuangan Bulan April', priority: 'Medium', diajukan: 'Dewi Lestari', tanggal: '2024-04-30', tipe: 'Laporan', status: 'Pending' },
  { id: '3', title: 'Permohonan Dana Seminar Kesehatan', priority: 'High', diajukan: 'Ahmad Fauzi', tanggal: '2024-04-22', tipe: 'Keuangan', status: 'Pending' },
  { id: '4', title: 'Laporan Donor Darah Feb 2024', priority: 'Medium', diajukan: 'Ahmad Fauzi', tanggal: '2024-03-05', tipe: 'Laporan', status: 'Approved' },
  { id: '5', title: 'Proposal Pelatihan P3K', priority: 'Low', diajukan: 'Fitri Handayani', tanggal: '2024-03-01', tipe: 'Kegiatan', status: 'Approved' },
  { id: '6', title: 'Pembelian Alat Medis Q1', priority: 'Medium', diajukan: 'Dewi Lestari', tanggal: '2024-02-28', tipe: 'Keuangan', status: 'Rejected' },
];

export const Approval = () => {
  const [activeTab, setActiveTab] = useState('Semua');

  const filteredData = mockApprovals.filter(item => {
    if (activeTab === 'Semua') return true;
    return item.status === activeTab;
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Pending" value="3" icon={Clock} colorClass="bg-yellow-50 text-ksr-warning" />
        <SummaryCard title="Disetujui" value="2" icon={CheckCircle2} colorClass="bg-green-50 text-ksr-success" />
        <SummaryCard title="Ditolak" value="1" icon={XCircle} colorClass="bg-red-50 text-ksr-danger" />
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-2">
        {['Semua', 'Pending', 'Approved', 'Rejected'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-ksr-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredData.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 transition-all hover:shadow-md">
            
            <div className={`p-4 rounded-xl shrink-0 ${
              item.status === 'Pending' ? 'bg-yellow-50 text-ksr-warning' :
              item.status === 'Approved' ? 'bg-green-50 text-ksr-success' :
              'bg-red-50 text-ksr-danger'
            }`}>
              {item.status === 'Pending' ? <Clock className="w-6 h-6" /> : 
               item.status === 'Approved' ? <CheckCircle2 className="w-6 h-6" /> : 
               <XCircle className="w-6 h-6" />}
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <StatusBadge 
                  status={item.priority === 'High' ? 'danger' : item.priority === 'Medium' ? 'warning' : 'default'} 
                  label={item.priority} 
                  className="py-0.5 text-[10px]"
                />
              </div>
              <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
                <span>Diajukan oleh <span className="font-semibold text-gray-700">{item.diajukan}</span></span>
                <span>•</span>
                <span>{item.tanggal}</span>
                <span>•</span>
                <span>Tipe: {item.tipe}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto mt-4 md:mt-0">
              {item.status === 'Pending' ? (
                <>
                  <StatusBadge status="warning" label="Pending" className="hidden md:inline-flex" />
                  <button disabled title="Setujui (Segera)" className="flex-1 md:flex-none bg-ksr-success/50 text-white/70 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                    <CheckCircle2 className="w-4 h-4" /> Setujui (Segera)
                  </button>
                  <button disabled title="Tolak (Segera)" className="flex-1 md:flex-none bg-gray-50 border border-gray-200 text-gray-400 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                    <XCircle className="w-4 h-4" /> Tolak (Segera)
                  </button>
                  <button disabled title="Lihat Detail (Segera)" className="p-2 text-gray-300 border border-gray-100 rounded-lg hidden md:block cursor-not-allowed">
                    <FileText className="w-5 h-5" />
                  </button>
                </>
              ) : item.status === 'Approved' ? (
                <span className="font-bold text-ksr-success px-4 py-2">Approved</span>
              ) : (
                <span className="font-bold text-ksr-danger px-4 py-2">Rejected</span>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
