"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  DollarSign,
  User,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useCommissions, useDeleteCommission } from "@/lib/hooks/admin/useCommissions";
import { toast } from "sonner";
import CommissionModal from "./CommissionModal";

export default function CommissionsTab() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commissionToDelete, setCommissionToDelete] = useState<{
    id: number;
    description: string;
  } | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: commissionsData, isLoading, error } = useCommissions({
    page: currentPage,
    per_page: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  });

  const { mutate: deleteCommission, isPending: isDeleting } = useDeleteCommission();

  const handleDeleteClick = (id: number, description: string) => {
    setCommissionToDelete({ id, description });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!commissionToDelete) return;

    toast.loading("Deleting commission...", { id: "delete-commission" });

    deleteCommission(commissionToDelete.id, {
      onSuccess: (res) => {
        toast.success(res.message || "Commission deleted successfully!", {
          id: "delete-commission",
        });
        setDeleteModalOpen(false);
        setCommissionToDelete(null);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete commission",
          { id: "delete-commission" }
        );
      },
    });
  };

  const handleEdit = (commission: any) => {
    setSelectedCommission(commission);
    setOpenModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string; icon: any }> = {
      approved: {
        text: "Approved",
        className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]",
        icon: CheckCircle,
      },
      pending: {
        text: "Pending",
        className: "text-[#F59E0B] bg-[#FEF3C7] border-[#FCD34D]",
        icon: Clock,
      },
      rejected: {
        text: "Rejected",
        className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]",
        icon: XCircle,
      },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || statusMap.pending;
    const Icon = statusInfo.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 text-[12px] font-semibold ${statusInfo.className} border px-3 py-1 rounded-full`}
      >
        <Icon size={12} />
        {statusInfo.text}
      </span>
    );
  };

  const commissionsArray = commissionsData?.data;
  const commissions = Array.isArray(commissionsArray) ? commissionsArray : [];
  const pagination = commissionsData?.pagination;

  return (
    <>
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6A7282] h-5 w-5" />
          <input
            type="text"
            placeholder="Search commissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            <option value="joining_commission">Joining Commission</option>
            <option value="referral_commission">Referral Commission</option>
            <option value="monthly_commission">Monthly Commission</option>
            <option value="milestone_commission">Milestone Commission</option>
          </select>

          <button
            onClick={() => {
              setSelectedCommission(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#068847] text-white whitespace-nowrap hover:bg-[#057038] transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-semibold">Add Commission</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
            <p className="text-[#4A5565]">Loading commissions...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load commissions</p>
            <p className="text-sm text-[#4A5565]">
              {(error as any)?.message || "Please try again later"}
            </p>
          </div>
        </div>
      ) : !commissions || commissions.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px] border border-[#E5E7EB] rounded-lg">
          <div className="text-center">
            <DollarSign className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
            <p className="text-[#4A5565] mb-2">No commissions found</p>
            <p className="text-sm text-[#6A7282]">
              Create your first commission to get started
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
            <table className="w-full">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-[#6A7282] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {commissions.map((commission: any) => (
                  <tr key={commission.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                          <User className="h-4 w-4 text-[#6A7282]" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-[#030712] block">
                            User #{commission.user_id}
                          </span>
                          {commission.source_user_id && (
                            <span className="text-xs text-[#6A7282]">
                              From: #{commission.source_user_id}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm font-semibold text-[#068847] block">
                          ৳{parseFloat(commission.amount).toLocaleString()}
                        </span>
                        {commission.percentage && (
                          <span className="text-xs text-[#6A7282]">
                            {commission.percentage}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#4A5565] capitalize">
                        {commission.type?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs">
                        <span className="text-[#6A7282] block">
                          {commission.source_type?.split('\\').pop()}
                        </span>
                        <span className="text-[#9CA3AF]">
                          ID: {commission.source_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(commission.status)}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <span className="text-sm text-[#4A5565] line-clamp-2">
                        {commission.description || "N/A"}
                      </span>
                      {commission.rejection_reason && (
                        <span className="text-xs text-[#DC2626] block mt-1">
                          Reason: {commission.rejection_reason}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(commission)}
                          className="p-2 rounded-lg border border-[#D1D5DC] text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClick(
                              commission.id,
                              commission.description || `Commission #${commission.id}`
                            )
                          }
                          disabled={isDeleting}
                          className="p-2 rounded-lg border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  onClick={() => setCurrentPage((prev) => Math.min(pagination.total_pages, prev + 1))}
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
        <CommissionModal
          setOpenModal={setOpenModal}
          commissionToEdit={selectedCommission}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && commissionToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-[#DC2626]" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#030712] mb-2">
                Delete Commission?
              </h3>
              <p className="text-[#4A5565] text-sm mb-3">
                Are you sure you want to delete this commission?
              </p>
              <p className="text-[#DC2626] text-sm font-medium">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setCommissionToDelete(null);
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
