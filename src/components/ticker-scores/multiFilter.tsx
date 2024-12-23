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

  const rankOptions = ["all", "A++", "A+", "A", "B", "C", "D", "F"];

  const DataTable = React.useCallback(({ 
    columns, 
    data 
  }: DataTableProps) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const filteredData = React.useMemo(() => {
      return data.filter(row => {
        const longRankMatch = longRankFilter === "all" || row.long_rank === longRankFilter;
        const shortRankMatch = shortRankFilter === "all" || row.short_rank === shortRankFilter;
        return longRankMatch && shortRankMatch;
      });
    }, [data, longRankFilter, shortRankFilter]);

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
          'long_rank', 
          'short_rank', 
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
      <div className="w-full">
        <Table className="rounded-md border overflow-x-auto max-h-64 scrollbar-hide">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
    );
  }, [globalFilter, columnVisibility, longRankFilter, shortRankFilter]);

  const renderControls = () => (
    <div className="flex items-center py-4 space-x-4">
      <Input
        placeholder="Filter across all columns..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="w-[220px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Select value={longRankFilter} onValueChange={setLongRankFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Long Rank" />
        </SelectTrigger>
        <SelectContent>
          {rankOptions.map((rank) => (
            <SelectItem key={rank} value={rank}>
              {rank === "all" ? "All Long Rank" : rank}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={shortRankFilter} onValueChange={setShortRankFilter}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Short Rank" />
        </SelectTrigger>
        <SelectContent>
          {rankOptions.map((rank) => (
            <SelectItem key={rank} value={rank}>
              {rank === "all" ? "All Short Rank" : rank}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        className="bg-white text-black hover:bg-white hover:text-black"
        onClick={() => {
          setGlobalFilter("");
          setLongRankFilter("all");
          setShortRankFilter("all");
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