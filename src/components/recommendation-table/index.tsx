import React from 'react';
import { RecommendationsTableProps } from './types';

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({ recommendations }) => {
  if (!recommendations) return null;

  const periods = Object.values(recommendations.period);
  
  return (
    <div className="m-6 ml-10">
      <h3 className="text-xl font-semibold mb-4">Analyst Recommendations</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-center">Period</th>
            <th className="border p-2 text-center">Strong Buy</th>
            <th className="border p-2 text-center">Buy</th>
            <th className="border p-2 text-center">Hold</th>
            <th className="border p-2 text-center">Sell</th>
            <th className="border p-2 text-center">Strong Sell</th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period, index) => (
            <tr key={period} className="hover:bg-gray-50">
              <td className="border p-2 font-medium text-center ">{period}</td>
              <td className="border p-2 text-center text-green-700 font-semibold">
                {recommendations.strongBuy[index]}
              </td>
              <td className="border p-2 text-center text-green-500">
                {recommendations.buy[index]}
              </td>
              <td className="border p-2 text-center text-gray-500">
                {recommendations.hold[index]}
              </td>
              <td className="border p-2 text-center text-red-500">
                {recommendations.sell[index]}
              </td>
              <td className="border p-2 text-center text-red-700 font-semibold">
                {recommendations.strongSell[index]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecommendationsTable;