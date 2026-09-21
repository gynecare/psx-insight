import { sampleCompanies } from "@/data/sampleCompanies";
import GrowthChart from "@/components/GrowthChart";

async function getRealPrice(symbol: string) {
  try {
    const res = await fetch(
      `https://psxdata-api.fastapicloud.dev/stocks/${symbol}/quote`,
      {
        next: { revalidate: 3600 }, // cache for 1 hour
      }
    );

    if (!res.ok) return null;

    const json = await res.json();
    const data = json?.data;

    if (!data) return null;

    return {
      price: data.price || data.ldcp || data.close || null,
      change: data.change || null,
      changePercent: data.change_percent || data.changePercent || null,
    };
  } catch (error) {
    return null;
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
  const realPriceData = await getRealPrice(upperSymbol);

  const hasSample = !!sample;

  // Prefer real price if available, otherwise use sample
  const displayPrice = realPriceData?.price
    ? Number(realPriceData.price).toFixed(2)
    : sample?.price || "—";

  const displayChange = realPriceData?.changePercent
    ? `${Number(realPriceData.changePercent) > 0 ? "+" : ""}${Number(
        realPriceData.changePercent
      ).toFixed(2)}%`
    : sample?.change || "—";

  const isPositive = displayChange.toString().startsWith("+");

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
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{upperSymbol}</h1>
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
            {/* Company Header */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-bold text-slate-800">
                      {upperSymbol}
                    </h1>
                    <span className="text-xs bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full font-medium">
                      {sample.sector}
                    </span>
                    {realPriceData?.price && (
                      <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                        Live EOD
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
                { label: "P/E Ratio", value: sample.pe },
                { label: "EPS", value: sample.eps },
                { label: "ROE", value: sample.roe },
                { label: "Debt/Equity", value: sample.debtToEquity },
                { label: "Dividend Yield", value: sample.dividendYield },
                { label: "Score", value: `${sample.score} / 10` },
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
                Revenue & EPS Trend (Sample)
              </h2>
              <GrowthChart />
              <p className="text-xs text-slate-400 mt-3">
                * Chart is currently using sample data.
              </p>
            </div>

            {/* Verdict */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                  Plain English Verdict
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  {sample.score >= 8
                    ? `${upperSymbol} currently shows strong fundamentals with good profitability, reasonable valuation, and manageable debt.`
                    : `${upperSymbol} has decent fundamentals. Review latest results before investing.`}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6">
                <h2 className="text-lg font-semibold text-slate-800 mb-3">
                  Important Notes
                </h2>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-amber-500">▲</span>
                    <span>Price may be real EOD data. Fundamentals are still sample.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-amber-500">▲</span>
                    <span>Always verify from official PSX sources.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-red-500">▲</span>
                    <span>Not financial advice.</span>
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