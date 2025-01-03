
import { NextResponse } from "next/server";

interface AnalyzeRequestBody {
  ticker: string;
  categoryId: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as AnalyzeRequestBody;
    const { ticker, categoryId } = body;

    if (!ticker || !categoryId) {
      return NextResponse.json(
        { error: "Ticker and category are required" },
        { status: 400 }
      );
    }

    const formattedTicker = ticker.toUpperCase();
    
    // Construct URL with query parameter
    const url = new URL(`${process.env.BACKEND_URL}/single-ticker-score/${formattedTicker}`);
    url.searchParams.append('category_id', categoryId.toString());
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // No body needed as we're using query parameters
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || 'Failed to fetch analysis data' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("[STOCK_ANALYSIS_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}