interface AnalysisCategory {
  score: number;
  comment: string;
}

export interface AnalysisData {
  stock: string;
  analysis: {
    market_sentiment: AnalysisCategory;
    price_action: AnalysisCategory;
    technical_indicators: AnalysisCategory;
    support_resistance: AnalysisCategory;
    volatility: AnalysisCategory;
    institutional_activity: AnalysisCategory;
    earnings_financials: AnalysisCategory;
    valuation_metrics: AnalysisCategory;
    dividend_yield: AnalysisCategory;
    sector_trends: AnalysisCategory;
    peer_comparison: AnalysisCategory;
    momentum_indicators: AnalysisCategory;
    insider_activity: AnalysisCategory;
    analyst_ratings: AnalysisCategory;
    risk_assessment: AnalysisCategory;
  };
  total_score: number;
  rank: string;
}

export interface StockAnalysisSectionProps {
  selectedStock: string;
}