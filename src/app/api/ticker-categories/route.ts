import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/ticker-categories`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const categories = await response.json();
    return NextResponse.json(categories);
  } catch (e) {
    console.error("[CATEGORIES_ERROR]", e);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
