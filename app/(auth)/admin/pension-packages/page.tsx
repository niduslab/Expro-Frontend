"use client";
import { Calendar, Package, Plus, TrendingUp, Users, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import NewPackageModal from "./new-package-modal";
import { usePensionPackages, useDeletePensionPackage } from "@/lib/hooks/admin/usePensionPackages";
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
  
  const { data: packagesData, isLoading, error } = usePensionPackages({ per_page: 100 });
  const { mutate: deletePackage, isPending: isDeleting } = useDeletePensionPackage();

  const handleDelete = (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    toast.loading("Deleting pension package...", { id: "delete-package" });

    deletePackage(id, {
      onSuccess: (res) => {
        toast.success(res.message || "Pension package deleted successfully!", { id: "delete-package" });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to delete pension package", { id: "delete-package" });
      },
    });
  };

  const handleEdit = (pkg: any) => {
    setSelectedPackage(pkg);
    setOpenModal(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; className: string }> = {
      running: { text: "Running", className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]" },
      active: { text: "Running", className: "text-[#29A36A] bg-[#DFF1E9] border-[#A8DAC3]" },
      inactive: { text: "Expired", className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]" },
      expired: { text: "Expired", className: "text-[#DC2626] bg-[#FEE2E2] border-[#FCA5A5]" },
      upcoming: { text: "Upcoming", className: "text-[#F59E0B] bg-[#FEF3C7] border-[#FCD34D]" },
    };

    const statusInfo = statusMap[status?.toLowerCase()] || statusMap.running;

    return (
      <span className={`text-[12px] font-semibold ${statusInfo.className} border px-3 py-[2px] rounded-full`}>
        {statusInfo.text}
      </span>
    );
  };

  const packagesArray = packagesData?.data;
  const packages = Array.isArray(packagesArray) ? packagesArray : [];

  return (
    <>
      <div className="container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#068847] mx-auto mb-4"></div>
            <p className="text-[#4A5565]">Loading pension packages...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load pension packages</p>
            <p className="text-sm text-[#4A5565]">{(error as any)?.message || "Please try again later"}</p>
          </div>
        </div>
      ) : !packages || packages.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Package className="h-16 w-16 text-[#D1D5DC] mx-auto mb-4" />
            <p className="text-[#4A5565] mb-2">No pension packages found</p>
            <p className="text-sm text-[#6A7282]">Create your first pension package to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
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
                  onClick={() => handleEdit(plan)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#D1D5DC] text-[#4A5565] hover:bg-[#F3F4F6] transition-colors"
                >
                  <Edit size={16} />
                  <span className="text-sm font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(plan.id, plan.name)}
                  disabled={isDeleting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FEE2E2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={16} />
                  <span className="text-sm font-medium">Delete</span>
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
    </>
  );
}
