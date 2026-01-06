
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
import { FileText, Clock, Search, Filter, History, BrainCircuit } from 'lucide-react';
// Added missing ICONS import from constants
import { ICONS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [history, setHistory] = useState<ScannedReceipt[]>([]);
  
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = () => {
    // Simulate Google Login
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
          <div className="max-w-4xl mx-auto">
            <ReceiptScanner onReceiptProcessed={handleNewReceipt} />
          </div>
        );
      case 'recommender':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-10">
              <h2 className="text-4xl font-bold tracking-tighter flex items-center gap-4">
                <BrainCircuit className="text-[#2D3E2D] w-10 h-10" />
                Stock Recommender
              </h2>
              <p className="text-gray-500 mt-2 text-lg">Analisis bertenaga AI berdasarkan data struk Anda.</p>
            </div>
            <StockInsights receipts={history} />
          </div>
        );
      case 'history':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter flex items-center gap-3 text-[#2D3E2D]">
                  <History className="w-8 h-8" />
                  Riwayat Struk
                </h2>
                <p className="text-gray-500">Database bisnis digital Anda</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input placeholder="Cari barang atau toko..." className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 ring-[#D9ED92]" />
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
                <h3 className="text-2xl font-bold text-[#2D3E2D] mb-3">Database Kosong</h3>
                <p className="text-gray-500 max-w-sm mb-10 leading-relaxed text-lg">Struk yang Anda scan akan muncul di sini.</p>
                <button 
                  onClick={() => setCurrentView('scanner')}
                  className="bg-[#2D3E2D] text-[#D9ED92] px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition-all text-lg"
                >
                  Buka Scanner
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
      case 'chatbot':
        return <FullChatbot />;
      default:
        return null;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen selection:bg-[#D9ED92] selection:text-[#2D3E2D] bg-[#F8F9FA]">
        <Navbar currentView={'home' as any} onNavigate={() => {}} />
        <main className="pt-20">
          <Hero />
          <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
             <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 text-center space-y-8 max-w-md w-full animate-in zoom-in duration-500">
                <div className="text-[#D9ED92] bg-[#2D3E2D] p-4 rounded-3xl w-fit mx-auto shadow-xl">
                  {/* Fixed: Access ICONS correctly after import */}
                  {ICONS.Leaf}
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tighter text-[#2D3E2D]">Sign In to Dashboard</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">Kelola bisnis MSME Anda dengan kekuatan AI dari Leafslip.</p>
                </div>
                
                <button 
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-2xl font-bold text-[#2D3E2D] hover:bg-gray-50 hover:border-[#D9ED92] transition-all shadow-sm group"
                >
                  <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-6 h-6 group-hover:scale-110 transition-transform" alt="Google" />
                  Sign in with Google
                </button>
                
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Secure access for verified merchants
                </p>
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
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        user={user!} 
        onLogout={handleLogout} 
      />
      
      <main className="flex-1 ml-64 p-12">
        {renderAuthenticatedView()}
      </main>
    </div>
  );
};

export default App;
