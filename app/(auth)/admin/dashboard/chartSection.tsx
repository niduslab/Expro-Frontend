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
    <div className="w-full  bg-white rounded-xl border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[#131C20] font-semibold text-[20px] leading-[120%] tracking-[-1%] align-middle">
            Collection Trend
          </h2>
          <p className="text-[#73808C] font-normal text-[12px] leading-[160%] tracking-[-1%] align-middle">
            Monthly pension & membership collections
          </p>
        </div>

        <select className="text-[#030712] text-[12px] bg-[#F3F4F6] rounded-full leading-[150%] tracking-[-1%] px-1.5 py-3 font-medium outline-none">
          <option className="">Last 7 months</option>
          <option>Last 12 months</option>
        </select>
      </div>

      {/* Chart */}
      <div className="w-full h-[261px]">
        <ResponsiveContainer width="100%" height={261}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={true}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6B7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v / 1000}k`}
              tick={{ fill: "#6E7D91", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 60000]}
              tickCount={5}
              interval="preserveStartEnd"
            />
            <Tooltip
              formatter={(value) => [
                `${Number(value ?? 0).toLocaleString()}`,
                "Collection",
              ]}
              labelStyle={{ color: "#111827" }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
              }}
            />
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
