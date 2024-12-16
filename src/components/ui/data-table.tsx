"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trade } from "@/types/trades";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Trade, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      remarks: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  // New state for indicator filter
  const [selectedIndicator, setSelectedIndicator] = React.useState<
    string | null
  >(null);

  // Get distinct indicators
  const distinctIndicators = React.useMemo(() => {
    return Array.from(new Set(data.map((item) => item.indicator)))
      .filter(Boolean)
      .sort();
  }, [data]);

  // Calculate filtered ROI summary
  const roiSummary = React.useMemo(() => {
    // If no indicator selected, calculate for all trades
    const filteredTrades = selectedIndicator
      ? data.filter((trade) => trade.indicator === selectedIndicator)
      : data;

    const totalTrades = filteredTrades.length;
    const totalROI = filteredTrades.reduce((sum, trade) => {
      const roi = parseFloat(trade.ROI);
      return sum + (isNaN(roi) ? 0 : roi);
    }, 0);
    const totalCapital = filteredTrades.reduce((sum, trade) => {
      const capital = parseFloat(trade.capital);
      return sum + (isNaN(capital) ? 0 : capital);
    }, 0);
    const totalROIPercentage = totalROI / (totalCapital || 100) * 100;
    const positiveTradesCount = filteredTrades.filter(
      (trade) => trade.ROI && parseFloat(trade.ROI) > 0
    ).length;
    const positiveTradesCountPercentage = positiveTradesCount / totalTrades * 100;
    const negativeTradesCount = filteredTrades.filter(
      (trade) => trade.ROI && parseFloat(trade.ROI) < 0
    ).length;
    const negativeTradesCountPercentage = negativeTradesCount / totalTrades * 100;

    const averageROI =
      filteredTrades.reduce((sum, trade) => {
        const roi = parseFloat(trade.ROI);
        return sum + (isNaN(roi) ? 0 : roi);
      }, 0) / (totalCapital || 100);

    return {
      totalTrades,
      totalROI,
      totalROIPercentage,
      totalCapital,
      positiveTradesCount,
      positiveTradesCountPercentage,
      negativeTradesCount,
      negativeTradesCountPercentage,
      averageROI: isNaN(averageROI) ? 0 : averageROI,
    };
  }, [data, selectedIndicator]);

  // Modify the filtering to include indicator filter
  const [filtering, setFiltering] = React.useState<ColumnFiltersState>([
    ...(selectedIndicator
      ? [{ id: "indicator", value: selectedIndicator }]
      : []),
  ]);

  // Update filtering when selectedIndicator changes
  React.useEffect(() => {
    const newFilters = [...columnFilters];

    // Remove existing indicator filter if any
    const indicatorFilterIndex = newFilters.findIndex(
      (filter) => filter.id === "indicator"
    );
    if (indicatorFilterIndex !== -1) {
      newFilters.splice(indicatorFilterIndex, 1);
    }

    // Add new indicator filter if selected
    if (selectedIndicator) {
      newFilters.push({ id: "indicator", value: selectedIndicator });
    }

    setColumnFilters(newFilters);
  }, [selectedIndicator]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* ROI Summary Section */}
      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Return on Investment for{" "}
          {selectedIndicator
            ? `${selectedIndicator} Indicator `
            : "All Indicators "}
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Trades</p>
            <p className="font-bold">{roiSummary.totalTrades}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 text-wrap">
              Total Capital Invested
            </p>
            <p className="font-bold">
              {roiSummary.totalCapital
                ? roiSummary.totalCapital.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : 0}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total ROI</p>
            <p className={`font-bold ${roiSummary.totalROI && roiSummary.totalROI > 0 ? "text-green-600" : "text-red-600"}`}>{roiSummary.totalROI
                ? roiSummary.totalROI.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })
                : 0} ({isNaN(roiSummary.totalROIPercentage) ? 0 : roiSummary?.totalROIPercentage?.toFixed(2) || 0}%)</p>

          </div>
          <div>
            <p className="text-sm text-gray-600">Positive Trades</p>
            <p className="font-bold text-green-600">
              {roiSummary.positiveTradesCount}
              {` (${isNaN(roiSummary.positiveTradesCountPercentage) ? 0 : roiSummary?.positiveTradesCountPercentage?.toFixed(2) || 0}%)`}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Negative Trades</p>
            <p className="font-bold text-green-600">
              {roiSummary.negativeTradesCount}
              {` (${isNaN(roiSummary.negativeTradesCountPercentage) ? 0 : roiSummary?.negativeTradesCountPercentage?.toFixed(2) || 0}%)`}

            </p>
          </div>
          
        </div>
      </div>

      <div className="flex items-center py-4 px-1 space-x-2">
        {/* Stock Name Filter */}
        <Input
          placeholder="Filter stocks..."
          value={
            (table.getColumn("stockname")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("stockname")?.setFilterValue(event.target.value)
          }
          className="max-w-44 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        {/* Indicator Filter Dropdown */}
        <DropdownMenu >
          <DropdownMenuTrigger asChild className="without-ring">
            <Button variant="outline">
              {selectedIndicator || "All"} <ChevronDown className="ml-2 without-ring" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={selectedIndicator || ""}
              onValueChange={(value) =>
                setSelectedIndicator(value === "" ? null : value)
              }
            >
              <DropdownMenuRadioItem value="">
                All Indicators
              </DropdownMenuRadioItem>
              {distinctIndicators.map((indicator) => (
                <DropdownMenuRadioItem key={indicator} value={indicator}>
                  {indicator}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Columns Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="h-48 overflow-auto scrollbar-hide"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table Rendering Remains the Same */}
      <div className="rounded-md border overflow-x-auto max-h-64 scrollbar-hide">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
