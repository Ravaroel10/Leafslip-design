
import React from 'react';
import { ICONS } from '../constants';
import { AppView, User } from '../types';
import { LayoutDashboard, Scan, TrendingUp, History, LogOut, MessageSquare, X } from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentView, onNavigate, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'chatbot' as AppView, label: 'Pesan', icon: <MessageSquare size={20} /> },
    { id: 'scanner' as AppView, label: 'Scanner', icon: <Scan size={20} /> },
    { id: 'recommender' as AppView, label: 'Waste', icon: <TrendingUp size={20} /> },
    { id: 'history' as AppView, label: 'Riwayat', icon: <History size={20} /> },
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 flex flex-col z-50 transition-all duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:w-20'}`}>
      
      {/* Branding Section */}
      <div className="px-2 py-6 lg:py-8 flex flex-col items-center justify-center font-bold tracking-tight text-[#2D3E2D] shrink-0">
        <div className="text-[#D9ED92] bg-[#2D3E2D] p-2 rounded-md mb-1 transition-transform hover:scale-105 active:scale-90">
          {React.cloneElement(ICONS.Leaf as React.ReactElement, { size: 18 })}
        </div>
        <span className="text-[8px] tracking-[0.2em] hidden lg:block uppercase font-black text-gray-300">LEAF</span>
        
        {onClose && (
          <button onClick={onClose} className="lg:hidden absolute right-4 top-6 p-2 hover:bg-gray-50 rounded text-gray-400">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation Section - Scrollable but scrollbar is hidden */}
      <nav className="flex-1 px-1 lg:px-1 space-y-1 lg:space-y-0.5 mt-2 overflow-y-auto hide-scrollbar flex flex-col items-center">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex lg:flex-col items-center gap-3 lg:gap-1.5 px-3 py-3 lg:py-4 transition-all group relative z-10 ${
              currentView === item.id
                ? 'text-[#2D3E2D]'
                : 'text-gray-400 hover:text-[#2D3E2D]'
            }`}
          >
            {/* Minimal Highlight Pop Effect */}
            {currentView === item.id && (
              <div className="absolute inset-x-1.5 lg:inset-x-1 inset-y-1 lg:inset-y-1.5 bg-[#D9ED92]/60 rounded-md -z-10 animate-highlight" />
            )}
            
            <div className={`transition-transform group-hover:scale-110 ${currentView === item.id ? 'text-[#2D3E2D]' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] lg:text-[8.5px] font-bold uppercase tracking-wide leading-tight text-center truncate w-full">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Account Section - Fixed at bottom */}
      <div className="p-2 border-t border-gray-50 flex flex-col items-center shrink-0">
        <div className="flex lg:flex-col items-center gap-3 lg:gap-1 p-1 mb-2 lg:w-full group">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-8 h-8 lg:w-10 lg:h-10 rounded-md object-cover border border-gray-100 transition-transform group-hover:scale-105" 
          />
          <span className="lg:hidden text-[10px] font-bold text-[#2D3E2D] truncate">{user.name}</span>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95"
          title="Keluar"
        >
          <LogOut size={16} />
          <span className="lg:hidden font-bold text-[10px] uppercase">Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
