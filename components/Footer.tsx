
import React from 'react';
import { ICONS } from '../constants';

interface FooterProps {
  scrollToTop: () => void;
}

const Footer: React.FC<FooterProps> = ({ scrollToTop }) => {
  return (
    <footer className="bg-[#2D3E2D] text-white pt-24 pb-12 rounded-t-[40px] md:rounded-t-[80px]" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          {/* Brand & Newsletter */}
          <div className="lg:col-span-6 space-y-10">
            <div className="flex items-center gap-2 font-bold text-2xl tracking-tight">
              <div className="text-[#D9ED92]">
                {ICONS.Leaf}
              </div>
              <span>LEAFSLIP</span>
            </div>
            
            <div className="space-y-6 max-w-md">
              <h3 className="text-3xl font-light leading-snug">
                Building a <span className="text-[#D9ED92] font-medium italic">paperless & waste-free</span> future for Indonesian small businesses.
              </h3>
              <div className="flex p-1 bg-white/10 rounded-full border border-white/20 focus-within:border-[#D9ED92] transition-all">
                <input 
                  type="email" 
                  placeholder="Owner's email address" 
                  className="flex-1 bg-transparent px-6 py-3 outline-none text-white placeholder:text-gray-400 text-sm"
                />
                <button className="bg-[#D9ED92] text-[#2D3E2D] px-8 py-3 rounded-full font-bold hover:brightness-110 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              {[ICONS.Instagram, ICONS.Facebook, ICONS.Mail, ICONS.Phone].map((icon, idx) => (
                <button key={idx} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-[#D9ED92] hover:text-[#2D3E2D] hover:border-[#D9ED92] transition-all hover:scale-110">
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-6 flex flex-col md:flex-row justify-between gap-12">
            <div className="space-y-10 flex-1">
              <div className="flex justify-end">
                <button 
                  onClick={scrollToTop}
                  className="flex items-center gap-2 bg-white/5 border border-white/20 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Back to Top {ICONS.ArrowUp}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8 text-right">
                <div className="space-y-4 text-sm">
                  <span className="block text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-4">PLATFORM</span>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Scanner</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Inventory API</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Waste Insights</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Retail Network</a>
                </div>
                <div className="space-y-4 text-sm">
                  <span className="block text-gray-500 font-bold uppercase text-[10px] tracking-widest mb-4">LEGAL</span>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Terms of Service</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Privacy Policy</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Data Security</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Help Center</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500">
          <p>© 2024 Leafslip Agriculture & Logistics. Empowering the Backbone of Indonesia.</p>
          <div className="flex gap-8">
            <span className="text-[#D9ED92]">Supported by Gemini AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
