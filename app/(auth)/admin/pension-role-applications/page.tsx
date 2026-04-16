"use client";

import { useState } from "react";
import {
  CheckCircle2,
  X,
  Clock,
  CreditCard,
  Search,
  Filter,
  Eye,
  Loader2,
  Award,
  FileText,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  useAllApplications,
  useApplicationStats,
  useApproveApplication,
  useRejectApplication,
} from "@/lib/hooks/user/usePensionRoleApplications";
import { toast } from "sonner";

export default function AdminPensionRoleApplicationsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: applicationsData, isLoading, refetch } = useAllApplications({
    page: currentPage,
    per_page: 20,
    search: searchTerm,
    status: statusFilter,
    requested_role: roleFilter,
  });

  const { data: statsData } = useApplicationStats();
  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const applications = applicationsData?.data || [];
  const pagination = applicationsData?.meta;
  const stats = statsData?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "under_review":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "payment_pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <X className="w-4 h-4" />;
      case "under_review":
        return <Clock className="w-4 h-4" />;
      case "payment_pending":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;

    try {
      await approveMutation.mutateAsync({
        id: selectedApplication.id,
        data: { review_notes: reviewNotes },
      });
      setShowApproveModal(false);
      setSelectedApplication(null);
      setReviewNotes("");
      refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleReject = async () => {
    if (!selectedApplication) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await rejectMutation.mutateAsync({
        id: selectedApplication.id,
        data: {
          rejection_reason: rejectionReason,
          review_notes: reviewNotes,
        },
      });
      setShowRejectModal(false);
      setSelectedApplication(null);
      setRejectionReason("");
      setReviewNotes("");
      refetch();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatCurrency = (amount: number) => {
    return "৳" + parseFloat(String(amount || 0)).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pension Role Applications</h1>
        <p className="text-gray-600 mt-2">
          Review and manage member role applications
        </p>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_applications}</p>
          </div>
          <div className="bg-white border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Payment Pending</p>
            <p className="text-3xl font-bold text-amber-600">{stats.by_status.payment_pending}</p>
          </div>
          <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Under Review</p>
            <p className="text-3xl font-bold text-blue-600">{stats.by_status.under_review}</p>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.by_status.approved}</p>
          </div>
          <div className="bg-white border-2 border-red-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{stats.by_status.rejected}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by application number or member..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="payment_pending">Payment Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="executive_member">Executive Member</option>
            <option value="project_presenter">Project Presenter</option>
            <option value="assistant_pp">Assistant PP</option>
          </select>

          <button
            onClick={() => refetch()}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No applications found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Application
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Requested Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app: any) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {app.application_number}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.pension_enrollment?.enrollment_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {app.user?.member?.name_english || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {app.user?.member?.member_id || app.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {app.requested_role.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          From: {app.current_role.replace(/_/g, " ")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {app.payment_required ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(app.application_fee)}
                            </p>
                            {app.payment_completed ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                <CheckCircle2 className="w-3 h-3" />
                                Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                                <Clock className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">No payment</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(app.status)}`}>
                          {getStatusIcon(app.status)}
                          {app.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(app.applied_at).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {app.status === "under_review" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setShowApproveModal(true);
                                }}
                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                title="Approve"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedApplication(app);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedApplication(app)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.last_page && pagination.last_page > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t-2 border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{" "}
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
                  {pagination.total} results
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Approve Application</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to approve this application? The role will be automatically assigned to the member.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Application Number</p>
              <p className="font-semibold text-gray-900">{selectedApplication.application_number}</p>
              <p className="text-sm text-gray-600 mt-2 mb-1">Member</p>
              <p className="font-semibold text-gray-900">
                {selectedApplication.user?.member?.name_english}
              </p>
              <p className="text-sm text-gray-600 mt-2 mb-1">Requested Role</p>
              <p className="font-semibold text-gray-900">
                {selectedApplication.requested_role.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="Add any notes about this approval..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={approveMutation.isPending}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {approveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedApplication(null);
                  setReviewNotes("");
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Application</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting this application.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Application Number</p>
              <p className="font-semibold text-gray-900">{selectedApplication.application_number}</p>
              <p className="text-sm text-gray-600 mt-2 mb-1">Member</p>
              <p className="font-semibold text-gray-900">
                {selectedApplication.user?.member?.name_english}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="Explain why this application is being rejected..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                placeholder="Add any additional notes..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {rejectMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    Reject
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedApplication(null);
                  setRejectionReason("");
                  setReviewNotes("");
                }}
                className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {selectedApplication && !showApproveModal && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
              <button
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Application Number</p>
                  <p className="font-semibold text-gray-900">{selectedApplication.application_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusIcon(selectedApplication.status)}
                    {selectedApplication.status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Name</p>
                  <p className="font-semibold text-gray-900">
                    {selectedApplication.user?.member?.name_english || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member ID</p>
                  <p className="font-semibold text-gray-900">
                    {selectedApplication.user?.member?.member_id || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Role</p>
                  <p className="font-semibold text-gray-900">
                    {selectedApplication.current_role.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Requested Role</p>
                  <p className="font-semibold text-gray-900">
                    {selectedApplication.requested_role.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </p>
                </div>
              </div>

              {selectedApplication.payment_required && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Application Fee</p>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(selectedApplication.application_fee)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    {selectedApplication.payment_completed ? (
                      <span className="inline-flex items-center gap-1 text-sm text-green-600 font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-semibold">
                        <Clock className="w-4 h-4" />
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600 mb-1">Application Reason</p>
                <p className="text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                  {selectedApplication.application_reason}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Applied Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedApplication.applied_at).toLocaleString()}
                </p>
              </div>

              {selectedApplication.reviewed_at && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Reviewed Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedApplication.reviewed_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedApplication.review_notes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Review Notes</p>
                      <p className="text-gray-900 bg-gray-50 border border-gray-200 rounded-lg p-3">
                        {selectedApplication.review_notes}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
