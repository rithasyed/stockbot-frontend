"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";

interface HeaderProps {
  ticker_symbols: string[];
}

export default function Header({ 
  ticker_symbols, 
}: HeaderProps) {
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [searchTerm, setSearchTerm] = useState("");
  const [frameworks, setFrameworks] = useState(ticker_symbols);
  const [filteredFrameworks, setFilteredFrameworks] = useState(frameworks);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFilteredFrameworks(frameworks.filter(fw => fw.toLowerCase().includes(e.target.value.toLowerCase())));
    setIsDropdownOpen(true);
  };

  const handleFrameworkSelection = (framework: string) => {
    setSearchTerm(framework);
    setFilteredFrameworks(frameworks);
    setIsDropdownOpen(false);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header
      className={`w-full ${
        theme === "dark" ? "bg-zinc-800" : "bg-white"
      } shadow-md p-2`}
    >
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer ">
            <Bot className="h-6 w-6 ml-3" />
            <span className="font-bold text-lg pl-2">StockBot</span>
            <div className="flex items-center ml-28">
            <div className="relative ml-2">
              <Input
                type="text"
                placeholder="Search tickers..."
                value={searchTerm}
                onChange={handleSearch}
                className="ml-10 rounded-2xl w-45"
                onFocus={() => setIsDropdownOpen(true)}
                onBlur={handleDropdownClose}
              />
              {isDropdownOpen && filteredFrameworks.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white shadow-md rounded-lg z-10 max-h-48 overflow-y-auto ">
                  {filteredFrameworks.map((fw) => (
                    <div
                      key={fw}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleFrameworkSelection(fw)}
                    >
                      {fw}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button 
             variant="ghost"
             className="ml-2"
             onClick={() => router.push("/ticker-scores")}>
                Scanner
            </Button>
            <Button 
             variant="ghost"
             className="ml-2"
             onClick={() => router.push("/performance")}>
                Performance
            </Button> 
            </div>
          </div>
              <div className="flex justify-between items-center">
                <div className="mr-4">
                <UserButton signInUrl="/signin"/>
                </div>
              </div>
        </div>
    </header>
  );
}