export interface IndexScore {
  "rank": number;
  "ticker_name" : string;
  "ticker_symbol" : string;
   "w_score": number;
   "w_squeeze": string;
  "five_d_score": number;
  "five_d_squeeze": string;
   "d_score": number;
   "d_squeeze": string;
  "one_h_score": number;
  "one_h_squeeze": string;
  "ninety_m_score": number;
  "ninety_m_squeeze": string;
  "thirty_m_score": number;
  "thirty_m_squeeze": string;
  "fifteen_m_score": number;
  "fifteen_m_squeeze": string;
  "long_score": number;
  "short_score": number;
  "trend": string;
  "long_rank": string;
  "short_rank": string;
  "score_change_trend": string;
  "current_price": number;
}
