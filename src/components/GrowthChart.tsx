"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const chartData = [
  { year: "2020", revenue: 120, eps: 18 },
  { year: "2021", revenue: 145, eps: 22 },
  { year: "2022", revenue: 180, eps: 28 },
  { year: "2023", revenue: 210, eps: 35 },
  { year: "2024", revenue: 255, eps: 42 },
];

export default function GrowthChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="year" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#0d9488"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="eps"
            name="EPS"
            stroke="#3b82f6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}