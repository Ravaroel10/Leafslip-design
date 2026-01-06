
import React from 'react';
import { User, ScannedReceipt } from '../types';
import { Sparkles, ArrowRight, Receipt, Package, Trash2, ChevronRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  history: ScannedReceipt[];
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, history, onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* User Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-[#2D3E2D] border-2 border-white shadow-sm overflow-hidden">
          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#2D3E2D]">Halo, {user.name}!</h1>
          <span className="inline-block mt-1 px-3 py-0.5 bg-[#D9ED92] text-[#2D3E2D] text-[10px] font-bold uppercase rounded-full">
            {user.role}
          </span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative h-48 rounded-[40px] overflow-hidden bg-[#FFD6A5] p-10 flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
           <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-bold text-[#2D3E2D] max-w-md leading-tight">
            Optimalkan Stok, Kurangi Sampah Bisnis Anda!
          </h2>
          <p className="text-sm text-[#2D3E2D]/70 max-w-sm">
            Scan struk belanjaan Anda dan biarkan AI kami memberikan rekomendasi stok mingguan secara otomatis.
          </p>
          <button 
            onClick={() => onNavigate('scanner')}
            className="bg-[#2D3E2D] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
          >
            Pelajari Lebih Lanjut
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Recent History */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-xl font-bold text-[#2D3E2D] flex items-center gap-2">
            Riwayat Terbaru
          </h3>
          <div className="bg-white rounded-[32px] p-2 border border-gray-100 shadow-sm">
            {history.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
                   <Receipt className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-500 font-medium">Belum ada struk yang di-scan.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {history.slice(0, 3).map((receipt) => (
                  <div key={receipt.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors rounded-2xl group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <Receipt size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-[#2D3E2D]">{receipt.merchantName}</p>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{receipt.date}</p>
                      </div>
                    </div>
                    <button className="px-5 py-2 rounded-xl bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#2D3E2D] hover:border-[#D9ED92] transition-all">
                      Lihat Detail
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Overview Stats */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-bold text-[#2D3E2D]">Ikhtisar Inventaris</h3>
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-8">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <Package size={20} />
                </div>
                <div className="flex-1">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Item Scan</p>
                   <p className="text-2xl font-black text-[#2D3E2D]">
                     {history.reduce((acc, r) => acc + r.items.length, 0)}
                   </p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500">
                  <Trash2 size={20} />
                </div>
                <div className="flex-1">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Potensi Limbah</p>
                   <p className="text-2xl font-black text-orange-600">Low</p>
                </div>
             </div>
             
             <button 
                onClick={() => onNavigate('recommender')}
                className="w-full bg-[#FF6B35] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 hover:brightness-110 active:scale-95 transition-all"
             >
               Analisis Sekarang
               <ChevronRight size={18} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
