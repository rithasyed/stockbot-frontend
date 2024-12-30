"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { IndexScore } from "./types";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { PopupChart } from "../popupChart";


const getGradeValue = (grade: string): number => {
  const gradeValues: { [key: string]: number } = {
    'A++': 7,
    'A+': 6,
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2,
    'F': 1,
  };
  return gradeValues[grade] || 0;
};

const addRankToData = (data: IndexScore[]): (IndexScore & { rank: number })[] => {
  const sortedData = [...data].sort((a, b) => (b.long_score as number) - (a.long_score as number));
  return sortedData.map((item, index) => ({
    ...item,
    rank: index + 1
  }));
};

export const columns: ColumnDef<IndexScore>[] = [
  {
    accessorKey: "rank",
    header: "Rank",
    cell: ({ row }) => {
      return (
        <div className="text-center font-medium">
          {row.original.rank}
        </div>
      );
    }
  },
  {
    accessorKey: "ticker_name",
    header: "Ticker Name",
    cell: ({ row }) => {
      const value = row.getValue("ticker_name") as number;
      return (
        <div className="text-left pl-2 ">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "ticker_symbol",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
          Symbol
          <ArrowUpDown className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const symbol = row.original["ticker_symbol"];
      return (
        <div className="rounded-lg">
          <Dialog >
            <DialogTrigger asChild>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {symbol}
              </Badge>
            </DialogTrigger>
            <DialogContent className="max-w-[85vw] h-[85vh] p-0 rounded-lg">
              <div className="w-full h-full overflow-hidden rounded-lg">
                <PopupChart symbol={symbol} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }
  },
  {
    accessorKey: "current_price",
    header: ({ column  }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Price(USD)
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original["current_price"].toFixed(2)}</div>;
    }
  },
  {
    accessorKey: "sector",
    header: ({ column  }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Sector
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original["sector"]}</div>;
    }
  },
  {
    accessorKey: "w_score",
    header: "W",
    cell: ({ row }) => {
      const value = row.getValue("w_score") as number;
      const squeeze = row.original["w_squeeze"] as string;
      let color = '';
      switch (squeeze) {
        case 'no squeeze':
          color = 'text-green-500';
          break;
        case 'low squeeze':
          color = 'text-black';
          break;
        case 'mid squeeze':
          color = 'text-red-500';
          break;
        case 'high squeeze':
          color = 'text-orange-500';
          break;
        default:
          color = 'text-green-500'; 
      }
      return (
        <div className={`text-center ${color}`}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "five_d_score",
    header: "5D",
    cell: ({ row }) => {
      const value = row.getValue("five_d_score") as number;
      const squeeze = row.original["five_d_squeeze"] as string;
      let color = '';
      switch (squeeze) {
        case 'no squeeze':
          color = 'text-green-500';
          break;
        case 'low squeeze':
          color = 'text-black';
          break;
        case 'mid squeeze':
          color = 'text-red-500';
          break;
        case 'high squeeze':
          color = 'text-orange-500';
          break;
        default:
          color = 'text-green-500';
      }
      return (
        <div className={`text-center ${color}`}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "d_score",
    header: "1D",
    cell: ({ row }) => {
      const value = row.getValue("d_score") as number;
      const squeeze = row.original["d_squeeze"] as string;
      let color = '';
      switch (squeeze) {
        case 'no squeeze':
          color = 'text-green-500';
          break;
        case 'low squeeze':
          color = 'text-black';
          break;
        case 'mid squeeze':
          color = 'text-red-500';
          break;
        case 'high squeeze':
          color = 'text-orange-500';
          break;
        default:
          color = 'text-green-500';
      }
      return (
        <div className={`text-center ${color}`}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "one_h_score",
    header: "1H",
    cell: ({ row }) => {
      const value = row.getValue("one_h_score") as number;
      const squeeze = row.original["one_h_squeeze"] as string;
      let color = '';
      switch (squeeze) {
        case 'no squeeze':
          color = 'text-green-500';
          break;
        case 'low squeeze':
          color = 'text-black';
          break;
        case 'mid squeeze':
          color = 'text-red-500';
          break;
        case 'high squeeze':
          color = 'text-orange-500';
          break;
        default:
          color = 'text-green-500';
      }
      return (
        <div className={`text-center ${color}`}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "ninety_m_score",
    header: "90M",
    cell: ({ row }) => {
      const value = row.getValue("ninety_m_score") as number;
      const squeeze = row.original["ninety_m_squeeze"] as string;
      let color = '';
      switch (squeeze) {
        case 'no squeeze':
          color = 'text-green-500';
          break;
        case 'low squeeze':
          color = 'text-black';
          break;
        case 'mid squeeze':
          color = 'text-red-500';
          break;
        case 'high squeeze':
          color = 'text-orange-500';
          break;
        default:
          color = 'text-green-500';
      }
      return (
        <div className={`text-center ${color}`}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "thirty_m_score",
    header: "30M",
    cell: ({ row }) => {
      const value = row.getValue("thirty_m_score") as number;
      const squeeze = row.original["thirty_m_squeeze"] as string;
      let color = '';
      switch (squeeze) {
        case 'no squeeze':
          color = 'text-green-500';
          break;
        case 'low squeeze':
          color = 'text-black';
          break;
        case 'mid squeeze':
          color = 'text-red-500';
          break;
        case 'high squeeze':
          color = 'text-orange-500';
          break;
        default:
          color = 'text-green-500'; 
      }
      return (
        <div className={`text-center ${color}`}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "fifteen_m_score",
    header: "15M",
    cell: ({ row }) => {
      const value = row.getValue("fifteen_m_score") as number;
      const squeeze = row.original["fifteen_m_squeeze"] as string;
      let color = '';
      switch (squeeze) {
        case 'no squeeze':
          color = 'text-green-500';
          break;
        case 'low squeeze':
          color = 'text-black';
          break;
        case 'mid squeeze':
          color = 'text-red-500';
          break;
        case 'high squeeze':
          color = 'text-orange-500';
          break;
        default:
          color = 'text-green-500';
      }
      return (
        <div className={`text-center ${color}`}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "long_score",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Long Score
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("long_score") as number;
      return (
        <div className={
          value >= 70 ? "font-bold text-green-600 text-center" :
          value >= 40 ? "text-yellow-500 text-center" :
          "text-red-500 text-center"
        }>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "short_score",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Short Score
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("short_score") as number;
      return (
        <div className={
          value >= 70 ? "font-bold text-green-600 text-center" :
          value >= 40 ? "text-yellow-500 text-center" :
          "text-red-500 text-center"
        }>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "trend",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Trend
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.original["trend"];
      return (
        <div className="text-center font-medium">{value}</div>
      );
    }
  },
  {
    accessorKey: "long_rank",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Long Term 
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = getGradeValue(rowA.getValue(columnId));
      const b = getGradeValue(rowB.getValue(columnId));
      return a < b ? -1 : a > b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.getValue("long_rank") as string;
      let color = "";
      switch (value) {
        case "A++":
          color = "#008000";
          break;
        case "A+":
          color = "#00CC00";
          break;
        case "A":
          color = "#CCCC00";
          break;
        case "B":
          color = "#FFC080";
          break;
        case "C":
          color = "#FF9900";
          break;
        case "D":
          color = "#FF3300";
          break;
        case "F":
          color = "#CC0000";
          break;
        default:
          color = "#666666";
      }
      return (
        <div className="text-center" style={{ color: color }}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "short_rank",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Short Term
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = getGradeValue(rowA.getValue(columnId));
      const b = getGradeValue(rowB.getValue(columnId));
      return a < b ? -1 : a > b ? 1 : 0;
    },
    cell: ({ row }) => {
      const value = row.getValue("short_rank") as string;
      let color = "";
      switch (value) {
        case "A++":
          color = "#008000";
          break;
        case "A+":
          color = "#00CC00";
          break;
        case "A":
          color = "#CCCC00";
          break;
        case "B":
          color = "#FFC080";
          break;
        case "C":
          color = "#FF9900";
          break;
        case "D":
          color = "#FF3300";
          break;
        case "F":
          color = "#CC0000";
          break;
        default:
          color = "#666666";
      }
      return (
        <div className="text-center" style={{ color: color }}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "score_change_trend",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
          Overall Trend
          <ArrowUpDown className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const valueString = row.original["score_change_trend"];
      
      // Check for empty string, null, or undefined
      if (valueString === "" || valueString === null || valueString === undefined) {
        return <div className="text-center"></div>;
      }
  
      const value = parseFloat(valueString);
      
      // Check if parseFloat resulted in a valid number
      if (isNaN(value)) {
        return <div className="text-center"></div>;
      }
  
      const isPositive = value > 0;
      const isNegative = value < 0;
  
      return (
        <div className="text-center font-medium flex items-center justify-center">
          {value}
          {isPositive && <ArrowUp className="ml-2 text-green-500" />}
          {isNegative && <ArrowDown className="ml-2 text-red-500" />}
        </div>
      );
    }
  }
  
];
export const FirstTable = (scores: IndexScore[]) => {
  //stocks
  const firsttabledesiredSymbols = [
    'AMZN', 'PLTR', 'NFLX', 'META', 'TSLA', 'WMT', 'CRM', 'ORCL', 'AAPL', 'C', 'MSFT', 'PTON', 'JPM', 'UAL', 
    'GOOG', 'LMND', 'NVDA', 'WFC', 'OKTA', 'SMCI', 'AMD', 'INTC',"DOCU","PEP","TGT","BAC",
    'GOOGL', 'AVGO', 'BA', 'BKNG', 'SQ', 'CAT', 'CVX', 'CMG', 'NET', 'CRSP', "LMT", "LRCX","LULU","MCD",
    'DDOG', 'DE', 'TSM', 'LLY', 'FSLR', 'GTLB', 'GS', 'SOFI', 'HD', 'IBM', "SO","MP",
    'RIVN', 'RTX', 'RBRK', 'AI', 'MU', 'MRK', 'NKE', 'OUST', 'QCOM', 'ROKU', "BIDU",
    'SHOP', 'PSNL', 'ABBV', 'BABA', 'DUK', 'EOG', 'XOM', 'GE', 'NEE', 'PG', 'SBUX', 'SU', 'TJX', 'KO', 'UNP', 'UPS', 'UNH', 'VLO', 'COST', 'Z', 'ZM'
  ];
  const filteredData = scores.filter(score => firsttabledesiredSymbols.includes(score['ticker_symbol']));
  return addRankToData(filteredData);
};

export const SecondTable = (scores: IndexScore[]) => {
  //indexes
  const firsttabledesiredSymbols = [
    'QQQ', 'SPY', 'IWM', 'DIA', 'RSP', 'GLD'
  ];
  const filteredData = scores.filter(score => firsttabledesiredSymbols.includes(score['ticker_symbol']));
  return addRankToData(filteredData);
};

export const ThirdTable = (scores: IndexScore[]) => {
  //futures
  const secondtabledesiredSymbols = [
    'BTC-USD', 'RTY=F', 'YM=F', 'GC=F', 'NQ=F', 'ES', 'TSM'
  ];
  const filteredData = scores.filter(score => secondtabledesiredSymbols.includes(score['ticker_symbol']));
  return addRankToData(filteredData);
};

export const FourthTable = (scores: IndexScore[]) => {
  //sectors or etfs
  const firsttabledesiredSymbols = [
    'XLK', 'SMH', 'XLF', 'XLV', 'XLE', 'XLC', 'IYR', 'ARKK', 'XLU', 'XLB', 'IYT', 'XLI', 'IBB', 'GBTC', 'SLV'
  ];
  const filteredData = scores.filter(score => firsttabledesiredSymbols.includes(score['ticker_symbol']));
  return addRankToData(filteredData);
};