import React from 'react';

interface StatisticsTableProps {
  info: {
    trailingPE: number;
    trailingEps: number;
    priceToBook: number;
    priceToSalesTrailing12Months: number;
  };
}

const StatisticsTable: React.FC<StatisticsTableProps> = ({ info }) => {
  if (!info) return null;

  return (
    <div className="m-6 ml-10">
      <h3 className="text-xl font-semibold mb-4">Main Statistics</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-center">Metric</th>
            <th className="border p-2 text-center">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-center">PE Ratio (TTM)</td>
            <td className="border p-2 text-center">{info.trailingPE.toFixed(4)}</td>
          </tr>
          <tr className="hover:bg-gray-50 text-center">
            <td className="border p-2 font-medium text-center">EPS (TTM)</td>
            <td className="border p-2 text-center">{info.trailingEps.toFixed(4)}</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-center">Price/Sales (TTM)</td>
            <td className="border p-2 text-center">{info.priceToSalesTrailing12Months.toFixed(4)}</td>
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-center">Price/Book (MRQ)</td>
            <td className="border p-2 text-center">{info.priceToBook.toFixed(4)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StatisticsTable;