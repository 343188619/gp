import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';
import { analyzeStock } from './services/geminiService';
import { AnalysisState, StockAnalysisResult } from './types';
import { AnalysisCharts } from './components/AnalysisCharts';
import { RecommendationCard } from './components/RecommendationCard';
import { MarkdownRenderer } from './components/MarkdownRenderer';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    data: null,
    error: null,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setState({ status: 'loading', data: null, error: null });

    try {
      const result = await analyzeStock(query);
      setState({ status: 'success', data: result, error: null });
    } catch (err: any) {
      setState({ status: 'error', data: null, error: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-amber-500/30 selection:text-amber-200 overflow-x-hidden">
      {/* Background Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-amber-400 text-xs tracking-widest uppercase mb-6 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            AI Powered Financial Analysis
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 mb-6 drop-shadow-sm">
            AlphaInsight
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            尊享智能投资分析系统。利用生成式 AI 与实时搜索网络，为您提供专业的股票趋势预测与买卖建议。
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-700 shadow-2xl p-2">
              <Search className="ml-4 text-slate-400 w-6 h-6" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入股票代码或名称 (例如: TSLA, 茅台, BTC)"
                className="w-full bg-transparent text-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none font-light"
              />
              <button 
                type="submit"
                disabled={state.status === 'loading'}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {state.status === 'loading' ? <Loader2 className="animate-spin" /> : <TrendingUp className="w-5 h-5" />}
                <span>分析</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {state.status === 'loading' && (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-slate-700 border-t-amber-500 rounded-full animate-spin mb-8"></div>
              <p className="text-slate-400 text-lg animate-pulse">正在全网搜索最新资讯并生成分析模型...</p>
            </motion.div>
          )}

          {state.status === 'error' && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-500/50 rounded-xl p-8 text-center max-w-2xl mx-auto backdrop-blur-md"
            >
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-200 mb-2">分析未能完成</h3>
              <p className="text-red-200/80">{state.error}</p>
            </motion.div>
          )}

          {state.status === 'success' && state.data && (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-slate-700/50">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-slate-100 mb-2">{state.data.companyName}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-mono text-amber-400">{state.data.symbol}</span>
                    <span className="text-xl text-slate-400">当前参考价: <span className="text-slate-200">{state.data.currentPrice}</span></span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-right">
                  <div className="text-xs text-slate-500 mb-1">AI 模型版本</div>
                  <div className="px-3 py-1 bg-indigo-900/30 border border-indigo-500/30 rounded text-indigo-300 text-sm">Gemini 2.5 Pro (Enhanced)</div>
                </div>
              </div>

              {/* Recommendation Logic */}
              <RecommendationCard data={state.data.recommendation} />

              {/* Charts Section */}
              <AnalysisCharts data={state.data.trendData} />

              {/* Main Text Analysis */}
              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-md shadow-xl mb-12">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif text-slate-100">深度分析报告</h3>
                </div>
                <MarkdownRenderer content={state.data.markdownAnalysis} />
              </div>

              {/* Sources Section */}
              {state.data.sources && state.data.sources.length > 0 && (
                <div className="mb-12">
                  <h4 className="text-sm uppercase tracking-widest text-slate-500 mb-4">参考来源 / 联网搜索结果</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {state.data.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:border-slate-600 transition-colors group"
                      >
                        <span className="truncate text-slate-400 text-sm group-hover:text-amber-400 transition-colors">{source.title}</span>
                        <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-amber-400 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer / Disclaimer */}
        <footer className="mt-20 pt-8 border-t border-slate-800 text-center">
          <div className="flex items-center justify-center gap-2 mb-4 text-amber-500/80">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold">风险提示</span>
          </div>
          <p className="text-slate-500 text-sm max-w-3xl mx-auto leading-relaxed">
            本系统分析结果由 AI 模型基于互联网公开数据生成，仅供参考，不构成任何投资建议。股市有风险，投资需谨慎。
            AlphaInsight 不对任何基于本系统信息做出的投资决定负责。请结合个人风险承受能力与专业理财顾问意见进行操作。
          </p>
          <p className="text-slate-600 text-xs mt-4">
            Powered by Gemini API & Google Search Grounding
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;