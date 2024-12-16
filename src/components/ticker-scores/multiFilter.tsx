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
  filterColumn?: string;
}

export function MultiTableDataManager() {

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const DataTable = React.useCallback(({ 
    columns, 
    data, 
    filterColumn = "TICKER SYMBOL" 
  }: DataTableProps) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
      data,
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
        columnFilters: globalFilter 
          ? [{ id: filterColumn, value: globalFilter }] 
          : columnFilters,
        columnVisibility,
        rowSelection,
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
  }, [globalFilter, columnVisibility]);

  const renderControls = () => (
    <div className="flex items-center py-4 space-x-4">
      <Input
        placeholder="Filter across tables..."
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="w-[220px] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Button
        variant="outline"
        className="bg-white text-black hover:bg-white hover:text-black"  
        onClick={() => setGlobalFilter("")}
      >
        Clear
      </Button>
    </div>
  );

  // Return an object with the controls and DataTable component
  return {
    renderControls,
    DataTable
  };
}