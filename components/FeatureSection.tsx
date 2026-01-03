
import React from 'react';
import { AIMS, BENEFITS } from '../constants';

const FeatureSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20 md:py-32" id="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left Side: Aims Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-[#D9ED92]/40 rounded-[32px] p-8 space-y-8 sticky top-32">
            <h2 className="text-2xl font-bold tracking-tight uppercase">AIMS FOR</h2>
            
            <div className="space-y-6">
              {AIMS.map((aim) => (
                <div key={aim.id} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-7 h-7 bg-[#2D3E2D] text-[#D9ED92] rounded-full flex items-center justify-center text-xs font-bold">
                    {aim.id}
                  </span>
                  <p className="text-[#2D3E2D] font-medium leading-tight pt-0.5">
                    {aim.text}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full bg-[#D9ED92] text-[#2D3E2D] py-3.5 rounded-full font-bold text-sm hover:brightness-95 transition-all shadow-sm">
              Explore Other Services
            </button>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="lg:col-span-8 space-y-12">
          {/* Main Image */}
          <div className="relative group">
            <img 
              src="https://picsum.photos/seed/greenhouse1/1200/800" 
              alt="Greenhouse interior" 
              className="w-full h-[400px] md:h-[500px] object-cover rounded-[40px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Description Text */}
          <div className="space-y-6">
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              GreenRoots' Greenhouse Farming service uses advanced climate control and sustainable practices to grow high-quality vegetables, herbs, and fruits regardless of the season. This method ensures consistent supply, minimizes resource waste, and maximizes yield, perfect for businesses that demand fresh, reliable produce all year long.
            </p>
            
            <div className="space-y-4 pt-4">
              <h3 className="text-3xl font-bold">Benefits You'll Get</h3>
              <ul className="space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit.id} className="flex items-center gap-3 text-gray-700">
                    <span className="w-1.5 h-1.5 bg-[#2D3E2D] rounded-full"></span>
                    <span>{benefit.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-full md:w-1/3">
              <img 
                src="https://picsum.photos/seed/farmer/400/400" 
                alt="Farmer with basket" 
                className="w-48 h-48 md:w-full md:h-auto object-cover rounded-[32px] mx-auto"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-3xl font-bold">Technique</h3>
                <p className="text-gray-500 leading-relaxed">
                  We utilize advanced greenhouse structures with controlled temperature, humidity, and light systems. Crops are grown in nutrient-rich, pesticide-free soil or hydroponic setups.
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
                <button className="bg-[#2D3E2D] text-[#D9ED92] px-8 py-3 rounded-full font-bold hover:brightness-125 transition-all">
                  Let's Explore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
