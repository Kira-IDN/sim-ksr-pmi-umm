import { Network } from 'lucide-react';

export const StrukturOrganisasi = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center min-h-[600px]">
        <div className="bg-red-50 text-ksr-primary p-4 rounded-full mb-4">
          <Network className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Struktur Organisasi KSR PMI UMM</h2>
        <p className="text-gray-500 text-center max-w-md mb-8">
          Halaman ini akan menampilkan bagan struktur organisasi kepengurusan yang sedang aktif. Anda dapat melakukan scroll horizontal jika bagan terlalu lebar.
        </p>
        
        {/* Placeholder for Organization Chart Component */}
        <div className="w-full border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center py-32">
          <p className="text-gray-400 font-medium">[ Interactive Organization Tree Component ]</p>
        </div>
      </div>
    </div>
  );
};
