import { useState } from 'react';
import { DataTable } from '@/components/tables/DataTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { UserPlus } from 'lucide-react';
import { UserModal } from './UserModal';
import { ConfirmDialog } from './ConfirmDialog';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/authStore';

export const DataAnggota = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.roleName === 'Admin Sistem';

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const { data: usersData, error } = useQuery({
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
  
  const filteredData = members.filter((item: any) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.nia.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex w-full md:w-auto gap-4">
            <SearchBar 
              placeholder="Cari nama atau NIA..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              wrapperClassName="w-full md:w-80"
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
            ...(isAdmin ? [{ header: 'ID', accessorKey: 'loginId' }] : [{ 
              header: 'No', 
              cell: (_: any, index: number) => <span className="text-gray-500">{index + 1}</span>
            }]),
            { 
              header: 'Nama Lengkap', 
              cell: (item: any) => <span className="font-bold text-gray-800">{item.name}</span> 
            },
            { header: 'NIA', accessorKey: 'nia' },
            { header: 'Jabatan', accessorKey: 'position' },
            { header: 'Bidang', accessorKey: 'division' },
            ...(isAdmin ? [{
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
            }] : [])
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
