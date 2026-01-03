
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReceiptScanner from './components/ReceiptScanner';
import StockInsights from './components/StockInsights';
import ServicesSection from './components/ServicesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import AgricultureAssistant from './components/AgricultureAssistant';
import { ScannedReceipt } from './types';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [history, setHistory] = useState<ScannedReceipt[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewReceipt = (receipt: ScannedReceipt) => {
    setHistory(prev => [receipt, ...prev]);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen selection:bg-[#D9ED92] selection:text-[#2D3E2D] bg-[#F8F9FA]">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* App Core Functionality Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 -mt-20 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <ReceiptScanner onReceiptProcessed={handleNewReceipt} />
            </div>
            <div className="lg:col-span-5">
              <StockInsights receipts={history} />
            </div>
          </div>
        </section>

        {/* Live Feed / History (Optional Preview) */}
        {history.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pb-20 overflow-x-auto">
             <div className="flex gap-6 pb-4">
                {history.map(receipt => (
                  <div key={receipt.id} className="min-w-[280px] bg-white p-6 rounded-3xl shadow-sm border border-dashed border-gray-200 relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[10px] font-bold text-gray-400 uppercase">{receipt.date}</span>
                       <span className="text-[10px] font-bold bg-[#D9ED92] text-[#2D3E2D] px-2 py-0.5 rounded uppercase">{receipt.category}</span>
                    </div>
                    <h4 className="font-bold mb-4 border-b border-gray-100 pb-2">{receipt.merchantName}</h4>
                    <div className="space-y-2 mb-6 flex-grow">
                      {receipt.items.slice(0,3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-500">
                          <span>{item.quantity}x {item.name}</span>
                          <span>Rp{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                      {receipt.items.length > 3 && <div className="text-[10px] text-gray-400">+{receipt.items.length - 3} more items</div>}
                    </div>
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                       <span className="text-sm font-bold">TOTAL</span>
                       <span className="text-lg font-bold text-[#2D3E2D]">Rp{receipt.grandTotal.toLocaleString()}</span>
                    </div>
                    {/* Visual Cutout effect */}
                    <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-2">
                       {[...Array(10)].map((_, i) => <div key={i} className="w-4 h-4 bg-[#F8F9FA] rounded-full"></div>)}
                    </div>
                  </div>
                ))}
             </div>
          </section>
        )}

        <ServicesSection />
        <CTASection />
      </main>

      <Footer scrollToTop={scrollToTop} />
      <AgricultureAssistant />
    </div>
  );
};

export default App;
