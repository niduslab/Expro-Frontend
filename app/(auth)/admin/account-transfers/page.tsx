"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useAccountTransfers,
  useAccountTransferStatistics,
  useReviewTransfer,
  useApproveTransfer,
  useRejectTransfer,
  useClearOutstanding,
  AccountTransfer,
  AccountTransferStatistics,
} from "@/lib/hooks/admin/useAccountTransfers";
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  FileText,
  Download,
  Search
} from "lucide-react";
import TransferDetailsModal from "./TransferDetailsModal";
import ReviewModal from "./ReviewModal";
import ApproveModal from "./ApproveModal";
import RejectModal from "./RejectModal";
import ClearOutstandingModal from "./ClearOutstandingModal";

type Status = "requested" | "under_review" | "approved" | "rejected" | "completed" | "cancelled";

// Status Badge Component
function StatusBadge({ status }: { status: Status }) {
  const config: Record<Status, { bg: string; text: string; label: string; dot: string }> = {
    requested: { bg: "bg-blue-50", text: "text-blue-700", label: "Requested", dot: "bg-blue-500" },
    under_review: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Under Review", dot: "bg-yellow-500" },
    approved: { bg: "bg-green-50", text: "text-green-700", label: "Approved", dot: "bg-green-500" },
    rejected: { bg: "bg-red-50", text: "text-red-700", label: "Rejected", dot: "bg-red-500" },
    completed: { bg: "bg-purple-50", text: "text-purple-700", label: "Completed", dot: "bg-purple-500" },
    cancelled: { bg: "bg-gray-50", text: "text-gray-700", label: "Cancelled", dot: "bg-gray-500" },
  };
  const s = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// Stat Card Component
function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export default function AccountTransfersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [hasOutstandingFilter, setHasOutstandingFilter] = useState<boolean | "">("");
  const [newMemberRegisteredFilter, setNewMemberRegisteredFilter] = useState<boolean | "">("");
  
  // Modal states
  const [selectedTransfer, setSelectedTransfer] = useState<AccountTransfer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showClearOutstandingModal, setShowClearOutstandingModal] = useState(false);

  // Fetch data
  const { data: response, isLoading } = useAccountTransfers({
    page,
    per_page: perPage,
    search: search || undefined,
    status: statusFilter || undefined,
    has_outstanding: hasOutstandingFilter !== "" ? hasOutstandingFilter : undefined,
    new_member_registered: newMemberRegisteredFilter !== "" ? newMemberRegisteredFilter : undefined,
  });

  const { data: statsResponse } = useAccountTransferStatistics();
  const statsData = (statsResponse?.data || statsResponse) as AccountTransferStatistics | undefined;

  // Mutations
  const reviewMutation = useReviewTransfer();
  const approveMutation = useApproveTransfer();
  const rejectMutation = useRejectTransfer();
  const clearOutstandingMutation = useClearOutstanding();

  // Extract data
  const transfers: AccountTransfer[] = response?.data?.data || [];
  const pagination = response?.data?.pagination || {
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: perPage,
  };

  // Format currency
  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '৳0';
    return `৳${amount.toLocaleString()}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle actions
  const handleViewDetails = (transfer: AccountTransfer) => {
    setSelectedTransfer(transfer);
    setShowDetailsModal(true);
  };

  const handleReview = (transfer: AccountTransfer) => {
    setSelectedTransfer(transfer);
    setShowReviewModal(true);
  };

  const handleApprove = (transfer: AccountTransfer) => {
    setSelectedTransfer(transfer);
    setShowApproveModal(true);
  };

  const handleReject = (transfer: AccountTransfer) => {
    setSelectedTransfer(transfer);
    setShowRejectModal(true);
  };

  const handleClearOutstanding = (transfer: AccountTransfer) => {
    setSelectedTransfer(transfer);
    setShowClearOutstandingModal(true);
  };

  // Page window for pagination
  function pageWindow(): number[] {
    const pages: number[] = [];
    const currentPage = pagination.current_page;
    const lastPage = pagination.last_page;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(lastPage, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account Transfers</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage pension account transfer requests
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Statistics */}
        {statsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={FileText}
              label="Total Transfers"
              value={statsData.total_transfers || 0}
              subtitle={`${statsData.requested || 0} pending requests`}
              color="text-blue-600"
            />
            <StatCard
              icon={Clock}
              label="Under Review"
              value={statsData.under_review || 0}
              subtitle={`${statsData.approved || 0} approved`}
              color="text-yellow-600"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={statsData.completed || 0}
              subtitle={`${statsData.rejected || 0} rejected`}
              color="text-green-600"
            />
            <StatCard
              icon={DollarSign}
              label="Total Fees"
              value={formatCurrency(statsData.total_transfer_fees)}
              subtitle={`${formatCurrency(statsData.total_outstanding_balance)} outstanding`}
              color="text-purple-600"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transfer number, member name, email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as Status | "");
                setPage(1);
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="requested">Requested</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Outstanding Filter */}
            <select
              value={hasOutstandingFilter.toString()}
              onChange={(e) => {
                const val = e.target.value;
                setHasOutstandingFilter(val === "" ? "" : val === "true");
                setPage(1);
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Outstanding</option>
              <option value="true">Has Outstanding</option>
              <option value="false">No Outstanding</option>
            </select>

            {/* New Member Registered Filter */}
            <select
              value={newMemberRegisteredFilter.toString()}
              onChange={(e) => {
                const val = e.target.value;
                setNewMemberRegisteredFilter(val === "" ? "" : val === "true");
                setPage(1);
              }}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Registrations</option>
              <option value="true">Registered</option>
              <option value="false">Not Registered</option>
            </select>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : transfers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <FileText className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No transfers found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transfer #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        From Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        New Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Outstanding
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transfer Fee
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transfers.map((transfer) => (
                      <tr key={transfer.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {transfer.transfer_number}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transfer.from_user?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transfer.from_user?.member_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transfer.new_member_data?.name || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transfer.new_member_registered ? (
                              <span className="text-green-600 font-medium">✓ Account Created</span>
                            ) : (
                              <span className="text-gray-500">Not Created Yet</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transfer.pension_enrollment?.enrollment_number || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transfer.pension_enrollment?.package_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            {formatCurrency(transfer.outstanding_balance)}
                          </div>
                          <div className="text-xs">
                            {transfer.outstanding_cleared ? (
                              <span className="text-green-600">✓ Cleared</span>
                            ) : (
                              <span className="text-red-600">Pending</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(transfer.transfer_fee)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={transfer.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transfer.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(transfer)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {transfer.status === "requested" && (
                              <button
                                onClick={() => handleReview(transfer)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                title="Move to Review"
                              >
                                <Clock className="h-4 w-4" />
                              </button>
                            )}
                            
                            {transfer.status === "under_review" && (
                              <>
                                {!transfer.outstanding_cleared && (
                                  <button
                                    onClick={() => handleClearOutstanding(transfer)}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                    title="Clear Outstanding"
                                  >
                                    <DollarSign className="h-4 w-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleApprove(transfer)}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={!transfer.outstanding_cleared ? "Clear outstanding balance first" : "Approve & Auto-Complete"}
                                  disabled={!transfer.outstanding_cleared}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(transfer)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(pagination.current_page - 1) * pagination.per_page + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span> results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    {pageWindow().map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          p === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(pagination.last_page, page + 1))}
                      disabled={page === pagination.last_page}
                      className="p-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedTransfer && (
        <TransferDetailsModal
          transfer={selectedTransfer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransfer(null);
          }}
        />
      )}

      {showReviewModal && selectedTransfer && (
        <ReviewModal
          transfer={selectedTransfer}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedTransfer(null);
          }}
          onSubmit={async (notes: string) => {
            await reviewMutation.mutateAsync({ id: selectedTransfer.id, review_notes: notes });
            setShowReviewModal(false);
            setSelectedTransfer(null);
          }}
        />
      )}

      {showApproveModal && selectedTransfer && (
        <ApproveModal
          transfer={selectedTransfer}
          onClose={() => {
            setShowApproveModal(false);
            setSelectedTransfer(null);
          }}
          onSubmit={async (notes: string) => {
            try {
              await approveMutation.mutateAsync({ id: selectedTransfer.id, review_notes: notes });
              alert("Transfer approved and completed successfully! New member account has been created automatically.");
              setShowApproveModal(false);
              setSelectedTransfer(null);
            } catch (error: any) {
              alert(error.response?.data?.message || "Failed to approve transfer");
            }
          }}
        />
      )}

      {showRejectModal && selectedTransfer && (
        <RejectModal
          transfer={selectedTransfer}
          onClose={() => {
            setShowRejectModal(false);
            setSelectedTransfer(null);
          }}
          onSubmit={async (notes: string) => {
            await rejectMutation.mutateAsync({ id: selectedTransfer.id, review_notes: notes });
            setShowRejectModal(false);
            setSelectedTransfer(null);
          }}
        />
      )}

      {showClearOutstandingModal && selectedTransfer && (
        <ClearOutstandingModal
          transfer={selectedTransfer}
          onClose={() => {
            setShowClearOutstandingModal(false);
            setSelectedTransfer(null);
          }}
          onSubmit={async (notes: string) => {
            await clearOutstandingMutation.mutateAsync({ id: selectedTransfer.id, notes });
            setShowClearOutstandingModal(false);
            setSelectedTransfer(null);
          }}
        />
      )}
    </div>
  );
}
