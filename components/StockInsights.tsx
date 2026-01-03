
import React from 'react';
import { ScannedReceipt, StockRecommendation } from '../types';
import { ICONS, COLORS } from '../constants';
import { TrendingDown, TrendingUp, AlertTriangle, Zap } from 'lucide-react';

interface StockInsightsProps {
  receipts: ScannedReceipt[];
}

const StockInsights: React.FC<StockInsightsProps> = ({ receipts }) => {
  // Simple Mock Recommendation Logic based on current session
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
      if (val.total > 20) {
        recommendations.push({ itemName: key, action: 'Restock', reason: 'High velocity sales detected.', confidence: 0.92 });
      } else if (val.total < 3 && receipts.length > 2) {
        recommendations.push({ itemName: key, action: 'Reduce', reason: 'Low turnover; potential for spoilage.', confidence: 0.85 });
      }
    });

    return recommendations.slice(0, 3);
  };

  const recs = generateRecommendations();

  return (
    <div className="bg-[#2D3E2D] rounded-[40px] p-8 text-white h-full relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D9ED92] rounded-full blur-[80px] opacity-20"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold flex items-center gap-2">
            <span className="p-2 bg-white/10 rounded-xl">{ICONS.Chart}</span>
            Stock Recommender
          </h3>
          <span className="text-[10px] font-bold text-[#D9ED92] border border-[#D9ED92]/30 px-3 py-1 rounded-full uppercase">AI Analysis</span>
        </div>

        {receipts.length === 0 ? (
          <div className="py-20 text-center text-gray-400 space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                <Zap className="w-8 h-8 opacity-20" />
             </div>
             <p className="font-medium">Scan your first receipt to see<br/>smart inventory insights.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recs.map((rec, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-[24px] p-5 hover:bg-white/10 transition-all cursor-default group">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg">{rec.itemName}</h4>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                    rec.action === 'Restock' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {rec.action}
                  </span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {rec.reason}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-[#D9ED92]">
                    {rec.action === 'Restock' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{Math.round(rec.confidence * 100)}% Match</span>
                  </div>
                  <button className="text-[10px] font-bold underline opacity-0 group-hover:opacity-100 transition-opacity">Apply to Inventory</button>
                </div>
              </div>
            ))}
            
            {recs.length === 0 && (
              <div className="flex items-center gap-3 p-4 bg-[#D9ED92]/10 border border-[#D9ED92]/20 rounded-2xl">
                <AlertTriangle className="text-[#D9ED92] w-5 h-5" />
                <p className="text-sm text-[#D9ED92]/80">Processing more data for better patterns...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockInsights;
