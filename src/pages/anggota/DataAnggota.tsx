import { useState } from 'react';
import { SummaryCard } from '@/components/cards/SummaryCard';
import { DataTable } from '@/components/tables/DataTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterDropdown } from '@/components/ui/FilterDropdown';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Users, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import { UserModal } from './UserModal';
import { ConfirmDialog } from './ConfirmDialog';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

export const DataAnggota = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users?limit=500'); // Fetch max
      return res.data;
    }
  });

  if (error) {
    toast.error('Gagal memuat data anggota');
  }

  const members = usersData?.data || [];
  
  const total = members.length;
  const activeCount = members.filter((m: any) => m.status === 'Active').length;
  const inactiveCount = members.filter((m: any) => m.status === 'Inactive').length;
  const alumniCount = members.filter((m: any) => m.status === 'Alumni').length;

  const filteredData = members.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.nia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard title="Total Anggota" value={isLoading ? "..." : total.toString()} icon={Users} colorClass="bg-red-50 text-ksr-primary" />
        <SummaryCard title="Anggota Aktif" value={isLoading ? "..." : activeCount.toString()} icon={UserCheck} colorClass="bg-green-50 text-ksr-success" />
        <SummaryCard title="Anggota Nonaktif" value={isLoading ? "..." : inactiveCount.toString()} icon={UserMinus} colorClass="bg-yellow-50 text-ksr-warning" />
        <SummaryCard title="Alumni" value={isLoading ? "..." : alumniCount.toString()} icon={Users} colorClass="bg-blue-50 text-ksr-info" />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex w-full md:w-auto gap-4">
            <SearchBar 
              placeholder="Cari nama atau NIA..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              wrapperClassName="w-full md:w-80"
            />
            <FilterDropdown 
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Alumni', value: 'Alumni' },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Semua Status"
            />
          </div>
          <button 
            onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
            className="w-full md:w-auto bg-ksr-primary hover:bg-red-800 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Tambah Anggota
          </button>
        </div>

        <DataTable
          data={filteredData}
          keyExtractor={(item) => item.id}
          columns={[
            { header: 'NIA', accessorKey: 'nia' },
            { 
              header: 'Nama Lengkap', 
              cell: (item: any) => <span className="font-bold text-gray-800">{item.name}</span> 
            },
            { header: 'Angkatan', accessorKey: 'generation' },
            { 
              header: 'Status', 
              cell: (item: any) => {
                const statusMap: Record<string, any> = {
                  'Active': 'success',
                  'Inactive': 'warning',
                  'Alumni': 'info'
                };
                return <StatusBadge status={statusMap[item.status] || 'default'} label={item.status} />;
              }
            },
            {
              header: 'Aksi',
              cell: (item: any) => (
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSelectedUser(item); setIsModalOpen(true); }}
                    className="text-ksr-info hover:underline text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => { setUserToDelete(item); setIsDeleteOpen(true); }}
                    className="text-ksr-danger hover:underline text-sm font-medium"
                  >
                    Hapus
                  </button>
                </div>
              )
            }
          ]}
        />
      </div>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser} 
      />
      
      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        userId={userToDelete?.id}
        userName={userToDelete?.name}
      />
    </>
  );
};
