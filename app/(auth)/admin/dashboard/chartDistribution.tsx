"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "৳300/mo", value: 320, color: "#166534" },
  { name: "৳700/mo", value: 480, color: "#2dd4bf" },
  { name: "৳1000/mo", value: 290, color: "#facc15" },
  { name: "৳1500/mo", value: 150, color: "#2563eb" },
];

export default function PackageDistribution() {
  return (
    <div className="w-full bg-white p-6 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Package Distribution
        </h2>
        <p className="text-sm text-gray-500">Members by pension package</p>
      </div>

      {/* Chart */}
      <div className="w-full" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              cornerRadius={8}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-col gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-gray-700 text-sm">{item.name}</span>
            </div>
            <span className="text-gray-900 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
