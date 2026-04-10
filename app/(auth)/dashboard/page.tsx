"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Wallet,
  Package,
  Users,
  Building2,
  TrendingUp,
  Shield,
  Calendar,
  Bell,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useMyProfile } from "@/lib/hooks/admin/useUsers";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const { data: userData, isLoading } = useMyProfile();
  console.log(userData);
  const data = userData as any;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#068847] mx-auto mb-3" />
          <p className="text-sm text-[#6B7280]">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const member = data.member || {};
  const wallet = data.wallet || {};
  const nominees = data.nominee || [];
  const enrollments = data.pension_enrollments || [];
  const transactions = data.wallet_transactions || [];
  const branch = data.branch;

  const initials = (member.name_english || data.email || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fmt = (n: string | number) =>
    "৳" +
    parseFloat(String(n || 0)).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
    });

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const membershipStart = member.membership_date
    ? new Date(member.membership_date)
    : null;
  const membershipEnd = member.membership_expiry_date
    ? new Date(member.membership_expiry_date)
    : null;
  const membershipPct =
    membershipStart && membershipEnd
      ? Math.min(
          100,
          Math.max(
            0,
            ((Date.now() - membershipStart.getTime()) /
              (membershipEnd.getTime() - membershipStart.getTime())) *
              100,
          ),
        )
      : 0;

  const statusColors: Record<
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
    (data.status === "approved" ? "active" : data.status) || "inactive";
  const sc = statusColors[status] || statusColors.inactive;

  return (
    <div className="container mx-auto  mb-4 ">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* ── Top greeting bar ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#030712]">
              Welcome back, {member.name_english?.split(" ")[0] || "Member"}
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* ── Hero member card ── */}
        <div className="relative bg-[#068847] rounded-2xl overflow-hidden">
          {/* Top section */}
          <div className="relative px-6 pt-5 pb-5 md:px-6 md:pt-6 flex flex-row items-start gap-8">
            {/* Avatar / Photo */}
            <div className="flex-shrink-0 w-[68px] h-[68px]">
              {userData?.member?.photo ? (
                <Image
                  src={
                    userData?.member?.photo.startsWith("http")
                      ? userData?.member?.photo
                      : `${process.env.NEXT_PUBLIC_API_URL || ""}/${userData?.member?.photo}`
                  }
                  alt={userData?.member?.name_english || "Member"}
                  width={68}
                  height={68}
                  className="w-[68px] h-[68px] rounded-2xl object-cover border-2 border-white/30"
                  unoptimized
                />
              ) : (
                <div className="w-[88px] h-[68px] p-3 px-4 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-xl font-semibold tracking-tight">
                  {initials}
                </div>
              )}
            </div>

            {/* Name + chips */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-white text-2xl font-semibold leading-snug">
                  {member.name_english || data.email}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full  border border-white/25 text-white whitespace-nowrap">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              <p className="text-gray-300 text-[12.5px] mb-3.5 truncate">
                {data.email}
                {member.mobile && <>&nbsp;&nbsp;·&nbsp;&nbsp;{member.mobile}</>}
              </p>

              {/* Info chips */}
              <div className="flex items-center gap-2 flex-wrap pt-4 w-full ">
                {[
                  {
                    label: "Member ID",
                    value: member.member_id || `#${data.id}`,
                  },
                  {
                    label: "Type",
                    value:
                      (member.membership_type || "General")
                        .charAt(0)
                        .toUpperCase() +
                      (member.membership_type || "General").slice(1),
                  },
                  { label: "Joined", value: fmtDate(member.membership_date) },
                  {
                    label: "Expires",
                    value: fmtDate(member.membership_expiry_date),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-gray-500 border border-green-200 rounded-xl px-6 py-4"
                  >
                    <p className="text-white/50 text-[10px] uppercase tracking-wide mb-2">
                      {label}
                    </p>
                    <p
                      className={`text-white text-[13px] font-medium leading-none `}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right mini-stat grid — md+ only */}
            <div className="hidden md:grid grid-cols-2 gap-1.5 flex-shrink-0 w-44">
              {[
                { label: "Wallet", value: fmt(wallet.balance || 0) },
                {
                  label: "Commission",
                  value: fmt(wallet.commission_balance || 0),
                },
                {
                  label: "Pension plans",
                  value: `${enrollments.length} enrolled`,
                },
                {
                  label: "Nominees",
                  value: `${nominees.length} ${nominees.length === 1 ? "person" : "people"}`,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-black/[0.12] border border-white/[0.12] rounded-lg px-2.5 py-1.5"
                >
                  <p className="text-white/50 text-[10px] mb-0.5">{label}</p>
                  <p className="text-white text-[12px] font-medium leading-snug">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative bg-black/[0.12]  px-5 md:px-6 py-2.5 flex items-center gap-1 flex-wrap">
            <svg
              className="w-3 h-3 text-white/40 flex-shrink-0 mr-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-white/50 text-[11px]">
              Last login:&nbsp;
              <span className="text-white/80 font-medium">
                {data.last_login_at
                  ? new Date(data.last_login_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })
                  : "Never"}
              </span>
            </span>
            <span className="w-1 h-1 rounded-full bg-white/25 mx-1.5" />
            <span className="text-white/50 text-[11px]">
              Role:&nbsp;
              <span className="text-white/80 font-medium capitalize">
                {data.roles?.[0] || "member"}
              </span>
            </span>
            {data.permissions?.length > 0 && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/25 mx-1.5" />
                <span className="text-white/50 text-[11px]">
                  Permissions:&nbsp;
                  <span className="text-white/80 font-medium">
                    {data.permissions.length} granted
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── 4 stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Wallet Balance",
              value: fmt(wallet.balance || 0),
              sub: `${fmt(wallet.total_deposited || 0)} deposited`,
              icon: Wallet,
              iconBg: "bg-blue-50",
              iconColor: "text-blue-600",
              accent: "border-blue-100",
            },
            {
              label: "Commission",
              value: fmt(wallet.commission_balance || 0),
              sub: `${fmt(wallet.total_commission_earned || 0)} total earned`,
              icon: TrendingUp,
              iconBg: "bg-emerald-50",
              iconColor: "text-emerald-600",
              accent: "border-emerald-100",
            },
            {
              label: "Pension Plans",
              value: String(enrollments.length),
              sub:
                enrollments.length === 0
                  ? "None enrolled"
                  : `${enrollments.filter((e: any) => e.status === "active").length} active`,
              icon: Package,
              iconBg: "bg-amber-50",
              iconColor: "text-amber-600",
              accent: "border-amber-100",
            },
            {
              label: "Nominees",
              value: String(nominees.length),
              sub:
                nominees.length > 0
                  ? `${nominees.filter((n: any) => n.is_primary).length} primary`
                  : "None added",
              icon: Users,
              iconBg: "bg-purple-50",
              iconColor: "text-purple-600",
              accent: "border-purple-100",
            },
          ].map(
            ({ label, value, sub, icon: Icon, iconBg, iconColor, accent }) => (
              <div
                key={label}
                className={`bg-white rounded-xl border border-gray-200 shadow-sm ${accent} p-4`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}
                  >
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-[#030712] leading-none">
                  {value}
                </p>
                <p className="text-xs text-[#6B7280] mt-1.5">{label}</p>
                <p className="text-[11px] text-[#9CA3AF] mt-0.5">{sub}</p>
              </div>
            ),
          )}
        </div>

        {/* ── 5 navigation section cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Profile */}
          <Link
            href="/dashboard/profile"
            className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-[#068847]/30 hover:shadow-sm transition-all block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-[#E6F4EC] rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-[#068847]" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#068847] transition-colors mt-1" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              My Profile
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Personal information, contact details, address, and identity
              documents.
            </p>
            <div className="space-y-1.5">
              <ProfileRow label="Name" value={member.name_english || "—"} />
              <ProfileRow label="Mobile" value={member.mobile || "—"} />
              <ProfileRow
                label="NID"
                value={
                  member.nid_number ? `••••${member.nid_number.slice(-4)}` : "—"
                }
              />
            </div>
          </Link>

          {/* Wallet */}
          <Link
            href="/dashboard/wallet"
            className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-blue-200 hover:shadow-sm transition-all block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-blue-500 transition-colors mt-1" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              Wallet
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Balance, transaction history, deposits, withdrawals and
              commissions.
            </p>
            <div className="bg-[#F9FAFB] rounded-lg p-3 space-y-2">
              <WalletRow
                label="Balance"
                value={fmt(wallet.balance || 0)}
                highlight
              />
              <WalletRow
                label="Commission"
                value={fmt(wallet.commission_balance || 0)}
              />
              <WalletRow
                label="Total withdrawn"
                value={fmt(wallet.total_withdrawn || 0)}
              />
            </div>
            {wallet.is_locked && (
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <Shield className="w-3 h-3" /> Wallet is locked
              </div>
            )}
          </Link>

          {/* Pension */}
          <Link
            href="/dashboard/pension"
            className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-amber-200 hover:shadow-sm transition-all block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-amber-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-amber-500 transition-colors mt-1" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              Pension Plans
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Enrollment details, installment history, maturity amounts and
              progress.
            </p>
            {enrollments.length > 0 ? (
              <div className="space-y-2">
                {enrollments.slice(0, 2).map((e: any) => (
                  <div key={e.id} className="bg-[#F9FAFB] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs font-semibold text-[#030712] truncate pr-2">
                        {e.pension_package?.name || "Package"}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          e.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#6B7280] mb-1.5">
                      <span>
                        {e.installments_paid}/{e.total_installments} paid
                      </span>
                      <span className="font-semibold text-[#068847]">
                        {fmt(e.maturity_amount)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width: `${(e.installments_paid / e.total_installments) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <Package className="w-6 h-6 text-amber-300 mx-auto mb-1.5" />
                <p className="text-xs text-amber-700 font-medium">
                  No plans enrolled
                </p>
                <p className="text-[11px] text-amber-600 mt-0.5">
                  Explore available pension packages
                </p>
              </div>
            )}
          </Link>

          {/* Nominees */}
          <Link
            href="/dashboard/nominees"
            className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-purple-200 hover:shadow-sm transition-all block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-purple-500 transition-colors mt-1" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              Nominees
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Manage who receives your benefits — names, relations and share
              percentages.
            </p>
            {nominees.length > 0 ? (
              <div className="space-y-2">
                {nominees.map((n: any) => (
                  <div
                    key={n.id}
                    className="flex items-center gap-3 bg-[#F9FAFB] rounded-lg p-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-semibold flex-shrink-0">
                      {(n.nominee_name_english || "?")
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#030712] truncate">
                        {n.nominee_name_english}
                      </p>
                      <p className="text-[11px] text-[#6B7280]">
                        {n.relation} · {n.percentage}%
                      </p>
                    </div>
                    {n.is_primary && (
                      <span className="text-[10px] px-2 py-0.5 bg-[#068847] text-white rounded-full font-medium flex-shrink-0">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Users className="w-6 h-6 text-purple-300 mx-auto mb-1.5" />
                <p className="text-xs text-purple-700 font-medium">
                  No nominees added
                </p>
              </div>
            )}
          </Link>

          {/* Branch */}
          <Link
            href="/dashboard/branch"
            className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-teal-200 hover:shadow-sm transition-all block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-teal-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-teal-500 transition-colors mt-1" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              Branch
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Your assigned branch, contact information and branch
              representative details.
            </p>
            {branch ? (
              <div className="space-y-1.5">
                <ProfileRow label="Branch" value={branch.name || "—"} />
                <ProfileRow label="Code" value={branch.code || "—"} />
                <ProfileRow label="Contact" value={branch.phone || "—"} />
              </div>
            ) : (
              <div className="bg-teal-50 rounded-lg p-4 text-center">
                <Building2 className="w-6 h-6 text-teal-300 mx-auto mb-1.5" />
                <p className="text-xs text-teal-700 font-medium">
                  No branch assigned
                </p>
                <p className="text-[11px] text-teal-600 mt-0.5">
                  Contact admin to assign a branch
                </p>
              </div>
            )}
          </Link>

          {/* Recent transactions quick card */}
          <Link
            href="/dashboard/wallet"
            className="group bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-[#E5E7EB] hover:shadow-sm transition-all block"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-[#6B7280]" />
              </div>
              <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#6B7280] transition-colors mt-1" />
            </div>
            <h3 className="text-sm font-semibold text-[#030712] mb-1">
              Recent Activity
            </h3>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Latest wallet transactions and payment activity.
            </p>
            {transactions.length > 0 ? (
              <div className="space-y-2">
                {transactions.slice(0, 3).map((tx: any) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-1.5 border-b border-[#F3F4F6] last:border-0"
                  >
                    <div>
                      <p className="text-xs font-medium text-[#030712] capitalize">
                        {tx.category?.replace(/_/g, " ")}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold ${tx.type === "credit" ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {fmt(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#F9FAFB] rounded-lg p-4 text-center">
                <Activity className="w-6 h-6 text-[#D1D5DB] mx-auto mb-1.5" />
                <p className="text-xs text-[#9CA3AF] font-medium">
                  No transactions yet
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* ── Membership timeline bar ── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-[#068847]" />
            <h3 className="text-sm font-semibold text-[#030712]">
              Membership Timeline
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right min-w-[80px]">
              <p className="text-[11px] text-[#9CA3AF]">Joined</p>
              <p className="text-xs font-semibold text-[#030712]">
                {fmtDate(member.membership_date)}
              </p>
            </div>
            <div className="flex-1">
              <div className="relative h-3 bg-[#F3F4F6] rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#068847] to-[#4ade80] rounded-full transition-all duration-700"
                  style={{ width: `${membershipPct}%` }}
                />
                {/* today marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#068847] rounded-full shadow-sm transition-all duration-700"
                  style={{ left: `calc(${membershipPct}% - 6px)` }}
                />
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-[#9CA3AF]">0%</span>
                <span className="text-[10px] font-medium text-[#068847]">
                  {membershipPct.toFixed(1)}% elapsed
                </span>
                <span className="text-[10px] text-[#9CA3AF]">100%</span>
              </div>
            </div>
            <div className="min-w-[80px]">
              <p className="text-[11px] text-[#9CA3AF]">Expires</p>
              <p className="text-xs font-semibold text-[#030712]">
                {fmtDate(member.membership_expiry_date)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Permissions chip list ── */}
        {data.permissions && data.permissions.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-[#068847]" />
              <h3 className="text-sm font-semibold text-[#030712]">
                Your Permissions
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.permissions.map((p: string) => (
                <span
                  key={p}
                  className="text-[11px] px-2.5 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-full font-medium capitalize"
                >
                  {p.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Small helper components ── */

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-[#F3F4F6] last:border-0">
      <span className="text-[11px] text-[#9CA3AF]">{label}</span>
      <span className="text-[11px] font-medium text-[#030712] truncate ml-2 max-w-[60%] text-right">
        {value}
      </span>
    </div>
  );
}

function WalletRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-[#9CA3AF]">{label}</span>
      <span
        className={`text-[12px] font-semibold ${highlight ? "text-[#030712]" : "text-[#6B7280]"}`}
      >
        {value}
      </span>
    </div>
  );
}
