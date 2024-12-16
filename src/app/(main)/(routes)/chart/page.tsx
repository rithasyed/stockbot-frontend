"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import PaperTrading from "@/components/paper-trade";
import BackTesting from "@/components/back-testing";
import Header, { TickerData } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Separator } from "@/components/ui/separator";
import { Loader } from "@/components/ui";
import { useSymbols } from "@/store/symbolStore";
import { useTrades } from "@/store/tradeStore";
import { useGeneralSetting } from "@/store/generalSettingStore";
import TickerScores from "@/components/ticker-scores";
import { IndexScore } from "@/components/ticker-scores/types";
const Chart = dynamic(() => import("@/components/chart"), { ssr: false });
export interface WatchlistItem {
  id: number;
  name: string;
}

export default function Home() {
  // const [theme, setTheme] = useState<"light" | "dark">("light");
  const [chartData, setChartData] = useState<any>(null);
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const openScreen = (screen: string) => setActiveScreen(screen);
  const { execute: fetchWatchlist } = useSymbols((state) => state);
  const { execute: fetchTradeslist } = useTrades((state) => state);
  const { theme } = useGeneralSetting((state) => state);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tickerFromUrl = urlParams.get('ticker') || 'NVDA';

    onSubmit({
      ticker: tickerFromUrl,
      timeframe: "1m",
      emaPeriod: 20,
      vwapPeriod: 20,
      vwapStdDev: 2,
    }); 
    fetchWatchlist();
    fetchTradeslist();
  }, []);

  const onSubmit = async (technicalData: TickerData) => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <div
      className={` w-screen h-screen ${
        theme === "light" ? "bg-[#e0e3eb] text-black" : "bg-black text-white"
      }`}
    >
      {loading && <Loader />}
      <div className="pb-2">
        <Header onSubmit={onSubmit} />
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
              {activeScreen === "papertrading" && <PaperTrading />}
              {activeScreen === "backtesting" && <BackTesting />}
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
            <Chart key={theme} data={chartData} />
          </main>
        </div>
      </div>
    </div>
  );
}