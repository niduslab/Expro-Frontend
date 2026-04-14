"use client";

import { useState } from "react";
import { Search, Filter, Eye, Edit, Trash2, TrendingUp, DollarSign } from "lucide-react";
import { usePensionInvestments, useDeleteInvestment } from "@/lib/hooks/admin/usePensionInvestments";
import { toast } from "sonner";
import InvestmentModal from "./InvestmentModal";
import InvestmentDetailsModal from "./InvestmentDetailsModal";
import type { InvestmentSector, InvestmentStatus, RiskLevel } from "@/lib/hooks/admin/usePensionInvestments";

export default function InvestmentsTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState<InvestmentSector | "">("");
  const [status, setStatus] = useState<InvestmentStatus | "">("");
  const [riskLevel, setRiskLevel] = useState<RiskLevel | "">("");
  const [showFilters, setShowFilters] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<any>(null);
  const [viewingInvestment, setViewingInvestment] = useState<any>(null);

  const { data, isLoading } = usePensionInvestments({
    page,
    per_page: 10,
    search: search || undefined,
    sector: sector || undefined,
    status: status || undefined,
    risk_level: riskLevel || undefined,
  });

  // Debug: Log the data structure
  console.log('Investments data:', data);

  const { mutate: deleteInvestment } = useDeleteInvestment();

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      toast.loading("Deleting investment...", { id: "delete-investment" });
      deleteInvestment(id, {
        onSuccess: (res) => {
          toast.success(res.message || "Investment deleted successfully!", {
            id: "delete-investment",
          });
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to delete investment",
            { id: "delete-investment" }
          );
        },
      });
    }
  };

  const getSectorBadgeColor = (sector: string) => {
    const colors = {
      productive: "bg-blue-100 text-blue-700",
      service: "bg-green-100 text-green-700",
      income_project: "bg-purple-100 text-purple-700",
      reserve: "bg-gray-100 text-gray-700",
    };
    return colors[sector as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-700",
      matured: "bg-blue-100 text-blue-700",
      closed: "bg-gray-100 text-gray-700",
      underperforming: "bg-yellow-100 text-yellow-700",
      defaulted: "bg-red-100 text-red-700",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getRiskBadgeColor = (risk: string) => {
    const colors = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };
    return colors[risk as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A7282]" />
            <input
              type="text"
              placeholder="Search by name, code, or sub-sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#E5E7EB]">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Sector
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as InvestmentSector | "")}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] bg-white"
              >
                <option value="">All Sectors</option>
                <option value="productive">Productive (40%)</option>
                <option value="service">Service (35%)</option>
                <option value="income_project">Income Project (20%)</option>
                <option value="reserve">Reserve (5%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvestmentStatus | "")}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] bg-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="matured">Matured</option>
                <option value="closed">Closed</option>
                <option value="underperforming">Underperforming</option>
                <option value="defaulted">Defaulted</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Risk Level
              </label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value as RiskLevel | "")}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] bg-white"
              >
                <option value="">All Risk Levels</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Investments Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#068847] border-t-transparent"></div>
          </div>
        ) : !data?.data || !Array.isArray(data.data) || data.data.length === 0 ? (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 text-[#D1D5DC] mx-auto mb-3" />
            <p className="text-[#6A7282] font-medium">No investments found</p>
            <p className="text-sm text-[#9CA3AF] mt-1">
              Create your first investment to get started
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      Investment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      Sector
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      Current Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      ROI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {data.data.map((investment) => (
                    <tr key={investment.id} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#030712]">
                            {investment.investment_name}
                          </p>
                          <p className="text-xs text-[#6A7282] mt-0.5">
                            {investment.investment_code}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSectorBadgeColor(
                            investment.sector
                          )}`}
                        >
                          {investment.sector.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-[#030712]">
                          ৳{parseFloat(investment.amount_invested).toLocaleString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#030712]">
                            ৳{parseFloat(investment.current_value).toLocaleString()}
                          </p>
                          <p className="text-xs text-green-600 mt-0.5">
                            +৳{parseFloat(investment.profit_generated).toLocaleString()}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-[#068847]" />
                          <span className="text-sm font-medium text-[#068847]">
                            {parseFloat(investment.roi_percentage).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                            investment.status
                          )}`}
                        >
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(
                            investment.risk_level
                          )}`}
                        >
                          {investment.risk_level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewingInvestment(investment)}
                            className="p-2 text-[#6A7282] hover:text-[#068847] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingInvestment(investment)}
                            className="p-2 text-[#6A7282] hover:text-[#068847] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(investment.id, investment.investment_name)}
                            className="p-2 text-[#6A7282] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.last_page && data.last_page > 1 && (
              <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <p className="text-sm text-[#6A7282]">
                  Showing {data.data.length} of {data.total} investments
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#6A7282] hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === data.last_page}
                    className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#6A7282] hover:bg-[#F3F4F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {editingInvestment && (
        <InvestmentModal
          setOpenModal={(open) => !open && setEditingInvestment(null)}
          investmentToEdit={editingInvestment}
        />
      )}

      {viewingInvestment && (
        <InvestmentDetailsModal
          investment={viewingInvestment}
          setOpenModal={(open) => !open && setViewingInvestment(null)}
        />
      )}
    </div>
  );
}
