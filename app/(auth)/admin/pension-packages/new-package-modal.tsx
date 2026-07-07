"use client";
import { Plus, Save } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  useCreatePensionPackage,
  useUpdatePensionPackage,
} from "@/lib/hooks/admin/usePensionPackages";
import RichTextEditor from "@/components/admin/RichTextEditor";

interface NewPackageModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  packageToEdit?: any;
}

export default function NewPackageModal({
  setOpenModal,
  packageToEdit,
}: NewPackageModalProps) {
  const isEditMode = !!packageToEdit;

  const [formData, setFormData] = useState({
    packageName: "",
    packageNameBangla: "",
    slug: "",
    monthlyFee: "",
    totalInstallments: "",
    maturity: "",
    joiningCommission: "",
    installmentCommission: "",
    maxAdvanceInstallments: "",
    allowFullPrepayment: false,
    prepaymentDiscountPercentage: "",
    maturityOnSchedule: true,
    isActive: true,
    acceptsNewEnrollment: true,
    description: "",
    termsConditions: "",
  });

  useEffect(() => {
    if (packageToEdit) {
      setFormData({
        packageName: packageToEdit.name || "",
        packageNameBangla: packageToEdit.name_bangla || "",
        slug: packageToEdit.slug || "",
        monthlyFee: packageToEdit.monthly_amount?.toString() || "",
        totalInstallments: packageToEdit.total_installments?.toString() || "",
        maturity: packageToEdit.maturity_amount?.toString() || "",
        joiningCommission: packageToEdit.joining_commission?.toString() || "",
        installmentCommission:
          packageToEdit.installment_commission?.toString() || "",
        maxAdvanceInstallments:
          packageToEdit.max_advance_installments?.toString() || "",
        allowFullPrepayment: packageToEdit.allow_full_prepayment || false,
        prepaymentDiscountPercentage:
          packageToEdit.prepayment_discount_percentage?.toString() || "",
        maturityOnSchedule: packageToEdit.maturity_on_schedule ?? true,
        isActive: packageToEdit.is_active ?? true,
        acceptsNewEnrollment: packageToEdit.accepts_new_enrollment ?? true,
        description: packageToEdit.description || "",
        termsConditions: packageToEdit.terms_conditions || "",
      });
    }
  }, [packageToEdit]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: createPackage, isPending: isCreating } =
    useCreatePensionPackage();
  const { mutate: updatePackage, isPending: isUpdating } =
    useUpdatePensionPackage();

  const isPending = isCreating || isUpdating;

  // Auto-generate slug from package name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Auto-generate slug when package name changes
  useEffect(() => {
    if (formData.packageName && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.packageName),
      }));
    }
  }, [formData.packageName, isEditMode]);

  const handleSubmit = () => {
    // Basic validation
    const validationErrors: Record<string, string> = {};

    if (!formData.packageName.trim())
      validationErrors.packageName = "Package name is required";
    if (!formData.slug.trim()) validationErrors.slug = "Slug is required";
    if (!formData.monthlyFee || parseFloat(formData.monthlyFee) <= 0)
      validationErrors.monthlyFee = "Valid monthly fee is required";
    if (
      !formData.totalInstallments ||
      parseInt(formData.totalInstallments) <= 0
    )
      validationErrors.totalInstallments =
        "Valid total installments is required";
    if (!formData.maturity || parseFloat(formData.maturity) <= 0)
      validationErrors.maturity = "Valid maturity amount is required";
    if (
      !formData.joiningCommission ||
      parseFloat(formData.joiningCommission) < 0
    )
      validationErrors.joiningCommission =
        "Valid joining commission is required";
    if (
      !formData.installmentCommission ||
      parseFloat(formData.installmentCommission) < 0
    )
      validationErrors.installmentCommission =
        "Valid installment commission is required";
    if (
      !formData.maxAdvanceInstallments ||
      parseInt(formData.maxAdvanceInstallments) < 0
    )
      validationErrors.maxAdvanceInstallments =
        "Valid max advance installments is required";
    if (
      formData.allowFullPrepayment &&
      (!formData.prepaymentDiscountPercentage ||
        parseFloat(formData.prepaymentDiscountPercentage) < 0)
    ) {
      validationErrors.prepaymentDiscountPercentage =
        "Valid prepayment discount is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields correctly");
      return;
    }

    setErrors({});

    const payload = {
      name: formData.packageName.trim(),
      name_bangla: formData.packageNameBangla.trim() || undefined,
      slug: formData.slug.trim(),
      monthly_amount: parseFloat(formData.monthlyFee),
      total_installments: parseInt(formData.totalInstallments),
      maturity_amount: parseFloat(formData.maturity),
      joining_commission: parseFloat(formData.joiningCommission),
      installment_commission: parseFloat(formData.installmentCommission),
      max_advance_installments: parseInt(formData.maxAdvanceInstallments),
      allow_full_prepayment: formData.allowFullPrepayment,
      prepayment_discount_percentage:
        parseFloat(formData.prepaymentDiscountPercentage) || 0,
      maturity_on_schedule: formData.maturityOnSchedule,
      is_active: formData.isActive,
      accepts_new_enrollment: formData.acceptsNewEnrollment,
      description: formData.description.trim() || undefined,
      terms_conditions: formData.termsConditions.trim() || undefined,
    };

    if (isEditMode) {
      toast.loading("Updating pension package...", { id: "save-package" });

      updatePackage(
        { id: packageToEdit.id, ...payload },
        {
          onSuccess: (res) => {
            toast.success(
              res.message || "Pension package updated successfully!",
              { id: "save-package" },
            );
            setOpenModal(false);
          },
          onError: (err: any) => {
            toast.error(
              err?.response?.data?.message ||
                "Failed to update pension package",
              { id: "save-package" },
            );
            setErrors(err?.response?.data?.errors || {});
          },
        },
      );
    } else {
      toast.loading("Creating pension package...", { id: "save-package" });

      createPackage(payload, {
        onSuccess: (res) => {
          toast.success(
            res.message || "Pension package created successfully!",
            { id: "save-package" },
          );
          setOpenModal(false);
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || "Failed to create pension package",
            { id: "save-package" },
          );
          setErrors(err?.response?.data?.errors || {});
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto p-2">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          <div className=" flex flex-col gap-2">
            {" "}
            <div className="flex justify-between items-center ">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                {isEditMode
                  ? "Edit Pension Package"
                  : "Create New Pension Package"}
              </p>
              <button
                onClick={() => setOpenModal(false)}
                className=" text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <div className="">
              <p className="font-normal text-[12px] leading-[160%] tracking-[-0.01em] text-[#4A5565]">
                Define the package details, duration, and commission
                structure.{" "}
              </p>
            </div>
          </div>

          <div className=" w-full top-[16px]  border border-[#E5E7EB] relative"></div>
          {/*Package details*/}
          <div className="flex flex-col relative top-[24px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Package Details
              </p>
            </div>
            <div className=" justify-between">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Package Name
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>

              <input
                className="w-full h-[48px] gap-[129px] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                placeholder="e.g. standard pension"
                value={formData.packageName}
                onChange={(e) => {
                  setFormData({ ...formData, packageName: e.target.value });

                  if (errors.packageName) {
                    setErrors((prev) => ({ ...prev, packageName: "" }));
                  }
                }}
              />
              {errors.packageName && (
                <span className="text-sm text-red-500">
                  {errors.packageName}
                </span>
              )}
            </div>

            <div className=" justify-between">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Package Name (Bangla)
                </span>
              </div>

              <input
                className="w-full h-[48px] gap-[129px] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                placeholder="e.g. স্ট্যান্ডার্ড পেনশন"
                value={formData.packageNameBangla}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    packageNameBangla: e.target.value,
                  });
                }}
              />
            </div>

            <div className=" justify-between">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Slug
                </span>
                <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                  *
                </span>
              </div>

              <input
                className="w-full h-[48px] gap-[129px] opacity-100 border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                placeholder="e.g. standard-pension"
                value={formData.slug}
                onChange={(e) => {
                  setFormData({ ...formData, slug: e.target.value });

                  if (errors.slug) {
                    setErrors((prev) => ({ ...prev, slug: "" }));
                  }
                }}
              />
              {errors.slug && (
                <span className="text-sm text-red-500">{errors.slug}</span>
              )}
            </div>

            <div className="flex gap-2 w-full">
              <div className="relative w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Monthly Amount (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    type="number"
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                    placeholder="e.g. 1000"
                    value={formData.monthlyFee}
                    onChange={(e) => {
                      setFormData({ ...formData, monthlyFee: e.target.value });

                      if (errors.monthlyFee) {
                        setErrors((prev) => ({ ...prev, monthlyFee: "" }));
                      }
                    }}
                  />
                  {errors.monthlyFee && (
                    <span className="text-sm text-red-500">
                      {errors.monthlyFee}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Total Installments
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    type="number"
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                    placeholder="e.g. 108"
                    value={formData.totalInstallments}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        totalInstallments: e.target.value,
                      });

                      if (errors.totalInstallments) {
                        setErrors((prev) => ({
                          ...prev,
                          totalInstallments: "",
                        }));
                      }
                    }}
                  />
                  {errors.totalInstallments && (
                    <span className="text-sm text-red-500">
                      {errors.totalInstallments}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className=" container top-2  border border-[#E5E7EB] relative "></div>
          </div>

          {/*duration & maturity*/}
          <div className="flex flex-col relative top-[48px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Maturity & Advance Settings
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="relative md:w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Maturity Amount (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    type="number"
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                    placeholder="e.g. 180000"
                    value={formData.maturity}
                    onChange={(e) => {
                      setFormData({ ...formData, maturity: e.target.value });

                      if (errors.maturity) {
                        setErrors((prev) => ({ ...prev, maturity: "" }));
                      }
                    }}
                  />
                  {errors.maturity && (
                    <span className="text-sm text-red-500">
                      {errors.maturity}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative md:w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Max Advance Installments
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    type="number"
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                    placeholder="e.g. 6"
                    value={formData.maxAdvanceInstallments}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        maxAdvanceInstallments: e.target.value,
                      });

                      if (errors.maxAdvanceInstallments) {
                        setErrors((prev) => ({
                          ...prev,
                          maxAdvanceInstallments: "",
                        }));
                      }
                    }}
                  />
                  {errors.maxAdvanceInstallments && (
                    <span className="text-sm text-red-500">
                      {errors.maxAdvanceInstallments}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className=" container top-[16px]  border border-[#E5E7EB] relative "></div>
          </div>
          {/*Commission Structure*/}
          <div className="flex flex-col relative top-[86px]    gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Commission Structure
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="relative md:w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Joining Commission (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                      placeholder="e.g. 500"
                      value={formData.joiningCommission}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          joiningCommission: e.target.value,
                        });

                        if (errors.joiningCommission) {
                          setErrors((prev) => ({
                            ...prev,
                            joiningCommission: "",
                          }));
                        }
                      }}
                    />

                    <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                      One-time on new enrollment
                    </span>
                  </div>
                  {errors.joiningCommission && (
                    <span className="text-sm text-red-500">
                      {errors.joiningCommission}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative md:w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Installment Commission (৳)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                      placeholder="e.g. 30"
                      value={formData.installmentCommission}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          installmentCommission: e.target.value,
                        });

                        if (errors.installmentCommission) {
                          setErrors((prev) => ({
                            ...prev,
                            installmentCommission: "",
                          }));
                        }
                      }}
                    />
                    <span className="text-[#6A7282] font-normal text-[12px] leading-[160%] tracking-[-0.01em]">
                      Per monthly installment
                    </span>
                  </div>
                  <div>
                    {errors.installmentCommission && (
                      <span className="text-sm text-red-500">
                        {errors.installmentCommission}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" container top-[16px]  border border-[#E5E7EB] relative "></div>
          </div>

          {/*Prepayment Settings*/}
          <div className="flex flex-col relative top-[110px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Prepayment Settings
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allowFullPrepayment"
                checked={formData.allowFullPrepayment}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    allowFullPrepayment: e.target.checked,
                  });
                }}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label
                htmlFor="allowFullPrepayment"
                className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em]"
              >
                Allow Full Prepayment
              </label>
            </div>

            {formData.allowFullPrepayment && (
              <div className="relative">
                <div className="pb-2">
                  <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                    Prepayment Discount Percentage (%)
                  </span>
                  <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                    *
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                  placeholder="e.g. 5.5"
                  value={formData.prepaymentDiscountPercentage}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      prepaymentDiscountPercentage: e.target.value,
                    });

                    if (errors.prepaymentDiscountPercentage) {
                      setErrors((prev) => ({
                        ...prev,
                        prepaymentDiscountPercentage: "",
                      }));
                    }
                  }}
                />
                {errors.prepaymentDiscountPercentage && (
                  <span className="text-sm text-red-500">
                    {errors.prepaymentDiscountPercentage}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="maturityOnSchedule"
                checked={formData.maturityOnSchedule}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    maturityOnSchedule: e.target.checked,
                  });
                }}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label
                htmlFor="maturityOnSchedule"
                className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em]"
              >
                Maturity On Schedule
              </label>
            </div>
            <div className=" container top-[16px]  border border-[#E5E7EB] relative "></div>
          </div>

          {/*Package Status*/}
          <div className="flex flex-col relative top-[134px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Package Status
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    isActive: e.target.checked,
                  });
                }}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label
                htmlFor="isActive"
                className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em]"
              >
                Is Active
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="acceptsNewEnrollment"
                checked={formData.acceptsNewEnrollment}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    acceptsNewEnrollment: e.target.checked,
                  });
                }}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label
                htmlFor="acceptsNewEnrollment"
                className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em]"
              >
                Accepts New Enrollment
              </label>
            </div>
            <div className=" container top-[16px]  border border-[#E5E7EB] relative "></div>
          </div>

          {/*Additional Information*/}
          <div className="flex flex-col relative top-[158px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Additional Information
              </p>
            </div>

            <div className="relative">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Description
                </span>
              </div>
              <RichTextEditor
                value={formData.description || ""}
                onChange={(html) => {
                  setFormData({
                    ...formData,
                    description: html,
                  });
                }}
                placeholder="Enter package description..."
              />
            </div>

            <div className="relative">
              <div className="pb-2">
                <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                  Terms & Conditions
                </span>
              </div>
              <RichTextEditor
                value={formData.termsConditions || ""}
                onChange={(html) => {
                  setFormData({
                    ...formData,
                    termsConditions: html,
                  });
                }}
                placeholder="Enter terms and conditions..."
              />
            </div>

            <div className="flex relative w-[257px]  gap-[16px] ">
              <button
                onClick={() => setOpenModal(false)}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#068847] h-[48px] w-[158px] rounded-xl  px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEditMode ? (
                  <>
                    <Save className="h-5 w-5 mr-1" />
                    <span className="whitespace-nowrap">
                      {isPending ? "Saving..." : "Save Changes"}
                    </span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5 mr-1" />
                    <span>{isPending ? "Adding..." : "Add Package"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
