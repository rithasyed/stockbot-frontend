export interface IndexScore {
  "ticker_name" : string;
  "ticker_symbol" : string;
   "w_score": number;
   "w_squeeze": boolean;
  "five_d_score": number;
  "five_d_squeeze": boolean;
   "d_score": number;
   "d_squeeze": boolean;
  "one_h_score": number;
  "one_h_squeeze": boolean;
  "ninety_m_score": number;
  "ninety_m_squeeze": boolean;
  "thirty_m_score": number;
  "thirty_m_squeeze": boolean;
  "fifteen_m_score": number;
  "fifteen_m_squeeze": boolean;
  "long_score": number;
  "short_score": number;
  "trend": string;
  "long_rank": string;
  "short_rank": string;
  "score_change_trend": string;
}
