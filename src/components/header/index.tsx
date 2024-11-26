"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

export interface TickerData {
  ticker: string;
  timeframe: string;
  emaPeriod: number;
  vwapPeriod: number;
  vwapStdDev: number;
}
interface HeaderProps {
  symbols: { id: number; name: string }[];
  onSubmit: (data: TickerData) => void;
  onToggleTheme: () => void;
  setWatchlist: (symbols: { id: number; name: string }[]) => void;
  toggleMarkerType: () => void;
  theme: "light" | "dark";
}

const timePeriods = ["1m", "5m", "15m", "60m", "1d", "1wk", "1mo"];

export default function Header({
  symbols,
  onSubmit,
  onToggleTheme,
  toggleMarkerType,
  theme,
  setWatchlist,
}: HeaderProps) {
  const [technicalData, setTechnicalData] = useState<TickerData>({
    ticker: "AAPL",
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
  const addSymbol = async (value: string) => {
    try {
      const symbol = await fetch("/api/symbols", {
        method: "POST",
        body: JSON.stringify({
          ticker: value.toString(),
        }),
      }).then((res) => res.json());
      console.log(symbol);
      const lastSymbol = symbols[symbols.length - 1];
      setWatchlist([...symbols, { id: lastSymbol.id + 1, name: symbol.name }]);
    } catch (e) {
      console.log(e);
    }
  };
  const handleAddClick = () => {
    // console.log("add symbol");
    addSymbol(ticker);
    setDialogOpen(false);
  };
  const handleSubmit = async () => {
    // e.preventDefault();
    await onSubmit(technicalData);
  };


  return (
    <header
      className={`w-full ${
        theme === "dark" ? "bg-zinc-800" : "bg-white"
      } shadow-md p-2`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
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
                  ? symbols.find((s) => s.name === technicalData.ticker)?.name
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
                          setTechnicalData((prev) => ({
                            ...prev,
                            ticker: s.name,
                          }));
                          setOpen(false);
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
          {/* <div>
            <CirclePlus
              onClick={handleClick}
              size={20}
              className="shrink-0 opacity-50 cursor-pointer"
            />
          </div> */}
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
            onChange={(e) => setUpdateFrequency(parseInt(e.target.value, 10))}
            className="w-44"
            disabled={!autoUpdate}
          />
          <div className="flex items-center space-x-2">
            <Switch
              id="ttm"
              // checked={autoUpdate}
              onCheckedChange={toggleMarkerType}
            />
            <Label htmlFor="auto-update">TTM</Label>
          </div>
        </div>
        <div>
          {/* {theme === "light" ? (
            <MoonStar
              onClick={onToggleTheme}
              className="ml-5 text-sm  text-gray-700  hover:text-black"
            />
          ) : (
            <Sun
              onClick={onToggleTheme}
              className="ml-5 text-sm text-gray-300 hover:text-white"
            />
          )} */}
        </div>
      </div>
    </header>
  );
}
