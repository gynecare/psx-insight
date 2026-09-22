"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const popularCompanies = [
    { symbol: "EFERT", name: "Engro Fertilizers" },
    { symbol: "ENGROH", name: "Engro Holdings" },
    { symbol: "FFC", name: "Fauji Fertilizer" },
    { symbol: "LUCK", name: "Lucky Cement" },
    { symbol: "HBL", name: "Habib Bank" },
    { symbol: "UBL", name: "United Bank" },
    { symbol: "MCB", name: "MCB Bank" },
    { symbol: "MEBL", name: "Meezan Bank" },
    { symbol: "OGDC", name: "Oil & Gas Development" },
    { symbol: "PPL", name: "Pakistan Petroleum" },
    { symbol: "MARI", name: "Mari Energies" },
    { symbol: "HUBC", name: "Hub Power" },
    { symbol: "SYS", name: "Systems Limited" },
    { symbol: "PSO", name: "Pakistan State Oil" },
  ];

  const handleSearch = () => {
    if (search.trim() === "") return;
    router.push(`/company/${search.trim().toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              P
            </div>
            <h1 className="text-xl font-bold text-slate-800">PSX Insight</h1>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="/" className="text-teal-600">Home</a>
            <a href="#" className="hover:text-teal-600">Watchlist</a>
            <a href="#" className="hover:text-teal-600">Sectors</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3">
            Analyze. Track. Invest.
          </h2>
          <p className="text-slate-600 text-lg">
            Simple fundamental analysis for KSE-100 companies
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-14">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter symbol (e.g. EFERT, FFC, OGDC)"
              className="flex-1 px-5 py-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm text-slate-800"
            />
            <button
              onClick={handleSearch}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3.5 rounded-xl font-medium transition"
            >
              Analyze
            </button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-slate-800">
              Popular KSE-100 Companies
            </h3>
            <span className="text-xs text-slate-400">Real EOD Price Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularCompanies.map((company) => (
              <a
                key={company.symbol}
                href={`/company/${company.symbol}`}
                className="bg-white p-5 rounded-xl border border-slate-100 hover:border-teal-300 hover:shadow-md transition block"
              >
                <div className="font-bold text-lg text-teal-700">
                  {company.symbol}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {company.name}
                </div>
              </a>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-16 border-t bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-slate-400">
          PSX Insight — Educational tool for Pakistani investors • Free
        </div>
      </footer>
    </div>
  );
}