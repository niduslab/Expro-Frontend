"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Percent,
  FileText,
  Edit,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import {
  usePensionPackage,
  useDeletePensionPackage,
} from "@/lib/hooks/admin/usePensionPackages";
import { toast } from "sonner";
import NewPackageModal from "../new-package-modal";

function InfoCard({
  icon,
  label,
  value,
  description,
  className = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E5E7EB] p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm text-[#6B7280] font-medium">{label}</p>
          <p className="text-2xl font-bold text-[#030712]">{value}</p>
        </div>
      </div>
      {description && <p className="text-sm text-[#6B7280]">{description}</p>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    { text: string; className: string; icon: React.ReactNode }
  > = {
    active: {
      text: "Active",
      className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]",
      icon: <CheckCircle size={14} />,
    },
    inactive: {
      text: "Inactive",
      className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]",
      icon: <XCircle size={14} />,
    },
    upcoming: {
      text: "Upcoming",
      className: "text-[#F59E0B] bg-[#FEF3C7] border-[#FCD34D]",
      icon: <Clock size={14} />,
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.active;

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-semibold ${config.className} border px-4 py-2 rounded-full`}
    >
      {config.icon}
      {config.text}
    </span>
  );
}

export default function PensionPackageDetails() {
  const params = useParams();
  const router = useRouter();
  const packageId = parseInt(params.id as string);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: response, isLoading, error } = usePensionPackage(packageId);
  const { mutate: deletePackage, isPending: isDeleting } =
    useDeletePensionPackage();

  const packageData = response?.package_details;
  const statistics = response?.statistics;
  const recentEnrollments = response?.recent_enrollments || [];
  const recentApplications = response?.recent_applications || [];
  const recentInstallments = response?.recent_installments || [];
  const overdueInstallments = response?.overdue_installments || [];

  const handleDelete = () => {
    toast.loading("Deleting pension package...", { id: "delete-package" });

    deletePackage(packageId, {
      onSuccess: (res) => {
        toast.success(res.message || "Pension package deleted successfully!", {
          id: "delete-package",
        });
        router.push("/admin/pension-packages");
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete pension package",
          { id: "delete-package" },
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
          <p className="text-[#4A5565]">Loading package details...</p>
        </div>
      </div>
    );
  }

  // if (error || !response || !packageData) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <div className="text-center">
  //         <Package className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
  //         <p className="text-red-500 mb-2">Failed to load package details</p>
  //         <p className="text-sm text-[#4A5565] mb-4">
  //           {(error as any)?.message || "Package not found"}
  //         </p>
  //         <button
  //           onClick={() => router.push("/admin/pension-packages")}
  //           className="px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#057038] transition-colors"
  //         >
  //           Back to Packages
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/pension-packages")}
              className="flex items-center justify-center h-10 w-10 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
            >
              <ArrowLeft size={20} className="text-[#6B7280]" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#030712]">
                {packageData?.name}
              </h1>
              <p className="text-[#6B7280] mt-1">
                Pension Package Details & Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={packageData?.status || ""} />
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] text-[#6B7280] rounded-lg hover:bg-[#F9FAFB] transition-colors"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-[#DC2626] text-[#DC2626] rounded-lg hover:bg-[#FEE2E2] transition-colors"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Package Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <InfoCard
            icon={<DollarSign className="h-5 w-5 text-[#068847]" />}
            label="Monthly Amount"
            value={`৳${packageData?.monthly_amount?.toLocaleString()}`}
            description="Per installment"
          />
          <InfoCard
            icon={<Calendar className="h-5 w-5 text-[#068847]" />}
            label="Total Installments"
            value={`${packageData?.total_installments} months`}
            description="Payment duration"
          />
          <InfoCard
            icon={<TrendingUp className="h-5 w-5 text-[#068847]" />}
            label="Maturity Amount"
            value={`৳${packageData?.maturity_amount?.toLocaleString()}`}
            description="Final payout"
          />
          <InfoCard
            icon={<Users className="h-5 w-5 text-[#068847]" />}
            label="Enrolled Members"
            value={statistics?.enrollments?.total || 0}
            description={`${statistics?.enrollments?.active || 0} active, ${statistics?.enrollments?.completed || 0} completed`}
          />
        </div>

        {/* Financial Statistics */}
        {statistics?.financial && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <InfoCard
              icon={<DollarSign className="h-5 w-5 text-[#2563EB]" />}
              label="Total Collected"
              value={`৳${statistics.financial.total_collected?.toLocaleString()}`}
              description="From all enrollments"
              className="border-[#DBEAFE]"
            />
            <InfoCard
              icon={<TrendingUp className="h-5 w-5 text-[#2563EB]" />}
              label="Total Maturity Amount"
              value={`৳${statistics.financial.total_maturity_amount?.toLocaleString()}`}
              description="Expected payout"
              className="border-[#DBEAFE]"
            />
            <InfoCard
              icon={<CheckCircle className="h-5 w-5 text-[#2563EB]" />}
              label="Installments Paid"
              value={statistics.financial.total_installments_paid || 0}
              description={`${statistics.financial.total_installments_remaining || 0} remaining`}
              className="border-[#DBEAFE]"
            />
            <InfoCard
              icon={<Percent className="h-5 w-5 text-[#2563EB]" />}
              label="Total Commissions"
              value={`৳${(statistics.commissions?.total_commissions_paid || 0).toLocaleString()}`}
              description={`Joining: ৳${(statistics.commissions?.total_joining_commissions || 0).toLocaleString()}`}
              className="border-[#DBEAFE]"
            />
          </div>
        )}

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Package Information */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-xl font-semibold text-[#030712] mb-6 flex items-center gap-2">
                <Package className="h-5 w-5 text-[#068847]" />
                Package Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                    Package Name
                  </label>
                  <p className="text-[#030712] font-medium">
                    {packageData?.name}
                  </p>
                </div>

                {packageData?.name_bangla && (
                  <div>
                    <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                      Package Name (Bangla)
                    </label>
                    <p className="text-[#030712] font-medium">
                      {packageData?.name_bangla}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                    Package Slug
                  </label>
                  <p className="text-[#030712] font-mono text-sm bg-[#F9FAFB] px-2 py-1 rounded">
                    {packageData?.slug}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                    Status
                  </label>
                  <StatusBadge status={packageData?.status || ""} />
                </div>
              </div>
            </div>

            {/* Commission & Settings */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h2 className="text-xl font-semibold text-[#030712] mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#068847]" />
                Commission & Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                    Joining Commission
                  </label>
                  <p className="text-[#030712] font-medium">
                    ৳{packageData?.joining_commission?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                    Installment Commission
                  </label>
                  <p className="text-[#030712] font-medium">
                    ৳{packageData?.installment_commission?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                    Max Advance Installments
                  </label>
                  <p className="text-[#030712] font-medium">
                    {packageData?.max_advance_installments} months
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#6B7280] mb-1 block">
                    Prepayment Discount
                  </label>
                  <p className="text-[#030712] font-medium">
                    {packageData?.prepayment_discount_percentage}%
                  </p>
                </div>
              </div>
            </div>

            {/* Description & Terms */}
            {(packageData?.description || packageData?.terms_conditions) && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h2 className="text-xl font-semibold text-[#030712] mb-6 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#068847]" />
                  Description & Terms
                </h2>

                {packageData?.description && (
                  <div className="mb-6">
                    <label className="text-sm font-medium text-[#6B7280] mb-2 block">
                      Description
                    </label>
                    <div
                      className="text-[#030712] bg-[#F9FAFB] p-4 rounded-lg prose prose-sm max-w-none [&>p]:mb-2"
                      dangerouslySetInnerHTML={{
                        __html: packageData?.description || "",
                      }}
                    />
                  </div>
                )}

                {packageData?.terms_conditions && (
                  <div>
                    <label className="text-sm font-medium text-[#6B7280] mb-2 block">
                      Terms & Conditions
                    </label>
                    <div
                      className="text-[#030712] bg-[#F9FAFB] p-4 rounded-lg prose prose-sm max-w-none [&>p]:mb-2"
                      dangerouslySetInnerHTML={{
                        __html: packageData?.terms_conditions || "",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Settings */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#030712] mb-4">
                Package Settings
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">Active Status</span>
                  <span
                    className={`text-sm font-medium ${packageData?.is_active ? "text-[#29A36A]" : "text-[#DC2626]"}`}
                  >
                    {packageData?.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">New Enrollment</span>
                  <span
                    className={`text-sm font-medium ${packageData?.accepts_new_enrollment ? "text-[#29A36A]" : "text-[#DC2626]"}`}
                  >
                    {packageData?.accepts_new_enrollment
                      ? "Allowed"
                      : "Disabled"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">
                    Full Prepayment
                  </span>
                  <span
                    className={`text-sm font-medium ${packageData?.allow_full_prepayment ? "text-[#29A36A]" : "text-[#DC2626]"}`}
                  >
                    {packageData?.allow_full_prepayment
                      ? "Allowed"
                      : "Not Allowed"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6B7280]">
                    Maturity on Schedule
                  </span>
                  <span
                    className={`text-sm font-medium ${packageData?.maturity_on_schedule ? "text-[#29A36A]" : "text-[#DC2626]"}`}
                  >
                    {packageData?.maturity_on_schedule ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
              <h3 className="text-lg font-semibold text-[#030712] mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() =>
                    router.push(
                      `/admin/members?packageId=${packageId}&packageName=${encodeURIComponent(packageData?.name || "")}`,
                    )
                  }
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#068847] border border-[#068847] rounded-lg hover:bg-[#F0FDF4] transition-colors"
                >
                  <Users size={16} />
                  View Members
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/admin/team-collections?packageId=${packageId}&packageName=${encodeURIComponent(packageData?.name || "")}`,
                    )
                  }
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#6B7280] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  <TrendingUp size={16} />
                  Team Collection
                </button>
              </div>
            </div>

            {/* Package Timeline */}
            {(packageData?.created_at || packageData?.updated_at) && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h3 className="text-lg font-semibold text-[#030712] mb-4">
                  Timeline
                </h3>

                <div className="space-y-3">
                  {packageData?.created_at && (
                    <div>
                      <span className="text-sm text-[#6B7280]">Created</span>
                      <p className="text-sm font-medium text-[#030712]">
                        {new Date(packageData?.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  )}

                  {packageData?.updated_at && (
                    <div>
                      <span className="text-sm text-[#6B7280]">
                        Last Updated
                      </span>
                      <p className="text-sm font-medium text-[#030712]">
                        {new Date(packageData.updated_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Applications Statistics */}
            {statistics?.applications && (
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
                <h3 className="text-lg font-semibold text-[#030712] mb-4">
                  Applications
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Total</span>
                    <span className="text-sm font-medium text-[#030712]">
                      {statistics.applications.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Approved</span>
                    <span className="text-sm font-medium text-[#29A36A]">
                      {statistics.applications.approved}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Pending</span>
                    <span className="text-sm font-medium text-[#F59E0B]">
                      {statistics.applications.pending}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6B7280]">Rejected</span>
                    <span className="text-sm font-medium text-[#DC2626]">
                      {statistics.applications.rejected}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">
                        Approval Rate
                      </span>
                      <span className="text-sm font-semibold text-[#068847]">
                        {statistics.applications.approval_rate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Enrollments */}
        {recentEnrollments.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#030712] mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#068847]" />
              Recent Enrollments
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Enrollment Number
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Member ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Installments Paid
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Amount Paid
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Enrolled At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((enrollment: any) => (
                    <tr
                      key={enrollment.id}
                      className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-[#030712]">
                        {enrollment.enrollment_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {enrollment.member_id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            enrollment.status === "active"
                              ? "bg-[#DFF1E9] text-[#29A36A]"
                              : enrollment.status === "completed"
                                ? "bg-[#DBEAFE] text-[#2563EB]"
                                : "bg-[#FEE2E2] text-[#DC2626]"
                          }`}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {enrollment.installments_paid}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        ৳{enrollment.total_amount_paid?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280] capitalize">
                        {enrollment.current_role?.replace("_", " ")}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {new Date(enrollment.enrolled_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Applications */}
        {recentApplications.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#030712] mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#068847]" />
              Recent Applications
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Application Number
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Member ID
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Applied At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((application: any) => (
                    <tr
                      key={application.id}
                      className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-[#030712]">
                        {application.application_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {application.member_id}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            application.status === "approved"
                              ? "bg-[#DFF1E9] text-[#29A36A]"
                              : application.status === "pending"
                                ? "bg-[#FEF3C7] text-[#F59E0B]"
                                : "bg-[#FEE2E2] text-[#DC2626]"
                          }`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {new Date(application.applied_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Overdue Installments Warning */}
        {overdueInstallments.length > 0 && (
          <div className="bg-[#FEE2E2] border border-[#FCA5A5] rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-[#DC2626] mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#DC2626] mb-2">
                  Overdue Installments
                </h3>
                <p className="text-sm text-[#991B1B] mb-4">
                  There are {overdueInstallments.length} overdue installments
                  that require attention.
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg">
                    <thead>
                      <tr className="border-b border-[#E5E7EB]">
                        <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">
                          Enrollment
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">
                          Installment #
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">
                          Amount
                        </th>
                        <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">
                          Due Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueInstallments
                        .slice(0, 5)
                        .map((installment: any) => (
                          <tr
                            key={installment.id}
                            className="border-b border-[#F3F4F6]"
                          >
                            <td className="py-2 px-3 text-xs text-[#030712]">
                              {installment.enrollment_number}
                            </td>
                            <td className="py-2 px-3 text-xs text-[#6B7280]">
                              {installment.installment_number}
                            </td>
                            <td className="py-2 px-3 text-xs text-[#6B7280]">
                              ৳{installment.amount?.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-xs text-[#DC2626]">
                              {new Date(
                                installment.due_date,
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Installments */}
        {recentInstallments.length > 0 && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-8">
            <h2 className="text-xl font-semibold text-[#030712] mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#068847]" />
              Recent Installments
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Enrollment Number
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Installment #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Amount Paid
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Due Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">
                      Payment Method
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentInstallments.slice(0, 10).map((installment: any) => (
                    <tr
                      key={installment.id}
                      className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-[#030712]">
                        {installment.enrollment_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {installment.installment_number}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        ৳{installment.amount?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        ৳{installment.amount_paid?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {new Date(installment.due_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            installment.status === "paid"
                              ? "bg-[#DFF1E9] text-[#29A36A]"
                              : installment.status === "upcoming"
                                ? "bg-[#DBEAFE] text-[#2563EB]"
                                : installment.status === "overdue"
                                  ? "bg-[#FEE2E2] text-[#DC2626]"
                                  : "bg-[#FEF3C7] text-[#F59E0B]"
                          }`}
                        >
                          {installment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[#6B7280]">
                        {installment.payment_method || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModalOpen && (
        <NewPackageModal
          setOpenModal={setEditModalOpen}
          packageToEdit={packageData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-[#DC2626]" />
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-[#030712] mb-2">
                Delete Pension Package?
              </h3>
              <p className="text-[#4A5565] text-sm mb-3">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-[#030712]">
                  "{packageData?.name}"
                </span>
                ?
              </p>
              <p className="text-[#DC2626] text-sm font-medium">
                This action cannot be undone and will affect all enrolled
                members.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DC] text-[#4A5565] font-medium hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-lg bg-[#DC2626] text-white font-medium hover:bg-[#B91C1C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Package
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
