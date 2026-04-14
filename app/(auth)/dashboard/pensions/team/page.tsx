"use client";

import { useState } from "react";
import {
  Package,
  Network,
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Target,
  Award,
  Wallet,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import {
  useTeamHierarchyTree,
  useTeamStats,
  useDirectTeamMembers,
  useTeamUpline,
  useTeamMembers,
  useMyCommissionStats,
  useMyCommissions,
} from "@/lib/hooks";

export default function MyTeamPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // Current month: "2026-04"
  );
  const [expandedMemberId, setExpandedMemberId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "hierarchy" | "commissions">("overview");

  // Fetch team hierarchy data
  const { data: hierarchyData, isLoading: loadingHierarchy } = useTeamHierarchyTree(selectedMonth);
  const { data: statsData, isLoading: loadingStats } = useTeamStats();
  const { data: directMembersData, isLoading: loadingDirectMembers } = useDirectTeamMembers(selectedMonth);
  const { data: uplineData, isLoading: loadingUpline } = useTeamUpline();
  const { data: allMembersData, isLoading: loadingAllMembers } = useTeamMembers({
    month: selectedMonth,
    per_page: 50,
    page: 1
  });
  
  // Fetch commission data
  const { data: commissionStatsData, isLoading: loadingCommissionStats } = useMyCommissionStats(selectedMonth);
  const { data: commissionsData, isLoading: loadingCommissions } = useMyCommissions({
    per_page: 10,
    page: 1
  });

  const tree = hierarchyData?.data.tree || [];
  const totals = hierarchyData?.data.totals || {
    total_members: 0,
    total_collection: 0,
    total_installments: 0,
    by_level: {},
    by_role: {},
  };
  const stats = statsData?.data;
  const directMembers = directMembersData?.data || [];
  const uplineChain = uplineData?.data.data || [];
  const allMembers = allMembersData?.data || [];
  const commissionStats = commissionStatsData?.data;
  const commissions = commissionsData?.data || [];

  const toggleExpand = (memberId: number) => {
    if (expandedMemberId === memberId) {
      setExpandedMemberId(null);
    } else {
      setExpandedMemberId(memberId);
    }
  };

  // Generate month options for the selector
  const generateMonthOptions = () => {
    const months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date.toISOString().slice(0, 7));
    }
    return months;
  };

  const monthOptions = generateMonthOptions();
  const isLoading = loadingHierarchy || loadingStats || loadingDirectMembers || loadingUpline || loadingCommissionStats;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#030712] mb-1">
            My Team
          </h1>
          <p className="text-[14px] text-[#6B7280]">
            View your team hierarchy, performance, collections, and commission earnings
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E5E7EB]">
          <Link
            href="/dashboard/pensions"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#6B7280] hover:text-[#030712] hover:bg-[#F9FAFB] rounded-t-lg transition-colors"
          >
            <Package className="w-4 h-4" />
            Pension Plans
          </Link>
          
          <Link
            href="/dashboard/pensions/team"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-[#068847] border-b-2 border-[#068847] transition-colors"
          >
            <Network className="w-4 h-4" />
            My Team
          </Link>
        </div>

        {/* Month Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#4A5565]" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#068847]"
            >
              {monthOptions.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + "-01").toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                <Users className="h-5 w-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-xs text-[#4A5565]">Total Members</p>
                <p className="text-lg font-semibold text-[#030712]">
                  {totals.total_members || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-[#068847]" />
              </div>
              <div>
                <p className="text-xs text-[#4A5565]">Team Collection</p>
                <p className="text-lg font-semibold text-[#030712]">
                  ৳{(() => {
                    // Calculate total collection from tree recursively
                    const calculateTreeCollection = (members: any[]): number => {
                      if (!members || members.length === 0) return 0;
                      return members.reduce((sum, member) => {
                        const memberCollection = member.collection?.current_month || 0;
                        const childrenCollection = calculateTreeCollection(member.children || []);
                        return sum + memberCollection + childrenCollection;
                      }, 0);
                    };
                    
                    const totalCollection = calculateTreeCollection(tree);
                    return totalCollection > 0 
                      ? totalCollection.toLocaleString() 
                      : (totals.total_collection || 0).toLocaleString();
                  })()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                <Target className="h-5 w-5 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-xs text-[#4A5565]">Direct Members</p>
                <p className="text-lg font-semibold text-[#030712]">
                  {stats?.direct_members || directMembers.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="flex border-b border-[#E5E7EB] overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "overview"
                  ? "text-[#068847] border-b-2 border-[#068847] bg-[#F0FDF4]"
                  : "text-[#6B7280] hover:text-[#030712] hover:bg-[#F9FAFB]"
              }`}
            >
              <Users className="w-4 h-4" />
              Team Overview
            </button>
            <button
              onClick={() => setActiveTab("hierarchy")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "hierarchy"
                  ? "text-[#068847] border-b-2 border-[#068847] bg-[#F0FDF4]"
                  : "text-[#6B7280] hover:text-[#030712] hover:bg-[#F9FAFB]"
              }`}
            >
              <Network className="w-4 h-4" />
              Team Hierarchy
            </button>
            <button
              onClick={() => setActiveTab("commissions")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "commissions"
                  ? "text-[#068847] border-b-2 border-[#068847] bg-[#F0FDF4]"
                  : "text-[#6B7280] hover:text-[#030712] hover:bg-[#F9FAFB]"
              }`}
            >
              <Award className="w-4 h-4" />
              Commissions
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
                  <p className="text-[#4A5565]">Loading team data...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <OverviewTab 
                    directMembers={directMembers} 
                    uplineChain={uplineChain}
                    stats={stats}
                    totals={totals}
                  />
                )}

                {/* Hierarchy Tab */}
                {activeTab === "hierarchy" && (
                  <HierarchyTab tree={tree} />
                )}

                {/* Commissions Tab */}
                {activeTab === "commissions" && (
                  <CommissionsTab 
                    commissionStats={commissionStats}
                    commissions={commissions}
                    isLoading={loadingCommissions}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tab Components ──────────────────────────────────────────────────────────

// Overview Tab Component
function OverviewTab({ 
  directMembers, 
  uplineChain, 
  stats, 
  totals 
}: { 
  directMembers: any[]; 
  uplineChain: any[]; 
  stats: any; 
  totals: any; 
}) {
  return (
    <div className="space-y-6">
      {/* Your Upline Chain */}
      {uplineChain.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#030712] mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Your Sponsors Chain
          </h3>
          <div className="bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] rounded-lg border border-[#D1FAE5] p-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              {uplineChain.map((sponsor, index) => (
                <div key={sponsor.user_id} className="flex items-center gap-2 whitespace-nowrap">
                  <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-[#E5E7EB]">
                    <span className="text-xs text-[#6B7280]">Level {sponsor.level}</span>
                    <span className="text-sm font-medium text-[#030712]">{sponsor.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sponsor.role === 'executive_member' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                      sponsor.role === 'project_presenter' ? 'bg-[#DBEAFE] text-[#3B82F6]' :
                      'bg-[#F3F4F6] text-[#6B7280]'
                    }`}>
                      {sponsor.role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </span>
                  </div>
                  {index < uplineChain.length - 1 && (
                    <div className="text-[#9CA3AF]">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Statistics Grid */}
      <div>
        <h3 className="text-sm font-semibold text-[#030712] mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Team Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* By Role */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <h4 className="text-xs font-medium text-[#6B7280] mb-3">Members by Role</h4>
            <div className="space-y-2">
              {stats?.by_role && Object.entries(stats.by_role).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between">
                  <span className="text-sm text-[#4A5565] capitalize">
                    {role.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-semibold text-[#030712]">
                    {count as number}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* By Status */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <h4 className="text-xs font-medium text-[#6B7280] mb-3">Members by Status</h4>
            <div className="space-y-2">
              {stats?.by_status && Object.entries(stats.by_status).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status === 'active' ? 'bg-[#068847]' :
                      status === 'pending' ? 'bg-[#F59E0B]' :
                      'bg-[#DC2626]'
                    }`} />
                    <span className="text-sm text-[#4A5565] capitalize">{status}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#030712]">
                    {count as number}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* By Level */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <h4 className="text-xs font-medium text-[#6B7280] mb-3">Members by Level</h4>
            <div className="space-y-2">
              {stats?.by_level && Object.entries(stats.by_level).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm text-[#4A5565]">Level {level}</span>
                  <span className="text-sm font-semibold text-[#030712]">
                    {count as number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Direct Team Members */}
      {directMembers.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#030712] mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Direct Team Members ({directMembers.length})
          </h3>
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {directMembers.slice(0, 6).map((member) => (
                <div key={member.user_id} className="bg-[#F9FAFB] rounded-lg p-3 border border-[#E5E7EB]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-[#030712]">
                        {member.name_english}
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        {member.member_id}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.enrollment?.status === 'active' ? 'bg-[#F0FDF4] text-[#068847]' :
                      member.enrollment?.status === 'pending' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                      'bg-[#FEE2E2] text-[#DC2626]'
                    }`}>
                      {member.enrollment?.status || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6B7280]">This Month:</span>
                    <span className="font-semibold text-[#068847]">
                      ৳{member.collection?.current_month?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {directMembers.length > 6 && (
              <div className="bg-[#F3F4F6] px-4 py-3 text-center">
                <span className="text-sm text-[#6B7280]">
                  +{directMembers.length - 6} more members
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#030712] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => window.open('/dashboard/pensions', '_blank')}
            className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            <Package className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#4A5565]">View My Plans</span>
          </button>
          <button
            onClick={() => window.open('/dashboard/profile', '_blank')}
            className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            <Users className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#4A5565]">Edit Profile</span>
          </button>
          <button
            onClick={() => window.open('/dashboard/wallets', '_blank')}
            className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            <Wallet className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#4A5565]">View Wallet</span>
          </button>
          <button
            className="flex items-center gap-2 p-3 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <Award className="w-4 h-4 text-[#6B7280]" />
            <span className="text-sm text-[#4A5565]">Export Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Hierarchy Tab Component
function HierarchyTab({ tree }: { tree: any[] }) {
  if (tree.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Network className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
          <p className="text-[#4A5565] mb-2">No team members found</p>
          <p className="text-sm text-[#6A7282]">
            Your team members will appear here once they enroll
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#F3F4F6]">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-medium text-[#4A5565]">
              Member
            </th>
            <th className="text-center px-4 py-3 text-xs font-medium text-[#4A5565]">
              Level
            </th>
            <th className="text-center px-4 py-3 text-xs font-medium text-[#4A5565]">
              Role
            </th>
            <th className="text-center px-4 py-3 text-xs font-medium text-[#4A5565]">
              Status
            </th>
            <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
              This Month
            </th>
            <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
              Total Paid
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {renderTreeMembers(tree)}
        </tbody>
      </table>
    </div>
  );
}

// Commissions Tab Component
function CommissionsTab({ 
  commissionStats, 
  commissions,
  isLoading 
}: { 
  commissionStats: any; 
  commissions: any[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
          <p className="text-[#4A5565]">Loading commission data...</p>
        </div>
      </div>
    );
  }

  if (!commissionStats) {
    return (
      <div className="space-y-6">
        {/* API Not Available Notice */}
        <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Award className="w-6 h-6 text-[#F59E0B] mt-0.5" />
            <div>
              <p className="text-base font-semibold text-[#92400E] mb-2">
                Commission API Not Available
              </p>
              <p className="text-sm text-[#6B7280] mb-3">
                The commission calculation endpoint is not yet implemented. Once available, this tab will display:
              </p>
              <ul className="text-sm text-[#6B7280] space-y-1 ml-4 list-disc">
                <li>Joining commissions from new team member enrollments</li>
                <li>Installment commissions from monthly contributions</li>
                <li>Milestone bonuses and performance rewards</li>
                <li>Commission breakdown by level and type</li>
              </ul>
              <div className="mt-4 p-3 bg-white rounded-lg border border-[#E5E7EB]">
                <p className="text-xs text-[#4A5565] font-medium mb-1">Required API Endpoints:</p>
                <code className="text-xs text-[#DC2626] bg-[#FEE2E2] px-2 py-1 rounded block mb-1">
                  GET /api/v1/my-commissions
                </code>
                <code className="text-xs text-[#DC2626] bg-[#FEE2E2] px-2 py-1 rounded block">
                  GET /api/v1/my-commission-stats?month=YYYY-MM
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const summary = commissionStats.summary || {
    total_commissions: 0,
    total_count: 0,
    credited_amount: 0,
    pending_amount: 0,
    approved_amount: 0,
  };

  const byType = commissionStats.by_type || {};
  const byStatus = commissionStats.by_status || {};

  // Calculate growth percentage (placeholder - would need previous month data)
  const growthPercentage = 0;

  return (
    <div className="space-y-6">
      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] rounded-lg p-4 border border-[#86EFAC]">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#068847]" />
            <p className="text-xs text-[#065F46] font-medium">Total Earned</p>
          </div>
          <p className="text-2xl font-bold text-[#068847]">
            ৳{summary.total_commissions?.toLocaleString() || '0.00'}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            {commissionStats.period ? `For ${commissionStats.period}` : 'All time'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-lg p-4 border border-[#93C5FD]">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-[#3B82F6]" />
            <p className="text-xs text-[#1E40AF] font-medium">Credited</p>
          </div>
          <p className="text-2xl font-bold text-[#3B82F6]">
            ৳{summary.credited_amount?.toLocaleString() || '0.00'}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            Paid to wallet
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-lg p-4 border border-[#FCD34D]">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
            <p className="text-xs text-[#92400E] font-medium">Pending</p>
          </div>
          <p className="text-2xl font-bold text-[#F59E0B]">
            ৳{summary.pending_amount?.toLocaleString() || '0.00'}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            Awaiting approval
          </p>
        </div>
      </div>

      {/* Commission by Type */}
      {Object.keys(byType).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#030712] mb-3">
            Commission by Type
          </h3>
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F3F4F6]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#4A5565]">Type</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">Count</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {Object.entries(byType).map(([type, data]: [string, any]) => (
                  <tr key={type} className="hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3">
                      <span className="text-sm text-[#030712] capitalize">
                        {type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-[#4A5565]">
                      {data.count}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#068847]">
                      ৳{data.total?.toLocaleString() || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Commission by Status */}
      {Object.keys(byStatus).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#030712] mb-3">
            Commission by Status
          </h3>
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F3F4F6]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#4A5565]">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">Count</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {Object.entries(byStatus).map(([status, data]: [string, any]) => (
                  <tr key={status} className="hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          status === 'credited' ? 'bg-[#068847]' :
                          status === 'approved' ? 'bg-[#3B82F6]' :
                          status === 'pending' ? 'bg-[#F59E0B]' :
                          'bg-[#DC2626]'
                        }`} />
                        <span className="text-sm text-[#030712] capitalize">{status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-[#4A5565]">
                      {data.count}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#068847]">
                      ৳{data.total?.toLocaleString() || '0.00'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Commissions */}
      {commissions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#030712] mb-3">
            Recent Commissions
          </h3>
          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F3F4F6]">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#4A5565]">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#4A5565]">Type</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-[#4A5565]">Description</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">Amount</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-[#4A5565]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {commissions.map((commission) => {
                  const formatDate = (dateString: string | undefined) => {
                    if (!dateString) return { date: 'N/A', time: '' };
                    
                    try {
                      const date = new Date(dateString);
                      if (isNaN(date.getTime())) return { date: 'Invalid Date', time: '' };
                      
                      return {
                        date: date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }),
                        time: date.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })
                      };
                    } catch (error) {
                      return { date: 'Invalid Date', time: '' };
                    }
                  };
                  
                  // Use the most relevant date based on status
                  const displayDate = commission.credited_at || commission.approved_at || commission.created_at;
                  const { date, time } = formatDate(displayDate);
                  
                  return (
                  <tr key={commission.id} className="hover:bg-[#F9FAFB]">
                    <td className="px-4 py-3">
                      <div className="text-sm text-[#030712]">{date}</div>
                      {time && <div className="text-xs text-[#6B7280]">{time}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#EFF6FF] text-[#3B82F6] capitalize">
                        {commission.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-[#030712]">{commission.description}</p>
                      {commission.source_user && (
                        <p className="text-xs text-[#6B7280]">From: {commission.source_user.name}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#068847]">
                      ৳{commission.amount?.toLocaleString() || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        commission.status === 'credited' ? 'bg-[#F0FDF4] text-[#068847]' :
                        commission.status === 'approved' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
                        commission.status === 'pending' ? 'bg-[#FEF3C7] text-[#F59E0B]' :
                        'bg-[#FEE2E2] text-[#DC2626]'
                      }`}>
                        {commission.status.charAt(0).toUpperCase() + commission.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {commissions.length === 0 && Object.keys(byType).length === 0 && (
        <div className="bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] p-8 text-center">
          <Award className="w-12 h-12 text-[#D1D5DC] mx-auto mb-3" />
          <p className="text-sm font-medium text-[#4A5565] mb-1">No Commissions Yet</p>
          <p className="text-xs text-[#6B7280]">
            Your commission earnings will appear here once your team starts making contributions
          </p>
        </div>
      )}
    </div>
  );
}

// Helper function to render tree members recursively
function renderTreeMembers(tree: any[]): JSX.Element[] {
  const elements: JSX.Element[] = [];

  const formatRoleName = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getRoleBadgeColor = (role: string) => {
    const roleColors: Record<string, string> = {
      executive_member: "bg-[#FEF3C7] text-[#F59E0B]",
      project_presenter: "bg-[#DBEAFE] text-[#3B82F6]",
      assistant_pp: "bg-[#E0E7FF] text-[#6366F1]",
      general_member: "bg-[#F3F4F6] text-[#6B7280]",
    };
    return roleColors[role] || "bg-[#F3F4F6] text-[#6B7280]";
  };

  const renderMember = (member: any, depth: number = 0) => {
    const paddingLeft = depth * 24; // 24px per level

    elements.push(
      <tr key={member.user_id} className="hover:bg-[#F9FAFB]">
        <td className="px-4 py-3">
          <div style={{ paddingLeft: `${paddingLeft}px` }}>
            <p className="text-sm font-medium text-[#030712] flex items-center gap-2">
              {depth > 0 && <span className="text-[#9CA3AF]">└─</span>}
              {member.name_english}
            </p>
            <p className="text-xs text-[#4A5565]">
              {member.member_id} • {member.email}
            </p>
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#3B82F6]">
            Level {member.level}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
              member.role
            )}`}
          >
            {formatRoleName(member.role)}
          </span>
        </td>
        <td className="px-4 py-3 text-center">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              member.enrollment?.status === "active"
                ? "bg-[#F0FDF4] text-[#068847]"
                : member.enrollment?.status === "pending"
                ? "bg-[#FEF3C7] text-[#F59E0B]"
                : "bg-[#FEE2E2] text-[#DC2626]"
            }`}
          >
            {member.enrollment?.status || "N/A"}
          </span>
        </td>
        <td className="px-4 py-3 text-right text-sm font-semibold text-[#068847]">
          ৳{member.collection?.current_month?.toLocaleString() || 0}
        </td>
        <td className="px-4 py-3 text-right text-sm font-medium text-[#030712]">
          ৳{member.collection?.total_paid?.toLocaleString() || 0}
        </td>
      </tr>
    );

    // Recursively render children
    if (member.children && member.children.length > 0) {
      member.children.forEach((child: any) => renderMember(child, depth + 1));
    }
  };

  tree.forEach((member) => renderMember(member, 0));
  return elements;
}
