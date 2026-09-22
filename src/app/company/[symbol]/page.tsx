import { sampleCompanies } from "@/data/sampleCompanies";
import GrowthChart from "@/components/GrowthChart";

async function getRealData(symbol: string) {
  try {
    const quoteRes = await fetch(
      `https://psxdata-api.fastapicloud.dev/stocks/${symbol}/quote`,
      { next: { revalidate: 3600 } }
    );

    let quoteData = null;
    if (quoteRes.ok) {
      const json = await quoteRes.json();
      quoteData = json?.data || null;
    }

    return { quote: quoteData };
  } catch (error) {
    return { quote: null };
  }
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const upperSymbol = symbol.toUpperCase();

  const sample = sampleCompanies[upperSymbol];
  const real = await getRealData(upperSymbol);

  const hasSample = !!sample;

  const realPrice =
    real.quote?.price || real.quote?.ldcp || real.quote?.close || null;
  const realChange =
    real.quote?.change_percent || real.quote?.changePercent || null;

  const displayPrice = realPrice
    ? Number(realPrice).toFixed(2)
    : sample?.price || "—";

  const displayChange = realChange
    ? `${Number(realChange) > 0 ? "+" : ""}${Number(realChange).toFixed(2)}%`
    : sample?.change || "—";

  const isPositive = String(displayChange).startsWith("+");
  const isRealPrice = !!realPrice;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <span className="text-xl font-bold text-slate-800">PSX Insight</span>
          </a>
          <a href="/" className="text-sm text-slate-600 hover:text-teal-600">
            ← Back to Home
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {!hasSample ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              {upperSymbol}
            </h1>
            <p className="text-slate-500 mb-6">
              This company is not available in the current data set.
            </p>
            <a
              href="/"
              className="inline-block bg-teal-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-700"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold text-slate-800">
                      {upperSymbol}
                    </h1>
                    <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
                      {sample.sector}
                    </span>
                    {isRealPrice && (
                      <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                        Live EOD Price
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500">{sample.name}</p>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-3xl font-bold text-slate-800">
                    PKR {displayPrice}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      isPositive ? "text-green-600" : "text-slate-500"
                    }`}
                  >
                    {displayChange}
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {[
                { label: "P/E Ratio", value: sample.pe || "—" },
                { label: "EPS", value: sample.eps || "—" },
                { label: "ROE", value: sample.roe || "—" },
                { label: "Debt/Equity", value: sample.debtToEquity || "—" },
                { label: "Dividend Yield", value: sample.dividendYield || "—" },
                { label: "Score", value: sample.score ? `${sample.score} / 10` : "—" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white p-5 rounded-xl border border-slate-100"
                >
                  <div className="text-sm text-slate-500 mb-1">{item.label}</div>
                  <div
                    className={`text-xl font-bold ${
                      item.label === "Score" ? "text-teal-600" : "text-slate-800"
                    }`}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">
                Growth Trend (Sample)
              </h2>
              <GrowthChart />
              <p className="text-xs text-slate-400 mt-3">
                Chart is currently using sample data.
              </p>
            </div>

            {/* Verdict + Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                  Plain English Verdict
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {sample.score >= 8
                    ? `${upperSymbol} currently shows relatively strong metrics based on available data.`
                    : `${upperSymbol} has mixed fundamentals. Always verify the latest financial results from official sources before making any decision.`}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                  Data Status
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-green-500">●</span>
                    <span>
                      Closing Price: {isRealPrice ? "Real EOD" : "Not available"}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500">●</span>
                    <span>Fundamentals: Limited / Sample</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">●</span>
                    <span>Not financial advice</span>
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}