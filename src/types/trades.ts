export interface Trade {
  id: number;
  stockname: string;
  entry_price: string;
  exit_price: string;
  pnl: string;
  status: string;
  entry_time: string;
  exit_time: string | null;
  stoploss: string;
  target: string;
  quantity: string;
  capital: string;
  ROI: string;
  profit: string;
  tradetype: string;
  indicator: string;
  back_testing: boolean;
  interval: string;
  remarks: string;
}

export type TradeStore = {
  loading: boolean;
  success: boolean;
  error: boolean;
  data: Trade[];
  errorData: null;
  execute: () => void;
};
