"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "৳300/mo", value: 320, color: "#206F5F" },
  { name: "৳700/mo", value: 480, color: "#34B299" },
  { name: "৳1000/mo", value: 290, color: "#F4B625" },
  { name: "৳1500/mo", value: 150, color: "#308CE8" },
];

export default function PackageDistribution() {
  return (
    <div
      className="w-full bg-white p-6 rounded-xl border border-[#E5E7EB]"
      style={{ height: 378 }}
    >
      {/* Header */}
      <div className="mb-1" style={{ flex: 0 }}>
        <h2 className="text-[#131C20] font-semibold text-[20px] leading-[120%] tracking-[-1%] align-middle">
          Package Distribution
        </h2>
        <p className="text-[#73808C] font-normal text-[12px] leading-[160%] tracking-[-1%] align-middle">
          Members by pension package
        </p>
      </div>

      {/* Chart */}
      <div className=" flex items-center w-full">
        {/* Chart */}
        <div className="w-full h-[200px]">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={4}
                cornerRadius={0}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div
        className="mt-2"
        style={{
          flex: 1,
          overflowY: "auto",
          height: "100px",
          paddingRight: "8px",
        }}
      >
        <div className="flex flex-col gap-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></span>
                <span className="text-[#73808C] font-normal  text-[12px] leading-[150%] tracking-[-0.01em]">
                  {item.name}
                </span>
              </div>
              <span className="text-[#131C20] font-normal  text-[12px] leading-[160%] tracking-[-0.01em]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
