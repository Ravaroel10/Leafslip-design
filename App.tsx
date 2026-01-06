
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReceiptScanner from './components/ReceiptScanner';
import StockInsights from './components/StockInsights';
import ServicesSection from './components/ServicesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import FullChatbot from './components/FullChatbot';
import { ScannedReceipt, AppView } from './types';
import { ICONS } from './constants';
import { FileText, Clock, Search, Filter, LayoutDashboard, History, Sparkles, BrainCircuit } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [history, setHistory] = useState<ScannedReceipt[]>([]);

  const handleNewReceipt = (receipt: ScannedReceipt) => {
    setHistory(prev => [receipt, ...prev]);
    setCurrentView('history');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderView = () => {
    switch (currentView) {
      case 'scanner':
        return (
          <div className="max-w-6xl mx-auto py-12 px-6">
            <ReceiptScanner onReceiptProcessed={handleNewReceipt} />
          </div>
        );
      case 'recommender':
        return (
          <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="mb-10">
              <h2 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
                <BrainCircuit className="text-[#2D3E2D] w-10 h-10" />
                Stock Recommender
              </h2>
              <p className="text-gray-500 mt-2 text-lg">AI-powered analytics based on your scanned data.</p>
            </div>
            <StockInsights receipts={history} />
          </div>
        );
      case 'chatbot':
        return (
          <div className="max-w-7xl mx-auto py-12 px-6">
             <FullChatbot />
          </div>
        );
      case 'history':
        return (
          <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter flex items-center gap-3 text-[#2D3E2D]">
                  <History className="w-8 h-8" />
                  Receipt History
                </h2>
                <p className="text-gray-500">Browse your digitized business database</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input placeholder="Search items or merchants..." className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 ring-[#D9ED92]" />
                </div>
                <button className="bg-white border border-gray-200 p-3 rounded-2xl text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
                  <Filter size={20} />
                </button>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="bg-white rounded-[40px] p-24 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-8">
                  <FileText className="text-gray-300" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-[#2D3E2D] mb-3">Database is Empty</h3>
                <p className="text-gray-500 max-w-sm mb-10 leading-relaxed text-lg">Your scanned receipts will appear here once you start using the Scanner.</p>
                <button 
                  onClick={() => setCurrentView('scanner')}
                  className="bg-[#2D3E2D] text-[#D9ED92] px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-all text-lg"
                >
                  Open Scanner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {history.map(receipt => (
                  <div key={receipt.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col group">
                    <div className="flex justify-between items-start mb-6">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{receipt.date}</span>
                       <span className="text-[10px] font-bold bg-[#D9ED92] text-[#2D3E2D] px-4 py-1.5 rounded-full uppercase tracking-widest">{receipt.category}</span>
                    </div>
                    <h4 className="font-bold text-xl mb-6 border-b border-gray-50 pb-4 truncate text-[#2D3E2D]">{receipt.merchantName}</h4>
                    <div className="space-y-3 mb-8 flex-grow">
                      {receipt.items.slice(0,3).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                          <span className="truncate pr-4 font-medium">{item.quantity}x {item.name}</span>
                          <span className="font-bold text-[#2D3E2D]">Rp{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                      {receipt.items.length > 3 && (
                        <div className="text-[10px] text-[#2E7D32] font-black mt-4 uppercase tracking-[0.1em] bg-green-50 w-fit px-3 py-1 rounded-md">
                          +{receipt.items.length - 3} OTHER PRODUCTS
                        </div>
                      )}
                    </div>
                    <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">SUBTOTAL</span>
                       <span className="text-2xl font-black text-[#2D3E2D]">Rp{receipt.grandTotal.toLocaleString()}</span>
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
      
      {/* Redesigned Floating Chat Button */}
      <button 
        onClick={() => setCurrentView('chatbot')}
        className="fixed bottom-10 right-10 bg-[#2D3E2D] text-[#D9ED92] p-5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group z-[60]"
      >
        <Sparkles size={28} />
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-[#2D3E2D] px-6 py-3 rounded-2xl text-xs font-bold shadow-xl border border-gray-100 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-x-4 group-hover:translate-x-0">
          Open AI Advisor
        </div>
      </button>
    </div>
  );
};

export default App;
