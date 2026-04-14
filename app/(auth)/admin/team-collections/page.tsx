"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Network,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  usePackageHierarchy,
} from "@/lib/hooks";

export default function TeamCollectionsPage() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const packageName = searchParams.get("packageName");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7) // Current month: "2026-04"
  );
  const [expandedHierarchyId, setExpandedHierarchyId] = useState<number | null>(null);

  // Use the new Package Hierarchy API
  const { data: hierarchyData, isLoading } = usePackageHierarchy(
    packageId ? parseInt(packageId) : 0,
    selectedMonth
  );

  const packageData = hierarchyData?.data.package;
  const hierarchies = hierarchyData?.data.hierarchies || [];
  const totals = hierarchyData?.data.totals || {
    total_members: 0,
    total_collection: 0,
    total_hierarchies: 0,
  };

  // Debug: Log the hierarchy data to see the structure
  useEffect(() => {
    if (hierarchyData?.data.hierarchies && hierarchyData.data.hierarchies.length > 0) {
      console.log("Hierarchy Data Sample:", hierarchyData.data.hierarchies[0]);
      if (hierarchyData.data.hierarchies[0].tree && hierarchyData.data.hierarchies[0].tree.length > 0) {
        console.log("First Member Sample:", hierarchyData.data.hierarchies[0].tree[0]);
      }
    }
  }, [hierarchyData]);

  const toggleExpand = (rootUserId: number) => {
    if (expandedHierarchyId === rootUserId) {
      setExpandedHierarchyId(null);
    } else {
      setExpandedHierarchyId(rootUserId);
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

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/pension-packages"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-[#4A5565]" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#030712]">
            Team Hierarchy & Collections
          </h1>
          <p className="text-sm text-[#4A5565] mt-1">
            {packageName || packageData?.name || "Package"} - Complete team structure and monthly performance
          </p>
        </div>

        {/* Month Selector */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-[#068847]" />
            </div>
            <div>
              <p className="text-xs text-[#4A5565]">Total Collection</p>
              <p className="text-lg font-semibold text-[#030712]">
                ৳{(totals.total_collection / 100000).toFixed(2)}L
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
              <Users className="h-5 w-5 text-[#3B82F6]" />
            </div>
            <div>
              <p className="text-xs text-[#4A5565]">Total Members</p>
              <p className="text-lg font-semibold text-[#030712]">
                {totals.total_members}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
              <Network className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-xs text-[#4A5565]">Hierarchies</p>
              <p className="text-lg font-semibold text-[#030712]">
                {totals.total_hierarchies}
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
              <p className="text-xs text-[#4A5565]">Package Amount</p>
              <p className="text-lg font-semibold text-[#030712]">
                ৳{packageData?.monthly_amount || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
            <p className="text-[#4A5565]">Loading team hierarchy...</p>
          </div>
        </div>
      ) : hierarchies.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Network className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
            <p className="text-[#4A5565] mb-2">No team hierarchies found</p>
            <p className="text-sm text-[#6A7282]">
              Team hierarchies will appear here once members enroll in this package
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {hierarchies.map((hierarchy: any) => (
            <div
              key={hierarchy.root_user_id}
              className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
            >
              {/* Hierarchy Header */}
              <div
                className="bg-[#F9FAFB] px-6 py-4 border-b border-[#E5E7EB] cursor-pointer hover:bg-[#F3F4F6] transition-colors"
                onClick={() => toggleExpand(hierarchy.root_user_id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#068847] to-[#059669] flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#030712]">
                        {hierarchy.root_name}
                      </h3>
                      <p className="text-sm text-[#4A5565]">
                        Root Member • ID: {hierarchy.root_member_id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-[#4A5565]">Team Size</p>
                      <p className="text-lg font-semibold text-[#3B82F6]">
                        {hierarchy.tree?.length || 0} members
                      </p>
                    </div>

                    {expandedHierarchyId === hierarchy.root_user_id ? (
                      <ChevronUp className="h-5 w-5 text-[#4A5565]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-[#4A5565]" />
                    )}
                  </div>
                </div>
              </div>

              {/* Hierarchy Tree (Expanded) */}
              {expandedHierarchyId === hierarchy.root_user_id && (
                <div className="p-6">
                  {hierarchy.tree && hierarchy.tree.length > 0 ? (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-[#030712] mb-4">
                        Team Members Hierarchy
                      </h4>
                      <div className="bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] overflow-hidden">
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
                                Package Roles
                              </th>
                              <th className="text-center px-4 py-3 text-xs font-medium text-[#4A5565]">
                                Hierarchy Role
                              </th>
                              <th className="text-center px-4 py-3 text-xs font-medium text-[#4A5565]">
                                Status
                              </th>
                              <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
                                Installments
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
                            {renderTreeMembers(hierarchy.tree, packageId)}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-[#4A5565] text-center py-8">
                      No team members found in this hierarchy
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to render tree members recursively
function renderTreeMembers(tree: any[], packageId: string | null): JSX.Element[] {
  const elements: JSX.Element[] = [];

  // Helper to get role badge color
  const getRoleBadgeColor = (role: string) => {
    const roleColors: Record<string, string> = {
      executive_member: "bg-[#FEF3C7] text-[#F59E0B]",
      project_presenter: "bg-[#DBEAFE] text-[#3B82F6]",
      assistant_pp: "bg-[#E0E7FF] text-[#6366F1]",
      general_member: "bg-[#F3F4F6] text-[#6B7280]",
    };
    return roleColors[role] || "bg-[#F3F4F6] text-[#6B7280]";
  };

  // Helper to format role name
  const formatRoleName = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderMember = (member: any, depth: number = 0) => {
    const paddingLeft = depth * 24; // 24px per level

    // Get active package roles - check multiple possible locations
    const activePackageRoles = 
      member.package_roles?.filter((r: any) => r.is_active) || 
      member.enrollment?.package_roles?.filter((r: any) => r.is_active) ||
      [];

    // Debug log for first member
    if (depth === 0 && elements.length === 0) {
      console.log("Member data structure:", {
        has_package_roles: !!member.package_roles,
        has_enrollment_package_roles: !!member.enrollment?.package_roles,
        member_keys: Object.keys(member),
        enrollment_keys: member.enrollment ? Object.keys(member.enrollment) : []
      });
    }

    elements.push(
      <tr key={member.user_id} className="hover:bg-[#F9FAFB]">
        <td className="px-4 py-3">
          <Link
            href={`/admin/members/${member.user_id}?from=team-collections&packageId=${packageId}`}
            className="hover:underline"
          >
            <div style={{ paddingLeft: `${paddingLeft}px` }}>
              <p className="text-sm font-medium text-[#2563EB] flex items-center gap-2">
                {depth > 0 && <span className="text-[#9CA3AF]">└─</span>}
                {member.name_english}
              </p>
              <p className="text-xs text-[#4A5565]">
                {member.member_id} • {member.email}
              </p>
            </div>
          </Link>
        </td>
        <td className="px-4 py-3 text-center">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EFF6FF] text-[#3B82F6]">
            Level {member.level}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex flex-wrap gap-1 justify-center">
            {activePackageRoles.length > 0 ? (
              activePackageRoles.map((roleObj: any, index: number) => (
                <span
                  key={roleObj.id || index}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    roleObj.role
                  )}`}
                  title={roleObj.assigned_at ? `Assigned: ${new Date(roleObj.assigned_at).toLocaleDateString()}` : undefined}
                >
                  {formatRoleName(roleObj.role)}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#9CA3AF] italic">Not available</span>
            )}
          </div>
        </td>
        <td className="px-4 py-3 text-center">
          <span className={`text-xs capitalize ${getRoleBadgeColor(member.role)} inline-flex items-center px-2 py-1 rounded-full font-medium`}>
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
        <td className="px-4 py-3 text-right text-sm text-[#4A5565]">
          {member.enrollment?.installments_paid || 0} /{" "}
          {member.enrollment?.installments_remaining
            ? member.enrollment.installments_paid +
              member.enrollment.installments_remaining
            : "N/A"}
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
