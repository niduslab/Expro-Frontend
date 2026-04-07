"use client";

import { X, User, Mail, Phone, Calendar, MapPin, CreditCard, Package, Wallet as WalletIcon } from "lucide-react";
import Image from "next/image";
import { useMember } from "@/lib/hooks/admin/useMembers";

interface MemberViewModalProps {
  memberId: number;
  onClose: () => void;
}

export default function MemberViewModal({ memberId, onClose }: MemberViewModalProps) {
  const { data: response, isLoading, error } = useMember(memberId);
  const member = response?.data;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
              <p className="text-[#4A5565]">Loading member details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-2xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load member details</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const memberProfile = member.member;
  const wallet = member.wallet;
  const pensionEnrollments = member.pension_enrollments || [];
  const nominees = member.nominee || [];

  // Status badge
  const getStatusBadge = () => {
    const status = member.status === "approved" ? "active" : member.status;
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: "bg-[#CCFBF1]", text: "text-[#0D9488]", label: "Active" },
      pending: { bg: "bg-[#FEF3C7]", text: "text-[#92400E]", label: "Pending" },
      inactive: { bg: "bg-[#F3F4F6]", text: "text-gray-700", label: "Inactive" },
      suspended: { bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", label: "Suspended" },
    };
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-full ${config.bg} ${config.text}`}>
        <span className={`w-2 h-2 rounded-full ${config.text.replace('text-', 'bg-')}`} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full my-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-4">
            {memberProfile?.photo ? (
              <Image
                src={
                  memberProfile.photo.startsWith('http') 
                    ? memberProfile.photo 
                    : `http://localhost:8000/storage/${memberProfile.photo}`
                }
                alt={memberProfile.name_english || "Member"}
                width={64}
                height={64}
                className="rounded-full object-cover w-16 h-16"
                unoptimized
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#068847] to-[#045a2e] flex items-center justify-center text-white text-xl font-bold">
                {memberProfile?.name_english?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "NA"}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold text-[#030712]">
                {memberProfile?.name_english || member.email}
              </h2>
              <p className="text-sm text-[#4A5565] mt-1">
                {memberProfile?.member_id || `ID: ${member.id}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#4A5565]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status & Type */}
              <div className="bg-[#F9FAFB] rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Status</p>
                    {getStatusBadge()}
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Member Type</p>
                    <span className={`inline-flex text-[12px] font-medium px-3 py-1 rounded-full ${
                      memberProfile?.membership_type === "executive"
                        ? "text-[#6366F1] bg-[#E0E7FF]"
                        : "text-[#65A30D] bg-[#ECFCCB]"
                    }`}>
                      {memberProfile?.membership_type === "executive" ? "Executive" : "General"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Last Login</p>
                    <p className="text-sm font-medium text-[#030712]">
                      {member.last_login_at
                        ? new Date(member.last_login_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#068847]" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={<User className="w-4 h-4" />} label="Name (Bangla)" value={memberProfile?.name_bangla} />
                  <InfoItem icon={<User className="w-4 h-4" />} label="Father/Husband" value={memberProfile?.father_husband_name} />
                  <InfoItem icon={<User className="w-4 h-4" />} label="Mother's Name" value={memberProfile?.mother_name} />
                  <InfoItem icon={<Calendar className="w-4 h-4" />} label="Date of Birth" value={
                    memberProfile?.user_date_of_birth
                      ? new Date(memberProfile.user_date_of_birth).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"
                  } />
                  <InfoItem icon={<CreditCard className="w-4 h-4" />} label="NID Number" value={memberProfile?.nid_number} />
                  <InfoItem icon={<User className="w-4 h-4" />} label="Gender" value={memberProfile?.gender} />
                  <InfoItem icon={<User className="w-4 h-4" />} label="Religion" value={memberProfile?.religion} />
                  <InfoItem icon={<User className="w-4 h-4" />} label="Education" value={memberProfile?.academic_qualification} />
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#068847]" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem icon={<Mail className="w-4 h-4" />} label="Email" value={member.email} />
                  <InfoItem icon={<Phone className="w-4 h-4" />} label="Mobile" value={memberProfile?.mobile} />
                  <InfoItem icon={<Phone className="w-4 h-4" />} label="Alternate Mobile" value={memberProfile?.alternate_mobile || "N/A"} />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#068847]" />
                  Address Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Present Address</p>
                    <p className="text-sm text-[#030712]">{memberProfile?.present_address || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Permanent Address</p>
                    <p className="text-sm text-[#030712]">{memberProfile?.permanent_address || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Nominees */}
              {nominees.length > 0 && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#068847]" />
                    Nominees
                  </h3>
                  <div className="space-y-3">
                    {nominees.map((nominee: any, index: number) => (
                      <div key={nominee.id} className="p-3 bg-[#F9FAFB] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-[#030712]">{nominee.nominee_name_english}</p>
                          {nominee.is_primary && (
                            <span className="text-xs px-2 py-0.5 bg-[#068847] text-white rounded-full">Primary</span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <p className="text-[#6B7280]">Relation: <span className="text-[#030712]">{nominee.relation}</span></p>
                          <p className="text-[#6B7280]">Share: <span className="text-[#030712]">{nominee.percentage}%</span></p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Financial & Membership */}
            <div className="space-y-6">
              {/* Wallet */}
              <div className="bg-gradient-to-br from-[#068847] to-[#045a2e] rounded-xl p-5 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <WalletIcon className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Wallet</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Current Balance</p>
                    <p className="text-2xl font-bold">৳{parseFloat(wallet?.balance || "0").toLocaleString()}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                    <div>
                      <p className="text-xs text-white/70 mb-1">Commission</p>
                      <p className="text-sm font-semibold">৳{parseFloat(wallet?.commission_balance || "0").toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70 mb-1">Total Earned</p>
                      <p className="text-sm font-semibold">৳{parseFloat(wallet?.total_commission_earned || "0").toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-white/70 mb-1">Deposited</p>
                      <p className="text-sm font-semibold">৳{parseFloat(wallet?.total_deposited || "0").toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/70 mb-1">Withdrawn</p>
                      <p className="text-sm font-semibold">৳{parseFloat(wallet?.total_withdrawn || "0").toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership Info */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#068847]" />
                  Membership
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Member Since</p>
                    <p className="text-sm font-medium text-[#030712]">
                      {memberProfile?.membership_date
                        ? new Date(memberProfile.membership_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Expiry Date</p>
                    <p className="text-sm font-medium text-[#030712]">
                      {memberProfile?.membership_expiry_date
                        ? new Date(memberProfile.membership_expiry_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280] mb-1">Fee Paid</p>
                    <p className="text-sm font-medium text-[#030712]">
                      ৳{parseFloat(memberProfile?.member_fee_paid || "0").toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pension Enrollments */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#068847]" />
                  Pension Plans
                </h3>
                {pensionEnrollments.length > 0 ? (
                  <div className="space-y-3">
                    {pensionEnrollments.map((enrollment: any) => (
                      <div key={enrollment.id} className="p-3 bg-[#F9FAFB] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-[#030712]">{enrollment.enrollment_number}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            enrollment.status === "active"
                              ? "bg-[#CCFBF1] text-[#0D9488]"
                              : "bg-[#F3F4F6] text-gray-700"
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className="text-[#6B7280]">
                            Installment: <span className="text-[#030712] font-medium">৳{parseFloat(enrollment.amount_per_installment).toLocaleString()}</span>
                          </p>
                          <p className="text-[#6B7280]">
                            Paid: <span className="text-[#030712] font-medium">{enrollment.installments_paid}/{enrollment.total_installments}</span>
                          </p>
                          <p className="text-[#6B7280]">
                            Maturity: <span className="text-[#030712] font-medium">৳{parseFloat(enrollment.maturity_amount).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#6B7280] text-center py-4">No pension plans enrolled</p>
                )}
              </div>

              {/* Roles & Permissions */}
              {member.roles && member.roles.length > 0 && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-[#030712] mb-4">Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.roles.map((role: string) => (
                      <span key={role} className="text-xs px-3 py-1 bg-[#E0E7FF] text-[#6366F1] rounded-full font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors">
            Edit Member
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-[#6B7280] mb-1 flex items-center gap-1">
        <span className="text-[#068847]">{icon}</span>
        {label}
      </p>
      <p className="text-sm text-[#030712] font-medium capitalize">{value || "N/A"}</p>
    </div>
  );
}
