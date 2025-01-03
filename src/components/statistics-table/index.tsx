import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StatisticsTableProps {
  info: {
    trailingPE?: number | null;
    trailingEps?: number | null;
    priceToBook?: number | null;
    priceToSalesTrailing12Months?: number | null;
  };
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ info }) => {
  if (!info) return null;

  // Check if any of the required statistics are available
  const hasAnyStats = [
    info.trailingPE,
    info.trailingEps,
    info.priceToSalesTrailing12Months,
    info.priceToBook
  ].some(value => value != null);

  if (!hasAnyStats) return null;

  const formatValue = (value: number | null | undefined) => {
    if (value == null) return 'N/A';
    return isFinite(value) ? value.toFixed(4) : 'N/A';
  };

  const statistics = [
    { metric: "PE Ratio (TTM)", value: info.trailingPE },
    { metric: "EPS (TTM)", value: info.trailingEps },
    { metric: "Price/Sales (TTM)", value: info.priceToSalesTrailing12Months },
    { metric: "Price/Book (MRQ)", value: info.priceToBook },
  ].filter(stat => stat.value != null);

  if (statistics.length === 0) return null;

  return (
    <div className="m-6 ml-10">
      <h3 className="text-xl font-semibold mb-4">Main Statistics</h3>
        <Table className='border'>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-center">Metric</TableHead>
              <TableHead className="text-center">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics.map((stat) => (
              <TableRow key={stat.metric} className="hover:bg-muted/50">
                <TableCell className="font-medium text-center">
                  {stat.metric}
                </TableCell>
                <TableCell className="text-center">
                  {formatValue(stat.value)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};

export default StatisticsTable;