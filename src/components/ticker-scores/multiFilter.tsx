import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { IndexScore } from "./types"

interface DataTableProps {
  columns: ColumnDef<IndexScore, unknown>[];
  data: IndexScore[];
}

export function MultiTableDataManager() {
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [longRankFilter, setLongRankFilter] = React.useState<string>("all");
  const [shortRankFilter, setShortRankFilter] = React.useState<string>("all");
  const [longScoreFilter, setLongScoreFilter] = React.useState<string>("all");

  const rankOptions = ["all", "A++", "A+", "A", "B", "C", "D", "F"];
  const longScoreOptions = ["all", "top10bull", "top10bear"];

  const DataTable = React.useCallback(({ 
    columns, 
    data 
  }: DataTableProps) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const filteredData = React.useMemo(() => {
      let filtered = data.filter(row => {
        const longRankMatch = longRankFilter === "all" || row.long_rank === longRankFilter;
        const shortRankMatch = shortRankFilter === "all" || row.short_rank === shortRankFilter;
        return longRankMatch && shortRankMatch;
      });

      // Apply long score filter if selected
      if (longScoreFilter !== "all") {
        // Sort by long_score
        const sorted = [...filtered].sort((a, b) => {
          if (longScoreFilter === "top10bull") {
            return b.long_score - a.long_score; // Descending for bullish
          } else {
            return a.long_score - b.long_score; // Ascending for bearish
          }
        });
        
        // Take top 10
        filtered = sorted.slice(0, 10);
      }

      return filtered;
    }, [data, longRankFilter, shortRankFilter, longScoreFilter]);

    const table = useReactTable({
      data: filteredData,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        globalFilter,
      },
      globalFilterFn: (row, _, filterValue) => {
        if (!filterValue) return true;

        const searchValue = filterValue.toLowerCase();
        const columnsToSearch = [
          'ticker_name', 
          'ticker_symbol', 
          'trend', 
          'long_score', 
          'short_score',
          'score_change_trend'
        ];

        return columnsToSearch.some(column => {
          const value = row.original[column as keyof IndexScore];
          const stringValue = String(value).toLowerCase();
          return stringValue.includes(searchValue);
        });
      },
    });

    return (
      <div className="w-full overflow-hidden border rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id}
                      className="px-2 py-3 text-sm font-medium"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className="px-2 py-2 text-sm"
                      >
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
      </div>
    );
  }, [globalFilter, columnVisibility, longRankFilter, shortRankFilter, longScoreFilter]);

  const renderControls = () => (
    <div className="flex flex-wrap items-center gap-4 py-4">
      <Input
        placeholder="Filter across all columns..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="w-[220px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Select value={longRankFilter} onValueChange={setLongRankFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Long Trend" />
        </SelectTrigger>
        <SelectContent>
          {rankOptions.map((rank) => (
            <SelectItem key={rank} value={rank}>
              {rank === "all" ? "All Long Trend" : rank}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={shortRankFilter} onValueChange={setShortRankFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Short Trend" />
        </SelectTrigger>
        <SelectContent>
          {rankOptions.map((rank) => (
            <SelectItem key={rank} value={rank}>
              {rank === "all" ? "All Short Trend" : rank}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={longScoreFilter} onValueChange={setLongScoreFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Long Score Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stocks</SelectItem>
          <SelectItem value="top10bull">Top 10 Bullish</SelectItem>
          <SelectItem value="top10bear">Top 10 Bearish</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="bg-white text-black hover:bg-gray-50"
        onClick={() => {
          setGlobalFilter("");
          setLongRankFilter("all");
          setShortRankFilter("all");
          setLongScoreFilter("all");
        }}
      >
        Clear All
      </Button>
    </div>
  );

  return {
    renderControls,
    DataTable
  };
}