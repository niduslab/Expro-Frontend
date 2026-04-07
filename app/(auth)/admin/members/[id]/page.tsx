"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Calendar, MapPin, CreditCard, Package, Wallet as WalletIcon, Edit } from "lucide-react";
import Image from "next/image";
import { useMember } from "@/lib/hooks/admin/useMembers";

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const memberId = Number(params.id);
  const [activeTab, setActiveTab] = useState<'profile' | 'pension_enrollments' | 'pension_installments' | 'wallet' | 'wallet_transactions' | 'nominees'>('profile');

  const { data: response, isLoading, error } = useMember(memberId);
  const member = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
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
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-500 mb-2">Failed to load member details</p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038]"
              >
                Go Back
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
    <div className="min-h-screen p-6 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto space-y-6">

         {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-2">
          <div className="flex flex-wrap gap-2">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              label="Profile"
            />
            <TabButton
              active={activeTab === 'pension_enrollments'}
              onClick={() => setActiveTab('pension_enrollments')}
              label="Pension Enrollments"
              count={pensionEnrollments.length}
            />
            <TabButton
              active={activeTab === 'pension_installments'}
              onClick={() => setActiveTab('pension_installments')}
              label="Pension Installments"
              count={member.pension_installments?.length || 0}
            />
            <TabButton
              active={activeTab === 'wallet'}
              onClick={() => setActiveTab('wallet')}
              label="Wallet"
            />
            <TabButton
              active={activeTab === 'wallet_transactions'}
              onClick={() => setActiveTab('wallet_transactions')}
              label="Transactions"
              count={member.wallet_transactions?.length || 0}
            />
            <TabButton
              active={activeTab === 'nominees'}
              onClick={() => setActiveTab('nominees')}
              label="Nominees"
              count={nominees.length}
            />
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#4A5565] hover:text-[#068847] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Members</span>
            </button>
            {/* here add few buttons like profilce, pension_installments , pension_enrollments, one page, wallet, wallet_transactions, nominee */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors">
              <Edit className="w-4 h-4" />
              Edit Member
            </button>
          </div>

          <div className="flex items-center gap-6">
            {memberProfile?.photo ? (
              <Image
                src={
                  memberProfile.photo.startsWith('http') 
                    ? memberProfile.photo 
                    : `http://localhost:8000/storage/${memberProfile.photo}`
                }
                alt={memberProfile.name_english || "Member"}
                width={96}
                height={96}
                className="rounded-full object-cover w-24 h-24"
                unoptimized
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#068847] to-[#045a2e] flex items-center justify-center text-white text-3xl font-bold">
                {memberProfile?.name_english?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "NA"}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#030712] mb-2">
                {memberProfile?.name_english || member.email}
              </h1>
              <p className="text-[#4A5565] mb-3">
                {memberProfile?.member_id || `ID: ${member.id}`}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {getStatusBadge()}
                <span className={`inline-flex text-[12px] font-medium px-3 py-1 rounded-full ${
                  memberProfile?.membership_type === "executive"
                    ? "text-[#6366F1] bg-[#E0E7FF]"
                    : "text-[#65A30D] bg-[#ECFCCB]"
                }`}>
                  {memberProfile?.membership_type === "executive" ? "Executive" : "General"}
                </span>
                <span className="text-sm text-[#6B7280]">
                  Last Login: {member.last_login_at
                    ? new Date(member.last_login_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Never"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#068847]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Name (Bangla)" value={memberProfile?.name_bangla} />
                <InfoItem label="Father/Husband" value={memberProfile?.father_husband_name} />
                <InfoItem label="Mother's Name" value={memberProfile?.mother_name} />
                <InfoItem label="Date of Birth" value={
                  memberProfile?.user_date_of_birth
                    ? new Date(memberProfile.user_date_of_birth).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"
                } />
                <InfoItem label="NID Number" value={memberProfile?.nid_number} />
                <InfoItem label="Gender" value={memberProfile?.gender} />
                <InfoItem label="Religion" value={memberProfile?.religion} />
                <InfoItem label="Education" value={memberProfile?.academic_qualification} />
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#068847]" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem label="Email" value={member.email} />
                <InfoItem label="Mobile" value={memberProfile?.mobile} />
                <InfoItem label="Alternate Mobile" value={memberProfile?.alternate_mobile || "N/A"} />
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
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

            {/* Documents */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#068847]" />
                Documents
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* NID Front */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-2">NID Front</p>
                  {memberProfile?.nid_front_photo ? (
                    <a
                      href={`http://localhost:8000/storage/${memberProfile.nid_front_photo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Image
                        src={`http://localhost:8000/storage/${memberProfile.nid_front_photo}`}
                        alt="NID Front"
                        width={200}
                        height={120}
                        className="rounded-lg border border-[#E5E7EB] object-cover w-full h-32 hover:opacity-80 transition-opacity"
                        unoptimized
                      />
                    </a>
                  ) : (
                    <div className="w-full h-32 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-sm text-[#6B7280]">
                      No document
                    </div>
                  )}
                </div>

                {/* NID Back */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-2">NID Back</p>
                  {memberProfile?.nid_back_photo ? (
                    <a
                      href={`http://localhost:8000/storage/${memberProfile.nid_back_photo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Image
                        src={`http://localhost:8000/storage/${memberProfile.nid_back_photo}`}
                        alt="NID Back"
                        width={200}
                        height={120}
                        className="rounded-lg border border-[#E5E7EB] object-cover w-full h-32 hover:opacity-80 transition-opacity"
                        unoptimized
                      />
                    </a>
                  ) : (
                    <div className="w-full h-32 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-sm text-[#6B7280]">
                      No document
                    </div>
                  )}
                </div>

                {/* Signature */}
                <div>
                  <p className="text-xs text-[#6B7280] mb-2">Signature</p>
                  {memberProfile?.signature ? (
                    <a
                      href={`http://localhost:8000/storage/${memberProfile.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Image
                        src={`http://localhost:8000/storage/${memberProfile.signature}`}
                        alt="Signature"
                        width={200}
                        height={120}
                        className="rounded-lg border border-[#E5E7EB] object-contain w-full h-32 bg-white hover:opacity-80 transition-opacity p-2"
                        unoptimized
                      />
                    </a>
                  ) : (
                    <div className="w-full h-32 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-sm text-[#6B7280]">
                      No signature
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nominees */}
            {nominees.length > 0 && (
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#068847]" />
                  Nominees
                </h3>
                <div className="space-y-3">
                  {nominees.map((nominee: any) => (
                    <div key={nominee.id} className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-[#030712]">{nominee.nominee_name_english}</p>
                        {nominee.is_primary && (
                          <span className="text-xs px-2 py-0.5 bg-[#068847] text-white rounded-full">Primary</span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
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
            <div className="bg-gradient-to-br from-[#068847] to-[#045a2e] rounded-xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <WalletIcon className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Wallet</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-white/70 mb-1">Current Balance</p>
                  <p className="text-3xl font-bold">৳{parseFloat(wallet?.balance || "0").toLocaleString()}</p>
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
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
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
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-[#030712] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#068847]" />
                Pension Plans
              </h3>
              {pensionEnrollments.length > 0 ? (
                <div className="space-y-3">
                  {pensionEnrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="p-4 bg-gradient-to-br from-[#F0F9FF] to-[#F0FDF4] rounded-lg border border-[#E5E7EB] hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#030712] mb-1">
                            {enrollment.pension_package?.name || "Unknown Package"}
                          </p>
                          <p className="text-xs text-[#6B7280] font-mono">
                            {enrollment.enrollment_number}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          enrollment.status === "active"
                            ? "bg-[#CCFBF1] text-[#0D9488]"
                            : "bg-[#F3F4F6] text-gray-700"
                        }`}>
                          {enrollment.status}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B7280]">Monthly:</span>
                          <span className="text-[#030712] font-semibold">৳{parseFloat(enrollment.amount_per_installment).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#6B7280]">Progress:</span>
                          <span className="text-[#030712] font-semibold">{enrollment.installments_paid}/{enrollment.total_installments}</span>
                        </div>
                        <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden mt-2">
                          <div 
                            className="bg-gradient-to-r from-[#068847] to-[#045a2e] h-full rounded-full"
                            style={{ width: `${(enrollment.installments_paid / enrollment.total_installments) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#E5E7EB]">
                          <span className="text-[#6B7280]">Maturity:</span>
                          <span className="text-[#068847] font-bold">৳{parseFloat(enrollment.maturity_amount).toLocaleString()}</span>
                        </div>
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
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
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
        )}

        {/* Pension Enrollments Tab */}
        {activeTab === 'pension_enrollments' && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[#030712] mb-6">Pension Enrollments</h3>
            {pensionEnrollments.length > 0 ? (
              <div className="space-y-6">
                {pensionEnrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-[#068847] to-[#045a2e] p-6 text-white">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Package className="w-6 h-6" />
                            <h4 className="text-xl font-bold">
                              {enrollment.pension_package?.name || "Unknown Package"}
                            </h4>
                          </div>
                          <p className="text-sm text-white/80 mb-1">
                            {enrollment.pension_package?.name_bangla || ""}
                          </p>
                          <p className="text-xs text-white/70 font-mono">
                            Enrollment: {enrollment.enrollment_number}
                          </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                          enrollment.status === "active"
                            ? "bg-white text-[#068847]"
                            : "bg-white/20 text-white"
                        }`}>
                          {enrollment.status.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/20">
                        <div>
                          <p className="text-xs text-white/70 mb-1">Monthly Payment</p>
                          <p className="text-2xl font-bold">৳{parseFloat(enrollment.amount_per_installment).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Maturity Amount</p>
                          <p className="text-2xl font-bold">৳{parseFloat(enrollment.maturity_amount).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/70 mb-1">Progress</p>
                          <p className="text-2xl font-bold">{enrollment.installments_paid}/{enrollment.total_installments}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-6 py-4 bg-[#F9FAFB]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#030712]">Payment Progress</span>
                        <span className="text-sm font-semibold text-[#068847]">
                          {((enrollment.installments_paid / enrollment.total_installments) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#068847] to-[#045a2e] h-full rounded-full transition-all duration-300"
                          style={{ width: `${(enrollment.installments_paid / enrollment.total_installments) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-2 text-xs text-[#6B7280]">
                        <span>Paid: ৳{parseFloat(enrollment.total_amount_paid).toLocaleString()}</span>
                        <span>Remaining: {enrollment.installments_remaining} installments</span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="p-6 bg-white">
                      <h5 className="text-sm font-semibold text-[#030712] mb-4 uppercase tracking-wide">Enrollment Details</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <InfoItem label="Enrollment Date" value={new Date(enrollment.enrollment_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                        <InfoItem label="Start Date" value={new Date(enrollment.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                        <InfoItem label="Maturity Date" value={new Date(enrollment.maturity_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} />
                        <InfoItem label="Next Due Date" value={enrollment.next_due_date ? new Date(enrollment.next_due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"} />
                        <InfoItem label="Missed Installments" value={
                          <span className={enrollment.missed_installments > 0 ? "text-red-600 font-semibold" : ""}>
                            {enrollment.missed_installments}
                          </span>
                        } />
                        <InfoItem label="Profit Share" value={`${enrollment.profit_share_percentage}%`} />
                        <InfoItem label="Sponsored By" value={enrollment.sponsored_by ? `Member #${enrollment.sponsored_by}` : "Self"} />
                        <InfoItem label="Commission Paid" value={enrollment.joining_commission_paid ? "Yes" : "No"} />
                      </div>

                      {/* Package Description */}
                      {enrollment.pension_package?.description && (
                        <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                          <h5 className="text-sm font-semibold text-[#030712] mb-2">Package Description</h5>
                          <p className="text-sm text-[#6B7280] leading-relaxed">{enrollment.pension_package.description}</p>
                        </div>
                      )}

                      {/* Notes */}
                      {enrollment.notes && (
                        <div className="mt-4 p-4 bg-[#FEF3C7] border border-[#FDE68A] rounded-lg">
                          <p className="text-sm text-[#92400E]">
                            <span className="font-semibold">Note:</span> {enrollment.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-[#E5E7EB] mx-auto mb-4" />
                <p className="text-[#6B7280] text-lg">No pension enrollments found</p>
              </div>
            )}
          </div>
        )}

        {/* Pension Installments Tab */}
        {activeTab === 'pension_installments' && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[#030712] mb-6">Pension Installments</h3>
            {member.pension_installments && member.pension_installments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Installment #</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Paid Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {member.pension_installments.map((installment: any) => (
                      <tr key={installment.id} className="hover:bg-[#F9FAFB]">
                        <td className="px-4 py-3 text-sm text-[#030712]">{installment.installment_number}</td>
                        <td className="px-4 py-3 text-sm text-[#030712]">
                          {new Date(installment.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#030712]">
                          ৳{parseFloat(installment.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030712]">
                          {installment.paid_date ? new Date(installment.paid_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            installment.status === "paid"
                              ? "bg-[#CCFBF1] text-[#0D9488]"
                              : installment.status === "pending"
                              ? "bg-[#FEF3C7] text-[#92400E]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}>
                            {installment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-[#6B7280] py-8">No pension installments found</p>
            )}
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[#030712] mb-6">Wallet Details</h3>
            {wallet ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-[#068847] to-[#045a2e] rounded-lg text-white">
                    <p className="text-sm text-white/70 mb-1">Current Balance</p>
                    <p className="text-3xl font-bold">৳{parseFloat(wallet.balance).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-1">Commission Balance</p>
                    <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.commission_balance).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-1">Total Earned</p>
                    <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_commission_earned).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-1">Total Deposited</p>
                    <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_deposited).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-1">Total Withdrawn</p>
                    <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_withdrawn).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-1">Membership Paid</p>
                    <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_membership_paid).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-1">Pension Paid</p>
                    <p className="text-2xl font-bold text-[#030712]">৳{parseFloat(wallet.total_pension_paid).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <p className="text-sm text-[#6B7280] mb-1">Status</p>
                    <p className="text-lg font-bold">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        wallet.is_locked ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-[#CCFBF1] text-[#0D9488]"
                      }`}>
                        {wallet.is_locked ? "Locked" : "Active"}
                      </span>
                    </p>
                  </div>
                </div>
                {wallet.is_locked && (
                  <div className="p-4 bg-[#FEE2E2] border border-[#FCA5A5] rounded-lg">
                    <p className="text-sm font-medium text-[#991B1B]">Wallet is currently locked</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-[#6B7280] py-8">No wallet information found</p>
            )}
          </div>
        )}

        {/* Wallet Transactions Tab */}
        {activeTab === 'wallet_transactions' && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[#030712] mb-6">Wallet Transactions</h3>
            {member.wallet_transactions && member.wallet_transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Transaction ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Balance After</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3F4F6]">
                    {member.wallet_transactions.map((transaction: any) => (
                      <tr key={transaction.id} className="hover:bg-[#F9FAFB]">
                        <td className="px-4 py-3 text-sm font-mono text-[#030712]">{transaction.transaction_id}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "credit"
                              ? "bg-[#CCFBF1] text-[#0D9488]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030712] capitalize">{transaction.category.replace(/_/g, ' ')}</td>
                        <td className="px-4 py-3 text-sm font-medium text-[#030712]">
                          ৳{parseFloat(transaction.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030712]">
                          ৳{parseFloat(transaction.balance_after).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "completed"
                              ? "bg-[#CCFBF1] text-[#0D9488]"
                              : transaction.status === "pending"
                              ? "bg-[#FEF3C7] text-[#92400E]"
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#030712]">
                          {new Date(transaction.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-[#6B7280] py-8">No transactions found</p>
            )}
          </div>
        )}

        {/* Nominees Tab */}
        {activeTab === 'nominees' && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6">
            <h3 className="text-xl font-semibold text-[#030712] mb-6">Nominees</h3>
            {nominees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nominees.map((nominee: any) => (
                  <div key={nominee.id} className="p-6 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-[#030712]">{nominee.nominee_name_english}</h4>
                      {nominee.is_primary && (
                        <span className="px-3 py-1 bg-[#068847] text-white rounded-full text-xs font-medium">Primary</span>
                      )}
                    </div>
                    <div className="space-y-3">
                      <InfoItem label="Name (Bangla)" value={nominee.nominee_name_bangla} />
                      <InfoItem label="Date of Birth" value={
                        nominee.nominee_date_of_birth 
                          ? new Date(nominee.nominee_date_of_birth).toLocaleDateString() 
                          : "N/A"
                      } />
                      <InfoItem label="Relation" value={nominee.relation} />
                      <InfoItem label="Percentage" value={`${nominee.percentage}%`} />
                      <InfoItem label="NID Number" value={nominee.nominee_nid_number || "N/A"} />
                      <InfoItem label="Mobile" value={nominee.nominee_mobile || "N/A"} />
                      {nominee.address && (
                        <div>
                          <p className="text-xs text-[#6B7280] mb-1">Address</p>
                          <p className="text-sm text-[#030712]">{nominee.address}</p>
                        </div>
                      )}
                      <InfoItem label="Status" value={
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          nominee.is_active ? "bg-[#CCFBF1] text-[#0D9488]" : "bg-[#F3F4F6] text-gray-700"
                        }`}>
                          {nominee.is_active ? "Active" : "Inactive"}
                        </span>
                      } />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#6B7280] py-8">No nominees found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? "bg-[#068847] text-white"
          : "bg-white text-[#4A5565] hover:bg-[#F3F4F6]"
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          active ? "bg-white/20" : "bg-[#E5E7EB]"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-[#6B7280] mb-1">{label}</p>
      <p className="text-sm text-[#030712] font-medium">{value || "N/A"}</p>
    </div>
  );
}
