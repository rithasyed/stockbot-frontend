// app/api/stock-data/route.ts
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { ticker: string } }
) {
  try {
    // Extract ticker from query parameters
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
      return new NextResponse("Ticker is required", { status: 400 });
    }

    // Ensure the ticker is uppercase
    const formattedTicker = ticker.toUpperCase();

    // Fetch stock data from your backend
    const response = await fetch(
      `${process.env.BACKEND_URL}/stock-data/${formattedTicker}`
    );

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const stockData = await response.json();
    return NextResponse.json(stockData);
  } catch (e) {
    console.error("[STOCK_DATA_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}