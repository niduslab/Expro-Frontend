"use client";

import Image from "next/image";
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Shield,
  Mail,
  BadgeCheck,
  Wallet,
  TrendingUp,
  Users,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  IdCard,
} from "lucide-react";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import { useDigitalIdCard } from "@/lib/hooks/user/useDigitalIdCard";
import { DigitalIdCard } from "@/components/user/DigitalIdCard";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") ||
  "http://localhost:8000";

const storageUrl = (path: string) =>
  path.startsWith("http") ? path : `${BASE_URL}/storage/${path}`;

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const fmtCurrency = (amount?: string | number | null) =>
  amount ? `৳${parseFloat(String(amount)).toLocaleString()}` : "৳0";

export default function ProfilePage() {
  const { data: profile, isLoading } = useMyProfile();
  
  // Use the user ID to fetch their digital ID card
  const userId = profile?.id;
  
  const { data: digitalIdCardData, isLoading: isLoadingCard } = useDigitalIdCard(
    userId || 0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4" />
          <p className="text-sm text-[#6B7280]">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const m = profile.member;
  const wallet = profile.wallet;
  const pension = profile.pension_enrollments?.[0];
  const nominee = profile.nominee?.[0];
  const digitalIdCard = digitalIdCardData?.data;
  
  const initials = (m?.name_english || profile.email || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const statusConfig: Record<
    string,
    { bg: string; text: string; dot: string }
  > = {
    active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    pending: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
    inactive: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
    suspended: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  };
  const status =
    (profile.status === "approved" ? "active" : profile.status) || "inactive";
  const sc = statusConfig[status] || statusConfig.inactive;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#030712]">My Profile</h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Hero Card */}
        <div className="bg-gradient-to-br from-[#068847] to-[#045a2e] rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {m?.photo ? (
                  <Image
                    src={storageUrl(m.photo)}
                    alt={m.name_english || "Profile"}
                    width={120}
                    height={120}
                    unoptimized
                    className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white/20 shadow-xl"
                  />
                ) : (
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl bg-white/10 border-4 border-white/20 shadow-xl flex items-center justify-center text-white text-4xl font-bold backdrop-blur-sm">
                    {initials}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {m?.name_english || profile.email}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${sc.bg} ${sc.text}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`}
                    />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                
                {m?.name_bangla && (
                  <p className="text-white/80 text-lg mb-3">{m.name_bangla}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  <div className="flex items-center gap-2 text-white/90">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {m?.mobile && (
                    <div className="flex items-center gap-2 text-white/90">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{m.mobile}</span>
                    </div>
                  )}
                  {m?.member_id && (
                    <div className="flex items-center gap-2 text-white/90">
                      <Shield className="w-4 h-4" />
                      <span className="text-sm font-mono">{m.member_id}</span>
                    </div>
                  )}
                  {m?.membership_type && (
                    <div className="flex items-center gap-2 text-white/90">
                      <BadgeCheck className="w-4 h-4" />
                      <span className="text-sm capitalize">{m.membership_type} Member</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview Cards */}
        {wallet && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              icon={<Wallet className="w-5 h-5" />}
              label="Wallet Balance"
              value={fmtCurrency(wallet.balance)}
              bgColor="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Commission Earned"
              value={fmtCurrency(wallet.total_commission_earned)}
              bgColor="bg-emerald-50"
              iconColor="text-emerald-600"
            />
            <StatCard
              icon={<FileText className="w-5 h-5" />}
              label="Total Pension Paid"
              value={fmtCurrency(wallet.total_pension_paid)}
              bgColor="bg-purple-50"
              iconColor="text-purple-600"
            />
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Digital ID Card Section */}
            {userId && digitalIdCard && (
              <Section
                icon={<IdCard className="w-5 h-5 text-[#068847]" />}
                title="Digital Identity Card"
              >
                <DigitalIdCard cardData={digitalIdCard} />
              </Section>
            )}

            {userId && isLoadingCard && (
              <Section
                icon={<IdCard className="w-5 h-5 text-[#068847]" />}
                title="Digital Identity Card"
              >
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4" />
                  <p className="text-sm text-[#6B7280]">Loading digital ID card...</p>
                </div>
              </Section>
            )}

            {userId && !digitalIdCard && !isLoadingCard && (
              <Section
                icon={<IdCard className="w-5 h-5 text-[#068847]" />}
                title="Digital Identity Card"
              >
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-[#F3F4F6] rounded-full flex items-center justify-center">
                    <IdCard className="w-10 h-10 text-[#9CA3AF]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#030712] mb-2">
                    No Digital ID Card
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">
                    Your digital identity card has not been issued yet.
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    Please contact the administrator for more information.
                  </p>
                </div>
              </Section>
            )}

            {/* Personal Information */}
            <Section
              icon={<User className="w-5 h-5 text-[#068847]" />}
              title="Personal Information"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Full Name (English)" value={m?.name_english} />
                <InfoItem label="Full Name (Bangla)" value={m?.name_bangla} />
                <InfoItem
                  label="Father/Husband"
                  value={m?.father_husband_name}
                />
                <InfoItem label="Mother's Name" value={m?.mother_name} />
                <InfoItem
                  label="Date of Birth"
                  value={fmtDate(m?.user_date_of_birth)}
                />
                <InfoItem label="Gender" value={m?.gender} capitalize />
                <InfoItem label="Religion" value={m?.religion} capitalize />
                <InfoItem
                  label="Education"
                  value={
                    m?.academic_qualification_other || m?.academic_qualification
                  }
                  capitalize
                />
                <InfoItem label="NID Number" value={m?.nid_number} mono />
              </div>
            </Section>

            {/* Contact Information */}
            <Section
              icon={<Phone className="w-5 h-5 text-[#068847]" />}
              title="Contact Information"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Email Address" value={profile.email} />
                <InfoItem label="Mobile" value={m?.mobile} />
                <InfoItem label="Alternate Mobile" value={m?.alternate_mobile} />
              </div>
            </Section>

            {/* Address */}
            <Section
              icon={<MapPin className="w-5 h-5 text-[#068847]" />}
              title="Address"
            >
              <div className="space-y-4">
                <AddressBlock
                  label="Present Address"
                  address={m?.present_address}
                />
                <div className="border-t border-[#E5E7EB] pt-4">
                  <AddressBlock
                    label="Permanent Address"
                    address={m?.permanent_address}
                  />
                </div>
              </div>
            </Section>

            {/* Pension Enrollment */}
            {pension && (
              <Section
                icon={<FileText className="w-5 h-5 text-[#068847]" />}
                title="Pension Enrollment"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoItem
                    label="Enrollment Number"
                    value={pension.enrollment_number}
                    mono
                  />
                  <InfoItem
                    label="Status"
                    value={pension.status}
                    capitalize
                  />
                  <InfoItem
                    label="Start Date"
                    value={fmtDate(pension.start_date)}
                  />
                  <InfoItem
                    label="Maturity Date"
                    value={fmtDate(pension.maturity_date)}
                  />
                  <InfoItem
                    label="Installment Amount"
                    value={fmtCurrency(pension.amount_per_installment)}
                  />
                  <InfoItem
                    label="Maturity Amount"
                    value={fmtCurrency(pension.maturity_amount)}
                  />
                  <InfoItem
                    label="Installments Paid"
                    value={`${pension.installments_paid} / ${pension.total_installments}`}
                  />
                  <InfoItem
                    label="Total Paid"
                    value={fmtCurrency(pension.total_amount_paid)}
                  />
                </div>
                
                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6B7280]">Progress</span>
                    <span className="font-semibold text-[#030712]">
                      {Math.round((pension.installments_paid / pension.total_installments) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#068847] to-[#0a9f54] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(pension.installments_paid / pension.total_installments) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </Section>
            )}

            {/* Identity Documents */}
            <Section
              icon={<CreditCard className="w-5 h-5 text-[#068847]" />}
              title="Identity Documents"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <DocumentCard label="NID Front" path={m?.nid_front_photo} />
                <DocumentCard label="NID Back" path={m?.nid_back_photo} />
                <DocumentCard
                  label="Signature"
                  path={m?.signature}
                  contain
                />
                <DocumentCard label="Profile Photo" path={m?.photo} />
              </div>
            </Section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Membership Card */}
            <Section
              icon={<Calendar className="w-5 h-5 text-[#068847]" />}
              title="Membership"
            >
              <div className="space-y-3">
                <InfoItem label="Member ID" value={m?.member_id} mono />
                <InfoItem label="Type" value={m?.membership_type} capitalize />
                <InfoItem
                  label="Member Since"
                  value={fmtDate(m?.membership_date)}
                />
                <InfoItem
                  label="Expiry Date"
                  value={fmtDate(m?.membership_expiry_date)}
                />
                <InfoItem
                  label="Fee Paid"
                  value={fmtCurrency(m?.member_fee_paid)}
                />
                <InfoItem
                  label="Missed Payments"
                  value={String(m?.consecutive_missed_payments ?? 0)}
                />
              </div>
            </Section>

            {/* Nominee Information */}
            {nominee && (
              <Section
                icon={<Users className="w-5 h-5 text-[#068847]" />}
                title="Nominee"
              >
                <div className="space-y-3">
                  <InfoItem
                    label="Name (English)"
                    value={nominee.nominee_name_english}
                  />
                  <InfoItem
                    label="Name (Bangla)"
                    value={nominee.nominee_name_bangla}
                  />
                  <InfoItem
                    label="Date of Birth"
                    value={fmtDate(nominee.nominee_date_of_birth)}
                  />
                  <InfoItem label="Relation" value={nominee.relation} />
                  <InfoItem
                    label="Percentage"
                    value={`${nominee.percentage}%`}
                  />
                  {nominee.nominee_mobile && (
                    <InfoItem label="Mobile" value={nominee.nominee_mobile} />
                  )}
                  {nominee.is_primary && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#E0E7FF] text-[#4338CA]">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        Primary Nominee
                      </span>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Account Information */}
            <Section
              icon={<Shield className="w-5 h-5 text-[#068847]" />}
              title="Account"
            >
              <div className="space-y-3">
                <InfoItem label="Email" value={profile.email} />
                <InfoItem label="Status" value={status} capitalize />
                <InfoItem
                  label="Last Login"
                  value={
                    profile.last_login_at
                      ? new Date(profile.last_login_at).toLocaleString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )
                      : "—"
                  }
                />
                {profile.roles?.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-medium text-[#6B7280] mb-2">
                      Roles
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.roles.map((r: string) => (
                        <span
                          key={r}
                          className="text-xs px-2.5 py-1 bg-[#E0E7FF] text-[#4338CA] rounded-full font-medium capitalize"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Section>

            {/* Recent Transactions */}
            {profile.wallet_transactions?.length > 0 && (
              <Section
                icon={<TrendingUp className="w-5 h-5 text-[#068847]" />}
                title="Recent Transactions"
              >
                <div className="space-y-2">
                  {profile.wallet_transactions.slice(0, 5).map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            tx.type === "credit"
                              ? "bg-emerald-100"
                              : "bg-red-100"
                          }`}
                        >
                          {tx.type === "credit" ? (
                            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#030712] capitalize">
                            {tx.category.replace(/_/g, " ")}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF]">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          tx.type === "credit"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                        {fmtCurrency(tx.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Shared Components ── */

function StatCard({
  icon,
  label,
  value,
  bgColor,
  iconColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center ${iconColor}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-[#6B7280] mb-1">{label}</p>
          <p className="text-xl font-bold text-[#030712]">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#F9FAFB] to-white border-b border-[#E5E7EB]">
        <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-[#030712]">{title}</h3>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  mono,
  capitalize,
}: {
  label: string;
  value?: string | number | null;
  mono?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[#9CA3AF]">{label}</span>
      <span
        className={`text-sm text-[#030712] font-medium ${mono ? "font-mono" : ""} ${capitalize ? "capitalize" : ""}`}
      >
        {value ?? <span className="text-[#D1D5DB]">—</span>}
      </span>
    </div>
  );
}

function AddressBlock({
  label,
  address,
}: {
  label: string;
  address?: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#6B7280] mb-2">{label}</p>
      <p className="text-sm text-[#030712] leading-relaxed">
        {address || <span className="text-[#9CA3AF]">—</span>}
      </p>
    </div>
  );
}

function DocumentCard({
  label,
  path,
  contain,
}: {
  label: string;
  path?: string | null;
  contain?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-[#6B7280] mb-2">{label}</p>
      {path ? (
        <a
          href={storageUrl(path)}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-[#E5E7EB] bg-[#F9FAFB] hover:border-[#068847] transition-colors">
            <Image
              src={storageUrl(path)}
              alt={label}
              fill
              unoptimized
              className={`${contain ? "object-contain p-2" : "object-cover"} group-hover:scale-105 transition-transform duration-300`}
            />
          </div>
        </a>
      ) : (
        <div className="w-full h-32 rounded-xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] flex flex-col items-center justify-center gap-2">
          <CreditCard className="w-6 h-6 text-[#D1D5DB]" />
          <p className="text-xs text-[#9CA3AF]">Not uploaded</p>
        </div>
      )}
    </div>
  );
}
