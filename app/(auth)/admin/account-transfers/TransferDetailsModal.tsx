import { AccountTransfer } from "@/lib/hooks/admin/useAccountTransfers";
import { X, User, FileText, DollarSign, CheckCircle, XCircle, Users } from "lucide-react";

interface TransferDetailsModalProps {
  transfer: AccountTransfer;
  onClose: () => void;
}

export default function TransferDetailsModal({ transfer, onClose }: TransferDetailsModalProps) {
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
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
          {/* Status and Timeline */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Status & Timeline</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Status:</span>
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
              {transfer.reviewed_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Reviewed:</span>
                  <span className="text-gray-900">{formatDate(transfer.reviewed_at)}</span>
                </div>
              )}
              {transfer.approved_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Approved:</span>
                  <span className="text-gray-900">{formatDate(transfer.approved_at)}</span>
                </div>
              )}
              {transfer.completed_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completed:</span>
                  <span className="text-gray-900">{formatDate(transfer.completed_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* From Member */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">From Member</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <p className="font-medium text-gray-900">{transfer.from_user?.name || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600">Member ID:</span>
                <p className="font-medium text-gray-900">{transfer.from_user?.member_id || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Email:</span>
                <p className="font-medium text-gray-900">{transfer.from_user?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* New Member Information */}
          {transfer.new_member_data && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-5 w-5 text-green-600" />
                <h3 className="text-sm font-semibold text-gray-900">New Member Information</h3>
                {transfer.new_member_registered && (
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    ✓ Account Created
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium text-gray-900">{transfer.new_member_data.name}</p>
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
                <div>
                  <span className="text-gray-600">Date of Birth:</span>
                  <p className="font-medium text-gray-900">{transfer.new_member_data.date_of_birth}</p>
                </div>
                <div>
                  <span className="text-gray-600">Gender:</span>
                  <p className="font-medium text-gray-900 capitalize">{transfer.new_member_data.gender}</p>
                </div>
                {transfer.new_member_data.father_name && (
                  <div>
                    <span className="text-gray-600">Father&apos;s Name:</span>
                    <p className="font-medium text-gray-900">{transfer.new_member_data.father_name}</p>
                  </div>
                )}
                {transfer.new_member_data.mother_name && (
                  <div>
                    <span className="text-gray-600">Mother&apos;s Name:</span>
                    <p className="font-medium text-gray-900">{transfer.new_member_data.mother_name}</p>
                  </div>
                )}
                {transfer.new_member_data.religion && (
                  <div>
                    <span className="text-gray-600">Religion:</span>
                    <p className="font-medium text-gray-900 capitalize">{transfer.new_member_data.religion}</p>
                  </div>
                )}
                {transfer.new_member_data.present_address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Present Address:</span>
                    <p className="font-medium text-gray-900">{transfer.new_member_data.present_address}</p>
                  </div>
                )}
                {transfer.new_member_data.permanent_address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Permanent Address:</span>
                    <p className="font-medium text-gray-900">{transfer.new_member_data.permanent_address}</p>
                  </div>
                )}
                {/* Legacy address field for backward compatibility */}
                {!transfer.new_member_data.present_address && transfer.new_member_data.address && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium text-gray-900">{transfer.new_member_data.address}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Nominees Information */}
          {transfer.new_member_data?.nominees && transfer.new_member_data.nominees.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-5 w-5 text-indigo-600" />
                <h3 className="text-sm font-semibold text-gray-900">Nominees ({transfer.new_member_data.nominees.length})</h3>
              </div>
              <div className="space-y-4">
                {transfer.new_member_data.nominees.map((nominee, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">Nominee {index + 1}</h4>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                        {nominee.percentage}%
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Name:</span>
                        <p className="font-medium text-gray-900">{nominee.name}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Relation:</span>
                        <p className="font-medium text-gray-900 capitalize">{nominee.relation}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Phone:</span>
                        <p className="font-medium text-gray-900">{nominee.phone}</p>
                      </div>
                      {nominee.nid && (
                        <div>
                          <span className="text-gray-600">NID:</span>
                          <p className="font-medium text-gray-900">{nominee.nid}</p>
                        </div>
                      )}
                      {nominee.date_of_birth && (
                        <div>
                          <span className="text-gray-600">Date of Birth:</span>
                          <p className="font-medium text-gray-900">{nominee.date_of_birth}</p>
                        </div>
                      )}
                      {nominee.address && (
                        <div className="col-span-2">
                          <span className="text-gray-600">Address:</span>
                          <p className="font-medium text-gray-900">{nominee.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  <span className="text-gray-600">Total Installments:</span>
                  <p className="font-medium text-gray-900">{transfer.pension_enrollment.total_installments}</p>
                </div>
                <div>
                  <span className="text-gray-600">Installments Paid:</span>
                  <p className="font-medium text-gray-900">{transfer.pension_enrollment.installments_paid}</p>
                </div>
                <div>
                  <span className="text-gray-600">Total Paid:</span>
                  <p className="font-medium text-gray-900">{formatCurrency(transfer.pension_enrollment.total_amount_paid)}</p>
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
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Cleared
                    </span>
                  ) : (
                    <span className="text-xs text-red-600 flex items-center gap-1">
                      <XCircle className="h-3 w-3" /> Pending
                    </span>
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
                          {(doc.size / 1024).toFixed(2)} KB • {doc.mime_type}
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
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Review Notes</h3>
              <p className="text-sm text-gray-700">{transfer.review_notes}</p>
              {transfer.reviewer && (
                <p className="text-xs text-gray-500 mt-2">
                  By {transfer.reviewer.name} on {transfer.reviewed_at && formatDate(transfer.reviewed_at)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
