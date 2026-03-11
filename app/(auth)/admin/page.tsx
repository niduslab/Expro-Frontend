"use client";

import React from "react";
import {
  Users,
  FolderKanban,
  TrendingUp,
  Wallet,
  ArrowUpRight,
} from "lucide-react";
import RecentActivity from "./recentActivity";
import CommissionOverview from "./commission/page";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's what's happening at Expro Welfare Foundation
          today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Members */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">1,847</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">12%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Projects
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">06</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <FolderKanban className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">2 new</span>
            <span className="text-gray-400 ml-1">this quarter</span>
          </div>
        </div>

        {/* Total Collections */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Collections
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">৳24.5L</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">8.2%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Wallet Balance
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                ৳8,42,000
              </h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <Wallet className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500 font-medium">৳ 1.2L pending</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Collection Trend
              </h3>
              <p className="text-sm text-gray-500">
                Monthly pension & membership collections
              </p>
            </div>
            <select className="text-sm border-gray-200 rounded-md text-gray-500 focus:ring-green-500 focus:border-green-500">
              <option>Last 7 months</option>
              <option>Last year</option>
            </select>
          </div>

          {/* Mock Line Chart */}
          <div className="h-64 w-full relative">
            <div className="absolute inset-0 flex items-end justify-between px-2">
              {[30, 45, 40, 60, 75, 70, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-full flex flex-col items-center gap-2 group"
                >
                  <div className="relative w-full h-full flex items-end justify-center">
                    {/* Tooltip placeholder */}
                    <div className="hidden group-hover:block absolute bottom-full mb-2 bg-gray-900 text-white text-xs py-1 px-2 rounded">
                      ৳{h}k
                    </div>
                    {/* Point */}
                    <div
                      className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm z-10"
                      style={{ marginBottom: `${h}%` }}
                    />
                    {/* Line segment (simplified visualization) */}
                    <div
                      className="absolute bottom-0 w-full bg-green-50 opacity-20 rounded-t-sm"
                      style={{ height: `${h}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"][i]}
                  </span>
                </div>
              ))}
            </div>
            {/* SVG Line for better look */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="none"
            >
              <path
                d="M20 200 C 50 180, 100 170, 150 175 C 200 180, 250 140, 300 120 C 350 100, 400 90, 450 95 C 500 100, 550 70, 600 50"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <defs>
                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M20 200 C 50 180, 100 170, 150 175 C 200 180, 250 140, 300 120 C 350 100, 400 90, 450 95 C 500 100, 550 70, 600 50 L 600 250 L 20 250 Z"
                fill="url(#gradient)"
                stroke="none"
              />
            </svg>

            {/* Y-axis labels mock */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-300 -ml-6 pointer-events-none">
              <span>60k</span>
              <span>45k</span>
              <span>30k</span>
              <span>15k</span>
              <span>0k</span>
            </div>
          </div>
        </div>

        {/* Package Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              Package Distribution
            </h3>
            <p className="text-sm text-gray-500">Members by pension package</p>
          </div>

          <div className="flex flex-col items-center justify-center h-64">
            {/* Mock Donut Chart */}
            <div className="relative w-48 h-48">
              <svg
                viewBox="0 0 36 36"
                className="w-full h-full transform -rotate-90"
              >
                {/* Ring 1 */}
                <path
                  className="text-green-600"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="40, 100"
                />
                {/* Ring 2 */}
                <path
                  className="text-blue-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="20, 100"
                  strokeDashoffset="-40"
                />
                {/* Ring 3 */}
                <path
                  className="text-yellow-400"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="25, 100"
                  strokeDashoffset="-60"
                />
                {/* Ring 4 */}
                <path
                  className="text-emerald-500"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-85"
                />
              </svg>
              {/* Center hole is transparent (donut) */}
            </div>

            {/* Legend */}
            <div className="w-full mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-gray-600">৳300/mo</span>
                </div>
                <span className="font-medium">320</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  <span className="text-gray-600">৳700/mo</span>
                </div>
                <span className="font-medium">480</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  <span className="text-gray-600">৳1000/mo</span>
                </div>
                <span className="font-medium">290</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-gray-600">৳1500/mo</span>
                </div>
                <span className="font-medium">150</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CommissionOverview />

      <RecentActivity />
    </div>
  );
}
