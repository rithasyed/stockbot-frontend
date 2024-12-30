import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sidebar } from "@/components/sidebar";
import Header from "@/components/header";
import { Separator } from "@/components/ui/separator";
import PaperTrading from "@/components/paper-trade";
import BackTesting from "@/components/back-testing";
import { Loader } from "@/components/ui";
import { useGeneralSetting } from "@/store/generalSettingStore";
const Chart = dynamic(() => import("@/components/Chart"), { ssr: false });

interface PopupChartProps {
  symbol: string;
}

export const PopupChart = ({ symbol }: PopupChartProps) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeScreen, setActiveScreen] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { theme } = useGeneralSetting((state) => state);

  const openScreen = (screen: string) => setActiveScreen(screen);

  const onSubmit = async (technicalData: any) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/candlesticks`, {
        method: "POST",
        body: JSON.stringify({
          ...technicalData,
          ticker: symbol,
        }),
      });
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onSubmit({
      ticker: symbol,
      timeframe: "15m",
      emaPeriod: 20,
      vwapPeriod: 20,
      vwapStdDev: 2,
    });
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full overflow-hidden ${
      theme === "light" ? "bg-[#e0e3eb]" : "bg-black"
    }`}>
      <div className="flex-none">
        <Header 
          onSubmit={onSubmit}
          initialTicker={symbol}
          isPopChart={false}
          isHeader={true}
        />
      </div>

      <div className="flex flex-1 gap-2 p-2 min-h-0">
        <div className={`flex h-full rounded ${
          theme === "light" ? "bg-white" : "bg-black"
        }`}>
          <div className="w-12">
            <Sidebar 
              onOpenScreen={openScreen} 
              setOpen={setOpen} 
              open={open} 
            />
          </div>
          <Separator orientation="vertical" />
          {open && (
            <div className="w-72 overflow-y-auto border-r">
              {activeScreen === "papertrading" && <PaperTrading />}
              {activeScreen === "backtesting" && <BackTesting />}
            </div>
          )}
        </div>
        
        <div className={`flex-1 rounded overflow-hidden ${
          theme === "light" ? "bg-white" : "bg-black"
        }`}>
          <div className="w-full h-full">
            <Chart key={theme} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};