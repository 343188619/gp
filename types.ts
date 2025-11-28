export interface ChartDataPoint {
  date: string;
  price: number;
  sentiment?: number;
  volume?: number;
}

export interface Recommendation {
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number; // 0-100
  entryPriceRange: string;
  exitPriceRange: string;
  timeHorizon: string;
}

export interface StockAnalysisResult {
  symbol: string;
  companyName: string;
  currentPrice: string; // approximate from search
  markdownAnalysis: string; // The detailed text report
  recommendation: Recommendation;
  trendData: ChartDataPoint[]; // For the line chart
  sources: { title: string; uri: string }[];
}

export interface AnalysisState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: StockAnalysisResult | null;
  error: string | null;
}