import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/symbols`);
    const symbols = await response.json();
    console.log("response", response);
    return new NextResponse(JSON.stringify(symbols), { status: 200 });
  } catch (e) {
    console.log("[CODE_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ticker } = body;
    // Validate input
    if (!ticker) {
      return new NextResponse(JSON.stringify({ error: "Ticker is required" }), {
        status: 400,
      });
    }

    // Set proper headers
    const response = await fetch(`${process.env.BACKEND_URL}/symbols`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: ticker,
      }),
    });
    const symbol = await response.json();
    console.log(symbol);
    return new NextResponse(JSON.stringify(symbol), { status: 200 });
  } catch (e) {
    console.log("[CODE_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
