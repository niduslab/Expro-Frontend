"use client";
import Dropdown from "@/components/ui/dropdown";
import { pensionpackageSchema } from "@/components/zodschema/pensionpackageSchema";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface NewPackageModalProps {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NewPackageModal({
  setOpenModal,
}: NewPackageModalProps) {
  const [formData, setFormData] = useState({
    packageName: "",
    monthlyFee: "",
    status: "",

    duration: "",
    installments: "",
    maturity: "",

    joiningCommission: "",
    installmentCommission: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleSubmit = () => {
    const result = pensionpackageSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((issue: any) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });

      setErrors(fieldErrors);

      const lastMessage = result.error.issues.slice(-1)[0]?.message;
      toast.error(lastMessage || "Validation failed");

      return;
    }

    setErrors({});

    toast.success("Pension Package added successfully.");
    setOpenModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="flex flex-col w-full max-w-[600px] h-[85vh] p-2 md:p-6 bg-white rounded-xl border border-[#E5E7EB] shadow-[0px_4px_40px_0px_#00000014] text-black relative">
        <div className="flex flex-col gap-6 overflow-y-auto overflow-x-hidden p-2">
          <div className=" flex flex-col gap-2">
            {" "}
            <div className="flex justify-between items-center ">
              <p className="text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                Create New Pension Package
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
            </div>{" "}
            <div className="flex gap-2 w-full">
              <div className="relative w-1/2">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Monthly Fee (৳)
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
                <Dropdown
                  label="Status"
                  required
                  placeholder="Select status"
                  options={["Running", "Expired", "Upcoming"]}
                  value={formData.status}
                  onChange={(value) => {
                    setFormData({ ...formData, status: value });

                    if (errors.status) {
                      setErrors((prev) => ({ ...prev, status: "" }));
                    }
                  }}
                />{" "}
                {errors.status && (
                  <span className="text-sm text-red-500">{errors.status}</span>
                )}
              </div>
            </div>
            <div className=" container top-2  border border-[#E5E7EB] relative "></div>
          </div>

          {/*duration & maturity*/}
          <div className="flex flex-col relative top-[48px]   gap-[16px]">
            <div>
              <p className="font-dm-sans font-semibold text-[18px] leading-[150%] tracking-[-0.01em] text-[#030712]  h-[27px] opacity-100">
                Duration & Maturity
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full">
              <div className="relative md:w-1/3">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Duration (Years)
                    </span>
                    <span className="text-[#FB2C36] font-medium text-[16px] leading-[150%] tracking-[-0.01em]">
                      *
                    </span>
                  </div>
                  <input
                    type="number"
                    className="h-[48px] w-full border border-[#D1D5DC] rounded-[8px] px-[16px] bg-[#FFFFFF] focus:outline-none focus:ring focus:ring-green-500 text-[#6A7282]"
                    placeholder="e.g. 9"
                    value={formData.duration}
                    onChange={(e) => {
                      setFormData({ ...formData, duration: e.target.value });

                      if (errors.duration) {
                        setErrors((prev) => ({ ...prev, duration: "" }));
                      }
                    }}
                  />
                  {errors.duration && (
                    <span className="text-sm text-red-500">
                      {errors.duration}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative md:w-1/3">
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
                    value={formData.installments}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        installments: e.target.value,
                      });

                      if (errors.installments) {
                        setErrors((prev) => ({ ...prev, installments: "" }));
                      }
                    }}
                  />
                  {errors.installments && (
                    <span className="text-sm text-red-500">
                      {errors.installments}
                    </span>
                  )}
                </div>
              </div>
              <div className="relative md:w-1/3">
                <div className="  justify-between w-full">
                  <div className="pb-2">
                    <span className="font-semibold text-[14px] leading-[150%] tracking-[-0.01em] p-0.5">
                      Maturity (৳)
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

            <div className="flex relative w-[257px]  gap-[16px] ">
              <button
                onClick={() => setOpenModal(false)}
                className="h-[48px] w-[83px] rounded-xl border border-[#E5E7EB] px-[16px] flex items-center justify-center text-[#6A7282] font-normal text-[16px] leading-[150%] tracking-[-0.01em]"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-[#068847] h-[48px] w-[158px] rounded-xl  px-[16px] text-[#FFFFFF] flex items-center justify-center font-semibold text-[16px] leading-[150%] tracking-[-0.01em]"
              >
                <Plus className="h-5 w-5 " /> <span>Add Package</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
