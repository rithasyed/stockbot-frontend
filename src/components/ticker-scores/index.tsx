"use client";

import { columns, SecondTable, FirstTable, ThirdTable, FourthTable } from "./columns";
import { IndexScore } from "./types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MultiTableDataManager } from "./multiFilter";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";

interface TickerScoresProps {
  scores: IndexScore[];
  onRefresh: () => Promise<void>;
  isLoading: boolean;
}

const TickerScores: React.FC<TickerScoresProps> = ({ scores, onRefresh, isLoading }) => {
  const firstTablefilteredScores = FirstTable(scores);
  const secondTablefilteredScores = SecondTable(scores);
  const thirdTablefilteredScores = ThirdTable(scores);
  const fourthTablefilteredScores = FourthTable(scores);
  const { renderControls, DataTable } = MultiTableDataManager();

  return (
    <ScrollArea className="w-full h-[670px]">
      <div className="pt-10 space-y-6 pr-2 mr-2">
      <div className="font-bold text-2xl">Ticker Scores</div>
        <div className="flex items-center justify-between">
          {renderControls()}
          <Button 
            onClick={onRefresh} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {/* Stocks Table */}
        <div>
          <div className="font-bold text-2xl pb-2">Stocks</div>
          {firstTablefilteredScores.length > 0 ? (
            <DataTable columns={columns} data={firstTablefilteredScores} />
          ) : (
            <div className="text-center py-4 text-gray-500">
              No stocks data available
            </div>
          )}
        </div>

        {/* Indexes Table */}
        <div>
          <div className="font-bold text-2xl pb-2">Indexes</div>
          {secondTablefilteredScores.length > 0 ? (
            <DataTable columns={columns} data={secondTablefilteredScores} />
          ) : (
            <div className="text-center py-4 text-gray-500">
              No indexes data available
            </div>
          )}
        </div>

        {/* Futures Table */}
        <div>
          <div className="font-bold text-2xl pb-2">Futures</div>
          {thirdTablefilteredScores.length > 0 ? (
            <DataTable columns={columns} data={thirdTablefilteredScores} />
          ) : (
            <div className="text-center py-4 text-gray-500">
              No futures data available
            </div>
          )}
        </div>

        {/* Sectors Table */}
        <div>
          <div className="font-bold text-2xl pb-2">Sectors</div>
          {fourthTablefilteredScores.length > 0 ? (
            <DataTable columns={columns} data={fourthTablefilteredScores} />
          ) : (
            <div className="text-center py-4 text-gray-500">
              No sectors data available
            </div>
          )}
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default TickerScores;