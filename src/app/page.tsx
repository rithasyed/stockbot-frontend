"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../app/components/Resizable";

const Chart = dynamic(() => import("./components/Chart"), { ssr: false });

interface WatchlistItem {
  symbol: string;
}

export default function Home() {
  const [ticker, setTicker] = useState<string>("NVDA");
  const [timeframe, setTimeframe] = useState<string>("1d");
  const [emaPeriod, setEmaPeriod] = useState<number>(20);
  const [vwapPeriod, setVwapPeriod] = useState<number>(20);
  const [vwapStdDev, setVwapStdDev] = useState<number>(2);
  const [autoUpdate, setAutoUpdate] = useState<boolean>(false);
  const [updateFrequency, setUpdateFrequency] = useState<number>(5);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchData(ticker, timeframe, emaPeriod, vwapPeriod, vwapStdDev);
    fetchWatchlist();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoUpdate) {
      interval = setInterval(() => {
        fetchData(ticker, timeframe, emaPeriod, vwapPeriod, vwapStdDev);
      }, updateFrequency * 1000);
    }
    return () => clearInterval(interval);
  }, [
    autoUpdate,
    updateFrequency,
    ticker,
    timeframe,
    emaPeriod,
    vwapPeriod,
    vwapStdDev,
  ]);

  const fetchData = async (
    ticker: string,
    timeframe: string,
    emaPeriod: number,
    vwapPeriod: number,
    vwapStdDev: number
  ) => {
    try {
      const response = await fetch(
        `https://deployment-sample-j8lexfkrh-ritha24s-projects.vercel.app/api/data/${ticker}/${timeframe}/${emaPeriod}/${vwapPeriod}/${vwapStdDev}`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          },
          method: "GET",
        }
      );

      const data = await response.json();
      console.log("Fetched data:", data);
      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await fetch(
        "https://deployment-sample-j8lexfkrh-ritha24s-projects.vercel.app/api/symbols",
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Accept",
          },
          method: "GET",
        }
      );
      const symbols = await response.json();
      console.log("Fetched symbols:", symbols);
      setWatchlist(symbols.map((symbol: string) => ({ symbol })));
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={`flex h-screen ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <div className="flex-grow flex flex-col">
        <header className="p-4 bg-gray-800 text-white">
          <div className="flex justify-between items-center mt-4">
            <div className="flex space-x-4 items-center">
              <div>Symbol</div>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                className="p-2 rounded border w-24 text-black"
                placeholder="Symbol"
              />
              <div>Interval</div>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="p-2 rounded border text-black"
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="60m">1h</option>
                <option value="1d">1d</option>
                <option value="1wk">1wk</option>
                <option value="1mo">1mo</option>
              </select>
              <div>EMA</div>
              <input
                type="number"
                value={emaPeriod}
                onChange={(e) => setEmaPeriod(Number(e.target.value))}
                className="p-2 rounded border w-16 text-black"
                placeholder="EMA"
              />
              <div>VWAP Period</div>
              <input
                type="number"
                value={vwapPeriod}
                onChange={(e) => setVwapPeriod(Number(e.target.value))}
                className="p-2 rounded border w-16 text-black"
                placeholder="VWAP Period"
              />
              <button
                onClick={() =>
                  fetchData(
                    ticker,
                    timeframe,
                    emaPeriod,
                    vwapPeriod,
                    vwapStdDev
                  )
                }
                className="p-2 bg-blue-500 text-white rounded"
              >
                Fetch Data
              </button>
              <label className="flex items-center">
                <span className="mr-2 text-white">Auto-update</span>
                <input
                  type="checkbox"
                  checked={autoUpdate}
                  onChange={(e) => setAutoUpdate(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </label>
              <div>Frequency (s)</div>
              <input
                type="number"
                value={updateFrequency}
                onChange={(e) => setUpdateFrequency(Number(e.target.value))}
                className="p-2 rounded border w-16 text-black"
                placeholder="Frequency (s)"
              />
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 bg-gray-700 text-white rounded"
            >
              Toggle Theme
            </button>
          </div>
        </header>
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          <ResizablePanel defaultSize={20} minSize={6} maxSize={15}>
            <div
              className={`watchlist p-3 h-full overflow-y-auto ${
                theme === "light"
                  ? "bg-gray-100 text-black"
                  : "bg-gray-800 text-white"
              }`}
            >
              <h3 className="font-bold text-lg mb-4 text-center">Watchlist</h3>
              <div className="flex flex-col items-center">
                {watchlist.length > 0 ? (
                  watchlist.map((item) => (
                    <div
                      key={item.symbol}
                      className={`watchlist-item ${
                        theme === "light"
                          ? "watchlist-item-light"
                          : "watchlist-item-dark"
                      }`}
                      onClick={() => {
                        setTicker(item.symbol);
                        fetchData(
                          item.symbol,
                          timeframe,
                          emaPeriod,
                          vwapPeriod,
                          vwapStdDev
                        );
                      }}
                    >
                      {item.symbol}
                    </div>
                  ))
                ) : (
                  <div>Loading watchlist...</div>
                )}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="flex h-full">
              <main className="chart">
                <Chart key={theme} theme={theme} data={chartData} />
              </main>
              <div
                className={`active-trader w-1/4 p-4 flex-grow ${
                  theme === "light"
                    ? "active-trader-light"
                    : "active-trader-dark"
                }`}
              >
                <h3 className="font-bold text-lg mb-4">Active Trader</h3>
                <div className="flex flex-row justify-between space-x-4">
                  <button className="buy-button">Buy MKT</button>
                  <button className="sell-button">Sell MKT</button>
                </div>
                <div className="grid grid-cols-6 gap-4 mt-4">
                  <div className="font-bold">Order</div>
                  <div className="font-bold">Bid</div>
                  <div className="font-bold">Price</div>
                  <div className="font-bold">Ask</div>
                  <div className="font-bold">Status</div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}