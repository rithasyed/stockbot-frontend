import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticker, timeframe, quantity, indicator } = body;
    const response = await fetch(`${process.env.BACKEND_URL}/back-test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        stockname: ticker,
        interval: timeframe,
        quantity: quantity,
        indicator: indicator,
      }),
    });
    const result = await response.json();
    return NextResponse.json(result);
  } catch (e) {
    console.log("[CODE_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
