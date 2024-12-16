"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./datatable";
import { columns, SecondTable, FirstTable, ThirdTable, FourthTable } from "./columns";
import { IndexScore } from "./types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MultiTableDataManager } from "./multiFilter";

interface TickerScoresProps {
  scores: IndexScore[];
}

const TickerScores: React.FC<TickerScoresProps> = ({ scores }) => {
  const firstTablefilteredScores = FirstTable(scores);
  const secondTablefilteredScores = SecondTable(scores);
  const thirdTablefilteredScores = ThirdTable(scores);
  const fourthTablefilteredScores = FourthTable(scores);
  const { renderControls, DataTable } = MultiTableDataManager();

  return (
    <ScrollArea className="w-full h-[670px]">
      <div className="pt-10 space-y-6 pr-2">
        {renderControls()} 
        {firstTablefilteredScores.length > 0 ? (
          <div>
            <DataTable columns={columns} data={firstTablefilteredScores} />
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No ticker scores available
          </div>
        )}

        {secondTablefilteredScores.length > 0 && (
          <div>
            <DataTable columns={columns} data={secondTablefilteredScores} />
          </div>
        )}
        {thirdTablefilteredScores.length > 0 && (
          <div>
            <DataTable columns={columns} data={thirdTablefilteredScores} />
          </div>
        )}
        {fourthTablefilteredScores.length > 0 && (
          <div>
            <DataTable columns={columns} data={fourthTablefilteredScores} />
          </div>
        )}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default TickerScores;