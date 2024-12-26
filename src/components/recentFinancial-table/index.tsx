import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentFinancialTableProps {
  financials: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

const RecentFinancialTable: React.FC<RecentFinancialTableProps> = ({ financials }) => {
  if (!financials) return null;

  const columnKeys = Object.keys(financials).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value ?? 'None';
  };

  const rows = [
    { key: 'Tax Effect Of Unusual Items', label: 'Tax Effect Of Unusual Items' },
    { key: 'Tax Rate For Calcs', label: 'Tax Rate For Calcs' },
    { key: 'Normalized EBITDA', label: 'Normalized EBITDA' },
    { key: 'Net Income From Continuing Operation Net Minority Interest', label: 'Net Income From Continuing' },
    { key: 'Reconciled Depreciation', label: 'Reconciled Depreciation' },
    { key: 'Reconciled Cost Of Revenue', label: 'Reconciled Cost Of Revenue' },
    { key: 'EBITDA', label: 'EBITDA' },
    { key: 'EBIT', label: 'EBIT' },
    { key: 'Net Interest Income', label: 'Net Interest Income' },
    { key: 'Interest Expense', label: 'Interest Expense' },
    { key: 'Interest Income', label: 'Interest Income' },
    { key: 'Normalized Income', label: 'Normalized Income' },
    { key: 'Net Income From Continuing And Discontinued Operation', label: 'Net Income From Continuing' },
    { key: 'Total Expenses', label: 'Total Expenses' },
    { key: 'Total Operating Income As Reported', label: 'Total Operating Income As Re' },
    { key: 'Diluted Average Shares', label: 'Diluted Average Shares' },
    { key: 'Basic Average Shares', label: 'Basic Average Shares' },
    { key: 'Diluted EPS', label: 'Diluted EPS' },
    { key: 'Basic EPS', label: 'Basic EPS' },
    { key: 'Diluted NI Availto Com Stockholders', label: 'Diluted NI Availto Com Stockholders' },
    { key: 'Net Income Common Stockholders', label: 'Net Income Common Stockholders' },
    { key: 'Net Income', label: 'Net Income' },
    { key: 'Net Income Including Noncontrolling Interests', label: 'Net Income Including Noncontrolling Interests' },
    { key: 'Net Income Continuous Operations', label: 'Net Income Continuous Operations' },
    { key: 'Tax Provision', label: 'Tax Provision' },
    { key: 'Pretax Income', label: 'Pretax Income' },
    { key: 'Other Income Expense', label: 'Other Income Expense' },
    { key: 'Other Non Operating Income Expenses', label: 'Other Non Operating Income Expenses' },
    { key: 'Net Non Operating Interest Income Expense', label: 'Net Non Operating Interest Income Expense' },
    { key: 'Interest Expense Non Operating', label: 'Interest Expense Non Operating' },
    { key: 'Interest Income Non Operating', label: 'Interest Income Non Operating' },
    { key: 'Operating Income', label: 'Operating Income' },
    { key: 'Operating Expense', label: 'Operating Expense' },
    { key: 'Research And Development', label: 'Research And Development' },
    { key: 'Selling General And Administration', label: 'Selling General And Administration' },
    { key: 'Gross Profit', label: 'Gross Profit' },
    { key: 'Cost Of Revenue', label: 'Cost Of Revenue' },
    { key: 'Total Revenue', label: 'Total Revenue' },
    { key: 'Operating Revenue', label: 'Operating Revenue' }
  ];

  return (
    <div className="m-6 ml-10">
      <h3 className="text-xl font-semibold mb-4">Analyst Recommendations</h3>
        <ScrollArea className="h-[500px] w-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-left"></TableHead>
                {columnKeys.map((key, index) => (
                  <TableHead key={index} className="text-center">
                    {new Date(key).toLocaleDateString()}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.key} className="hover:bg-muted/50">
                  <TableCell className="font-medium text-left">
                    {row.label}
                  </TableCell>
                  {columnKeys.map((colKey, index) => (
                    <TableCell key={index} className="text-center">
                      {formatValue(financials[colKey]?.[row.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
    </div>
  );
};

export default RecentFinancialTable;