
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReceiptScanner from './components/ReceiptScanner';
import StockInsights from './components/StockInsights';
import ServicesSection from './components/ServicesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import AgricultureAssistant from './components/AgricultureAssistant';
import { ScannedReceipt, AppView } from './types';
import { ICONS } from './constants';
import { FileText, Clock, Search, Filter } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [history, setHistory] = useState<ScannedReceipt[]>([]);

  const handleNewReceipt = (receipt: ScannedReceipt) => {
    setHistory(prev => [receipt, ...prev]);
    // Optionally switch to history view after saving
    setCurrentView('history');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'scanner':
        return (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <ReceiptScanner onReceiptProcessed={handleNewReceipt} />
          </div>
        );
      case 'insights':
        return (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <StockInsights receipts={history} />
          </div>
        );
      case 'history':
        return (
          <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter flex items-center gap-2">
                  <Clock className="text-[#2D3E2D]" />
                  Receipt Database
                </h2>
                <p className="text-gray-500">History of all digitalized transactions</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input placeholder="Search merchants..." className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-[#D9ED92]" />
                </div>
                <button className="bg-white border border-gray-200 p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="text-gray-300" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">No receipts scanned yet</h3>
                <p className="text-gray-500 mb-8">Start by scanning your first Indonesian paper receipt.</p>
                <button 
                  onClick={() => setCurrentView('scanner')}
                  className="bg-[#2D3E2D] text-[#D9ED92] px-8 py-3 rounded-full font-bold shadow-lg"
                >
                  Go to Scanner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map(receipt => (
                  <div key={receipt.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col group">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{receipt.date}</span>
                       <span className="text-[10px] font-bold bg-[#D9ED92] text-[#2D3E2D] px-3 py-1 rounded-full uppercase">{receipt.category}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-4 border-b border-gray-50 pb-2 truncate">{receipt.merchantName}</h4>
                    <div className="space-y-2 mb-6 flex-grow">
                      {receipt.items.slice(0,3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-500">
                          <span className="truncate pr-4">{item.quantity}x {item.name}</span>
                          <span className="font-medium">Rp{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                      {receipt.items.length > 3 && <div className="text-[10px] text-gray-400 font-bold mt-2">+{receipt.items.length - 3} MORE ITEMS</div>}
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                       <span className="text-xs font-bold text-gray-400">GRAND TOTAL</span>
                       <span className="text-xl font-black text-[#2D3E2D]">Rp{receipt.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <>
            <Hero />
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
            <ServicesSection />
            <CTASection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#D9ED92] selection:text-[#2D3E2D] bg-[#F8F9FA] pb-12">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="pt-20">
        {renderView()}
      </main>

      <Footer scrollToTop={scrollToTop} />
      <AgricultureAssistant />
    </div>
  );
};

export default App;
