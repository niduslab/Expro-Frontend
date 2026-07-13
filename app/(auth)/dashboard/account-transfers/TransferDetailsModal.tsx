import { MemberAccountTransfer } from "@/lib/hooks/user/useAccountTransfers";
import { useCancelTransfer } from "@/lib/hooks/user/useAccountTransfers";
import { X, User, FileText, DollarSign, Calendar, AlertCircle, XCircle } from "lucide-react";

interface TransferDetailsModalProps {
  transfer: MemberAccountTransfer;
  onClose: () => void;
}

export default function TransferDetailsModal({ transfer, onClose }: TransferDetailsModalProps) {
  const cancelMutation = useCancelTransfer();

  const formatCurrency = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null) return '৳0';
    return `৳${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const reasonLabels: Record<string, string> = {
    unable_to_continue: "Unable to Continue",
    financial_difficulties: "Financial Difficulties",
    relocation: "Relocation",
    health_issues: "Health Issues",
    other: "Other",
  };

  const canCancel = ['requested', 'under_review'].includes(transfer.status);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this transfer request?")) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(transfer.id);
      alert("Transfer request cancelled successfully");
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to cancel transfer");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Transfer Details</h2>
            <p className="text-sm text-gray-600 mt-1">{transfer.transfer_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  transfer.status === 'completed' ? 'text-green-600' :
                  transfer.status === 'rejected' ? 'text-red-600' :
                  transfer.status === 'approved' ? 'text-green-600' :
                  transfer.status === 'under_review' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {transfer.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Requested:</span>
                <span className="text-gray-900">{formatDate(transfer.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Pension Enrollment */}
          {transfer.pension_enrollment && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-900">Pension Enrollment</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Enrollment #:</span>
                  <p className="font-medium text-gray-900">{transfer.pension_enrollment.enrollment_number}</p>
                </div>
                <div>
                  <span className="text-gray-600">Package:</span>
                  <p className="font-medium text-gray-900">{transfer.pension_enrollment.package_name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Monthly Amount:</span>
                  <p className="font-medium text-gray-900">{formatCurrency(transfer.pension_enrollment.monthly_amount)}</p>
                </div>
                <div>
                  <span className="text-gray-600">Installments Paid:</span>
                  <p className="font-medium text-gray-900">
                    {transfer.pension_enrollment.installments_paid} / {transfer.pension_enrollment.total_installments}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* New Member Information */}
          {transfer.new_member_data && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">New Member Information</h3>
                {transfer.new_member_registered && (
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    ✓ Registered
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium text-gray-900">{transfer.new_member_data.name_english || transfer.new_member_data.name_bangla}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium text-gray-900">{transfer.new_member_data.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium text-gray-900">{transfer.new_member_data.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">NID:</span>
                  <p className="font-medium text-gray-900">{transfer.new_member_data.nid}</p>
                </div>
              </div>
            </div>
          )}

          {/* Financial Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <h3 className="text-sm font-semibold text-gray-900">Financial Details</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Outstanding Balance:</span>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(transfer.outstanding_balance)}</p>
                  {transfer.outstanding_cleared ? (
                    <span className="text-xs text-green-600">✓ Cleared</span>
                  ) : (
                    <span className="text-xs text-red-600">Pending</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Transfer Fee (2%):</span>
                <p className="font-medium text-gray-900">{formatCurrency(transfer.transfer_fee)}</p>
              </div>
            </div>
          </div>

          {/* Transfer Reason */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Transfer Reason</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Category:</span>
                <p className="font-medium text-gray-900">{reasonLabels[transfer.transfer_reason]}</p>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Details:</span>
                <p className="text-gray-900 mt-1">{transfer.reason_details}</p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {transfer.documents && transfer.documents.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Supporting Documents</h3>
              <div className="space-y-2">
                {transfer.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.filename}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${doc.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Notes */}
          {transfer.review_notes && (
            <div className={`border rounded-lg p-4 ${
              transfer.status === 'rejected' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start gap-2">
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  transfer.status === 'rejected' ? 'text-red-600' : 'text-blue-600'
                }`} />
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {transfer.status === 'rejected' ? 'Rejection Reason' : 'Admin Notes'}
                  </h3>
                  <p className="text-sm text-gray-700">{transfer.review_notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status-specific messages */}
          {transfer.status === 'approved' && !transfer.new_member_registered && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-green-900 mb-2">Next Steps</h3>
              <p className="text-sm text-green-800">
                Your transfer has been approved! The new member ({transfer.new_member_data?.name_english || transfer.new_member_data?.name_bangla}) will receive an email with registration instructions.
                Once they complete registration, the admin will finalize the transfer.
              </p>
            </div>
          )}

          {transfer.status === 'completed' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-purple-900 mb-2">Transfer Completed</h3>
              <p className="text-sm text-purple-800">
                This transfer has been successfully completed. The pension account has been transferred to {transfer.new_member_data?.name_english || transfer.new_member_data?.name_bangla}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Transfer"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
