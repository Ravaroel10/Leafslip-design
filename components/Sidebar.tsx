
import React from 'react';
import { ICONS } from '../constants';
import { AppView, User } from '../types';
import { LayoutDashboard, Scan, TrendingUp, History, LogOut, MessageSquare } from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard' as AppView, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'scanner' as AppView, label: 'Scanner', icon: <Scan size={20} /> },
    { id: 'recommender' as AppView, label: 'Waste Tracker', icon: <TrendingUp size={20} /> },
    { id: 'history' as AppView, label: 'History', icon: <History size={20} /> },
    { id: 'chatbot' as AppView, label: 'AI Advisor', icon: <MessageSquare size={20} /> },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      <div className="p-8 flex items-center gap-2 font-bold text-xl tracking-tight text-[#2D3E2D]">
        <div className="text-[#D9ED92] bg-[#2D3E2D] p-1.5 rounded-lg">
          {ICONS.Leaf}
        </div>
        <span>LEAFSLIP</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
              currentView === item.id
                ? 'bg-[#2D3E2D] text-[#D9ED92] shadow-lg shadow-green-900/10'
                : 'text-gray-500 hover:bg-gray-50 hover:text-[#2D3E2D]'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 mb-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#2D3E2D] truncate">{user.name}</p>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-red-500 text-xs font-bold hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
