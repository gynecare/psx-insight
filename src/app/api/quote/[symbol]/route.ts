import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  try {
    // Try a free public endpoint (may work for some symbols)
    const url = `https://api.polygon.io/v2/aggs/ticker/${upperSymbol}/prev?adjusted=true&apiKey=DEMO`;

    // Note: Polygon DEMO key has limitations.
    // For real production we will need better free sources later.

    // For now, return a clear structured response so the frontend can handle it
    return NextResponse.json({
      symbol: upperSymbol,
      price: null,
      change: null,
      changePercent: null,
      currency: "PKR",
      message: "Real-time free data source is limited. We will improve this step by step.",
      status: "sample_fallback",
    });
  } catch (error) {
    return NextResponse.json(
      {
        symbol: upperSymbol,
        error: "Failed to fetch real data",
        status: "error",
      },
      { status: 500 }
    );
  }
}