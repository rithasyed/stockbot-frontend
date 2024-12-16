"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrades } from "@/store/tradeStore";
import { useSymbols } from "@/store/symbolStore";
import BackTesting from "@/components/back-testing";
import PaperTrading from "@/components/paper-trade";
import { Loader } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/header";
export default function Performance() {
  const {
    data: trades,
    execute: fetchTradeslist,
    loading,
  } = useTrades((state) => state);
  const {
    data: symbols,
    execute: fetchWatchlist,
    loading: symbolLoading,
  } = useSymbols((state) => state);
  React.useEffect(() => {
    if (symbols.length === 0) {
      fetchWatchlist();
    }
    if (trades.length === 0) {
      fetchTradeslist();
    }
  }, []);
  return (
    <>
    <Header isHeader={true}  onSubmit={() => {}}/>
    <div className="w-full h-full p-4">
        {(loading || symbolLoading) && <Loader />}
        <Tabs defaultValue="BT">
          <div className="flex flex-row justify-between items-center">
            <TabsList className="grid w-1/4 grid-cols-2 ">
              <TabsTrigger value="BT" className="">
                Back Testing
              </TabsTrigger>
              <TabsTrigger value="PT">Paper Trading</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="BT">
            <BackTesting isBigScreen={true} />
          </TabsContent>
          <TabsContent value="PT">
            <PaperTrading />
          </TabsContent>
        </Tabs>
      </div></>
  );
}
