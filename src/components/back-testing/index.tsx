"use client";
import { useEffect, useState } from "react";
import { Trade } from "@/types/trades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "../ui";
import { Input } from "../ui/input";
import { useTrades } from "@/store/tradeStore";
import { useSymbols } from "@/store/symbolStore";

interface BackTestingProps {
  isBigScreen?: boolean;
}
interface BackTest {
  ticker: string;
  timeframe: string;
  quantity: number;
  indicator: string;
}
const timePeriods = ["1m", "5m", "15m", "60m", "1d", "1wk", "1mo"];

const BackTesting: React.FC<BackTestingProps> = ({ isBigScreen = false }) => {
  const { data: trades, execute } = useTrades((state) => state);
  const symbols = useSymbols((state) => state.data);
  const [backTestingTrades, setBackTestingTrades] = useState<Trade[]>([]);
  const [pnl, setPNL] = useState<number>(0);
  const [pnlPercent, setPNLPercent] = useState<string>("0.00");
  const [backTest, setBackTest] = useState<BackTest>({
    ticker: "AAPL",
    timeframe: "1m",
    quantity: 100,
    indicator: "TTM",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    processTrade(trades);
  }, [trades]);
  const calculateTotalPnl = (trades: Trade[]): number => {
    return trades.reduce((total, trade) => {
      if (trade.ROI !== "--" && trade.ROI !== null) {
        return total + parseFloat(trade.ROI);
      }
      return total;
    }, 0);
  };
  const calculatePNLPercentage = (trades: Trade[], pnl: number): string => {
    const totalCapital = trades.reduce((total: number, trade) => {
      if (trade.capital !== "--" && trade.capital !== null) {
        return total + parseFloat(trade.capital);
      }
      return total;
    }, 0);
    const percentagePNL = (pnl / totalCapital) * 100;
    return percentagePNL.toFixed(2);
  };

  const processTrade = (trade: Trade[]) => {
    if (!trade) {
      return;
    }
    const filteredTrades = trade.filter((trade) => trade.back_testing);
    setBackTestingTrades(filteredTrades);
    const pnl = calculateTotalPnl(filteredTrades);
    setPNL(pnl);
    const percentagePNL = calculatePNLPercentage(filteredTrades, pnl);
    setPNLPercent(percentagePNL);
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/backtest", {
        method: "POST",
        body: JSON.stringify(backTest),
      });
      const result = await response.json();
      execute();
      console.log("back testing result:", result); 
    } catch (error) {
      console.error("Error while back testing:", error);
    }
    setLoading(false);
  };
  const renderTradeTable = (trades: Trade[], title: string, pnl: number) => (
    <Card className="w-full">
      <CardHeader className="py-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{title}</span>
          <span
            className={`text-sm ${
              pnl >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            P&L: ${pnl.toFixed(2)} {isBigScreen && `(${pnlPercent}%)`}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="max-h-[24rem] overflow-auto scrollbar-hide">
          <DataTable columns={columns} data={trades} />
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="paper-trading px-2">
      {loading && <Loader />}
      <h3 className="font-bold text-xl mb-2 text-center py-2">Back Testing</h3>
      <div className="flex flex-row items-center justify-around py-3 ">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-32 justify-between border-1  `}
            >
              {backTest.ticker
                ? symbols.find((s) => s.name === backTest.ticker)?.name
                : "Select symbol..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-right" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search symbol..." />
              <CommandEmpty>No symbol found.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  {symbols.map((s) => (
                    <CommandItem
                      key={s.id}
                      onSelect={() => {
                        setBackTest((prev) => ({
                          ...prev,
                          ticker: s.name,
                        }));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          backTest.ticker === s.name
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {s.name} <span className="hidden">{s.id}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          value={backTest.timeframe}
          onValueChange={(value) => {
            setBackTest((prev) => ({ ...prev, timeframe: value }));
          }}
        >
          <SelectTrigger className="w-16 border-1 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Time" defaultValue={backTest.timeframe} />
          </SelectTrigger>
          <SelectContent>
            {timePeriods.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          className="w-16 border-1 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          type="number"
          value={backTest.quantity}
          onChange={(e) => {
            setBackTest((prev) => ({
              ...prev,
              quantity: Number(e.target.value),
            }));
          }}
        />
        <Select
          value={backTest.indicator}
          onValueChange={(value) => {
            setBackTest((prev) => ({ ...prev, indicator: value }));
          }}
        >
          <SelectTrigger className="w-24 border-1 focus:ring-0 focus:ring-offset-0">
            <SelectValue placeholder="Indicator" defaultValue={backTest.indicator} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TTM">TTM</SelectItem>
            <SelectItem value="Ripster">Ripster</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit}>Test</Button>
      </div>
      {renderTradeTable(backTestingTrades, "Back Tested Trades", pnl)}
    </div>
  );
};

export default BackTesting;
