"use client";
import { Button } from "@/components/ui/button";
import { ChartNoAxesCombined, ChartGantt } from "lucide-react";

interface SidebarProps {
  onOpenScreen: (screen: string) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
  theme?: string;
}

export function Sidebar({ onOpenScreen, theme, setOpen, open }: SidebarProps) {
  const handleClick = (value: string) => {
    onOpenScreen(value);
    setOpen(!open);
  };
  return (
    <div className="w-16 h-screen  text-white flex flex-col items-center py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleClick("papertrading")}
        className="mt-4"
      >
        <ChartNoAxesCombined className="h-8 w-8 text-black" />
        <span className="sr-only">Open Paper Trading</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleClick("backtesting")}
        className="mt-4"
      >
        <ChartGantt className="h-8 w-8 text-black" />
        <span className="sr-only">Open Back Testing</span>
      </Button>
    </div>
  );
}
