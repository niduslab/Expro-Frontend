"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  Settings,
  CheckCircle2,
  XCircle,
  Percent,
  DollarSign,
} from "lucide-react";
import {
  useCommissionRules,
  useDeleteCommissionRule,
} from "@/lib/hooks/admin/useCommissions";
import { toast } from "sonner";
import CommissionRuleModal from "./CommissionRuleModal";

export default function CommissionRulesTab() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<{
    id: number;
    description: string;
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: rulesData, isLoading, error } = useCommissionRules({
    page: currentPage,
    per_page: 10,
    role_slug: roleFilter !== "all" ? roleFilter : undefined,
    rule_type: typeFilter !== "all" ? typeFilter : undefined,
    is_active: statusFilter !== "all" ? statusFilter === "active" : undefined,
  });

  const { mutate: deleteRule, isPending: isDeleting } = useDeleteCommissionRule();

  const handleDeleteClick = (id: number, description: string) => {
    setRuleToDelete({ id, description });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!ruleToDelete) return;

    toast.loading("Deleting commission rule...", { id: "delete-rule" });

    deleteRule(ruleToDelete.id, {
      onSuccess: (res) => {
        toast.success(res.message || "Commission rule deleted successfully!", {
          id: "delete-rule",
        });
        setDeleteModalOpen(false);
        setRuleToDelete(null);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete commission rule",
          { id: "delete-rule" }
        );
      },
    });
  };

  const handleEdit = (rule: any) => {
    setSelectedRule(rule);
    setOpenModal(true);
  };

  const rulesArray = rulesData?.data;
  const rules = Array.isArray(rulesArray) ? rulesArray : [];
  const pagination = rulesData?.pagination;

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6A7282] h-5 w-5" />
          <input
            type="text"
            placeholder="Search commission rules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="agent">Agent</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            <option value="referral">Referral</option>
            <option value="monthly_fee">Monthly Fee</option>
            <option value="joining">Joining</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button
            onClick={() => {
              setSelectedRule(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#068847] text-white whitespace-nowrap hover:bg-[#057038] transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-semibold">Add Rule</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
            <p className="text-[#4A5565]">Loading commission rules...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load commission rules</p>
            <p className="text-sm text-[#4A5565]">
              {(error as any)?.message || "Please try again later"}
            </p>
          </div>
        </div>
      ) : !rules || rules.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px] border border-[#E5E7EB] rounded-lg">
          <div className="text-center">
            <Settings className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
            <p className="text-[#4A5565] mb-2">No commission rules found</p>
            <p className="text-sm text-[#6A7282]">
              Create your first commission rule to get started
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {rules.map((rule: any) => (
              <div
                key={rule.id}
                className="border border-[#E5E7EB] rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3 flex-1">
                    <div className="h-10 w-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0">
                      <Settings className="h-5 w-5 text-[#068847]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[16px] text-[#030712] line-clamp-1">
                        {rule.name}
                      </p>
                      <p className="text-[#6A7282] text-[12px] capitalize">
                        {rule.rule_type?.replace(/_/g, " ")}
                        {rule.role_slug && ` • ${rule.role_slug.toUpperCase()}`}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2">
                    {rule.is_active ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#29A36A] bg-[#DFF1E9] border border-[#A8DAC3] px-3 py-1 rounded-full whitespace-nowrap">
                        <CheckCircle2 size={12} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#DC2626] bg-[#FEE2E2] border border-[#FCA5A5] px-3 py-1 rounded-full whitespace-nowrap">
                        <XCircle size={12} />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>

                {/* Commission Value */}
                <div className="bg-[#F9FAFB] rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] text-[#6A7282]">Commission Rate</p>
                    {rule.is_one_time && (
                      <span className="text-[10px] font-medium text-[#F59E0B] bg-[#FEF3C7] px-2 py-0.5 rounded-full">
                        One-time
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {rule.commission_type === 'percentage' ? (
                      <>
                        <Percent className="h-5 w-5 text-[#068847]" />
                        <span className="text-2xl font-bold text-[#068847]">
                          {parseFloat(rule.commission_value)}%
                        </span>
                      </>
                    ) : (
                      <>
                        <DollarSign className="h-5 w-5 text-[#068847]" />
                        <span className="text-2xl font-bold text-[#068847]">
                          ৳{parseFloat(rule.commission_value).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Collection Range */}
                {(rule.min_collection || rule.max_collection) && (
                  <div className="mb-4 p-3 bg-[#F0FDF4] rounded-lg border border-[#BBF7D0]">
                    <p className="text-[11px] text-[#15803D] font-medium mb-1">
                      Collection Range
                    </p>
                    <p className="text-sm text-[#166534]">
                      {rule.min_collection && `৳${parseFloat(rule.min_collection).toLocaleString()}`}
                      {rule.min_collection && rule.max_collection && ' - '}
                      {rule.max_collection && `৳${parseFloat(rule.max_collection).toLocaleString()}`}
                      {rule.min_collection && !rule.max_collection && '+'}
                    </p>
                  </div>
                )}

                {/* Conditions */}
                {rule.conditions && Object.keys(rule.conditions).length > 0 && (
                  <div className="mb-4 p-3 bg-[#EFF6FF] rounded-lg border border-[#BFDBFE]">
                    <p className="text-[11px] text-[#1E40AF] font-medium mb-1">
                      Conditions
                    </p>
                    <div className="text-xs text-[#1E3A8A] space-y-1">
                      {Object.entries(rule.conditions).map(([key, value]) => (
                        <div key={key} className="flex gap-1">
                          <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {rule.description && (
                  <p className="text-sm text-[#4A5565] mb-4 line-clamp-2">
                    {rule.description}
                  </p>
                )}

                {/* Priority Badge */}
                <div className="mb-4">
                  <span className="text-xs text-[#6A7282] bg-[#F3F4F6] px-2 py-1 rounded">
                    Priority: {rule.priority}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#D1D5DC] text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
                  >
                    <Edit size={16} />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick(
                        rule.id,
                        rule.name || `${rule.role_slug} - ${rule.rule_type}`
                      )
                    }
                    disabled={isDeleting}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-[#6A7282]">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{" "}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
                {pagination.total} results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#4A5565] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(pagination.total_pages, prev + 1))
                  }
                  disabled={currentPage === pagination.total_pages}
                  className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#4A5565] hover:bg-[#F9FAFB] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {openModal && (
        <CommissionRuleModal setOpenModal={setOpenModal} ruleToEdit={selectedRule} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && ruleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-[#DC2626]" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#030712] mb-2">
                Delete Commission Rule?
              </h3>
              <p className="text-[#4A5565] text-sm mb-3">
                Are you sure you want to delete this commission rule?
              </p>
              <p className="text-[#DC2626] text-sm font-medium">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setRuleToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DC] text-[#4A5565] font-medium hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-lg bg-[#DC2626] text-white font-medium hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
