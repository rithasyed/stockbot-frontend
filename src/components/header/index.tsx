"use client";
import { UserButton } from "@clerk/nextjs";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Bot, Check, ChevronsUpDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { Separator } from "../ui/separator";
import { Sun, MoonStar, CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { IndexScore } from "../ticker-scores/types";
import { useSymbols } from "@/store/symbolStore";
import { useGeneralSetting } from "@/store/generalSettingStore";
import Link from "next/link";

export interface TickerData {
  ticker: string;
  timeframe: string;
  emaPeriod: number;
  vwapPeriod: number;
  vwapStdDev: number;
}

interface HeaderProps {
  onSubmit: (data: TickerData) => void;
  isHeader?: boolean;
  backButtonPath?: string;
  scores?: IndexScore[];
  initialTicker?: string;
}

const timePeriods = ["1m", "5m", "15m", "60m", "1d", "1wk", "1mo"];

export default function Header({
  onSubmit,
  isHeader = false,
  scores = [],
  initialTicker = 'NVDA'
}: HeaderProps) {
  const { data: symbols, addSymbol } = useSymbols((state) => state);
  const { theme, TTM, setTTM, setTheme } = useGeneralSetting((state) => state);
  const [technicalData, setTechnicalData] = useState<TickerData>({
    ticker: initialTicker,
    timeframe: "1m",
    emaPeriod: 20,
    vwapPeriod: 20,
    vwapStdDev: 2,
  });
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updateFrequency, setUpdateFrequency] = useState(5);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ticker, setTicker] = useState("");
  const router = useRouter();

  useEffect(() => {
    setTechnicalData(prev => ({
      ...prev,
      ticker: initialTicker
    }));
  }, [initialTicker]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoUpdate) {
      interval = setInterval(() => {
        handleSubmit();
      }, updateFrequency * 60000);
    }
    return () => clearInterval(interval);
  }, [autoUpdate, updateFrequency, technicalData]);

  const handleTimePeriodChange = (value: string) => {
    setTechnicalData((prev) => ({ ...prev, timeframe: value }));
  };
  const createSymbol = async (value: string) => {
    // if (!setWatchlist) return;

    try {
      addSymbol(value);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddClick = () => {
    createSymbol(ticker);
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit(technicalData);
    }
  };

  const handleDownload = () => {
    const columnHeaders = [
      "Ticker Name",
      "Ticker Symbol",
      "W",
      "5D",
      "1D",
      "1H",
      "90M",
      "30M",
      "15M",
      "Long Score",
      "Short Score",
      "Long Rank",
      "Short Rank",
      "Trend",
    ];
    const csvData = [
      columnHeaders,
      ...scores.map((row) => Object.values(row)),
    ].join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "ticker-scores.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleMarkerType = () => {
    setTTM(!TTM);
  };
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <header
      className={`w-full ${
        theme === "dark" ? "bg-zinc-800" : "bg-white"
      } shadow-md p-2`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {!isHeader && (
            <>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-32 justify-between border-none ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700 hover:text-white"
                        : "bg-white"
                    } `}
                  >
                    {technicalData.ticker
                      ? symbols.find((s) => s.name === technicalData.ticker)
                          ?.name
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
                                const newTicker = s.name;
                                setTechnicalData((prev) => ({
                                  ...prev,
                                  ticker: newTicker,
                                }));
                                setOpen(false);
                                // Trigger submit to update URL
                                onSubmit({
                                  ...technicalData,
                                  ticker: newTicker,
                                });
                              }}
                            >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                technicalData.ticker === s.name
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

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <CirclePlus
                    size={20}
                    className="shrink-0 opacity-50 cursor-pointer"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add symbol</DialogTitle>
                    <DialogDescription>
                      Add a new symbol to your watchlist.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="ticker" className="sr-only">
                        Symbol
                      </Label>
                      <Input
                        id="ticker"
                        placeholder="AAPL"
                        type="text"
                        onChange={(e) => setTicker(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-end">
                    <Button type="submit" onClick={handleAddClick}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div>
                <Separator orientation="vertical" className="h-8  text-sm" />
              </div>

              <Select
                value={technicalData.timeframe}
                onValueChange={handleTimePeriodChange}
              >
                <SelectTrigger className="w-16 border-none focus:ring-0 focus:ring-offset-0">
                  <SelectValue
                    placeholder="Time"
                    defaultValue={technicalData.timeframe}
                  />
                </SelectTrigger>
                <SelectContent>
                  {timePeriods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <Separator orientation="vertical" className="h-8  text-sm" />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="ema-period">EMA: </Label>
                <Input
                  type="number"
                  id="ema-period"
                  placeholder="EMA Period"
                  min={0}
                  value={technicalData.emaPeriod}
                  onChange={(e) =>
                    setTechnicalData((prev) => ({
                      ...prev,
                      emaPeriod: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-16 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                />
              </div>

              <div>
                <Separator orientation="vertical" className="h-8  text-sm" />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="vwap-period" className="">
                  VWAP:
                </Label>
                <Input
                  type="number"
                  id="vwap-period"
                  min={0}
                  placeholder="VWAP Period"
                  value={technicalData.vwapPeriod}
                  onChange={(e) =>
                    setTechnicalData((prev) => ({
                      ...prev,
                      vwapPeriod: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-20 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0"
                />
              </div>

              <Button type="submit" onClick={handleSubmit}>
                Submit
              </Button>

              <div>
                <Separator orientation="vertical" className="h-8  text-sm" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-update"
                  checked={autoUpdate}
                  onCheckedChange={setAutoUpdate}
                />
                <Label htmlFor="auto-update">Auto Update</Label>
              </div>

              <Input
                type="number"
                placeholder="Frequency (minutes)"
                value={updateFrequency}
                onChange={(e) =>
                  setUpdateFrequency(parseInt(e.target.value, 10))
                }
                className="w-44"
                disabled={!autoUpdate}
              />

              <div className="flex items-center space-x-2">
                <Switch id="ttm" onCheckedChange={toggleMarkerType} />
                <Label htmlFor="auto-update">TTM</Label>
              </div>
            </>
          )}
          {isHeader && (
            <>
              <div
                onClick={() => router.push("/home")}
                className="flex items-center cursor-pointer hover:opacity-70 transition-opacity"
              >
                <Bot className="h-6 w-6 ml-3" />
                <span className="font-bold text-lg pl-2">StockBot</span>
              </div>
            </>
          )}
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div>
            {/* {theme === "light" ? (
              <MoonStar
                onClick={toggleTheme}
                className="ml-5 text-sm  text-gray-700  hover:text-black"
              />
            ) : (
              <Sun
                onClick={toggleTheme}
                className="ml-5 text-sm text-gray-300 hover:text-white"
              />
            )} */}
          </div>

          <div className="flex items-center align-middle gap-1">
            {isHeader && (
              <div className="mr-4">
                <Button onClick={handleDownload}>
                  <Download className="h-5 w-5 mr-2" />
                  Export
                </Button>
              </div>
            )}
            <div className="mr-4">
              <UserButton signInUrl="/signin" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
