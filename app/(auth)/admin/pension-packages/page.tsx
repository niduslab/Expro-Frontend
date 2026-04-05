"use client";
import {
  Calendar,
  Package,
  Plus,
  TrendingUp,
  Users,
  Edit,
  Trash2,
  Eye,
  X,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";
import NewPackageModal from "./new-package-modal";
import {
  usePensionPackages,
  useDeletePensionPackage,
} from "@/lib/hooks/admin/usePensionPackages";
import { toast } from "sonner";

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-[12px] px-4 py-2 bg-[#F3F4F6]">
      <div className="flex items-center gap-2 text-[#4A5565] text-[11px]">
        {icon}
        {label}
      </div>
      <p className="text-[14px] font-medium text-[#030712]">{value}</p>
    </div>
  );
}

export default function AdminPensionPackages() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    data: packagesData,
    isLoading,
    error,
  } = usePensionPackages({ per_page: 100 });
  const { mutate: deletePackage, isPending: isDeleting } =
    useDeletePensionPackage();

  const handleDeleteClick = (id: number, name: string) => {
    setPackageToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!packageToDelete) return;

    toast.loading("Deleting pension package...", { id: "delete-package" });

    deletePackage(packageToDelete.id, {
      onSuccess: (res) => {
        toast.success(res.message || "Pension package deleted successfully!", {
          id: "delete-package",
        });
        setDeleteModalOpen(false);
        setPackageToDelete(null);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || "Failed to delete pension package",
          { id: "delete-package" },
        );
      },
    });
  };

  const handleViewMembers = (packageId: number, packageName: string) => {
    // TODO: Navigate to members page with filter or open members modal
    toast.info(`Viewing members for ${packageName}`, {
      description: "This feature will be implemented soon",
    });
  };

  const handleEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setOpenModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      running: {
        text: "Running",
        className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]",
      },
      active: {
        text: "Running",
        className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]",
      },
      inactive: {
        text: "Expired",
        className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]",
      },
      expired: {
        text: "Expired",
        className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]",
      },
      upcoming: {
        text: "Upcoming",
        className: "text-[#F59E0B] bg-[#FEF3C7] border-[#FCD34D]",
      },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || statusMap.running;

    return (
      <span
        className={`text-[12px] font-semibold ${statusInfo.className} border px-3 py-[2px] rounded-full`}
      >
        {statusInfo.text}
      </span>
    );
  };

  const packagesArray = packagesData?.data;
  const packages = Array.isArray(packagesArray) ? packagesArray : [];

  return (
    <>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-2xl sm:text-[32px] text-[#030712]">
            Pension Packages
          </p>
          <p className="text-sm text-[#4A5565]">
            Manage pension schemes and enrollment packages
          </p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <button
            onClick={() => {
              setSelectedPackage(null);
              setOpenModal(true);
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[#068847] text-white whitespace-nowrap hover:bg-[#057038] transition-colors"
          >
            <Plus className="h-5 w-5 shrink-0" />
            <span className="text-sm font-semibold">Add new Package</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px] ">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
            <p className="text-[#4A5565]">Loading pension packages...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load pension packages</p>
            <p className="text-sm text-[#4A5565]">
              {(error as any)?.message || "Please try again later"}
            </p>
          </div>
        </div>
      ) : !packages || packages.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Package className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
            <p className="text-[#4A5565] mb-2">No pension packages found</p>
            <p className="text-sm text-[#6A7282]">
              Create your first pension package to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8 max-w-7xl mx-auto">
          {packages.map((plan: any) => (
            <div
              key={plan.id}
              className="w-full min-h-[265px] flex flex-col justify-between border border-[#E5E7EB] rounded-[12px] p-5 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                    <Package className="h-5 w-5 text-[#068847]" />
                  </div>

                  <div>
                    <p className="font-semibold text-[16px] text-[#030712]">
                      {plan.name}
                    </p>
                    <p className="text-[#068847] font-semibold text-[12px]">
                      ৳{plan.monthly_amount}
                      <span className="text-[#4A5565] font-normal">/month</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(plan.status)}
                </div>
              </div>

              <div className="h-[1px] w-full bg-[#E5E7EB] my-4"></div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <Stat
                  icon={<Users size={14} />}
                  label="Enrolled Members"
                  value={plan.enrolled_members_count || 0}
                />
                <Stat
                  icon={<Calendar size={14} />}
                  label="Total Installments"
                  value={`${plan.total_installments} months`}
                />
                <Stat
                  icon={<TrendingUp size={14} />}
                  label="Maturity"
                  value={`৳${parseFloat(plan.maturity_amount)?.toLocaleString()}`}
                />
                <Stat
                  icon={<Package size={14} />}
                  label="Commission"
                  value={`৳${parseFloat(plan.installment_commission) || 0}/inst`}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                <button
                  onClick={() => handleViewMembers(plan.id, plan.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#068847] text-[#068847] hover:bg-[#F0FDF4] transition-colors"
                >
                  <Eye size={16} />
                  <span className="text-sm font-medium">View Members</span>
                </button>
                <button
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#D1D5DC] text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
                >
                  <Edit size={16} />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteClick(plan.id, plan.name)}
                  disabled={isDeleting}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openModal && (
        <NewPackageModal
          setOpenModal={setOpenModal}
          packageToEdit={selectedPackage}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && packageToDelete && (
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
                  "{packageToDelete.name}"
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
                onClick={() => {
                  setDeleteModalOpen(false);
                  setPackageToDelete(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 rounded-lg border border-[#D1D5DC] text-[#4A5565] font-medium hover:bg-[#F3F4F6] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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
