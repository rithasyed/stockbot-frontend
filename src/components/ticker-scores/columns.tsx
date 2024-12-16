"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { IndexScore } from "./types";

export const columns: ColumnDef<IndexScore>[] = [
  {
    accessorKey: "TICKER NAME",
    header: "Ticker Name",
    cell: ({ row }) => {
      const value = row.getValue("TICKER NAME") as number;
      return (
        <div className="text-left pl-2 ">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "TICKER SYMBOL",
    header: ({ column  }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Symbol
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.original["TICKER SYMBOL"]}</div>;
    }
  },
  {
    accessorKey: "W",
    header: "W",
    cell: ({ row }) => {
      const value = row.getValue("W") as number;
      return (
        <div className="text-center">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "5D",
    header: "5D",
    cell: ({ row }) => {
      const value = row.getValue("5D") as number;
      return (
        <div className="text-center">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "D",
    header: "1D",
    cell: ({ row }) => {
      const value = row.getValue("D") as number;
      return (
        <div className="text-center">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "1H",
    header: "1H",
    cell: ({ row }) => {
      const value = row.getValue("1H") as number;
      return (
        <div className="text-center">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "90M",
    header: "90M",
    cell: ({ row }) => {
      const value = row.getValue("90M") as number;
      return (
        <div className="text-center">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "30M",
    header: "30M",
    cell: ({ row }) => {
      const value = row.getValue("30M") as number;
      return (
        <div className="text-center">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "15M",
    header: "15M",
    cell: ({ row }) => {
      const value = row.getValue("15M") as number;
      return (
        <div className="text-center">
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "LONG SCORE",
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
      const value = row.getValue("LONG SCORE") as number;
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
    accessorKey: "SHORT SCORE",
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
      const value = row.getValue("SHORT SCORE") as number;
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
    accessorKey: "TREND",
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
      const value = row.original["TREND"];
      return (
        <div className="text-center font-medium">{value}</div>
      );
    }
  },
  {
    accessorKey: "LONG RANK",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Long Rank
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("LONG RANK") as string;
      let color = "";
      switch (value) {
        case "A++":
          color = "#008000";
          break;
        case "A+":
          color = "#00CC00"; // light green
          break;
        case "A":
          color = "#CCCC00"; // yellow
          break;
        case "B":
          color = "#FFC080"; // light orange
          break;
        case "C":
          color = "#FF9900"; // orange
          break;
        case "D":
          color = "#FF3300"; // dark orange
          break;
        case "F":
          color = "#CC0000"; // dark red
          break;
        default:
          color = "#666666"; // gray
      }
      return (
        <div className="text-center" style={{ color: color }}>
          {value}
        </div>
      );
    }
  },
  {
    accessorKey: "SHORT RANK",
    header: ({ column }) => {
      return (
        <Button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 text-center bg-black hover:bg-black"
        >
           Short Rank
          <ArrowUpDown className="ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const value = row.getValue("SHORT RANK") as string;
      let color = "";
      switch (value) {
        case "A++":
          color = "#008000";
          break;
        case "A+":
          color = "#00CC00"; // light green
          break;
        case "A":
          color = "#CCCC00"; // yellow
          break;
        case "B":
          color = "#FFC080"; // light orange
          break;
        case "C":
          color = "#FF9900"; // orange
          break;
        case "D":
          color = "#FF3300"; // dark orange
          break;
        case "F":
          color = "#CC0000"; // dark red
          break;
        default:
          color = "#666666"; // gray
      }
      return (
        <div className="text-center" style={{ color: color }}>
          {value}
        </div>
      );
    }
  }
];
export const FirstTable = (scores: IndexScore[]) => {
  const firsttabledesiredSymbols = ['QQQ', 'SPY', 'IWM', 'DIA', 'RSP'];
  return scores.filter(score => firsttabledesiredSymbols.includes(score['TICKER SYMBOL']));
};

export const SecondTable = (scores: IndexScore[]) => {
  const secondtabledesiredSymbols = ['BTC-USD', 'RTY=F', 'YM=F', 'GC=F', 'NQ=F', 'ES'];
  return scores.filter(score => secondtabledesiredSymbols.includes(score['TICKER SYMBOL']));
};

export const ThirdTable = (scores: IndexScore[]) => {
  const firsttabledesiredSymbols = ['XLK','SMH','XLF','XLV','XLE','XLC','IYR','ARKK','XLU','XLB','IYT','XLI','IBB','GBTC'];
  return scores.filter(score => firsttabledesiredSymbols.includes(score['TICKER SYMBOL']));
};
export const FourthTable = (scores: IndexScore[]) => {
  const firsttabledesiredSymbols = ['AMZN', 'PLTR', 'NFLX', 'META', 'TSLA', 'WMT', 'CRM', 'ORCL', 'AAPL', 'C', 'MSFT', 'PTON', 'JPM', 'UAL', 'GOOG', 'LMND', 'NVDA', 'WFC', 'OKTA', 'SMCI', 'AMD', 'INTC'];
  return scores.filter(score => firsttabledesiredSymbols.includes(score['TICKER SYMBOL']));
};