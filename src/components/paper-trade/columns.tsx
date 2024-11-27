"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PaperTrade } from "./types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";

export const columns: ColumnDef<PaperTrade>[] = [
  {
    accessorKey: "stockname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-0 hover:bg-transparent"
        >
          Stock
          <ArrowUpDown />
        </Button>
      );
    },
    enableSorting: true,
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">{row.original.stockname}</div>
      );
    },
  },
  {
    accessorKey: "entry_price",
    header: "Entry",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("entry_price"));
      const formatted = isNaN(value) ? "--" : value.toFixed(2);
      return formatted;
    },
  },
  {
    accessorKey: "exit_price",
    header: "Exit",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("exit_price"));
      const formatted = isNaN(value) ? "--" : value.toFixed(2);
      return formatted;
    },
  },
  {
    accessorKey: "pnl",
    header: "P&L",
    cell: ({ row }) => {
      const pnl = row.getValue("pnl") as string;
      const value = parseFloat(pnl);
      const formatted = isNaN(value) ? "--" : value.toFixed(2);
      return (
        <span className={value > 0 ? "text-green-500" : "text-red-500"}>
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "Closed"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "entry_time",
    header: "Entry Time",
    cell: ({ row }) =>
      format(new Date(row.getValue("entry_time")), "dd/MM/yyyy HH:mm"),
  },
  {
    accessorKey: "exit_time",
    header: "Exit Time",
    cell: ({ row }) => {
      const exitTime = row.getValue("exit_time") as string | null;
      return exitTime ? format(new Date(exitTime), "dd/MM/yyyy HH:mm") : "--";
    },
  },
  {
    accessorKey: "stoploss",
    header: "Stop Loss",
  },
  {
    accessorKey: "target",
    header: "Target",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "capital",
    header: "Capital",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("capital"));
      const formatted = isNaN(value) ? "--" : value.toFixed(2);
      return <span className={""}>{formatted}</span>;
    },
  },
  {
    accessorKey: "ROI",
    header: "ROI",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("ROI"));
      const formatted = isNaN(value) ? "--" : value.toFixed(2);
      return (
        <span className={value > 0 ? "text-green-500" : "text-red-500"}>
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: "interval",
    header: "Interval",
  },
];
