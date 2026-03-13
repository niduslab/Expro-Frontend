"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type DataType = {
  month: string;
  value: number;
};

const data: DataType[] = [
  { month: "Jul", value: 28000 },
  { month: "Aug", value: 31000 },
  { month: "Sep", value: 29000 },
  { month: "Oct", value: 38000 },
  { month: "Nov", value: 42000 },
  { month: "Dec", value: 40000 },
  { month: "Jan", value: 47000 },
];

export default function ChartSection() {
  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Collection Trend
          </h2>
          <p className="text-sm text-gray-500">
            Monthly pension & membership collections
          </p>
        </div>

        <select className="text-sm bg-gray-100 rounded-full px-4 py-2 text-gray-600 outline-none">
          <option>Last 7 months</option>
          <option>Last 12 months</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: 260, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            {/* Gradient */}
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid */}
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={true}
              stroke="#E5E7EB"
            />

            {/* X Axis */}
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y Axis */}
            <YAxis
              tickFormatter={(v) => `${v / 1000}k`}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Tooltip */}
            <Tooltip
              formatter={(value) => {
                const num = Number(value ?? 0);
                return [`${num.toLocaleString()}`, "Collection"];
              }}
              labelStyle={{ color: "#111827" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={3}
              fill="url(#trendFill)"
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
