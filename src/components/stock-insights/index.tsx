import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { IndexScore } from '../ticker-scores/types';

const StockInsights: React.FC<{ selectedStock: string; scores: IndexScore[] }> = ({ selectedStock, scores }) => {
  const getScoreColor = (score: number): string => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getGradeColor = (grade: string): string => {
    const colors: Record<string, string> = {
      'A++': '#008000',
      'A+': '#00CC00',
      'A': '#CCCC00',
      'B': '#FFC080',
      'C': '#FF9900',
      'D': '#FF3300',
      'F': '#CC0000'
    };
    return colors[grade] || '#666666';
  };

  const getSqueezeColor = (squeeze: string): string => {
    switch (squeeze) {
      case 'no squeeze': return 'text-green-500';
      case 'low squeeze': return 'text-black';
      case 'mid squeeze': return 'text-red-500';
      case 'high squeeze': return 'text-orange-500';
      default: return 'text-green-500';
    }
  };

  // Find and validate ticker data
  const tickerData = scores?.find(score => score.ticker_symbol === selectedStock);
  
  if (!tickerData) {
    return (
      <div className="m-6 flex justify-center items-center">
        <p className="text-muted-foreground">No insights available for {selectedStock}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Scores Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Score Insight</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex justify-between items-center">
              <span className="font-medium">Long Score</span>
              <span className={`font-bold ${getScoreColor(tickerData.long_score)}`}>
                {tickerData.long_score}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Short Score</span>
              <span className={`font-bold ${getScoreColor(tickerData.short_score)}`}>
                {tickerData.short_score}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Long Trend</span>
              <span style={{ color: getGradeColor(tickerData.long_rank) }}>
                {tickerData.long_rank}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Short Trend</span>
              <span style={{ color: getGradeColor(tickerData.short_rank) }}>
                {tickerData.short_rank}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Frame Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle>Time Frame Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-medium">Weekly</p>
              <p className={getSqueezeColor(tickerData.w_squeeze)}>
                {tickerData.w_score}
              </p>
            </div>
            <div>
              <p className="font-medium">5 Days</p>
              <p className={getSqueezeColor(tickerData.five_d_squeeze)}>
                {tickerData.five_d_score}
              </p>
            </div>
            <div>
              <p className="font-medium">1 Day</p>
              <p className={getSqueezeColor(tickerData.d_squeeze)}>
                {tickerData.d_score}
              </p>
            </div>
            <div>
              <p className="font-medium">90 Minutes</p>
              <p className={getSqueezeColor(tickerData.ninety_m_squeeze)}>
                {tickerData.ninety_m_score}
              </p>
            </div>
            <div>
              <p className="font-medium">1 Hour</p>
              <p className={getSqueezeColor(tickerData.one_h_squeeze)}>
                {tickerData.one_h_score}
              </p>
            </div>
            <div>
              <p className="font-medium">30 Minutes</p>
              <p className={getSqueezeColor(tickerData.thirty_m_squeeze)}>
                {tickerData.thirty_m_score}
              </p>
            </div>
            <div>
              <p className="font-medium">15 Minutes</p>
              <p className={getSqueezeColor(tickerData.fifteen_m_squeeze)}>
                {tickerData.fifteen_m_score}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-medium">Current Trend</p>
              <p className="text-muted-foreground">{tickerData.trend}</p>
            </div>
            <div>
              <p className="font-medium">Score Change Trend</p>
              <p className="text-muted-foreground">{tickerData.score_change_trend}</p>
            </div>
            <div>
              <p className="font-medium">Current Price</p>
              <p className="text-muted-foreground">${tickerData.current_price}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockInsights;