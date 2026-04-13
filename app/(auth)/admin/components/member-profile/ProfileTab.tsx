"use client";

import { User, Phone, MapPin, CreditCard, Calendar, Package, Wallet as WalletIcon } from "lucide-react";
import Image from "next/image";
import { InfoItem } from "./shared";

interface ProfileTabProps {
  member: any;
  memberProfile: any;
  wallet: any;
  pensionEnrollments: any[];
  nominees: any[];
}

export default function ProfileTab({ member, memberProfile, wallet, pensionEnrollments, nominees }: ProfileTabProps) {
  return (
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
            <DocumentImage
              label="NID Front"
              src={memberProfile?.nid_front_photo}
            />
            <DocumentImage
              label="NID Back"
              src={memberProfile?.nid_back_photo}
            />
            <DocumentImage
              label="Signature"
              src={memberProfile?.signature}
              isSignature
            />
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
  );
}

function DocumentImage({ label, src, isSignature = false }: { label: string; src?: string; isSignature?: boolean }) {
  if (!src) {
    return (
      <div>
        <p className="text-xs text-[#6B7280] mb-2">{label}</p>
        <div className="w-full h-32 bg-[#F3F4F6] rounded-lg flex items-center justify-center text-sm text-[#6B7280]">
          No {label.toLowerCase()}
        </div>
      </div>
    );
  }

  const imageUrl = `http://localhost:8000/storage/${src}`;

  return (
    <div>
      <p className="text-xs text-[#6B7280] mb-2">{label}</p>
      <a href={imageUrl} target="_blank" rel="noopener noreferrer" className="block">
        <Image
          src={imageUrl}
          alt={label}
          width={200}
          height={120}
          className={`rounded-lg border border-[#E5E7EB] w-full h-32 hover:opacity-80 transition-opacity ${
            isSignature ? "object-contain bg-white p-2" : "object-cover"
          }`}
          unoptimized
        />
      </a>
    </div>
  );
}
