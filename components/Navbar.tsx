
import React from 'react';
import { ICONS } from '../constants';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#2D3E2D]">
          <div className="text-[#D9ED92] bg-[#2D3E2D] p-1.5 rounded-lg">
            {ICONS.Leaf}
          </div>
          <span>LEAFSLIP</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10 text-sm font-medium">
          <a href="#" className="text-[#2D3E2D] hover:opacity-70 transition-opacity">Scanner</a>
          <a href="#" className="text-[#2D3E2D] hover:opacity-70 transition-opacity">Insights</a>
          <a href="#" className="text-[#2D3E2D] hover:opacity-70 transition-opacity">Waste Tracker</a>
          <a href="#" className="text-[#2D3E2D] hover:opacity-70 transition-opacity">Community</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 bg-[#2D3E2D] text-[#D9ED92] px-6 py-2.5 rounded-full font-bold text-sm hover:brightness-125 transition-all shadow-sm">
            Login
          </button>
          <button className="p-2.5 rounded-full bg-[#D9ED92] text-[#2D3E2D] hover:scale-105 transition-transform shadow-md">
            {ICONS.Camera}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
