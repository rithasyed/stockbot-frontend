export interface RecommendationsTableProps {
    recommendations: {
      period: Record<string, string>;
      strongBuy: Record<string, number>;
      buy: Record<string, number>;
      hold: Record<string, number>;
      sell: Record<string, number>;
      strongSell: Record<string, number>;
    };
  }