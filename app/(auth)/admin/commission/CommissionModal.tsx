"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useCreateCommission, useUpdateCommission } from "@/lib/hooks/admin/useCommissions";
import { toast } from "sonner";

interface CommissionModalProps {
  setOpenModal: (open: boolean) => void;
  commissionToEdit?: any;
}

export default function CommissionModal({
  setOpenModal,
  commissionToEdit,
}: CommissionModalProps) {
  const [formData, setFormData] = useState({
    user_id: "",
    amount: "",
    type: "joining_commission",
    status: "pending",
    percentage: "",
    base_amount: "",
    source_type: "",
    source_id: "",
    source_user_id: "",
    description: "",
  });

  const { mutate: createCommission, isPending: isCreating } = useCreateCommission();
  const { mutate: updateCommission, isPending: isUpdating } = useUpdateCommission();

  useEffect(() => {
    if (commissionToEdit) {
      setFormData({
        user_id: commissionToEdit.user_id?.toString() || "",
        amount: commissionToEdit.amount?.toString() || "",
        type: commissionToEdit.type || "joining_commission",
        status: commissionToEdit.status || "pending",
        percentage: commissionToEdit.percentage?.toString() || "",
        base_amount: commissionToEdit.base_amount?.toString() || "",
        source_type: commissionToEdit.source_type || "",
        source_id: commissionToEdit.source_id?.toString() || "",
        source_user_id: commissionToEdit.source_user_id?.toString() || "",
        description: commissionToEdit.description || "",
      });
    }
  }, [commissionToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.user_id || !formData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      user_id: parseInt(formData.user_id),
      amount: parseFloat(formData.amount),
      type: formData.type,
      status: formData.status,
      percentage: formData.percentage ? parseFloat(formData.percentage) : null,
      base_amount: formData.base_amount ? parseFloat(formData.base_amount) : null,
      source_type: formData.source_type || undefined,
      source_id: formData.source_id ? parseInt(formData.source_id) : undefined,
      source_user_id: formData.source_user_id ? parseInt(formData.source_user_id) : undefined,
      description: formData.description || undefined,
    };

    if (commissionToEdit) {
      toast.loading("Updating commission...", { id: "commission-action" });
      updateCommission(
        { id: commissionToEdit.id, ...payload },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Commission updated successfully!", {
              id: "commission-action",
            });
            setOpenModal(false);
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update commission",
              { id: "commission-action" }
            );
          },
        }
      );
    } else {
      toast.loading("Creating commission...", { id: "commission-action" });
      createCommission(payload, {
        onSuccess: (res) => {
          toast.success(res.message || "Commission created successfully!", {
            id: "commission-action",
          });
          setOpenModal(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to create commission",
            { id: "commission-action" }
          );
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold text-[#030712]">
            {commissionToEdit ? "Edit Commission" : "Add New Commission"}
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
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              User ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder="Enter user ID"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Amount (৳) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Commission Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
              required
            >
              <option value="joining_commission">Joining Commission</option>
              <option value="referral_commission">Referral Commission</option>
              <option value="monthly_commission">Monthly Commission</option>
              <option value="milestone_commission">Milestone Commission</option>
            </select>
          </div>

          {/* Percentage and Base Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Percentage (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={(e) =>
                  setFormData({ ...formData, percentage: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Base Amount (৳)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.base_amount}
                onChange={(e) =>
                  setFormData({ ...formData, base_amount: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Source Information */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Source Type
              </label>
              <input
                type="text"
                value={formData.source_type}
                onChange={(e) =>
                  setFormData({ ...formData, source_type: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="e.g., PensionEnrollment"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Source ID
              </label>
              <input
                type="number"
                value={formData.source_id}
                onChange={(e) =>
                  setFormData({ ...formData, source_id: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Source User ID
              </label>
              <input
                type="number"
                value={formData.source_user_id}
                onChange={(e) =>
                  setFormData({ ...formData, source_user_id: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
              required
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
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
              rows={4}
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent resize-none"
              placeholder="Enter commission description (optional)"
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
                  {commissionToEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{commissionToEdit ? "Update Commission" : "Create Commission"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
