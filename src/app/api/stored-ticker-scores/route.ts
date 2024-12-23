import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/stored-ticker-scores?${new Date().getTime()}`,
    {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    }
  );
    const scores = await response.json();
    return new NextResponse(JSON.stringify(scores), { status: 200 });
  } catch (e) {
    console.log("[CODE_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}