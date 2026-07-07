"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  DollarSign,
  User,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import {
  useCommissions,
  useDeleteCommission,
  Commission,
} from "@/lib/hooks/admin/useCommissions";
import { toast } from "sonner";
import CommissionModal from "./CommissionModal";
import Pagination from "@/components/pagination/page";

export default function CommissionsTab() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCommission, setSelectedCommission] =
    useState<Commission | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [commissionToDelete, setCommissionToDelete] = useState<{
    id: number;
    description: string;
  } | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const {
    data: commissionsData,
    isLoading,
    error,
  } = useCommissions({
    page: currentPage,
    per_page: perPage,
    status: statusFilter !== "all" ? statusFilter : undefined,
    type: typeFilter !== "all" ? typeFilter : undefined,
  });

  const { mutate: deleteCommission, isPending: isDeleting } =
    useDeleteCommission();

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
          { id: "delete-commission" },
        );
      },
    });
  };

  const handleEdit = (commission: Commission) => {
    setSelectedCommission(commission);
    setOpenModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { text: string; className: string; icon: any }
    > = {
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

    const statusInfo = statusMap[status?.toLowerCase()] ?? statusMap.pending;
    const Icon = statusInfo.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 text-[12px] font-semibold ${statusInfo.className} border px-3 py-1 rounded-full whitespace-nowrap`}
      >
        <Icon size={12} />
        {statusInfo.text}
      </span>
    );
  };

  // PaginatedResponse shape: { data: T[], pagination: { total, per_page, current_page, last_page } }
  const commissions: Commission[] = Array.isArray(commissionsData?.data)
    ? commissionsData.data
    : [];
  const pagination = commissionsData?.pagination;

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
        <div className="flex flex-wrap gap-2 flex-1">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            <option value="joining_commission">Joining Commission</option>
            <option value="referral_commission">Referral Commission</option>
            <option value="monthly_commission">Monthly Commission</option>
            <option value="milestone_commission">Milestone Commission</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedCommission(null);
            setOpenModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#068847] text-white hover:bg-[#057038] transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="text-sm font-semibold">Add Commission</span>
        </button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4" />
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
      ) : commissions.length === 0 ? (
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
            <table className="w-full min-w-[750px]">
              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                <tr>
                  {[
                    "User",
                    "Amount",
                    "Type",
                    "Source",
                    "Status",
                    "Description",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-medium text-[#6A7282] uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E5E7EB]">
                {commissions.map((commission) => (
                  <tr
                    key={commission.id}
                    className="hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 shrink-0 rounded-full bg-[#F3F4F6] flex items-center justify-center">
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
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-[#068847] block">
                        ৳{parseFloat(commission.amount).toLocaleString()}
                      </span>
                      {commission.percentage && (
                        <span className="text-xs text-[#6A7282]">
                          {commission.percentage}%
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-[#4A5565] capitalize">
                        {commission.type?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-xs text-[#6A7282] block">
                        {commission.source_type?.split("\\").pop()}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        ID: {commission.source_id}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {getStatusBadge(commission.status)}
                    </td>
                    <td className="px-4 py-4 max-w-[200px]">
                      <span className="text-sm text-[#4A5565] line-clamp-2">
                        {commission.description || "N/A"}
                      </span>
                      {commission.rejection_reason && (
                        <span className="text-xs text-[#DC2626] block mt-1">
                          Reason: {commission.rejection_reason}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
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
                              commission.description ||
                                `Commission #${commission.id}`,
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
          {pagination && pagination.last_page > 0 && (
            <Pagination
              page={currentPage}
              perPage={perPage}
              total={pagination.total}
              dataLength={commissions.length}
              onNext={() =>
                setCurrentPage((p) => Math.min(p + 1, pagination.last_page))
              }
              onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {openModal && (
        <CommissionModal
          setOpenModal={setOpenModal}
          commissionToEdit={selectedCommission}
        />
      )}

      {/* Delete Modal */}
      {deleteModalOpen && commissionToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
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
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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
