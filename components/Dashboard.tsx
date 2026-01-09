
import React from 'react';
import { User, ScannedReceipt } from '../types';
import { Receipt, Package, Trash2, ChevronRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  history: ScannedReceipt[];
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, history, onNavigate }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* User Header */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-sm font-bold text-[#2D3E2D] border border-gray-100 overflow-hidden">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#2D3E2D]">Halo, {user.name}!</h1>
          <span className="inline-block px-2 py-0.5 bg-[#D9ED92] text-[#2D3E2D] text-[8px] font-bold uppercase rounded">
            {user.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent History Card */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
            Riwayat Terbaru
          </h3>
          <div className="bg-white rounded-md border border-gray-100 overflow-hidden">
            {history.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center mx-auto border border-gray-50">
                   <Receipt className="text-gray-300" size={18} />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Belum ada data</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {history.slice(0, 5).map((receipt) => (
                  <div key={receipt.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-9 h-9 bg-green-50 rounded flex-shrink-0 flex items-center justify-center text-green-600 border border-green-100">
                        <Receipt size={16} />
                      </div>
                      <div className="truncate">
                        <p className="font-bold text-[#2D3E2D] text-xs truncate">{receipt.merchantName}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{receipt.date}</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-black text-xs text-[#2D3E2D]">Rp{receipt.grandTotal.toLocaleString()}</p>
                      <button 
                        onClick={() => onNavigate('history')}
                        className="text-[8px] font-bold uppercase tracking-widest text-gray-300 hover:text-[#2D3E2D]"
                      >
                        Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Ikhtisar Bisnis</h3>
          <div className="bg-white rounded-md border border-gray-100 p-5 space-y-6">
             <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-blue-50 rounded flex items-center justify-center text-blue-500 border border-blue-100">
                  <Package size={16} />
                </div>
                <div className="flex-1">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Barang</p>
                   <p className="text-xl font-black text-[#2D3E2D]">
                     {history.reduce((acc, r) => acc + r.items.length, 0)}
                   </p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-9 h-9 bg-orange-50 rounded flex items-center justify-center text-orange-500 border border-orange-100">
                  <Trash2 size={16} />
                </div>
                <div className="flex-1">
                   <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Potensi Waste</p>
                   <p className="text-xl font-black text-orange-600 uppercase">Rendah</p>
                </div>
             </div>
             
             <button 
                onClick={() => onNavigate('recommender')}
                className="w-full bg-[#2D3E2D] text-[#D9ED92] py-3 rounded font-bold flex items-center justify-center gap-2 hover:brightness-125 transition-all text-xs uppercase tracking-widest"
             >
               Analisis Stok
               <ChevronRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
