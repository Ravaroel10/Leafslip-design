
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ReceiptScanner from './components/ReceiptScanner';
import StockInsights from './components/StockInsights';
import ServicesSection from './components/ServicesSection';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import FullChatbot from './components/FullChatbot';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import { ScannedReceipt, AppView, User } from './types';
import { FileText, Clock, Search, Filter, History, BrainCircuit, Menu, X } from 'lucide-react';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [history, setHistory] = useState<ScannedReceipt[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    setUser({
      name: 'Rafael A',
      email: 'rafael@leafslip.com',
      avatar: 'https://i.pravatar.cc/150?u=rafael',
      role: 'Tutor Bisnis MSME'
    });
    setIsAuthenticated(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setIsSidebarOpen(false);
  };

  const handleNewReceipt = (receipt: ScannedReceipt) => {
    setHistory(prev => [receipt, ...prev]);
    setCurrentView('history');
  };

  const renderAuthenticatedView = () => {
    if (!user) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={user} history={history} onNavigate={setCurrentView} />;
      case 'scanner':
        return (
          <div className="max-w-4xl mx-auto px-2">
            <ReceiptScanner onReceiptProcessed={handleNewReceipt} />
          </div>
        );
      case 'recommender':
        return (
          <div className="max-w-4xl mx-auto px-2">
            <div className="mb-6">
              <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-[#2D3E2D]">
                <BrainCircuit className="w-5 h-5" />
                Stock Recommender
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5 font-bold uppercase tracking-wider">Analisis bertenaga AI berdasarkan data struk Anda.</p>
            </div>
            <StockInsights receipts={history} />
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6 px-2">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight flex items-center gap-2 text-[#2D3E2D]">
                  <History className="w-5 h-5" />
                  Riwayat Struk
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Database bisnis digital Anda</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3 h-3" />
                  <input placeholder="Cari barang..." className="w-full bg-white border border-gray-100 rounded-md pl-9 pr-3 py-2 text-[11px] outline-none focus:border-[#D9ED92] transition-colors" />
                </div>
                <button className="bg-white border border-gray-100 p-2 rounded-md text-gray-400 hover:text-[#2D3E2D] transition-colors">
                  <Filter size={14} />
                </button>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="bg-white rounded border border-gray-100 p-12 text-center flex flex-col items-center">
                <div className="w-14 h-14 bg-gray-50 rounded-md flex items-center justify-center mb-4">
                  <FileText className="text-gray-300" size={24} />
                </div>
                <h3 className="text-sm font-bold text-[#2D3E2D] mb-1 uppercase tracking-widest">Database Kosong</h3>
                <p className="text-[10px] text-gray-400 max-w-[220px] mb-6 leading-relaxed">Scan struk pertama Anda untuk mulai mendigitalkan inventaris.</p>
                <button 
                  onClick={() => setCurrentView('scanner')}
                  className="bg-[#2D3E2D] text-[#D9ED92] px-6 py-2.5 rounded font-bold text-xs hover:brightness-110 active:scale-95 transition-all uppercase tracking-widest"
                >
                  Mulai Scan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {history.map(receipt => (
                  <div key={receipt.id} className="bg-white p-5 rounded border border-gray-100 hover:border-[#D9ED92] transition-all flex flex-col group relative">
                    <div className="flex justify-between items-start mb-4">
                       <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{receipt.date}</span>
                       <span className="text-[8px] font-bold bg-[#D9ED92]/30 text-[#2D3E2D] px-2 py-0.5 rounded uppercase">{receipt.category}</span>
                    </div>
                    <h4 className="font-bold text-sm mb-3 border-b border-gray-50 pb-2 truncate text-[#2D3E2D]">{receipt.merchantName}</h4>
                    <div className="space-y-2 mb-4 flex-grow">
                      {receipt.items.slice(0,2).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[10px] text-gray-500">
                          <span className="truncate pr-6">{item.quantity}x {item.name}</span>
                          <span className="font-bold text-[#2D3E2D] shrink-0">Rp{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                      {receipt.items.length > 2 && <p className="text-[8px] text-gray-300 font-bold uppercase">+{receipt.items.length - 2} items lainnya</p>}
                    </div>
                    <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                       <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Total Bayar</span>
                       <span className="text-base font-black text-[#2D3E2D]">Rp{receipt.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'chatbot':
        return <FullChatbot />;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen selection:bg-[#D9ED92] selection:text-[#2D3E2D] bg-[#FDFDFD]">
        <Navbar currentView={'dashboard'} onNavigate={() => {}} onOpenMobileMenu={() => setIsSidebarOpen(true)} />
        <main className="pt-16 md:pt-20">
          <Hero />
          <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col items-center">
             <div className="bg-white p-8 rounded border border-gray-100 text-center space-y-6 max-w-sm w-full animate-in zoom-in-95 duration-500">
                <div className="text-[#D9ED92] bg-[#2D3E2D] p-3 rounded w-fit mx-auto shadow-sm">
                  {React.cloneElement(ICONS.Leaf as React.ReactElement, { size: 24 })}
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-[#2D3E2D] uppercase tracking-widest">Masuk Dashboard</h2>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">Satu platform untuk semua struk belanja bisnis Anda.</p>
                </div>
                <button 
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-3 rounded font-bold text-xs text-[#2D3E2D] hover:bg-gray-50 hover:border-[#D9ED92] transition-all group active:scale-95"
                >
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-4 h-4 transition-transform group-hover:scale-110" alt="Google" />
                  Sign in with Google
                </button>
             </div>
          </div>
          <ServicesSection />
          <CTASection />
        </main>
        <Footer scrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col lg:flex-row relative">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#2D3E2D]/10 backdrop-blur-[2px] z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentView={currentView} 
        onNavigate={(view) => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }} 
        user={user!} 
        onLogout={handleLogout} 
      />
      
      {/* Mobile Sticky Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2 font-bold text-[11px] tracking-tight text-[#2D3E2D]">
          <div className="text-[#D9ED92] bg-[#2D3E2D] p-1 rounded">
            {React.cloneElement(ICONS.Leaf as React.ReactElement, { size: 14 })}
          </div>
          <span className="uppercase tracking-widest font-black">LEAFSLIP</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 text-[#2D3E2D] hover:bg-gray-50 rounded-md transition-colors"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Main Content Area */}
      <main className={`flex-1 lg:ml-20 min-h-screen flex flex-col ${currentView === 'chatbot' ? 'overflow-hidden' : 'p-4 md:p-8 lg:p-12 overflow-x-hidden'}`}>
        <div className="flex-1 w-full max-w-[1600px] mx-auto">
          {renderAuthenticatedView()}
        </div>
      </main>
    </div>
  );
};

export default App;
