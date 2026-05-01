"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMyTransferRequests,
  useReceivedTransfers,
  MemberAccountTransfer,
} from "@/lib/hooks/user/useAccountTransfers";
import {
  ArrowLeftRight,
  Plus,
  Eye,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
} from "lucide-react";
import RequestTransferModal from "./RequestTransferModal";
import TransferDetailsModal from "./TransferDetailsModal";

type Status = "requested" | "under_review" | "approved" | "rejected" | "completed" | "cancelled";

// Status Badge Component
function StatusBadge({ status }: { status: Status }) {
  const config: Record<Status, { bg: string; text: string; label: string; icon: any }> = {
    requested: { bg: "bg-blue-50", text: "text-blue-700", label: "Requested", icon: Clock },
    under_review: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Under Review", icon: Clock },
    approved: { bg: "bg-green-50", text: "text-green-700", label: "Approved", icon: CheckCircle },
    rejected: { bg: "bg-red-50", text: "text-red-700", label: "Rejected", icon: XCircle },
    completed: { bg: "bg-purple-50", text: "text-purple-700", label: "Completed", icon: CheckCircle },
    cancelled: { bg: "bg-gray-50", text: "text-gray-700", label: "Cancelled", icon: XCircle },
  };
  const s = config[status];
  const Icon = s.icon;
  
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

// Info Card Component
function InfoCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs text-gray-600">{label}</p>
          <p className={`text-lg font-bold ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function MemberAccountTransfersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"my-requests" | "received">("my-requests");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<MemberAccountTransfer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch data
  const { data: myRequestsData, isLoading: loadingRequests } = useMyTransferRequests();
  const { data: receivedTransfersData, isLoading: loadingReceived } = useReceivedTransfers();

  // Extract arrays from paginated response
  // API returns: { success: true, data: { data: [...], current_page, total, etc } }
  const myRequests = myRequestsData?.data?.data || [];
  const receivedTransfers = receivedTransfersData?.data?.data || [];

  console.log("My Requests Data:", myRequestsData);
  console.log("My Requests Array:", myRequests);
  console.log("Received Transfers Data:", receivedTransfersData);
  console.log("Received Transfers Array:", receivedTransfers);

  const transfers = activeTab === "my-requests" ? myRequests : receivedTransfers;
  const isLoading = activeTab === "my-requests" ? loadingRequests : loadingReceived;

  // Calculate stats
  const stats = {
    total: myRequests.length,
    pending: myRequests.filter(t => ['requested', 'under_review'].includes(t.status)).length,
    approved: myRequests.filter(t => t.status === 'approved').length,
    completed: myRequests.filter(t => t.status === 'completed').length,
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

  const handleViewDetails = (transfer: MemberAccountTransfer) => {
    setSelectedTransfer(transfer);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ArrowLeftRight className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Account Transfers</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Transfer your pension account to a new member
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Request Transfer
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <InfoCard icon={FileText} label="Total Requests" value={stats.total} color="text-blue-600" />
          <InfoCard icon={Clock} label="Pending" value={stats.pending} color="text-yellow-600" />
          <InfoCard icon={CheckCircle} label="Approved" value={stats.approved} color="text-green-600" />
          <InfoCard icon={CheckCircle} label="Completed" value={stats.completed} color="text-purple-600" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6">
              <button
                onClick={() => setActiveTab("my-requests")}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "my-requests"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                My Requests ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab("received")}
                className={`py-4 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "received"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Received Transfers ({receivedTransfers.length})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : transfers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <ArrowLeftRight className="h-12 w-12 mb-4 text-gray-300" />
                <p className="text-lg font-medium">No transfers found</p>
                <p className="text-sm">
                  {activeTab === "my-requests"
                    ? "You haven't requested any transfers yet"
                    : "No one has transferred an account to you"}
                </p>
                {activeTab === "my-requests" && (
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Request Your First Transfer
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {transfer.transfer_number}
                          </h3>
                          <StatusBadge status={transfer.status} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-600">Enrollment</p>
                            <p className="text-sm font-medium text-gray-900">
                              {transfer.pension_enrollment?.enrollment_number || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transfer.pension_enrollment?.package_name}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">New Member</p>
                            <p className="text-sm font-medium text-gray-900">
                              {transfer.new_member_data?.name_english || transfer.new_member_data?.name_bangla || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transfer.new_member_registered ? (
                                <span className="text-green-600">✓ Registered</span>
                              ) : (
                                <span className="text-orange-600">Pending Registration</span>
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600">Financial</p>
                            <p className="text-sm font-medium text-gray-900">
                              Fee: {formatCurrency(transfer.transfer_fee)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Outstanding: {formatCurrency(transfer.outstanding_balance)}
                              {transfer.outstanding_cleared && (
                                <span className="text-green-600 ml-1">✓</span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                          <span>Requested: {formatDate(transfer.created_at)}</span>
                          {transfer.review_notes && (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              Has review notes
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(transfer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Status-specific messages */}
                    {transfer.status === 'approved' && !transfer.new_member_registered && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Transfer Approved!</strong> The new member can now register using the link sent to their email.
                        </p>
                      </div>
                    )}

                    {transfer.status === 'rejected' && transfer.review_notes && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Rejection Reason:</strong> {transfer.review_notes}
                        </p>
                      </div>
                    )}

                    {transfer.status === 'completed' && (
                      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <p className="text-sm text-purple-800">
                          <strong>Transfer Completed!</strong> The pension account has been successfully transferred to {transfer.new_member_data?.name_english || transfer.new_member_data?.name_bangla || "the new member"}.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showRequestModal && (
        <RequestTransferModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
          }}
        />
      )}

      {showDetailsModal && selectedTransfer && (
        <TransferDetailsModal
          transfer={selectedTransfer}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedTransfer(null);
          }}
        />
      )}
    </div>
  );
}
