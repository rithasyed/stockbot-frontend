"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { PaperTrade } from "./types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PaperTrading: React.FC<{ trades: PaperTrade[] }> = ({ trades }) => {
  const [shortTrades, setShortTrades] = useState<PaperTrade[]>([])
  const [longTrades, setLongTrades] = useState<PaperTrade[]>([])
  const [longPNL, setLongPNL] = useState<number>(0)
  const [shortPNL, setShortPNL] = useState<number>(0)

  useEffect(() => {
    processTrade(trades)
  }, [trades])

  const calculateTotalPnl = (trades: PaperTrade[]): number => {
    return trades.reduce((total, trade) => {
      if (trade.pnl !== "--") {
        return total + parseFloat(trade.pnl)
      }
      return total
    }, 0)
  }

  const processTrade = (trade: PaperTrade[]) => {
    if (!trade) {
      return
    }
    const filteredTrades = trade.filter((trade) => !trade.back_testing)
    const shortTrades = filteredTrades.filter((trade) => trade.tradetype === "short")
    const longTrades = filteredTrades.filter((trade) => trade.tradetype === "long")

    setShortTrades(shortTrades)
    setLongTrades(longTrades)
    setLongPNL(calculateTotalPnl(longTrades))
    setShortPNL(calculateTotalPnl(shortTrades))
  }

  const renderTradeTable = (trades: PaperTrade[], title: string, pnl: number) => (
    <Card className="w-full ">
      <CardHeader className="py-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{title}</span>
          <span className={`text-sm ${pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
            P&L: ${pnl.toFixed(2)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="max-h-96 overflow-auto scrollbar-hide">
          <DataTable columns={columns} data={trades} />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="paper-trading px-2">
      <h3 className="font-bold text-xl mb-2 text-center py-2">Paper Trading</h3>
      <Tabs defaultValue="long">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="long">Long Trades</TabsTrigger>
          <TabsTrigger value="short">Short Trades</TabsTrigger>
        </TabsList>
        <TabsContent value="long">
          {renderTradeTable(longTrades, "Long Trades", longPNL)}
        </TabsContent>
        <TabsContent value="short">
          {renderTradeTable(shortTrades, "Short Trades", shortPNL)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PaperTrading

