"use client";

import { useState } from "react";
import { X, TrendingUp, DollarSign, Calendar, AlertCircle, CheckCircle, Users } from "lucide-react";
import {
  useUpdateValuation,
  useApproveInvestment,
  useDistributeProfits,
  useProcessDistributions,
} from "@/lib/hooks/admin/usePensionInvestments";
import { toast } from "sonner";

interface InvestmentDetailsModalProps {
  investment: any;
  setOpenModal: (open: boolean) => void;
}

export default function InvestmentDetailsModal({
  investment,
  setOpenModal,
}: InvestmentDetailsModalProps) {
  const [showValuationForm, setShowValuationForm] = useState(false);
  const [currentValue, setCurrentValue] = useState(investment.current_value);
  const [valuationNotes, setValuationNotes] = useState("");

  const { mutate: updateValuation, isPending: isUpdatingValuation } = useUpdateValuation();
  const { mutate: approveInvestment, isPending: isApproving } = useApproveInvestment();
  const { mutate: distributeProfits, isPending: isDistributing } = useDistributeProfits();
  const { mutate: processDistributions, isPending: isProcessing } = useProcessDistributions();

  const handleUpdateValuation = () => {
    if (!currentValue || parseFloat(currentValue) <= 0) {
      toast.error("Please enter a valid current value");
      return;
    }

    toast.loading("Updating valuation...", { id: "update-valuation" });
    updateValuation(
      {
        id: investment.id,
        current_value: parseFloat(currentValue),
        notes: valuationNotes || undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(res.message || "Valuation updated successfully!", {
            id: "update-valuation",
          });
          setShowValuationForm(false);
          setValuationNotes("");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to update valuation",
            { id: "update-valuation" }
          );
        },
      }
    );
  };

  const handleApprove = () => {
    if (confirm("Are you sure you want to approve this investment?")) {
      toast.loading("Approving investment...", { id: "approve-investment" });
      approveInvestment(investment.id, {
        onSuccess: (res) => {
          toast.success(res.message || "Investment approved successfully!", {
            id: "approve-investment",
          });
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to approve investment",
            { id: "approve-investment" }
          );
        },
      });
    }
  };

  const handleDistributeProfits = () => {
    if (parseFloat(investment.profit_generated) <= 0) {
      toast.error("No profit available to distribute");
      return;
    }

    if (confirm("This will create profit distribution records for all completed pension enrollments. Continue?")) {
      toast.loading("Creating profit distributions...", { id: "distribute-profits" });
      distributeProfits(investment.id, {
        onSuccess: (res) => {
          toast.success(
            `${res.data?.total_distributions || 0} distributions created successfully!`,
            { id: "distribute-profits" }
          );
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to create distributions",
            { id: "distribute-profits" }
          );
        },
      });
    }
  };

  const handleProcessDistributions = () => {
    if (confirm("This will credit profits to member wallets. This action cannot be undone. Continue?")) {
      toast.loading("Processing distributions...", { id: "process-distributions" });
      processDistributions(investment.id, {
        onSuccess: (res) => {
          toast.success(
            `${res.data?.processed || 0} distributions processed successfully!`,
            { id: "process-distributions" }
          );
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to process distributions",
            { id: "process-distributions" }
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-[#030712]">
              {investment.investment_name}
            </h2>
            <p className="text-sm text-[#6A7282] mt-0.5">
              {investment.investment_code}
            </p>
          </div>
          <button
            onClick={() => setOpenModal(false)}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#6A7282]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Amount Invested</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                ৳{parseFloat(investment.amount_invested).toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">Current Value</p>
              </div>
              <p className="text-2xl font-bold text-green-900">
                ৳{parseFloat(investment.current_value).toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-medium text-purple-900">Profit Generated</p>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                ৳{parseFloat(investment.profit_generated).toLocaleString()}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-orange-600" />
                <p className="text-sm font-medium text-orange-900">ROI</p>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {parseFloat(investment.roi_percentage).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-[#F9FAFB] rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#030712]">Investment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-[#6A7282] mb-1">Sector</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSectorBadgeColor(
                    investment.sector
                  )}`}
                >
                  {investment.sector.replace("_", " ")}
                </span>
              </div>

              {investment.sub_sector && (
                <div>
                  <p className="text-sm text-[#6A7282] mb-1">Sub-sector</p>
                  <p className="text-sm font-medium text-[#030712]">{investment.sub_sector}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-[#6A7282] mb-1">Status</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    investment.status
                  )}`}
                >
                  {investment.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-[#6A7282] mb-1">Risk Level</p>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskBadgeColor(
                    investment.risk_level
                  )}`}
                >
                  {investment.risk_level}
                </span>
              </div>

              <div>
                <p className="text-sm text-[#6A7282] mb-1">Investment Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#6A7282]" />
                  <p className="text-sm font-medium text-[#030712]">
                    {new Date(investment.investment_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {investment.maturity_date && (
                <div>
                  <p className="text-sm text-[#6A7282] mb-1">Maturity Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#6A7282]" />
                    <p className="text-sm font-medium text-[#030712]">
                      {new Date(investment.maturity_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-[#6A7282] mb-1">Expected Return</p>
                <p className="text-sm font-medium text-[#030712]">
                  {parseFloat(investment.expected_return_percentage).toFixed(2)}%
                </p>
              </div>

              {investment.actual_return_percentage && (
                <div>
                  <p className="text-sm text-[#6A7282] mb-1">Actual Return</p>
                  <p className="text-sm font-medium text-[#030712]">
                    {parseFloat(investment.actual_return_percentage).toFixed(2)}%
                  </p>
                </div>
              )}
            </div>

            {investment.description && (
              <div>
                <p className="text-sm text-[#6A7282] mb-1">Description</p>
                <p className="text-sm text-[#030712]">{investment.description}</p>
              </div>
            )}

            {investment.manager && (
              <div>
                <p className="text-sm text-[#6A7282] mb-1">Managed By</p>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#6A7282]" />
                  <p className="text-sm font-medium text-[#030712]">
                    {investment.manager.name} ({investment.manager.email})
                  </p>
                </div>
              </div>
            )}

            {investment.approved_by && (
              <div>
                <p className="text-sm text-[#6A7282] mb-1">Approved By</p>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-medium text-[#030712]">
                    Approved on {new Date(investment.approved_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Update Valuation */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#030712]">Update Valuation</h3>
              {!showValuationForm && (
                <button
                  onClick={() => setShowValuationForm(true)}
                  className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors text-sm font-medium"
                >
                  Update Value
                </button>
              )}
            </div>

            {showValuationForm && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#030712] mb-2">
                    Current Value (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                    placeholder="Enter current value"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#030712] mb-2">
                    Notes
                  </label>
                  <textarea
                    value={valuationNotes}
                    onChange={(e) => setValuationNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent resize-none"
                    placeholder="Valuation notes..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowValuationForm(false)}
                    disabled={isUpdatingValuation}
                    className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[#4A5565] font-medium hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateValuation}
                    disabled={isUpdatingValuation}
                    className="flex-1 px-4 py-2.5 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdatingValuation ? "Updating..." : "Update Valuation"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#030712] mb-4">Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {!investment.approved_by && (
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-4 h-4" />
                  {isApproving ? "Approving..." : "Approve Investment"}
                </button>
              )}

              <button
                onClick={handleDistributeProfits}
                disabled={isDistributing || parseFloat(investment.profit_generated) <= 0}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Users className="w-4 h-4" />
                {isDistributing ? "Creating..." : "Create Distributions"}
              </button>

              <button
                onClick={handleProcessDistributions}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DollarSign className="w-4 h-4" />
                {isProcessing ? "Processing..." : "Process Payments"}
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Profit Distribution Process:</p>
                  <ol className="list-decimal list-inside space-y-1 text-blue-800">
                    <li>Update valuation to calculate profit</li>
                    <li>Create distributions for all completed enrollments</li>
                    <li>Process payments to credit member wallets</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
