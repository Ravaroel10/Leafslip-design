
import React from 'react';
import { IMPACT_STATS } from '../constants';

const Hero: React.FC = () => {
  return (
    <section className="pt-20">
      <div className="bg-[#2D3E2D] text-white relative overflow-hidden rounded-b-[40px] md:rounded-b-[80px]">
        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 md:pt-32 md:pb-40 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="inline-block bg-[#D9ED92] text-[#2D3E2D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Digitizing Indonesian MSMEs
              </span>
              <h1 className="text-5xl md:text-8xl font-bold leading-[0.95] mb-8 tracking-tighter">
                Leafslip:<br/><span className="text-[#D9ED92]">Paperless</span> Inventory.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-10 max-w-lg">
                Stop losing money to food waste. Turn paper receipts into smart digital records and get AI stock recommendations in seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#D9ED92] text-[#2D3E2D] px-8 py-4 rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-lime-500/10">
                  Scan Your First Receipt
                </button>
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-10 h-10 rounded-full border-2 border-[#2D3E2D]" alt="user" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-[#2D3E2D] bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                    +12k
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-5 grid grid-cols-1 gap-6">
               {IMPACT_STATS.map((stat, i) => (
                 <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-[32px] flex items-center gap-4 hover:bg-white/10 transition-all group">
                    <div className="p-3 bg-[#D9ED92] text-[#2D3E2D] rounded-2xl group-hover:scale-110 transition-transform">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">{stat.label}</div>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#D9ED92] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default Hero;
