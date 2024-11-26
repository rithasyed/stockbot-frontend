export interface PaperTrade {
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
  tradetype: string;
  back_testing: boolean;
  interval: string;
  remarks: string;
}
