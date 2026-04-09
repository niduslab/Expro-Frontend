"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  useCreateCommissionRule,
  useUpdateCommissionRule,
} from "@/lib/hooks/admin/useCommissions";
import { toast } from "sonner";

interface CommissionRuleModalProps {
  setOpenModal: (open: boolean) => void;
  ruleToEdit?: any;
}

export default function CommissionRuleModal({
  setOpenModal,
  ruleToEdit,
}: CommissionRuleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    role_slug: "",
    rule_type: "referral",
    commission_type: "percentage" as "percentage" | "fixed",
    commission_value: "",
    min_collection: "",
    max_collection: "",
    is_one_time: false,
    is_active: true,
    priority: "",
    conditions: {} as Record<string, any>,
    description: "",
  });

  const { mutate: createRule, isPending: isCreating } = useCreateCommissionRule();
  const { mutate: updateRule, isPending: isUpdating } = useUpdateCommissionRule();

  useEffect(() => {
    if (ruleToEdit) {
      setFormData({
        name: ruleToEdit.name || "",
        slug: ruleToEdit.slug || "",
        role_slug: ruleToEdit.role_slug || "",
        rule_type: ruleToEdit.rule_type || "referral",
        commission_type: ruleToEdit.commission_type || "percentage",
        commission_value: ruleToEdit.commission_value?.toString() || "",
        min_collection: ruleToEdit.min_collection?.toString() || "",
        max_collection: ruleToEdit.max_collection?.toString() || "",
        is_one_time: ruleToEdit.is_one_time ?? false,
        is_active: ruleToEdit.is_active ?? true,
        priority: ruleToEdit.priority?.toString() || "",
        conditions: ruleToEdit.conditions || {},
        description: ruleToEdit.description || "",
      });
    }
  }, [ruleToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.commission_value) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      name: formData.name,
      slug: formData.slug,
      rule_type: formData.rule_type,
      role_slug: formData.role_slug || null,
      commission_type: formData.commission_type,
      commission_value: parseFloat(formData.commission_value),
      min_collection: formData.min_collection ? parseFloat(formData.min_collection) : null,
      max_collection: formData.max_collection ? parseFloat(formData.max_collection) : null,
      is_one_time: formData.is_one_time,
      is_active: formData.is_active,
      priority: formData.priority ? parseInt(formData.priority) : undefined,
      conditions: Object.keys(formData.conditions).length > 0 ? formData.conditions : null,
      description: formData.description || undefined,
    };

    if (ruleToEdit) {
      toast.loading("Updating commission rule...", { id: "rule-action" });
      updateRule(
        { id: ruleToEdit.id, ...payload },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Commission rule updated successfully!", {
              id: "rule-action",
            });
            setOpenModal(false);
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message || "Failed to update commission rule",
              { id: "rule-action" }
            );
          },
        }
      );
    } else {
      toast.loading("Creating commission rule...", { id: "rule-action" });
      createRule(payload, {
        onSuccess: (res) => {
          toast.success(res.message || "Commission rule created successfully!", {
            id: "rule-action",
          });
          setOpenModal(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to create commission rule",
            { id: "rule-action" }
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
            {ruleToEdit ? "Edit Commission Rule" : "Add New Commission Rule"}
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Rule Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder="Enter rule name"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder="rule-slug"
              required
            />
          </div>

          {/* Rule Type */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Rule Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.rule_type}
              onChange={(e) =>
                setFormData({ ...formData, rule_type: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
              required
            >
              <option value="referral">Referral</option>
              <option value="milestone">Milestone</option>
              <option value="hierarchy">Hierarchy</option>
              <option value="package">Package</option>
            </select>
          </div>

          {/* Role Slug */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Role (Optional)
            </label>
            <select
              value={formData.role_slug}
              onChange={(e) =>
                setFormData({ ...formData, role_slug: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
            >
              <option value="">None</option>
              <option value="chairman">Chairman</option>
              <option value="admin">Admin</option>
              <option value="em">Executive Member (EM)</option>
              <option value="pp">Project Presenter (PP)</option>
              <option value="app">Assistant PP (APP)</option>
              <option value="member">Member</option>
            </select>
          </div>

          {/* Commission Type */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Commission Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="percentage"
                  checked={formData.commission_type === "percentage"}
                  onChange={(e) =>
                    setFormData({ ...formData, commission_type: e.target.value as "percentage" | "fixed" })
                  }
                  className="w-4 h-4 text-[#068847] focus:ring-[#068847]"
                />
                <span className="text-sm text-[#030712]">Percentage (%)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="fixed"
                  checked={formData.commission_type === "fixed"}
                  onChange={(e) =>
                    setFormData({ ...formData, commission_type: e.target.value as "percentage" | "fixed" })
                  }
                  className="w-4 h-4 text-[#068847] focus:ring-[#068847]"
                />
                <span className="text-sm text-[#030712]">Fixed Amount (৳)</span>
              </label>
            </div>
          </div>

          {/* Commission Value */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Commission Value <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.commission_value}
              onChange={(e) =>
                setFormData({ ...formData, commission_value: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder={formData.commission_type === "percentage" ? "Enter percentage (e.g., 10)" : "Enter amount"}
              required
            />
          </div>

          {/* Collection Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Min Collection (৳)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.min_collection}
                onChange={(e) =>
                  setFormData({ ...formData, min_collection: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#030712] mb-2">
                Max Collection (৳)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.max_collection}
                onChange={(e) =>
                  setFormData({ ...formData, max_collection: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Priority
            </label>
            <input
              type="number"
              min="1"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
              placeholder="Enter priority (higher = more important)"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_one_time}
                onChange={(e) =>
                  setFormData({ ...formData, is_one_time: e.target.checked })
                }
                className="w-4 h-4 text-[#068847] focus:ring-[#068847] rounded"
              />
              <span className="text-sm font-medium text-[#030712]">
                One-time Commission
              </span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4 text-[#068847] focus:ring-[#068847] rounded"
              />
              <span className="text-sm font-medium text-[#030712]">
                Active Rule
              </span>
            </label>
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
              placeholder="Enter rule description (optional)"
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
                  {ruleToEdit ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{ruleToEdit ? "Update Rule" : "Create Rule"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
