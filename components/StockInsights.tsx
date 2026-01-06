
import React, { useState } from 'react';
import { ScannedReceipt, StockRecommendation, TimePeriod } from '../types';
import { ICONS } from '../constants';
import { TrendingDown, TrendingUp, AlertTriangle, Zap, CalendarDays } from 'lucide-react';

interface StockInsightsProps {
  receipts: ScannedReceipt[];
}

const StockInsights: React.FC<StockInsightsProps> = ({ receipts }) => {
  const [period, setPeriod] = useState<TimePeriod>('weekly');

  const generateRecommendations = (): StockRecommendation[] => {
    if (receipts.length === 0) return [];
    const itemMap = new Map<string, { count: number, total: number }>();
    receipts.forEach(r => {
      r.items.forEach(i => {
        const existing = itemMap.get(i.name) || { count: 0, total: 0 };
        itemMap.set(i.name, { count: existing.count + 1, total: existing.total + i.quantity });
      });
    });
    const recommendations: StockRecommendation[] = [];
    itemMap.forEach((val, key) => {
      if (val.total > 15) recommendations.push({ itemName: key, action: 'Restock', reason: 'Fast selling item in this period.', confidence: 0.94 });
      else if (val.total < 5) recommendations.push({ itemName: key, action: 'Reduce', reason: 'Low turnover; risk of overstock.', confidence: 0.81 });
    });
    return recommendations.slice(0, 4);
  };

  const recs = generateRecommendations();

  return (
    <div className="bg-[#2D3E2D] rounded-[40px] p-8 text-white h-full relative overflow-hidden flex flex-col min-h-[600px]">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D9ED92] rounded-full blur-[80px] opacity-20"></div>

      <div className="relative z-10 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-white/10 rounded-xl">{ICONS.Chart}</span>
            Waste Tracker
          </h3>
          
          <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10">
            {(['weekly', 'monthly', 'yearly'] as TimePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${
                  period === p ? 'bg-[#D9ED92] text-[#2D3E2D]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {receipts.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center py-20 text-center text-gray-400 space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Zap className="w-8 h-8 opacity-20" />
             </div>
             <p className="font-medium">No sales data found for the<br/><span className="text-[#D9ED92]">{period}</span> period.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6 text-[#D9ED92]">
              <CalendarDays size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Analytics for {period} view</span>
            </div>
            {recs.map((rec, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-[28px] p-6 hover:bg-white/10 transition-all cursor-default group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg">{rec.itemName}</h4>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                    rec.action === 'Restock' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {rec.action}
                  </span>
                </div>
                <p className="text-sm text-gray-400 font-light">{rec.reason}</p>
                <div className="mt-4 flex items-center justify-between text-xs pt-4 border-t border-white/5">
                   <div className="flex items-center gap-1.5 font-bold text-[#D9ED92]">
                      {rec.action === 'Restock' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {Math.round(rec.confidence * 100)}% Confidence
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] text-center">
          Powered by Leafslip Predictor AI
        </p>
      </div>
    </div>
  );
};

export default StockInsights;
