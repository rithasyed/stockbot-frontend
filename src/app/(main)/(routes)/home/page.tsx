"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import Header from "@/components/mainHeader";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Loader } from "@/components/ui";
import { Button } from "@/components/ui/button";
import RecommendationsTable from "@/components/recommendation-table";
import StatisticsTable from "@/components/statistics-table";
import RecentFinancialTable from "@/components/recentFinancial-table";
import { StockData } from "@/types/home";
import Link from 'next/link';
import StockInsights from "@/components/stock-insights";
import { IndexScore } from "@/components/ticker-scores/types";
import StockAnalysisSection from "@/components/stock-analysis";

interface Symbol {
  id: number;
  name: string;
  full_name: string;
  category_id: number;
}

export default function StockTicker() {
  const [selectedStock, setSelectedStock] = useState<string>("NVDA");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [scores, setScores] = useState<Array<IndexScore>>([]);

  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch('/api/symbols');
        if (!response.ok) throw new Error('Failed to fetch symbols');
        const data = await response.json();
        setSymbols(data);
      } catch (err) {
        console.error('Error fetching symbols:', err);
        setSymbols([]);
      }
    };

    fetchSymbols();
  }, []);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        const stockResponse = await fetch(`/api/stock-data?ticker=${selectedStock}`);
        if (!stockResponse.ok) throw new Error('Failed to fetch stock data');
        const stockData = await stockResponse.json();
        
        const scoresResponse = await fetch('/api/stored-ticker-scores');
        if (!scoresResponse.ok) throw new Error('Failed to fetch scores');
        const scoresData = await scoresResponse.json();
        
        setStockData(stockData);
        setScores(scoresData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setStockData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, [selectedStock]);

  const truncateText = (text: string, wordLimit: number) => {
    if (!text) return 'No description available';
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const formatNumber = (value: number | null | undefined, prefix = '', suffix = '', decimals = 2) => {
    if (value == null) return 'N/A';
    return `${prefix}${value.toFixed(decimals)}${suffix}`;
  };

  const formatBillions = (value: number | null | undefined) => {
    if (value == null) return 'N/A';
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  };

  if (loading) return <div className="flex justify-center"><Loader /></div>;
  if (!stockData) return <div className="flex justify-center">No stock data available</div>;

  return (
    <>
      {loading && <Loader />}
      <div>
        <Header ticker_symbols={symbols.map(s => s.name)}/>
      </div>
      <ScrollArea className="w-full h-full">
        <div className="mt-4 p-10">
          <div className="absolute top-4 right-4 mt-4 mr-4">
            <Link href={`/chart?ticker=${selectedStock}`} target="_blank">
              <Button>Launch Chart</Button>
            </Link>
          </div>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="w-36 h-36 relative">
                <Image
                  src={stockData.logo_url || "/placeholder.svg"}
                  alt={`${stockData.info?.longName || selectedStock} logo`}
                  fill
                  className="rounded-lg object-contain"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-5xl font-bold">{stockData.info?.longName || selectedStock}</h1>
                <Select value={selectedStock} onValueChange={setSelectedStock}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue>{selectedStock}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {symbols.sort((a, b) => a.name.localeCompare(b.name)).map(symbol => (
                      <SelectItem key={symbol.id} value={symbol.name}>
                        {symbol.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex space-x-4">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold">
                        {formatNumber(stockData.current_price)}
                      </span>
                      <span className="text-sm text-muted-foreground">USD</span>
                      <span
                        className={`text-xl ${
                          (stockData.absolute_change || 0) >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatNumber(stockData.absolute_change, (stockData.absolute_change || 0) >= 0 ? "+" : "")}
                        ({formatNumber(stockData.percentage_change, (stockData.percentage_change || 0) >= 0 ? "+" : "", "%")})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 ml-8">
          <Button
            variant="ghost"
            className={`text-lg font-semibold hover:bg-white ${selectedTab === 'overview' ? 'selected-tab' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant="ghost"
            className={`text-lg font-semibold hover:bg-white ${selectedTab === 'insights' ? 'selected-tab' : ''}`}
            onClick={() => setSelectedTab('insights')}
          >
            Insights
          </Button>
          <Button
            variant="ghost"
            className={`text-lg font-semibold hover:bg-white ${selectedTab === 'financials' ? 'selected-tab' : ''}`}
            onClick={() => setSelectedTab('financials')}
          >
            Financials
          </Button>
          <Button
            variant="ghost"
            className={`text-lg font-semibold hover:bg-white ${selectedTab === 'bot' ? 'selected-tab' : ''}`}
            onClick={() => setSelectedTab('bot')}
          >
            Bot
          </Button>
        </div>

        {selectedTab === 'overview' && (
          <div>
            <div className="m-6 ml-14 grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-2">Key Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Market Cap</p>
                    <p className="text-muted-foreground">{formatBillions(stockData.info?.marketCap)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Dividend Yield</p>
                    <p className="text-muted-foreground">
                      {formatNumber(stockData.info?.dividendYield ? stockData.info.dividendYield * 100 : null, '', '%')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Shares Outstanding</p>
                    <p className="text-muted-foreground">{formatBillions(stockData.info?.sharesOutstanding)}</p>
                  </div>
                  <div>
                    <p className="font-medium">52 Week Low</p>
                    <p className="text-muted-foreground">{formatNumber(stockData.info?.fiftyTwoWeekLow, '$')}</p>
                  </div>
                  <div>
                    <p className="font-medium">52 Week High</p>
                    <p className="text-muted-foreground">{formatNumber(stockData.info?.fiftyTwoWeekHigh, '$')}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Funds</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Net Income</p>
                    <p className="text-muted-foreground">
                      {(() => {
                        const financials = stockData.financials?.[Object.keys(stockData.financials || {})[0]] || {};
                        const income = financials['Net Income'] || financials['net_income'] || financials.NetIncome;
                        return formatBillions(income);
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Total Revenue</p>
                    <p className="text-muted-foreground">
                      {(() => {
                        const financials = stockData.financials?.[Object.keys(stockData.financials || {})[0]] || {};
                        const revenue = financials['Total Revenue'] || financials['total_revenue'] || financials.TotalRevenue;
                        return formatBillions(revenue);
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Shares Float</p>
                    <p className="text-muted-foreground">{formatBillions(stockData.info?.floatShares)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Beta (1Y)</p>
                    <p className="text-muted-foreground">{formatNumber(stockData.info?.beta)}</p>
                  </div>
                  <div>
                    <p className="font-medium">Dividend Rate</p>
                    <p className="text-muted-foreground">{formatNumber(stockData.info?.dividendRate, '', '%')}</p>
                  </div>
                </div>
              </div>
            </div>

            {(stockData?.recommendations || stockData?.info) && (
              <div className="m-6 ml-4 grid grid-cols-2 gap-4">
                {/* Only render recommendations column if data exists */}
                {stockData?.recommendations && 
                Object.keys(stockData.recommendations).length > 0 && 
                stockData.recommendations.period && 
                Object.keys(stockData.recommendations.period).length > 0 && (
                  <div>
                    <RecommendationsTable recommendations={stockData.recommendations} />
                  </div>
                )}
                
                {/* Only render statistics column if info data exists and has properties */}
                {stockData?.info && 
                Object.keys(stockData.info).length > 0 && (
                  <div>
                    <StatisticsTable info={stockData.info} />
                  </div>
                )}
              </div>
            )}

            <div className="m-6 ml-14">
              <h3 className="text-xl font-semibold mb-2">Company Info</h3>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <p className="font-medium">Employees</p>
                  <p className="text-muted-foreground">
                    {stockData.info?.fullTimeEmployees?.toLocaleString() || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Headquarters</p>
                  <p className="text-muted-foreground">{stockData.info?.city || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium">Industry</p>
                  <p className="text-muted-foreground">{stockData.info?.industry || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium">Sector</p>
                  <p className="text-muted-foreground">{stockData.info?.sector || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium">CEO</p>
                  <p className="text-muted-foreground">
                    {stockData.info?.companyOfficers?.find(
                      officer => officer?.title?.toLowerCase().includes('ceo')
                    )?.name || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">State</p>
                  <p className="text-muted-foreground">{stockData.info?.state || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium">Website</p>
                  <p className="text-muted-foreground">{stockData.info?.website || 'N/A'}</p>
                </div>
                <div>
                  <p className="font-medium">
                    {stockData.info?.irWebsite ? 'Investor Relations (IR) Website' : 'Phone'}
                  </p>
                  <p className="text-muted-foreground">
                    {stockData.info?.irWebsite || stockData.info?.phone || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="m-6 ml-14">
              <h3 className="text-xl font-semibold mb-2">
                About {stockData.info?.longName || selectedStock}
              </h3>
              <p className="font-small">
                {isExpanded 
                  ? (stockData.info?.longBusinessSummary || 'No description available')
                  : truncateText(stockData.info?.longBusinessSummary || '', 90)
                }
                {stockData.info?.longBusinessSummary?.split(' ').length > 90 && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-black hover:underline font-bold"
                  >
                    {isExpanded ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'financials' && stockData?.financials && Object.keys(stockData.financials).length > 0 && (
          <div className="m-6 ml-1">
            <RecentFinancialTable financials={stockData.financials} />
          </div>
        )}

        {selectedTab === 'bot' && (
          <div className="m-6">
            {/* Bot component can be added here */}
          </div>
        )}

        {selectedTab === 'insights' && (
          <div className="m-6">
            <StockAnalysisSection selectedStock={selectedStock} />
            {scores.length > 0 ? (
              <StockInsights 
                selectedStock={selectedStock} 
                scores={scores}
              />
            ) : (
              <div className="text-center text-muted-foreground">No insights available</div>
            )}
          </div>
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  );
}