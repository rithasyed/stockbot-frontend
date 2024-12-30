import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AnalysisCategory {
  score: number;
  comment: string;
}

interface AnalysisData {
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

interface StockAnalysisSectionProps {
  selectedStock: string;
}

const StockAnalysisSection: React.FC<StockAnalysisSectionProps> = ({ selectedStock }) => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ticker: selectedStock }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analysis');
        }

        const data = await response.json();

        setAnalysisData(data as AnalysisData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setAnalysisData(null);
      } finally {
        setLoading(false);
      }
    };

    if (selectedStock) {
      fetchAnalysis();
    }
  }, [selectedStock]);

  const getScoreColor = (score: number): string => {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-500";
    return "text-red-500";
  };

  if (loading) return <div className="text-center p-4">Loading analysis...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!analysisData || !analysisData.analysis) {
    return <div className="text-center p-4">No analysis data available</div>;
  }

  const analysisEntries = Object.entries(analysisData.analysis);
  if (analysisEntries.length === 0) {
    return <div className="text-center p-4">No analysis categories available</div>;
  }

  return (
    <div className="mt-8 mb-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Bot Analysis</span>
            <span className={`text-xl ${getScoreColor(analysisData.total_score / 15)}`}>
              Score: {analysisData.total_score}/75
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-medium mb-2">
            Recommendation: {analysisData.rank}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {analysisEntries.map(([key, value]) => (
          <Card key={key}>
            <CardHeader>
              <CardTitle className="text-lg capitalize flex justify-between">
                <span>{key.replace(/_/g, ' ')}</span>
                <span className={getScoreColor(value.score)}>
                  {value.score}/5
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{value.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StockAnalysisSection;