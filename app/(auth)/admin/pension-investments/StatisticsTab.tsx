"use client";

import { useInvestmentStatistics } from "@/lib/hooks/admin/usePensionInvestments";
import { TrendingUp, DollarSign, PieChart, BarChart3, AlertCircle } from "lucide-react";

export default function StatisticsTab() {
  const { data: stats, isLoading } = useInvestmentStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#068847] border-t-transparent"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-[#D1D5DC] mx-auto mb-3" />
        <p className="text-[#6A7282] font-medium">No statistics available</p>
      </div>
    );
  }

  const getSectorColor = (sector: string) => {
    const colors = {
      productive: "from-blue-500 to-blue-600",
      service: "from-green-500 to-green-600",
      income_project: "from-purple-500 to-purple-600",
      reserve: "from-gray-500 to-gray-600",
    };
    return colors[sector as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "from-green-500 to-green-600",
      matured: "from-blue-500 to-blue-600",
      closed: "from-gray-500 to-gray-600",
      underperforming: "from-yellow-500 to-yellow-600",
      defaulted: "from-red-500 to-red-600",
    };
    return colors[status as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  const getRiskColor = (risk: string) => {
    const colors = {
      low: "from-green-500 to-green-600",
      medium: "from-yellow-500 to-yellow-600",
      high: "from-red-500 to-red-600",
    };
    return colors[risk as keyof typeof colors] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Investments</p>
          <p className="text-3xl font-bold">{stats.total_investments}</p>
          <p className="text-xs opacity-75 mt-2">
            {stats.active_investments} active, {stats.mature_investments} matured
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Total Invested</p>
          <p className="text-3xl font-bold">
            ৳{(parseFloat(stats.total_invested) / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs opacity-75 mt-2">
            Across {stats.by_sector.length} sectors
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Current Value</p>
          <p className="text-3xl font-bold">
            ৳{(parseFloat(stats.current_value) / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs opacity-75 mt-2">
            +৳{(parseFloat(stats.total_profit) / 1000000).toFixed(2)}M profit
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-medium opacity-90 mb-1">Average ROI</p>
          <p className="text-3xl font-bold">
            {parseFloat(stats.average_roi).toFixed(2)}%
          </p>
          <p className="text-xs opacity-75 mt-2">
            Across all investments
          </p>
        </div>
      </div>

      {/* By Sector */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="w-5 h-5 text-[#068847]" />
          <h3 className="text-lg font-semibold text-[#030712]">Investments by Sector</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.by_sector.map((sector) => (
            <div
              key={sector.sector}
              className="bg-[#F9FAFB] rounded-lg p-4 border border-[#E5E7EB]"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium text-[#030712] capitalize">
                    {sector.sector.replace("_", " ")}
                  </p>
                  <p className="text-xs text-[#6A7282] mt-0.5">
                    {sector.count} investment{sector.count !== 1 ? "s" : ""}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${getSectorColor(
                    sector.sector
                  )} flex items-center justify-center text-white font-bold`}
                >
                  {sector.count}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6A7282]">Total Invested:</span>
                  <span className="font-medium text-[#030712]">
                    ৳{(parseFloat(sector.total_invested) / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#6A7282]">Total Profit:</span>
                  <span className="font-medium text-green-600">
                    ৳{(parseFloat(sector.total_profit) / 1000000).toFixed(2)}M
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* By Status and Risk Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#068847]" />
            <h3 className="text-lg font-semibold text-[#030712]">By Status</h3>
          </div>
          <div className="space-y-3">
            {stats.by_status.map((status) => (
              <div
                key={status.status}
                className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getStatusColor(
                      status.status
                    )} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {status.count}
                  </div>
                  <span className="text-sm font-medium text-[#030712] capitalize">
                    {status.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6A7282]">
                    {((status.count / stats.total_investments) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Risk Level */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-[#068847]" />
            <h3 className="text-lg font-semibold text-[#030712]">By Risk Level</h3>
          </div>
          <div className="space-y-3">
            {stats.by_risk_level.map((risk) => (
              <div
                key={risk.risk_level}
                className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getRiskColor(
                      risk.risk_level
                    )} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {risk.count}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#030712] capitalize">
                      {risk.risk_level} Risk
                    </p>
                    <p className="text-xs text-[#6A7282]">
                      ৳{(parseFloat(risk.total_invested) / 1000000).toFixed(2)}M invested
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6A7282]">
                    {((risk.count / stats.total_investments) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Allocation Guide */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="w-5 h-5 text-[#068847]" />
          <h3 className="text-lg font-semibold text-[#030712]">
            Recommended Sector Allocation
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-[#E5E7EB]">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
              40%
            </div>
            <p className="text-sm font-medium text-[#030712]">Productive</p>
            <p className="text-xs text-[#6A7282] mt-1">Manufacturing, Agriculture</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-[#E5E7EB]">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-xl">
              35%
            </div>
            <p className="text-sm font-medium text-[#030712]">Service</p>
            <p className="text-xs text-[#6A7282] mt-1">Healthcare, Education</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-[#E5E7EB]">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
              20%
            </div>
            <p className="text-sm font-medium text-[#030712]">Income Project</p>
            <p className="text-xs text-[#6A7282] mt-1">Real Estate, Trading</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-[#E5E7EB]">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white font-bold text-xl">
              5%
            </div>
            <p className="text-sm font-medium text-[#030712]">Reserve</p>
            <p className="text-xs text-[#6A7282] mt-1">Reserve Fund</p>
          </div>
        </div>
      </div>
    </div>
  );
}
