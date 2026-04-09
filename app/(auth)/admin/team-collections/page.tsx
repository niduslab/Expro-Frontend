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
} from "lucide-react";
import Link from "next/link";
import {
  useTeamCollectionsByPackage,
  useTeamMemberContributions,
} from "@/lib/hooks";

export default function TeamCollectionsPage() {
  const searchParams = useSearchParams();
  const packageId = searchParams.get("packageId");
  const packageName = searchParams.get("packageName");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [expandedCollectionId, setExpandedCollectionId] = useState<
    number | null
  >(null);

  const { data: collectionsData, isLoading } = useTeamCollectionsByPackage(
    packageId ? parseInt(packageId) : 0
  );

  const { data: contributionsData, isLoading: loadingContributions } =
    useTeamMemberContributions({
      team_collection_id: expandedCollectionId || undefined,
      per_page: 100,
    });

  const collections = collectionsData?.data || [];
  const contributions = contributionsData?.data || [];

  // Group collections by period month
  const collectionsByMonth = collections.reduce((acc: any, collection: any) => {
    const month = collection.period_month;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(collection);
    return acc;
  }, {});

  const months = Object.keys(collectionsByMonth).sort().reverse();

  // Calculate totals
  const totalCollection = collections.reduce(
    (sum: number, c: any) => sum + parseFloat(c.total_collection || 0),
    0
  );
  const totalMilestones = collections.reduce(
    (sum: number, c: any) => sum + (c.lakh_milestones_reached || 0),
    0
  );
  const totalTeamLeaders = new Set(
    collections.map((c: any) => c.team_leader_id)
  ).size;

  const toggleExpand = (collectionId: number) => {
    if (expandedCollectionId === collectionId) {
      setExpandedCollectionId(null);
    } else {
      setExpandedCollectionId(collectionId);
    }
  };

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
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#030712]">
            Team Collections
          </h1>
          <p className="text-sm text-[#4A5565] mt-1">
            {packageName || "All Packages"} - Monthly team performance and
            contributions
          </p>
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
                ৳{(totalCollection / 100000).toFixed(2)}L
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-[#F59E0B]" />
            </div>
            <div>
              <p className="text-xs text-[#4A5565]">Lakh Milestones</p>
              <p className="text-lg font-semibold text-[#030712]">
                {totalMilestones}
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
              <p className="text-xs text-[#4A5565]">Team Leaders</p>
              <p className="text-lg font-semibold text-[#030712]">
                {totalTeamLeaders}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
              <Calendar className="h-5 w-5 text-[#6B7280]" />
            </div>
            <div>
              <p className="text-xs text-[#4A5565]">Active Months</p>
              <p className="text-lg font-semibold text-[#030712]">
                {months.length}
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
            <p className="text-[#4A5565]">Loading team collections...</p>
          </div>
        </div>
      ) : collections.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Users className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
            <p className="text-[#4A5565] mb-2">No team collections found</p>
            <p className="text-sm text-[#6A7282]">
              Team collections will appear here once members start contributing
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {months.map((month) => (
            <div key={month} className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
              {/* Month Header */}
              <div className="bg-[#F9FAFB] px-6 py-4 border-b border-[#E5E7EB]">
                <h3 className="text-lg font-semibold text-[#030712]">
                  {new Date(month + "-01").toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-sm text-[#4A5565] mt-1">
                  {collectionsByMonth[month].length} team leader(s)
                </p>
              </div>

              {/* Team Leaders */}
              <div className="divide-y divide-[#E5E7EB]">
                {collectionsByMonth[month].map((collection: any) => (
                  <div key={collection.id}>
                    {/* Collection Summary */}
                    <div
                      className="p-6 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                      onClick={() => toggleExpand(collection.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-[#F0FDF4] flex items-center justify-center">
                            <Users className="h-6 w-6 text-[#068847]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[#030712]">
                              {collection.team_leader?.member?.name_english ||
                                collection.team_leader?.email ||
                                "Unknown Leader"}
                            </p>
                            <p className="text-sm text-[#4A5565]">
                              Team Leader • {collection.team_member_count}{" "}
                              members
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-sm text-[#4A5565]">
                              Total Collection
                            </p>
                            <p className="text-lg font-semibold text-[#068847]">
                              ৳
                              {parseFloat(
                                collection.total_collection
                              ).toLocaleString()}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-[#4A5565]">Milestones</p>
                            <p className="text-lg font-semibold text-[#F59E0B]">
                              {collection.lakh_milestones_reached}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-[#4A5565]">Active</p>
                            <p className="text-lg font-semibold text-[#3B82F6]">
                              {collection.active_contributors}/
                              {collection.team_member_count}
                            </p>
                          </div>

                          {expandedCollectionId === collection.id ? (
                            <ChevronUp className="h-5 w-5 text-[#4A5565]" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-[#4A5565]" />
                          )}
                        </div>
                      </div>

                      {/* Collection Details */}
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-[#E5E7EB]">
                        <div>
                          <p className="text-xs text-[#4A5565]">
                            Membership Fees
                          </p>
                          <p className="text-sm font-medium text-[#030712]">
                            ৳
                            {parseFloat(
                              collection.membership_collection
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#4A5565]">
                            Pension Installments
                          </p>
                          <p className="text-sm font-medium text-[#030712]">
                            ৳
                            {parseFloat(
                              collection.pension_collection
                            ).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#4A5565]">
                            Commission Eligible
                          </p>
                          <p className="text-sm font-medium text-[#068847]">
                            ৳
                            {parseFloat(
                              collection.commission_eligible_amount
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Member Contributions (Expanded) */}
                    {expandedCollectionId === collection.id && (
                      <div className="px-6 pb-6 bg-[#F9FAFB]">
                        <h4 className="text-sm font-semibold text-[#030712] mb-4">
                          Member Contributions
                        </h4>

                        {loadingContributions ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#068847] mx-auto mb-2"></div>
                            <p className="text-sm text-[#4A5565]">
                              Loading contributions...
                            </p>
                          </div>
                        ) : contributions.length === 0 ? (
                          <p className="text-sm text-[#4A5565] text-center py-4">
                            No contributions found
                          </p>
                        ) : (
                          <div className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-[#F3F4F6]">
                                <tr>
                                  <th className="text-left px-4 py-3 text-xs font-medium text-[#4A5565]">
                                    Member
                                  </th>
                                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
                                    Total
                                  </th>
                                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
                                    Membership
                                  </th>
                                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
                                    Pension
                                  </th>
                                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
                                    Share %
                                  </th>
                                  <th className="text-right px-4 py-3 text-xs font-medium text-[#4A5565]">
                                    Commission
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#E5E7EB]">
                                {contributions.map((contrib: any) => (
                                  <tr
                                    key={contrib.id}
                                    className="hover:bg-[#F9FAFB]"
                                  >
                                    <td className="px-4 py-3">
                                      <Link
                                        href={`/admin/members/${contrib.member_id}?from=team-collections&packageId=${packageId}`}
                                        className="hover:underline"
                                      >
                                        <div>
                                          <p className="text-sm font-medium text-[#2563EB]">
                                            {contrib.member?.member
                                              ?.name_english ||
                                              contrib.member?.email ||
                                              "Unknown"}
                                          </p>
                                          {contrib.member?.member?.phone && (
                                            <p className="text-xs text-[#4A5565]">
                                              {contrib.member.member.phone}
                                            </p>
                                          )}
                                        </div>
                                      </Link>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#030712]">
                                      ৳
                                      {parseFloat(
                                        contrib.total_contribution
                                      ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-[#4A5565]">
                                      ৳
                                      {parseFloat(
                                        contrib.membership_contribution
                                      ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm text-[#4A5565]">
                                      ৳
                                      {parseFloat(
                                        contrib.pension_contribution
                                      ).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-[#3B82F6]">
                                      {parseFloat(
                                        contrib.contribution_percentage
                                      ).toFixed(2)}
                                      %
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-semibold text-[#068847]">
                                      ৳
                                      {parseFloat(
                                        contrib.commission_earned
                                      ).toLocaleString()}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
