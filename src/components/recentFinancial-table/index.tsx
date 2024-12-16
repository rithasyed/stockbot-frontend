import React from 'react';
import { ScrollArea } from '../ui/scroll-area';

interface RecentFinancialTableProps {
  financials: {
    [key: string]: {
      [key: string]: any;
    };
  };
}

const RecentFinancialTable: React.FC<RecentFinancialTableProps> = ({ financials }) => {
  if (!financials) return null;

  const columnKeys = Object.keys(financials).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const formatValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    } else {
      return value ?? 'None';
    }
  };

  return (
    <div className="m-6 ml-10 ">
      <h3 className="text-xl font-semibold mb-4">Recent Financials</h3>
      <ScrollArea style={{ height: '500px' }}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left"></th>
            {columnKeys.map((key, index) => (
              <th key={index} className="border p-2 text-center">
                {new Date(key).toLocaleDateString()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Tax Effect Of Unusual Items</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Tax Effect Of Unusual Items'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Tax Rate For Calcs</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Tax Rate For Calcs'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Normalized EBITDA</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Normalized EBITDA'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Income From Continuing</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Income From Continuing Operation Net Minority Interest'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Reconciled Depreciation</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Reconciled Depreciation'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Reconciled Cost Of Revenue</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Reconciled Cost Of Revenue'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">EBITDA</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['EBITDA'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">EBIT</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['EBIT'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Interest Income</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Interest Income'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Interest Expense</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Interest Expense'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Interest Income</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Interest Income'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Normalized Income</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Normalized Income'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Income From Continuing</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Income From Continuing And Discontinued Operation'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Total Expenses</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Total Expenses'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Total Operating Income As Re</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Total Operating Income As Reported'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Diluted Average Shares</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Diluted Average Shares'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Basic Average Shares</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Basic Average Shares'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Diluted EPS</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Diluted EPS'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Basic EPS</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Basic EPS'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Diluted NI Availto Com Stockholders</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Diluted NI Availto Com Stockholders'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Income Common Stockholders</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Income Common Stockholders'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Income</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Income'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Income Including Noncontrolling Interests</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Income Including Noncontrolling Interests'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Income Continuous Operations</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Income Continuous Operations'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Tax Provision</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Tax Provision'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Pretax Income</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Pretax Income'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Other Income Expense</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Other Income Expense'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Other Non Operating Income Expenses</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Other Non Operating Income Expenses'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Net Non Operating Interest Income Expense</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Net Non Operating Interest Income Expense'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Interest Expense Non Operating</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Interest Expense Non Operating'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Interest Income Non Operating</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Interest Income Non Operating'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Operating Income</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Operating Income'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Operating Expense</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Operating Expense'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Research And Development</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Research And Development'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Selling General And Administration</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Selling General And Administration'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Gross Profit</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Gross Profit'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Cost Of Revenue</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Cost Of Revenue'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Total Revenue</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Total Revenue'])}
              </td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="border p-2 font-medium text-left">Operating Revenue</td>
            {columnKeys.map((key, index) => (
              <td key={index} className="border p-2 text-right">
                {formatValue(financials[key]?.['Operating Revenue'])}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      </ScrollArea>
    </div>
  );
};

export default RecentFinancialTable;