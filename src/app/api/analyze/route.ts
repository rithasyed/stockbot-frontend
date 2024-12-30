// app/api/analyze/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticker } = body;

    if (!ticker) {
      return new NextResponse("Ticker is required", { status: 400 });
    }

    const formattedTicker = ticker.toUpperCase();
    
    const response = await fetch(`${process.env.BACKEND_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticker: formattedTicker }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch analysis data');
    }

    const data = await response.json();
    
    // Ensure the response is properly stringified
    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (e) {
    console.error("[STOCK_ANALYSIS_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}