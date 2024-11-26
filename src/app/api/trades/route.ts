import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/trades`);
    console.log("response", response);
    const symbols = await response.json();
    return new NextResponse(JSON.stringify(symbols), { status: 200 });
  } catch (e) {
    console.log("[CODE_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
