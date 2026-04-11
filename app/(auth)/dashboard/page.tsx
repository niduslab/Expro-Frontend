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
  Calendar,
  ChevronRight,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Banknote,
} from "lucide-react";
import { useMemberDashboard } from "@/lib/hooks/admin/useUsers";
import Image from "next/image";

export default function DashboardPage() {
  const router = useRouter();
  const { data: dashboardData, isLoading } = useMemberDashboard();

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

  if (!dashboardData) return null;

  const { user, member_profile, stats, pension_enrollments, upcoming_installments, pending_membership_fees, recent_payments, recent_transactions } = dashboardData;

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

  const displayName = member_profile?.name_english || user?.name || user?.email || "Member";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const photoUrl = member_profile?.photo
    ? member_profile.photo.startsWith("http")
      ? member_profile.photo
      : `${process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/storage/${member_profile.photo}`
    : null;

  return (
    <div className="container mx-auto mb-4">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Top greeting bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#030712]">
              Welcome back, {displayName.split(" ")[0]}
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Hero member card */}
        <div className="relative bg-gradient-to-br from-green-500 to-green-700 border-2 border-green-200 rounded-xl p-5 shadow-md overflow-hidden shadow-xl">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="relative px-6 pt-6 pb-5">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* Avatar and basic info */}
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 w-24 h-24">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt={displayName}
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-2xl object-cover border-3 border-white/40 shadow-2xl ring-4 ring-white/20"
                      unoptimized
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-3 border-white/40 flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-white/20">
                      {initials}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h2 className="text-white text-2xl font-bold tracking-tight">
                      {displayName}
                    </h2>
                    {user?.status && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-300/30 text-white backdrop-blur-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {member_profile?.name_bangla && (
                      <p className="text-white/90 text-sm flex items-center gap-2">
                        <span className="text-white/60">নাম:</span>
                        {member_profile.name_bangla}
                      </p>
                    )}
                    <p className="text-white/90 text-sm flex items-center gap-2">
                      <span className="text-white/60">Email:</span>
                      {user?.email}
                    </p>
                    {member_profile?.mobile && (
                      <p className="text-white/90 text-sm flex items-center gap-2">
                        <span className="text-white/60">Mobile:</span>
                        {member_profile.mobile}
                      </p>
                    )}
                    <p className="text-white/90 text-sm flex items-center gap-2">
                      <span className="text-white/60">Member ID:</span>
                      <span className="font-mono font-semibold">{user?.member_id || "N/A"}</span>
                    </p>
                    {member_profile?.membership_type && (
                      <p className="text-white/90 text-sm flex items-center gap-2">
                        <span className="text-white/60">Membership:</span>
                        <span className="capitalize font-medium">{member_profile.membership_type}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick stats grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
                {[
                  { 
                    label: "Wallet Balance", 
                    value: fmt(stats?.wallet?.balance || 0), 
                    icon: Wallet,
                    color: "from-blue-400 to-blue-600"
                  },
                  { 
                    label: "Commission", 
                    value: fmt(stats?.wallet?.commission_balance || 0), 
                    icon: TrendingUp,
                    color: "from-emerald-400 to-emerald-600"
                  },
                  { 
                    label: "Active Plans", 
                    value: stats?.pension?.active_enrollments || 0, 
                    icon: Package,
                    color: "from-amber-400 to-amber-600"
                  },
                  { 
                    label: "Pension Paid", 
                    value: fmt(stats?.wallet?.total_pension_paid || 0), 
                    icon: DollarSign,
                    color: "from-purple-400 to-purple-600"
                  },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white/15 backdrop-blur-md border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all shadow-lg">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="text-white text-xl font-bold leading-none mb-1.5">{value}</p>
                    <p className="text-white/70 text-[10px] uppercase tracking-wider font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom info strip */}
          <div className="relative bg-black/25 backdrop-blur-md px-6 py-3 flex items-center gap-4 flex-wrap text-xs border-t border-white/10">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/60">Role:</span>
              <span className="text-white font-semibold capitalize">{user?.roles?.[0] || "member"}</span>
            </div>
            {member_profile?.nid_number && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-2">
                  <span className="text-white/60">NID:</span>
                  <span className="text-white font-mono font-medium">
                    ••••{member_profile.nid_number.slice(-4)}
                  </span>
                </div>
              </>
            )}
            {member_profile?.gender && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Gender:</span>
                  <span className="text-white font-medium capitalize">{member_profile.gender}</span>
                </div>
              </>
            )}
            {member_profile?.religion && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-2">
                  <span className="text-white/60">Religion:</span>
                  <span className="text-white font-medium">{member_profile.religion}</span>
                </div>
              </>
            )}
            {member_profile?.user_date_of_birth && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-2">
                  <span className="text-white/60">DOB:</span>
                  <span className="text-white font-medium">
                    {new Date(member_profile.user_date_of_birth).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Wallet Balance */}
          <Link href="/dashboard/wallets" className="group">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-blue-300 transition-all h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                  <Wallet className="w-7 h-7 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl font-bold text-[#030712] mb-1">
                {fmt(stats?.wallet?.balance || 0)}
              </p>
              <p className="text-sm font-medium text-[#6B7280] mb-4">Wallet Balance</p>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Commission</span>
                  <span className="font-semibold text-emerald-600">
                    {fmt(stats?.wallet?.commission_balance || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Total Earned</span>
                  <span className="font-medium text-[#6B7280]">
                    {fmt(stats?.wallet?.total_commission_earned || 0)}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Pension Stats */}
          <Link href="/dashboard/pension" className="group">
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-amber-300 transition-all h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-3xl font-bold text-[#030712] mb-1">
                {stats?.pension?.total_enrollments || 0}
              </p>
              <p className="text-sm font-medium text-[#6B7280] mb-4">Pension Plans</p>
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Active Plans</span>
                  <span className="font-semibold text-emerald-600">
                    {stats?.pension?.active_enrollments || 0}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9CA3AF]">Installments Paid</span>
                  <span className="font-medium text-[#6B7280]">
                    {stats?.pension?.total_installments_paid || 0}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Payment Stats */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-emerald-300 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                <CreditCard className="w-7 h-7 text-white" />
              </div>
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-[#030712] mb-1">
              {stats?.payments?.total_completed || 0}
            </p>
            <p className="text-sm font-medium text-[#6B7280] mb-4">Completed Payments</p>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#9CA3AF]">Total Amount</span>
                <span className="font-semibold text-emerald-600">
                  {fmt(stats?.payments?.total_amount_paid || 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9CA3AF]">Pension Paid</span>
                <span className="font-medium text-[#6B7280]">
                  {fmt(stats?.pension?.total_amount_paid || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Membership Stats */}
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 hover:shadow-lg hover:border-purple-300 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <Banknote className="w-7 h-7 text-white" />
              </div>
              {stats?.membership?.pending_fees_count > 0 && (
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
              )}
            </div>
            <p className="text-3xl font-bold text-[#030712] mb-1">
              {fmt(stats?.wallet?.total_membership_paid || 0)}
            </p>
            <p className="text-sm font-medium text-[#6B7280] mb-4">Membership Paid</p>
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#9CA3AF]">Pending Fees</span>
                <span className={`font-semibold ${stats?.membership?.pending_fees_count > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {stats?.membership?.pending_fees_count || 0}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#9CA3AF]">Pending Amount</span>
                <span className="font-medium text-[#6B7280]">
                  {fmt(stats?.membership?.pending_fees_amount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column - 2/3 width */}
          <div className="lg:col-span-2 space-y-5">
            {/* Membership Timeline */}
            {member_profile?.membership_date && (
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#030712]">
                      Membership Information
                    </h3>
                    <p className="text-xs text-[#6B7280]">
                      Your membership details
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <p className="text-xs text-purple-600 mb-2 font-medium">Membership Started</p>
                    <p className="text-lg font-bold text-purple-900">
                      {fmtDate(member_profile.membership_date)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                    <p className="text-xs text-emerald-600 mb-2 font-medium">Membership Fee Paid</p>
                    <p className="text-lg font-bold text-emerald-900">
                      {fmt(member_profile.member_fee_paid || 0)}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <p className="text-xs text-blue-600 mb-2 font-medium">Membership Type</p>
                    <p className="text-lg font-bold text-blue-900 capitalize">
                      {member_profile.membership_type}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Installments */}
            {upcoming_installments && upcoming_installments.length > 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#030712]">
                        Upcoming Installments
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        {stats?.pension?.upcoming_installments_count || upcoming_installments.length} payments due
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/pension"
                    className="text-sm text-[#068847] hover:text-[#045a2e] font-semibold flex items-center gap-1 group"
                  >
                    View all
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {upcoming_installments.slice(0, 5).map((installment: any, idx: number) => {
                    const daysUntilDue = Math.ceil(
                      (new Date(installment.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysUntilDue <= 7;
                    
                    return (
                      <div
                        key={installment.id}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                          isUrgent
                            ? 'bg-red-50 border-red-200 hover:border-red-300'
                            : 'bg-amber-50 border-amber-200 hover:border-amber-300'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                            isUrgent ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            #{installment.installment_number}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#030712] mb-1">
                              Installment Payment
                            </p>
                            <div className="flex items-center gap-3 text-xs text-[#6B7280]">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {fmtDate(installment.due_date)}
                              </span>
                              {daysUntilDue > 0 && (
                                <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                                  {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''} left
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold mb-1 ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
                            {fmt(installment.amount)}
                          </p>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                            installment.status === 'upcoming'
                              ? 'bg-amber-100 text-amber-700'
                              : installment.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {installment.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pension Enrollments */}
            {pension_enrollments && pension_enrollments.length > 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#030712]">
                        Active Pension Plans
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        {pension_enrollments.length} plan{pension_enrollments.length !== 1 ? 's' : ''} enrolled
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard/pension"
                    className="text-sm text-[#068847] hover:text-[#045a2e] font-semibold flex items-center gap-1 group"
                  >
                    Manage
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {pension_enrollments.map((enrollment: any) => {
                    const progress = (enrollment.installments_paid / enrollment.total_installments) * 100;
                    
                    return (
                      <div
                        key={enrollment.id}
                        className="p-5 border-2 border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-base font-bold text-[#030712] mb-2">
                              {enrollment.package_name}
                            </p>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                                enrollment.status === 'active'
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {enrollment.status}
                              </span>
                              <span className="text-xs text-[#9CA3AF] font-mono">
                                {enrollment.enrollment_number}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-[#9CA3AF] mb-1">Maturity Amount</p>
                            <p className="text-2xl font-bold text-emerald-600">
                              {fmt(enrollment.maturity_amount)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-[#6B7280] font-medium">Payment Progress</span>
                            <span className="font-bold text-[#030712]">
                              {enrollment.installments_paid}/{enrollment.total_installments} installments
                            </span>
                          </div>
                          
                          <div className="relative">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 rounded-full transition-all duration-500 relative"
                                style={{ width: `${progress}%` }}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                              </div>
                            </div>
                            <span className="absolute -top-6 right-0 text-xs font-bold text-emerald-600">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200">
                            <div className="text-center">
                              <p className="text-xs text-[#9CA3AF] mb-1">Per Installment</p>
                              <p className="text-sm font-bold text-[#030712]">
                                {fmt(enrollment.amount_per_installment)}
                              </p>
                            </div>
                            <div className="text-center border-x border-gray-200">
                              <p className="text-xs text-[#9CA3AF] mb-1">Total Paid</p>
                              <p className="text-sm font-bold text-emerald-600">
                                {fmt(enrollment.total_amount_paid)}
                              </p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-[#9CA3AF] mb-1">Remaining</p>
                              <p className="text-sm font-bold text-amber-600">
                                {enrollment.installments_remaining}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-[#9CA3AF] pt-2">
                            <span>Matures: {fmtDate(enrollment.maturity_date)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Payments */}
            {recent_payments && recent_payments.length > 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#030712]">
                        Recent Payments
                      </h3>
                      <p className="text-xs text-[#6B7280]">
                        Last {recent_payments.length} completed transactions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {recent_payments.map((payment: any) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[#030712] capitalize mb-1">
                            {payment.payment_type?.replace(/_/g, " ")}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                            <span>{fmtDate(payment.paid_at)}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="capitalize font-medium text-[#6B7280]">
                              {payment.payment_method}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="font-mono text-[10px]">{payment.payment_id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-emerald-600 mb-1">
                          {fmt(payment.amount)}
                        </p>
                        <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-semibold border border-emerald-200">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column - 1/3 width */}
          <div className="space-y-5">
            {/* Next Installment Due - Highlighted */}
            {stats?.pension?.next_installment_due && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-5 shadow-md  relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 " />
                    </div>
                    <h3 className="text-sm font-bold">
                      Next Installment Due
                    </h3>
                  </div>
                  <p className="text-3xl font-bold mb-2">
                    {fmtDate(stats.pension.next_installment_due)}
                  </p>
                  <p className="text-sm ">
                    {Math.ceil((new Date(stats.pension.next_installment_due).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
                  </p>
                </div>
              </div>
            )}

            {/* Pending Membership Fees Alert */}
            {pending_membership_fees && pending_membership_fees.length > 0 && (
              <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-5 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-900 mb-1">
                      Pending Membership Fees
                    </h3>
                    <p className="text-xs text-red-700">
                      {pending_membership_fees.length} fee{pending_membership_fees.length > 1 ? 's' : ''} require{pending_membership_fees.length === 1 ? 's' : ''} payment
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {pending_membership_fees.map((fee: any) => (
                    <div key={fee.id} className="bg-white rounded-lg p-3 border-2 border-red-100">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-semibold text-[#030712] capitalize">
                          {fee.fee_type?.replace(/_/g, " ")}
                        </p>
                        <p className="text-base font-bold text-red-600">
                          {fmt(fee.amount)}
                        </p>
                      </div>
                      <p className="text-xs text-[#6B7280]">
                        Due: {fmtDate(fee.due_date)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            {recent_transactions && recent_transactions.length > 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-[#6B7280]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#030712]">
                      Recent Transactions
                    </h3>
                  </div>
                  <Link
                    href="/dashboard/wallets"
                    className="text-xs text-[#068847] hover:text-[#045a2e] font-semibold"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-1">
                  {recent_transactions.map((tx: any) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          tx.type === 'credit' 
                            ? 'bg-emerald-100' 
                            : 'bg-red-100'
                        }`}>
                          {tx.type === 'credit' ? (
                            <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#030712] capitalize truncate">
                            {tx.category?.replace(/_/g, " ")}
                          </p>
                          <p className="text-[10px] text-[#9CA3AF] truncate">
                            {new Date(tx.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                      <p className={`text-sm font-bold flex-shrink-0 ml-2 ${
                        tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-bold text-[#030712] mb-4 flex items-center gap-2">
                <div className="w-6 h-6 bg-[#068847] rounded-lg flex items-center justify-center">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
                Quick Actions
              </h3>
              <div className="space-y-2">
                {[
                  { label: "My Profile", href: "/dashboard/profile", icon: User, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Wallet", href: "/dashboard/wallets", icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Pension Plans", href: "/dashboard/pension", icon: Package, color: "text-amber-600", bg: "bg-amber-50" },
                  { label: "Nominees", href: "/dashboard/nominees", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
                ].map(({ label, href, icon: Icon, color, bg }) => (
                  <Link
                    key={label}
                    href={href}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <span className="text-sm text-[#030712] font-semibold">
                        {label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#D1D5DB] group-hover:text-[#068847] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}