"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/Resizable";
import NotificationContainer from "../components/ripster-notification";
import PaperTrading from "../components/paper-trade";
import BackTesting from "@/components/back-testing";
import Header, { TickerData } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { PaperTrade } from "@/components/paper-trade/types";
import Chart from "../components/Chart";

export interface WatchlistItem {
  id: number;
  name: string;
}

export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [chartData, setChartData] = useState<any>(null);
  const [trades, setTrades] = useState<PaperTrade[]>([]); // Store trades from WebSocketContainer
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [markerType, setMarkerType] = useState<"vwap" | "ttm">("vwap");
  const openScreen = (screen: string) => setActiveScreen(screen);

  useEffect(() => {
    onSubmit({
      ticker: "AAPL",
      timeframe: "1m",
      emaPeriod: 20,
      vwapPeriod: 20,
      vwapStdDev: 2,
    }); // Call onSubmit with initial values (ticker, timeframe, emaPeriod, vwapPeriod, vwapStdDev);
    fetchWatchlist();
    fetchTradeslist();
  }, []);

  const onSubmit = async (technicalData: TickerData) => {
    try {
      const response = await fetch(`api/candlesticks`, {
        method: "POST",
        body: JSON.stringify(technicalData),
      });
      const data = await response.json();
      console.log("Fetched data:", data);
      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const toggleMarkerType = () => {
    setMarkerType(markerType === "vwap" ? "ttm" : "vwap");
  };
  const fetchWatchlist = async () => {
    try {
      const response = await fetch("/api/symbols");
      const symbols = await response.json();
      console.log("Fetched symbols:", symbols); // Add this line for debugging
      setWatchlist(symbols);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };
  const fetchTradeslist = async () => {
    try {
      const response = await fetch("/api/trades");
      const trades = await response.json();
      console.log("Fetched trades:", trades); // Add this line for debugging
      setTrades(trades);
    } catch (error) {
      console.error("Error fetching trades:", error);
    }
  };
  const handleNewTrade = async () => {
    // console.log("handleNewTrade", trade);
    try {
      await fetchTradeslist();
    } catch (e) {
      console.log(e);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    // <div
    //   className={`flex h-screen w-screen custom-scroll ${
    //     theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
    //   }`}
    // >
    //   <div className="flex-grow flex flex-col ">
    //     <header className="p-4 bg-gray-800 text-white">
    //       <div className="flex justify-between items-center mt-1 h-6 w-fit  ">
    //         <div className="flex space-x-4 items-center">
    //           <div>Symbol</div>
    //           <input
    //             type="text"
    //             value={ticker}
    //             onChange={(e) => setTicker(e.target.value)}
    //             className="p-2 rounded border w-24 text-black"
    //             placeholder="Symbol"
    //           />
    //           <div>Interval</div>
    //           <select
    //             value={timeframe}
    //             onChange={(e) => setTimeframe(e.target.value)}
    //             className="p-2 rounded border text-black"
    //           >
    //             <option value="1m">1m</option>
    //             <option value="5m">5m</option>
    //             <option value="15m">15m</option>
    //             <option value="60m">1h</option>
    //             <option value="1d">1d</option>
    //             <option value="1wk">1wk</option>
    //             <option value="1mo">1mo</option>
    //           </select>
    //           <div>EMA</div>
    //           <input
    //             type="number"
    //             value={emaPeriod}
    //             onChange={(e) => setEmaPeriod(Number(e.target.value))}
    //             className="p-2 rounded border w-16 text-black"
    //             placeholder="EMA"
    //           />
    //           <div>VWAP Period</div>
    //           <input
    //             type="number"
    //             value={vwapPeriod}
    //             onChange={(e) => setVwapPeriod(Number(e.target.value))}
    //             className="p-2 rounded border w-16 text-black"
    //             placeholder="VWAP Period"
    //           />
    //           <button
    //             onClick={() =>
    //               fetchData(
    //                 ticker,
    //                 timeframe,
    //                 emaPeriod,
    //                 vwapPeriod,
    //                 vwapStdDev
    //               )
    //             }
    //             className="p-2 bg-blue-500 text-white rounded"
    //           >
    //             Fetch Data
    //           </button>
    //           <label className="flex items-center">
    //             <span className="mr-2 text-white">Auto-update</span>
    //             <input
    //               type="checkbox"
    //               checked={autoUpdate}
    //               onChange={(e) => setAutoUpdate(e.target.checked)}
    //               className="form-checkbox h-5 w-5 text-blue-600"
    //             />
    //           </label>
    //           <div>Frequency (s)</div>
    //           <input
    //             type="number"
    //             value={updateFrequency}
    //             onChange={(e) => setUpdateFrequency(Number(e.target.value))}
    //             className="p-2 rounded border w-16 text-black"
    //             placeholder="Frequency (s)"
    //           />
    //         </div>
    //         <button
    //           onClick={toggleTheme}
    //           className="ml-6 p-2 bg-gray-700 text-white rounded"
    //         >
    //           Toggle Theme
    //         </button>
    //       </div>
    //     </header>
    //     <ResizablePanelGroup direction="horizontal" className="">
    //       <ResizablePanel className="max-w-28 min-w-1 w-24">
    //         <div
    //           className={`watchlist p-3 h-full  overflow-y-auto ${
    //             theme === "light"
    //               ? "bg-gray-100 text-black"
    //               : "bg-gray-800 text-white"
    //           }`}
    //         >
    //           <h3 className="font-bold text-lg mb-4  text-center">Watchlist</h3>
    //           <div className="flex flex-col items-center">
    //             {watchlist.length > 0 ? (
    //               watchlist.map((item) => (
    //                 <div
    //                   key={item.symbol}
    //                   className={`watchlist-item ${
    //                     theme === "light"
    //                       ? "watchlist-item-light"
    //                       : "watchlist-item-dark"
    //                   }`}
    //                   onClick={() => {
    //                     setTicker(item.symbol);
    //                     fetchData(
    //                       item.symbol,
    //                       timeframe,
    //                       emaPeriod,
    //                       vwapPeriod,
    //                       vwapStdDev
    //                     );
    //                   }}
    //                 >
    //                   {item.symbol}
    //                 </div>
    //               ))
    //             ) : (
    //               <div>Loading watchlist...</div>
    //             )}
    //           </div>
    //         </div>
    //       </ResizablePanel>
    //       <ResizableHandle withHandle />
    //       <ResizablePanel>
    //         <div className="flex h-full">
    //           <main className="chart w-full">
    //             <Chart key={theme} theme={theme} data={chartData} />
    //           </main>
    //           {/* <div
    //             className={`active-trader p-4 flex-grow ${
    //               theme === "light"
    //                 ? "active-trader-light"
    //                 : "active-trader-dark"
    //             }`}
    //           >
    //             <h3 className="font-bold text-lg mb-4">Active Trader</h3>

    //             <PaperTrading trades={trades} />
    //           </div> */}
    //         </div>
    //       </ResizablePanel>
    //     </ResizablePanelGroup>
    //   </div>
    //   {/* <WebSocketContainer onNewTrade={handleNewTrade} /> */}
    // </div>
    <div
      className={` w-screen h-screen ${
        theme === "light" ? "bg-[#e0e3eb] text-black" : "bg-black text-white"
      }`}
    >
      <div className="pb-2">
        <Header
          symbols={watchlist}
          onSubmit={onSubmit}
          onToggleTheme={toggleTheme}
          theme={theme}
          setWatchlist={setWatchlist}
          toggleMarkerType= {toggleMarkerType}
        />
      </div>

      <div className="flex flex-row space-x-2 h-[90vh] ">
        <div
          className={`h-full flex  rounded ${
            theme === "light" ? "bg-white   text-black" : "bg-black text-white"
          }`}
        >
          <div className="w-16">
            <Sidebar onOpenScreen={openScreen} setOpen={setOpen} open={open} />
          </div>
          <Separator orientation="vertical" className="h-full" />
          {open && (
            <div className="w-96 transform transition-transform duration-300 ease-in-out overflow-y-auto">
              {activeScreen === "papertrading" && (
                <PaperTrading trades={trades} />
              )}
              {activeScreen === "backtesting" && (
                <BackTesting trades={trades} fetchTrades={handleNewTrade} symbols={watchlist} />
              )}
            </div>
          )}
        </div>
        <div
          className={`bg-white px-2 h-full w-full rounded pb-2theme === "light"
              ? "bg-white   text-black"
              : "bg-black text-white"
          }`}
        >
          <main className="w-full h-full">
            <Chart key={theme} theme={theme} data={chartData} markerType={markerType}/>
          </main>
        </div>
      </div>
    </div>
  );
}
