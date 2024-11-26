import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticker, timeframe, emaPeriod, vwapPeriod, vwapStdDev } = body;
    const response = await fetch(
      `${process.env.BACKEND_URL}/data/${ticker}/${timeframe}/${emaPeriod}/${vwapPeriod}/${vwapStdDev}`
    );
    const candleSticks = await response.json();
    return NextResponse.json(candleSticks);
  } catch (e) {
    console.log("[CODE_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
