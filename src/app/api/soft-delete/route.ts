// app/api/soft-delete/route.ts
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    // Get ticker from the URL search params
    const { searchParams } = new URL(req.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
      return new NextResponse("Ticker symbol is required", { status: 400 });
    }

    const formattedTicker = ticker.toUpperCase();

    const response = await fetch(
      `${process.env.BACKEND_URL}/ticker-scores/${formattedTicker}/soft-delete`,
      {
        method: 'DELETE',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to delete ticker');
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (e) {
    console.error("[TICKER_DELETE_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}