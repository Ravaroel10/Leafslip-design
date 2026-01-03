
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
              <span>GREEN ROOTS</span>
            </div>
            
            <div className="space-y-6 max-w-md">
              <h3 className="text-3xl font-light leading-snug">
                Get updates, tips, and special offers right in your inbox.
              </h3>
              <div className="flex p-1 bg-white/10 rounded-full border border-white/20 focus-within:border-white/40 transition-all">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 bg-transparent px-6 py-3 outline-none text-white placeholder:text-gray-400"
                />
                <button className="bg-white text-[#2D3E2D] px-8 py-3 rounded-full font-bold hover:bg-[#D9ED92] transition-colors">
                  Send
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              {[ICONS.Instagram, ICONS.Facebook, ICONS.Mail, ICONS.Phone].map((icon, idx) => (
                <button key={idx} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-all hover:scale-110">
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
                  className="flex items-center gap-2 border border-white/20 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all"
                >
                  Back to Top {ICONS.ArrowUp}
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-8 text-right">
                <div className="space-y-4">
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Home</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">About</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Services</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Product</a>
                </div>
                <div className="space-y-4">
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Blogs</a>
                  <a href="#" className="block hover:text-[#D9ED92] transition-colors">Contact</a>
                  <a href="#" className="block text-gray-400 text-sm hover:text-white transition-colors pt-4">Privacy and Policy</a>
                  <a href="#" className="block text-gray-400 text-sm hover:text-white transition-colors">Term and Condition</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
          <p>© 2024 Green Roots Agriculture. All rights reserved.</p>
          <div className="flex gap-8">
            <span>Crafted with sustainable passion.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
