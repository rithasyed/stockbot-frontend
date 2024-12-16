interface CompanyOfficer {
  maxAge: number;
  name: string;
  age: number;
  title: string;
  yearBorn: number;
  fiscalYear: number;
  totalPay: number;
  exercisedValue: number;
  unexercisedValue: number;
}

export interface StockData {
  ticker: string;
  current_price: number;
  absolute_change: number;
  percentage_change: number;
  info: {
    longName: string;
    marketCap: number;
    dividendYield: number;
    sharesOutstanding: number;
    fullTimeEmployees: number;
    symbol: string;
    longBusinessSummary: string;
    NetIncome: string;
    TotalRevenue: number;
    beta: number;
    industry: string;
    sector: string;
    fiftyTwoWeekHigh: number;
    fiftyTwoWeekLow: number;
    city: string;
    website: string;
    floatShares: number;
    trailingPE: number;
    trailingEps: number;
    priceToBook: number;
    priceToSalesTrailing12Months: number;
    state: string;
    phone: number;
    irWebsite: string;
    dividendRate: number;
    companyOfficers: CompanyOfficer[];
  };
  financials?: any;
  cash_flow?: any;
  ticker_symbols?: string[];
  logo_url?: string;
  recommendations?: any;
}