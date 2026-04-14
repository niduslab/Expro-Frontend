"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  useCreateInvestment,
  useUpdateInvestment,
  type InvestmentSector,
  type RiskLevel,
} from "@/lib/hooks/admin/usePensionInvestments";
import { toast } from "sonner";

interface InvestmentModalProps {
  setOpenModal: (open: boolean) => void;
  investmentToEdit?: any;
}

export default function InvestmentModal({
  setOpenModal,
  investmentToEdit,
}: InvestmentModalProps) {
  const [formData, setFormData] = useState({
    investment_name: "",
    investment_name_bangla: "",
    sector: "productive" as InvestmentSector,
    sub_sector: "",
    amount_invested: "",
    investment_date: "",
    maturity_date: "",
    investment_duration_months: "",
    expected_return_percentage: "",
    risk_level: "medium" as RiskLevel,
    description: "",
    terms_conditions: "",
    notes: "",
  });

  const { mutate: createInvestment, isPending: isCreating } = useCreateInvestment();
  const { mutate: updateInvestment, isPending: isUpdating } = useUpdateInvestment();

  useEffect(() => {
    if (investmentToEdit) {
      setFormData({
        investment_name: investmentToEdit.investment_name || "",
        investment_name_bangla: investmentToEdit.investment_name_bangla || "",
        sector: investmentToEdit.sector || "productive",
        sub_sector: investmentToEdit.sub_sector || "",
        amount_invested: investmentToEdit.amount_invested || "",
        investment_date: investmentToEdit.investment_date || "",
        maturity_date: investmentToEdit.maturity_date || "",
        investment_duration_months: investmentToEdit.investment_duration_months?.toString() || "",
        expected_return_percentage: investmentToEdit.expected_return_percentage || "",
        risk_level: investmentToEdit.risk_level || "medium",
        description: investmentToEdit.description || "",
        terms_conditions: investmentToEdit.terms_conditions || "",
        notes: investmentToEdit.notes || "",
      });
    }
  }, [investmentToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.investment_name || !formData.amount_invested || !formData.investment_date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      investment_name: formData.investment_name,
      investment_name_bangla: formData.investment_name_bangla || undefined,
      sector: formData.sector,
      sub_sector: formData.sub_sector || undefined,
      amount_invested: parseFloat(formData.amount_invested),
      investment_date: formData.investment_date,
      maturity_date: formData.maturity_date || undefined,
      investment_duration_months: formData.investment_duration_months
        ? parseInt(formData.investment_duration_months)
        : undefined,
      expected_return_percentage: parseFloat(formData.expected_return_percentage),
      risk_level: formData.risk_level,
      description: formData.description || undefined,
      terms_conditions: formData.terms_conditions || undefined,
      notes: formData.notes || undefined,
    };

    if (investmentToEdit) {
      toast.loading("Updating investment...", { id: "investment-action" });
      updateInvestment(
        { id: investmentToEdit.id, ...payload },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Investment updated successfully!", {
              id: "investment-action",
            });
            setOpenModal(false);
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update investment",
              { id: "investment-action" }
            );
          },
        }
      );
    } else {
      toast.loading("Creating investment...", { id: "investment-action" });
      createInvestment(payload, {
        onSuccess: (res) => {
          toast.success(res.message || "Investment created successfully!", {
            id: "investment-action",
          });
          setOpenModal(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to create investment",
            { id: "investment-action" }
          );
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-[#030712]">
            {investmentToEdit ? "Edit Investment" : "Create New Investment"}
          </h2>
          <button
            onClick={() => setOpenModal(false)}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#6A7282]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Investment Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Investment Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.investment_name}
                onChange={(e) =>
                  setFormData({ ...formData, investment_name: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="e.g., Healthcare Clinic - Dhaka"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Investment Name (Bangla)
              </label>
              <input
                type="text"
                value={formData.investment_name_bangla}
                onChange={(e) =>
                  setFormData({ ...formData, investment_name_bangla: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="স্বাস্থ্যসেবা ক্লিনিক - ঢাকা"
              />
            </div>
          </div>

          {/* Sector and Sub-sector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Sector <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.sector}
                onChange={(e) =>
                  setFormData({ ...formData, sector: e.target.value as InvestmentSector })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
                required
              >
                <option value="productive">Productive (40%)</option>
                <option value="service">Service (35%)</option>
                <option value="income_project">Income Project (20%)</option>
                <option value="reserve">Reserve (5%)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Sub-sector
              </label>
              <input
                type="text"
                value={formData.sub_sector}
                onChange={(e) =>
                  setFormData({ ...formData, sub_sector: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="e.g., Healthcare, Manufacturing"
              />
            </div>
          </div>

          {/* Amount and Expected Return */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Amount Invested (৳) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount_invested}
                onChange={(e) =>
                  setFormData({ ...formData, amount_invested: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="5000000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Expected Return (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.expected_return_percentage}
                onChange={(e) =>
                  setFormData({ ...formData, expected_return_percentage: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="12.5"
                required
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Investment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.investment_date}
                onChange={(e) =>
                  setFormData({ ...formData, investment_date: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Maturity Date
              </label>
              <input
                type="date"
                value={formData.maturity_date}
                onChange={(e) =>
                  setFormData({ ...formData, maturity_date: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Duration (Months)
              </label>
              <input
                type="number"
                min="1"
                value={formData.investment_duration_months}
                onChange={(e) =>
                  setFormData({ ...formData, investment_duration_months: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="24"
              />
            </div>
          </div>

          {/* Risk Level */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Risk Level <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {["low", "medium", "high"].map((risk) => (
                <label key={risk} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={risk}
                    checked={formData.risk_level === risk}
                    onChange={(e) =>
                      setFormData({ ...formData, risk_level: e.target.value as RiskLevel })
                    }
                    className="w-4 h-4 text-[#068847] focus:ring-[#068847]"
                  />
                  <span className="text-sm text-[#030712] capitalize">{risk} Risk</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent resize-none"
              placeholder="Enter investment description..."
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Terms & Conditions
            </label>
            <textarea
              value={formData.terms_conditions}
              onChange={(e) =>
                setFormData({ ...formData, terms_conditions: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent resize-none"
              placeholder="Enter terms and conditions..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent resize-none"
              placeholder="Internal notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              disabled={isPending}
              className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DC] text-[#4A5565] font-medium hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-3 rounded-lg bg-[#068847] text-white font-medium hover:bg-[#057038] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {investmentToEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{investmentToEdit ? "Update Investment" : "Create Investment"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
