import { useEffect, useState } from "react";
import { PaperTrade } from "./types";
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
import { WatchlistItem } from "@/app/page";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "../ui";

interface BackTest {
  ticker: string;
  timeframe: string;
}
interface BackTestingProps {
  trades: PaperTrade[];
  symbols: WatchlistItem[];
  fetchTrades: () => void;
}
const timePeriods = ["1m", "5m", "15m", "60m", "1d", "1wk", "1mo"];

const BackTesting: React.FC<BackTestingProps> = ({
  trades,
  fetchTrades,
  symbols,
}) => {
  const [backTestingTrades, setBackTestingTrades] = useState<PaperTrade[]>([]);
  const [pnl, setPNL] = useState<number>(0);
  const [backTest, setBackTest] = useState<BackTest>({
    ticker: "AAPL",
    timeframe: "1m",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    processTrade(trades);
  }, [trades]);
  const calculateTotalPnl = (trades: PaperTrade[]): number => {
    return trades.reduce((total, trade) => {
      if (trade.pnl !== "--") {
        return total + parseFloat(trade.pnl);
      }
      return total;
    }, 0);
  };

  const processTrade = (trade: PaperTrade[]) => {
    if (!trade) {
      return;
    }
    const filteredTrades = trade.filter((trade) => trade.back_testing);
    setBackTestingTrades(filteredTrades);
    setPNL(calculateTotalPnl(filteredTrades));
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/backtest", {
        method: "POST",
        body: JSON.stringify(backTest),
      });
      const result = await response.json();
      fetchTrades();
      console.log("back testing result:", result); // Add this line for debugging
    } catch (error) {
      console.error("Error while back testing:", error);
    }
    setLoading(false);
  };
  const renderTradeTable = (
    trades: PaperTrade[],
    title: string,
    pnl: number
  ) => (
    <Card className="w-full">
      <CardHeader className="py-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{title}</span>
          <span
            className={`text-sm ${
              pnl >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            P&L: ${pnl.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="max-h-[23rem] overflow-auto scrollbar-hide">
          <DataTable columns={columns} data={trades} />
        </div>
      </CardContent>
    </Card>
  );
  return (
    <div className="paper-trading px-2">
      {loading && <Loader />}
      <h3 className="font-bold text-xl mb-2 text-center py-2">Back Testing</h3>
      <div className="flex flex-row items-center justify-around py-2 ">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-32 justify-between border-none  `}
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
          <SelectTrigger className="w-16 border-none focus:ring-0 focus:ring-offset-0">
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
        <Button onClick={handleSubmit}>Test</Button>
      </div>
      {renderTradeTable(backTestingTrades, "Back Tested Trades", pnl)}
    </div>
  );
};

export default BackTesting;
