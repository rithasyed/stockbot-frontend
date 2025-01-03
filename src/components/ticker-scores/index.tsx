import { columns, SecondTable, FirstTable, ThirdTable, FourthTable, FifthTable } from "./columns";
import { IndexScore } from "./types";
import { MultiTableDataManager } from "./multiFilter";
import { Button } from "../ui/button";
import { RefreshCw, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import AddTickerDialog from "../add-ticker-popup";

interface TickerScoresProps {
  scores: IndexScore[];
  onRefresh: () => Promise<void>;
  isLoading: boolean;
  onAdd: () => Promise<void>;
}

const TickerScores: React.FC<TickerScoresProps> = ({ scores, onRefresh, isLoading, onAdd }) => {
  const [lastRefreshTime, setLastRefreshTime] = useState<string>("");

  useEffect(() => {
    const storedTime = localStorage.getItem("lastRefreshTime");
    if (storedTime) {
      setLastRefreshTime(storedTime);
    }
  }, []);

  const handleRefresh = async () => {
    await onRefresh();
    const currentTime = new Date().toLocaleString();
    setLastRefreshTime(currentTime);
    localStorage.setItem("lastRefreshTime", currentTime);
  };

  const sortByLongScore = (data: IndexScore[]) => {
    return [...data].sort((a, b) => (b.long_score as number) - (a.long_score as number));
  };
  
  const firstTablefilteredScores = sortByLongScore(FirstTable(scores));
  const secondTablefilteredScores = sortByLongScore(SecondTable(scores));
  const thirdTablefilteredScores = sortByLongScore(ThirdTable(scores));
  const fourthTablefilteredScores = sortByLongScore(FourthTable(scores));
  const fifthTablefilteredScores = sortByLongScore(FifthTable(scores));
  
  const { renderControls, DataTable } = MultiTableDataManager();

  const [openSections, setOpenSections] = useState({
    stocks: true,   
    indexes: false,
    futures: false,
    sectors: false,
    crypto: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="pt-10 px-4">
        <div className="font-bold text-2xl mb-6">Screening</div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {renderControls()}
            <AddTickerDialog onAdd={onAdd} />
          </div>
          <div className="flex items-center gap-4">
            {lastRefreshTime && (
              <span className="text-sm text-gray-600">
                Last refreshed: {lastRefreshTime}
              </span>
            )}
            <Button 
              onClick={handleRefresh} 
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <div className="px-4 space-y-6 pb-10">
          {/* Stocks Table */}
          <Collapsible open={openSections.stocks} onOpenChange={() => toggleSection('stocks')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span className="font-semibold text-xl">Stocks</span>
                <ChevronDown className={`h-6 w-6 transform transition-transform ${openSections.stocks ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 overflow-x-auto">
              <div className="min-w-full">
                {firstTablefilteredScores.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={firstTablefilteredScores}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No stocks data available
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Indexes Table */}
          <Collapsible open={openSections.indexes} onOpenChange={() => toggleSection('indexes')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span className="font-semibold text-xl">Indexes</span>
                <ChevronDown className={`h-6 w-6 transform transition-transform ${openSections.indexes ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 overflow-x-auto">
              <div className="min-w-full">
                {secondTablefilteredScores.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={secondTablefilteredScores}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No indexes data available
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Futures Table */}
          <Collapsible open={openSections.futures} onOpenChange={() => toggleSection('futures')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span className="font-semibold text-xl">Futures</span>
                <ChevronDown className={`h-6 w-6 transform transition-transform ${openSections.futures ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 overflow-x-auto">
              <div className="min-w-full">
                {thirdTablefilteredScores.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={thirdTablefilteredScores}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No futures data available
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Sectors Table */}
          <Collapsible open={openSections.sectors} onOpenChange={() => toggleSection('sectors')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span className="font-semibold text-xl">Sectors</span>
                <ChevronDown className={`h-6 w-6 transform transition-transform ${openSections.sectors ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 overflow-x-auto">
              <div className="min-w-full">
                {fourthTablefilteredScores.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={fourthTablefilteredScores}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No sectors data available
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* crypto Table */}
          <Collapsible open={openSections.crypto} onOpenChange={() => toggleSection('crypto')}>
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <span className="font-semibold text-xl">Crypto</span>
                <ChevronDown className={`h-6 w-6 transform transition-transform ${openSections.crypto ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 overflow-x-auto">
              <div className="min-w-full">
                {fifthTablefilteredScores.length > 0 ? (
                  <DataTable 
                    columns={columns} 
                    data={fifthTablefilteredScores}
                  />
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No crypto data available
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
  );
};

export default TickerScores;