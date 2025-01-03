import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/ticker-scores?${new Date().getTime()}`,
    {
      method: "POST",
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