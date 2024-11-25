"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";
import WebSocketContainer from "../components/ripsterNotification";
import PaperTrading from "../components/paperTrade";

const Chart = dynamic(() => import("../components/Chart"), { ssr: false });
export interface PaperTrade {
  id: number;
  stockname: string;
  entry_price: string;
  exit_price: string;
  pnl: string;
  status: "Ongoing" | "Closed";
  entry_time: string;
  exit_time: string;
  stoploss: string;
  target: string;
  quantity: string;
  capital: string;
  ROI: string;
  tradetype: "short" | "long";
  remarks: string;
}
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
  const [markerType, setMarkerType] = useState<"vwap" | "ttm">("vwap");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  // const [trades, setTrades] = useState<PaperTrade[]>([]); 

  useEffect(() => {
    fetchData(ticker, timeframe, emaPeriod, vwapPeriod, vwapStdDev);
    fetchWatchlist();
    // fetchTradeslist();
  }, []);
  // useEffect(() => {
  //   console.log("trades", trades);
  // }, [trades]);
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
        `http://localhost:5001/api/data/${ticker}/${timeframe}/${emaPeriod}/${vwapPeriod}/${vwapStdDev}`
      );
      const data = await response.json();
      console.log("Fetched data:", data);
      setChartData(data);
      console.log(chartData.vwap_signals.slice(0, -2));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchWatchlist = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/symbols");
      const symbols = await response.json();
      console.log("Fetched symbols:", symbols); // Add this line for debugging
      setWatchlist(symbols.map((symbol: string) => ({ symbol })));
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };
  // const fetchTradeslist = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5001/trades");
  //     const trades = await response.json();
  //     console.log("Fetched trades:", trades); // Add this line for debugging
  //     setTrades(trades);
  //   } catch (error) {
  //     console.error("Error fetching trades:", error);
  //   }
  // };
  // const handleNewTrade = async () => {
  //   // console.log("handleNewTrade", trade);
  //   try {
  //     await fetchTradeslist();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  const stocksData = [
    { stock: "AAPL", buy: 100, sell: 110, pl: "+10", closed: true },
    { stock: "GOOGL", buy: 1500, sell: 1490, pl: "-10", closed: true },
    { stock: "AMZN", buy: 3200, sell: 3300, pl: "+100", closed: true },
    { stock: "TSLA", buy: 600, sell: 620, pl: "+20", closed: false },
  ];
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const toggleMarkerType = () => {
    setMarkerType(markerType === "vwap" ? "ttm" : "vwap");
  };

  return (
    <div
      className={`flex h-screen w-screen custom-scroll ${
        theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
      }`}
    >
      <div className="flex-grow flex flex-col ">
        <header className="p-4 bg-gray-800 text-white">
          <div className="flex justify-between items-center mt-1 h-6 w-fit  ">
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
                onClick={toggleMarkerType}
                className="ml-6 p-2 bg-gray-700 text-white rounded"
              >
                {markerType === "vwap" ? "VWAP Signals" : "TTM Squeeze"}
            </button>
            <button
              onClick={toggleTheme}
              className="ml-6 p-2 bg-gray-700 text-white rounded"
            >
              Toggle Theme
            </button>
          </div>
        </header>
        <ResizablePanelGroup direction="horizontal" className="">
          <ResizablePanel className="max-w-28 min-w-1 w-24">
            <div
              className={`watchlist p-3 h-full  overflow-y-auto ${
                theme === "light"
                  ? "bg-gray-100 text-black"
                  : "bg-gray-800 text-white"
              }`}
            >
              <h3 className="font-bold text-lg mb-4  text-center">Watchlist</h3>
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
              <main className="chart ">
              <Chart 
                  key={`${theme}-${markerType}`} 
                  theme={theme} 
                  data={chartData} 
                  markerType={markerType}
                />
              </main>
              <div
                className={`active-trader p-4 flex-grow ${
                  theme === "light"
                    ? "active-trader-light"
                    : "active-trader-dark"
                }`}
              >
                <h3 className="font-bold text-lg mb-4">Active Trader</h3>
                {/* <div className="flex flex-row justify-between space-x-4">
                  <button className="buy-button">Buy MKT</button>
                  <button className="sell-button">Sell MKT</button>
                </div> */}
                {/* <div className="grid grid-cols-6 gap-3 mt-3">
                  <div className="font-bold">STOCK</div>
                  <div className="font-bold">BUY</div>
                  <div className="font-bold">SELL</div>
                  <div className="font-bold">P&L</div>
                  <div className="font-bold"></div>
                </div>
                {stocksData.map((stockItem, index) => (
                  <div key={index} className="grid grid-cols-6 gap-3 mt-2">
                    <div>{stockItem.stock}</div>
                    <div>{stockItem.buy}</div>
                    <div>{stockItem.sell}</div>
                    <div
                      className={`${
                        stockItem.sell - stockItem.buy > 0
                          ? " text-green-400"
                          : " text-red-500"
                      }`}
                    >
                      {stockItem.sell - stockItem.buy}
                    </div>
                    <div>
                      <button
                        className={`${
                          stockItem.closed ? "bg-red-400" : "bg-green-400"
                        } px-2 rounded text-white`}
                      >
                        {stockItem.closed ? "Closed" : "Ongoing"}
                      </button>
                    </div>
                  </div>
                ))} */}
                {/* <PaperTrading trades={trades} /> */}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* <WebSocketContainer onNewTrade={handleNewTrade} /> */}
    </div>
  );
}
