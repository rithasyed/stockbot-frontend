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

export default function StockTicker() {
  const [selectedStock, setSelectedStock] = useState<string>("NVDA");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTickers, setAvailableTickers] = useState<string[]>(["NVDA"]); 
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [scores, setScores] = useState<Array<IndexScore>>([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);
        
        // Fetch stock data
        const stockResponse = await fetch(`/api/stock-data?ticker=${selectedStock}`);
        if (!stockResponse.ok) throw new Error('Failed to fetch stock data');
        const stockData = await stockResponse.json();
        
        // Fetch scores data
        const scoresResponse = await fetch('/api/stored-ticker-scores');
        if (!scoresResponse.ok) throw new Error('Failed to fetch scores');
        const scoresData = await scoresResponse.json();
        
        setStockData(stockData);
        setScores(scoresData);
        
        if (stockData.ticker_symbols?.length > 0) {
          setAvailableTickers(stockData.ticker_symbols);
        }
        
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
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    
    return words.slice(0, wordLimit).join(' ') + '...';
  };
  if (loading) return <div className="flex justify-center"><Loader /></div>;
  if (!stockData) return <div className="flex justify-center">No stock data available</div>;


  return (
    <>
    {loading && <Loader />}
      <div>
        <Header  ticker_symbols={availableTickers}/>
      </div>
      <ScrollArea className="w-full h-full">
      <div className="mt-4 p-10">
        <div className="absolute top-4 right-4 mt-4 mr-4">
        <Link 
          href={`/chart?ticker=${selectedStock}`} 
          target="_blank"
        >
          <Button>
            Launch Chart
          </Button>
        </Link>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="w-36 h-36 relative">
              <Image
                src={stockData.logo_url || "/placeholder.svg"}
                alt={`${stockData.info.longName} logo`}
                fill
                className="rounded-lg object-contain"
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl font-bold">{stockData.info.longName}</h1>
              <Select value={selectedStock} onValueChange={setSelectedStock}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue>
                    {`${stockData.ticker}`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableTickers.map(ticker => (
                    <SelectItem key={ticker} value={ticker}>
                      {`${ticker}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex space-x-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">{stockData.current_price.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground">USD</span>
                    <span
                      className={`text-xl ${
                        stockData.absolute_change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stockData.absolute_change >= 0 ? "+" : ""}{stockData.absolute_change.toFixed(2)}
                      ({stockData.absolute_change >= 0 ? "+" : ""}{stockData.percentage_change.toFixed(2)}%)
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
              <h3 className="text-xl font-semibold mb-2 font-semibold">Key Stats</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Market Cap</p>
                  <p className="text-muted-foreground">${(stockData.info.marketCap / 1_000_000_000).toFixed(2)}B</p>
                </div>
                <div>
                  <p className="font-medium">Dividend Yield</p>
                  <p className="text-muted-foreground">{(stockData.info.dividendYield * 100 || 0).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="font-medium">Shares Outstanding</p>
                  <p className="text-muted-foreground">{(stockData.info.sharesOutstanding / 1_000_000_000).toFixed(2)}B</p>
                </div>
                <div>
                  <p className="font-medium">Fiftytwo Week Ligh</p>
                  <p className="text-muted-foreground">${(stockData.info.fiftyTwoWeekLow).toFixed(2)}</p>
                </div>
                <div>
                  <p className="font-medium">Fiftytwo Week High</p>
                  <p className="text-muted-foreground">${(stockData.info.fiftyTwoWeekHigh).toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2 font-semibold">Funds</h3>
              <div className="grid grid-cols-3 gap-4">
              <div>
                  <p className="font-medium">Net Income</p>
                  <p className="text-muted-foreground">
                    {(() => {
                      const financials = stockData.financials?.[Object.keys(stockData.financials)[0]];
                      const income = financials?.['Net Income'] || financials?.['net_income'] || financials?.NetIncome;
                      
                      return income 
                        ? `$${(income / 1_000_000_000).toFixed(2)}B` 
                        : 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Total Revenue</p>
                  <p className="text-muted-foreground">
                    {(() => {
                      const financials = stockData.financials?.[Object.keys(stockData.financials)[0]];
                      const revenue = financials?.['Total Revenue'] || financials?.['total_revenue'] || financials?.TotalRevenue;
                      
                      return revenue 
                        ? `$${(revenue / 1_000_000_000).toFixed(2)}B` 
                        : 'N/A';
                    })()}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Shares Float</p>
                  <p className="text-muted-foreground">{(stockData.info.floatShares/ 1_000_000_000).toFixed(2)}B</p>
                </div>
                <div>
                  <p className="font-medium">Beta (1Y)</p>
                  <p className="text-muted-foreground">{stockData.info.beta}</p>
                </div>
                <div>
                  <p className="font-medium">Dividend Rate</p>
                  <p className="text-muted-foreground">{stockData.info.dividendRate}%</p>
                </div>
              </div>
            </div>
          </div>
          <div className="m-6 ml-4 grid grid-cols-2 gap-4">
              <div>
                    {stockData?.recommendations && (
                    <RecommendationsTable recommendations={stockData.recommendations} />
                  )}
              </div>
              <div>
                {stockData?.info && (
                  <StatisticsTable info={stockData.info} />
                )}
              </div>
          </div>
          <div className="m-6 ml-14">
          <h3 className="text-xl font-semibold mb-2 font-semibold">Company Info</h3>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="font-medium">Employees</p>
              <p className="text-muted-foreground">{stockData.info.fullTimeEmployees?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Headquarters</p>
              <p className="text-muted-foreground">{stockData.info.city?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Industry</p>
              <p className="text-muted-foreground">{stockData.info.industry?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Sector</p>
              <p className="text-muted-foreground">{stockData.info.sector?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">CEO</p>
              <p className="text-muted-foreground">
                {stockData.info.companyOfficers.find(companyOfficers => companyOfficers.title.toLowerCase().includes('ceo'))?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="font-medium">State</p>
              <p className="text-muted-foreground">{stockData.info.state?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Website</p>
              <p className="text-muted-foreground">{stockData.info.website?.toLocaleString() || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">{stockData.info.irWebsite ? 'Investor Relations (IR) Website' : 'Phone'}</p>
              <p className="text-muted-foreground">{stockData.info.irWebsite || stockData.info.phone || 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="m-6 ml-14">
            <h3 className="text-xl font-semibold mb-2">About {stockData.info.longName}</h3>
            <p className="font-small">
              {isExpanded 
                ? stockData.info.longBusinessSummary 
                : truncateText(stockData.info.longBusinessSummary, 90)
              }
              {stockData.info.longBusinessSummary.split(' ').length > 90 && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className=" text-black hover:underline font-bold"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </p>
          </div>
        </div>       
      )}

      {selectedTab === 'financials' && (
          <div className="m-6 ml-1">
              {stockData?.financials && (
              <RecentFinancialTable financials={stockData.financials} />
            )}
          </div>
        )}

      {selectedTab === 'bot' && (
        <div></div>
            )}
      {selectedTab === 'insights' && (
          <div className="m-6">
            <StockAnalysisSection selectedStock={selectedStock} />
            <StockInsights 
              selectedStock={selectedStock} 
              scores={scores}
            />
          </div>
        )}
      <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  );
}