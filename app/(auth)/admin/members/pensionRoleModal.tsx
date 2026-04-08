"use client";

import { useState } from "react";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { usePromotePensionEnrollment, useDemotePensionEnrollment } from "@/lib/hooks/admin/useProjectHook";
import { toast } from "sonner";

interface PensionRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
  memberName: string;
  pensionEnrollments: any[];
}

type RoleType = 'executive_member' | 'project_presenter' | 'assistant_pp';
type ActionType = 'promote' | 'demote';

export default function PensionRoleModal({
  isOpen,
  onClose,
  memberId,
  memberName,
  pensionEnrollments,
}: PensionRoleModalProps) {
  const [action, setAction] = useState<ActionType>('promote');
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<RoleType>('executive_member');
  const [paymentId, setPaymentId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const { mutate: promote, isPending: isPromoting } = usePromotePensionEnrollment();
  const { mutate: demote, isPending: isDemoting } = useDemotePensionEnrollment();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEnrollmentId) {
      toast.error("Please select a pension enrollment");
      return;
    }

    if (action === 'promote') {
      if (selectedRole === 'executive_member' && !paymentId) {
        toast.error("Payment ID is required for Executive Member role");
        return;
      }

      const params: any = {
        enrollmentId: Number(selectedEnrollmentId),
        role: selectedRole,
      };

      if (selectedRole === 'executive_member' && paymentId) {
        params.payment_id = Number(paymentId);
      }

      if (notes) {
        params.notes = notes;
      }

      toast.loading("Promoting member...", { id: "pension-role-action" });

      promote(params, {
        onSuccess: (res) => {
          toast.success(res.message || "Member promoted successfully!", { id: "pension-role-action" });
          onClose();
          resetForm();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to promote member", { id: "pension-role-action" });
        },
      });
    } else {
      // Demote
      if (!reason) {
        toast.error("Please provide a reason for demotion");
        return;
      }

      toast.loading("Demoting member...", { id: "pension-role-action" });

      demote(
        {
          enrollmentId: Number(selectedEnrollmentId),
          reason,
        },
        {
          onSuccess: (res) => {
            toast.success(res.message || "Member demoted successfully!", { id: "pension-role-action" });
            onClose();
            resetForm();
          },
          onError: (err: any) => {
            toast.error(err.message || "Failed to demote member", { id: "pension-role-action" });
          },
        }
      );
    }
  };

  const resetForm = () => {
    setSelectedEnrollmentId('');
    setPaymentId('');
    setNotes('');
    setReason('');
    setSelectedRole('executive_member');
    setAction('promote');
  };

  const isPending = isPromoting || isDemoting;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              action === 'promote' ? 'bg-[#F0FDF4]' : 'bg-[#FEF3C7]'
            }`}>
              {action === 'promote' ? (
                <TrendingUp className="w-5 h-5 text-[#068847]" />
              ) : (
                <TrendingDown className="w-5 h-5 text-[#F59E0B]" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#030712]">
                {action === 'promote' ? 'Promote' : 'Demote'} Member
              </h3>
              <p className="text-sm text-[#4A5565]">{memberName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F4F6] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-[#4A5565]" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Action Toggle */}
          <div className="flex gap-2 p-1 bg-[#F3F4F6] rounded-lg">
            <button
              type="button"
              onClick={() => setAction('promote')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                action === 'promote'
                  ? 'bg-white text-[#068847] shadow-sm'
                  : 'text-[#4A5565] hover:text-[#030712]'
              }`}
            >
              Promote
            </button>
            <button
              type="button"
              onClick={() => setAction('demote')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                action === 'demote'
                  ? 'bg-white text-[#F59E0B] shadow-sm'
                  : 'text-[#4A5565] hover:text-[#030712]'
              }`}
            >
              Demote
            </button>
          </div>

          {/* Pension Enrollment Selection */}
          <div>
            <label className="block text-sm font-medium text-[#030712] mb-2">
              Select Pension Enrollment <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedEnrollmentId}
              onChange={(e) => setSelectedEnrollmentId(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] text-sm"
              required
            >
              <option value="">Choose enrollment...</option>
              {pensionEnrollments.map((enrollment: any) => (
                <option key={enrollment.id} value={enrollment.id}>
                  {enrollment.pension_package?.name || `Enrollment #${enrollment.id}`} - {enrollment.enrollment_number}
                </option>
              ))}
            </select>
            {pensionEnrollments.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                No pension enrollments found for this member
              </p>
            )}
          </div>

          {action === 'promote' ? (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-2">
                  Select Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as RoleType)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] text-sm"
                >
                  <option value="executive_member">Executive Member</option>
                  <option value="project_presenter">Project Presenter</option>
                  <option value="assistant_pp">Assistant PP</option>
                </select>
              </div>

              {/* Payment ID (for Executive Member) */}
              {selectedRole === 'executive_member' && (
                <div>
                  <label className="block text-sm font-medium text-[#030712] mb-2">
                    Payment ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    placeholder="Enter payment ID"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] text-sm"
                    required
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    Payment must be completed and ≥ ৳60,000
                  </p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  rows={3}
                  maxLength={1000}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#068847]/20 focus:border-[#068847] text-sm resize-none"
                />
                <p className="text-xs text-[#6B7280] mt-1">
                  {notes.length}/1000 characters
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Demotion Reason */}
              <div>
                <label className="block text-sm font-medium text-[#030712] mb-2">
                  Reason for Demotion <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Provide a reason for demotion..."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] text-sm resize-none"
                  required
                />
                <p className="text-xs text-[#6B7280] mt-1">
                  {reason.length}/500 characters
                </p>
              </div>

              {/* Warning */}
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-lg p-3">
                <p className="text-xs text-[#92400E]">
                  <strong>Warning:</strong> This will demote the member to General Member and remove all role-specific permissions.
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || pensionEnrollments.length === 0}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                action === 'promote'
                  ? 'bg-[#068847] text-white hover:bg-[#057038]'
                  : 'bg-[#F59E0B] text-white hover:bg-[#D97706]'
              }`}
            >
              {isPending ? (action === 'promote' ? 'Promoting...' : 'Demoting...') : (action === 'promote' ? 'Promote' : 'Demote')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
