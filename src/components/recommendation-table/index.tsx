import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecommendationsTableProps } from './types';

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({ recommendations }) => {
  if (!recommendations) return null;

  const periods = Object.values(recommendations.period);
  
  return (
    <div className="m-6 ml-10">
      <h3 className="text-xl font-semibold mb-4">Analyst Recommendations</h3>
        <Table className='border'>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-center">Period</TableHead>
              <TableHead className="text-center">Strong Buy</TableHead>
              <TableHead className="text-center">Buy</TableHead>
              <TableHead className="text-center">Hold</TableHead>
              <TableHead className="text-center">Sell</TableHead>
              <TableHead className="text-center">Strong Sell</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {periods.map((period, index) => (
              <TableRow key={period} className="hover:bg-muted/50">
                <TableCell className="font-medium text-center">
                  {period}
                </TableCell>
                <TableCell className="text-center text-green-700 font-semibold">
                  {recommendations.strongBuy[index]}
                </TableCell>
                <TableCell className="text-center text-green-500">
                  {recommendations.buy[index]}
                </TableCell>
                <TableCell className="text-center text-gray-500">
                  {recommendations.hold[index]}
                </TableCell>
                <TableCell className="text-center text-red-500">
                  {recommendations.sell[index]}
                </TableCell>
                <TableCell className="text-center text-red-700 font-semibold">
                  {recommendations.strongSell[index]}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    </div>
  );
};

export default RecommendationsTable;