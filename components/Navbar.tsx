
import React from 'react';
import { ICONS } from '../constants';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          // Fixed: 'home' is not a valid AppView, changing to 'dashboard'
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#2D3E2D] cursor-pointer"
        >
          <div className="text-[#D9ED92] bg-[#2D3E2D] p-1.5 rounded-lg">
            {ICONS.Leaf}
          </div>
          <span>LEAFSLIP</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <button 
            onClick={() => onNavigate('scanner')}
            className={`transition-all ${currentView === 'scanner' ? 'text-[#2D3E2D] font-bold border-b-2 border-[#D9ED92]' : 'text-gray-500 hover:text-[#2D3E2D]'}`}
          >
            Scanner
          </button>
          <button 
            onClick={() => onNavigate('recommender')}
            className={`transition-all ${currentView === 'recommender' ? 'text-[#2D3E2D] font-bold border-b-2 border-[#D9ED92]' : 'text-gray-500 hover:text-[#2D3E2D]'}`}
          >
            Waste Tracker
          </button>
          <button 
            onClick={() => onNavigate('history')}
            className={`transition-all ${currentView === 'history' ? 'text-[#2D3E2D] font-bold border-b-2 border-[#D9ED92]' : 'text-gray-500 hover:text-[#2D3E2D]'}`}
          >
            History
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('chatbot')}
            className={`p-2.5 rounded-full transition-all ${currentView === 'chatbot' ? 'bg-[#2D3E2D] text-[#D9ED92]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            <ICONS.Mail.type {...ICONS.Mail.props} />
          </button>
          <button 
            onClick={() => onNavigate('scanner')}
            className="p-2.5 rounded-full bg-[#D9ED92] text-[#2D3E2D] hover:scale-105 transition-transform shadow-md"
          >
            {ICONS.Camera}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
