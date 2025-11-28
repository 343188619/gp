import React from 'react';
import { Recommendation } from '../types';

interface RecommendationCardProps {
  data: Recommendation;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ data }) => {
  const getColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'SELL': return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
      default: return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    }
  };

  const getLabel = (action: string) => {
    switch (action) {
      case 'BUY': return '建议买入 (BUY)';
      case 'SELL': return '建议卖出 (SELL)';
      default: return '建议持有 (HOLD)';
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 backdrop-blur-md shadow-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 ${getColor(data.action)}`}>
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-sm uppercase tracking-widest opacity-80 mb-1">AI 投资建议</h2>
        <div className="text-4xl font-bold font-serif">{getLabel(data.action)}</div>
        <div className="mt-2 text-sm opacity-90">置信度: {data.confidence}%</div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
          <div className="text-xs text-slate-400 mb-1">建议入场区间</div>
          <div className="font-mono text-lg font-bold">{data.entryPriceRange}</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
          <div className="text-xs text-slate-400 mb-1">目标止盈区间</div>
          <div className="font-mono text-lg font-bold">{data.exitPriceRange}</div>
        </div>
        <div className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
          <div className="text-xs text-slate-400 mb-1">投资周期</div>
          <div className="font-bold text-sm">{data.timeHorizon}</div>
        </div>
      </div>
    </div>
  );
};