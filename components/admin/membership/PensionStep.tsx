"use client";

import React from "react";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import StepsNavigation from "./StepsNavigation";
import { usePensionPackages } from "@/lib/hooks/public/usePensionPackagesHook";

export type PensionInfoState = {
  selectedPackage: number | null;
};

interface PensionStepProps {
  data: PensionInfoState;
  onUpdate: (data: PensionInfoState) => void;
  onNext: () => void;
  onPrev: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const PensionStep: React.FC<PensionStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const { data: packagesData, isLoading, error } = usePensionPackages(1, 100);
  const packages = packagesData?.data || [];

  const handlePackageSelect = (packageId: PensionInfoState["selectedPackage"]) => {
    onUpdate({ selectedPackage: packageId });
  };

  const getSelectedPackageDetails = () => {
    if (!data.selectedPackage) return null;
    return packages.find((p) => p.id === data.selectedPackage);
  };

  const selectedPackageDetails = getSelectedPackageDetails();
  const canProceed = data.selectedPackage !== null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pension Package</h2>
        <p className="text-sm text-gray-600 mt-1">Select a pension package (Required)</p>
      </div>

      <StepsNavigation
        steps={steps}
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={onStepClick}
      />

      <div className="mb-6">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-orange-700">Important:</span> Admin must select a pension package. Payment via bKash is required for the first month.
          </p>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="animate-spin text-[#068847]" size={32} />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600 text-sm">Failed to load pension packages.</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm">No pension packages available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {packages.map((pkg) => {
              const isSelected = data.selectedPackage === pkg.id;
              const monthlyAmount = parseFloat(pkg.monthly_amount);
              const maturityAmount = parseFloat(pkg.maturity_amount);

              return (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageSelect(pkg.id)}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#068847] text-white border-[#068847] shadow-md"
                      : "bg-white text-gray-900 border-gray-200 hover:border-[#068847]"
                  }`}
                >
                  <h3 className={`text-base font-bold mb-1 ${isSelected ? "text-white" : "text-gray-900"}`}>
                    {pkg.name}
                  </h3>

                  <div className="flex items-baseline mb-3">
                    <span className={`text-xl font-bold ${isSelected ? "text-white" : "text-gray-900"}`}>
                      ৳{monthlyAmount.toLocaleString()}
                    </span>
                    <span className={`text-xs ml-1 ${isSelected ? "text-gray-200" : "text-gray-500"}`}>
                      /month
                    </span>
                  </div>

                  <button
                    className={`w-full py-2 rounded border text-xs font-medium mb-4 transition-colors ${
                      isSelected
                        ? "bg-white/20 border-white/30 text-white"
                        : "bg-gray-50 border-gray-300 text-gray-900 hover:border-gray-400"
                    }`}
                  >
                    {isSelected ? "Selected" : "Choose Package"}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <Check size={12} className={`mt-0.5 ${isSelected ? "text-green-300" : "text-[#068847]"}`} />
                      <span className={`text-xs ${isSelected ? "text-gray-100" : "text-gray-600"}`}>
                        Total Months: {pkg.total_installments}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check size={12} className={`mt-0.5 ${isSelected ? "text-green-300" : "text-[#068847]"}`} />
                      <span className={`text-xs ${isSelected ? "text-gray-100" : "text-gray-600"}`}>
                        Maturity: ৳{maturityAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check size={12} className={`mt-0.5 ${isSelected ? "text-green-300" : "text-[#068847]"}`} />
                      <span className={`text-xs ${isSelected ? "text-gray-100" : "text-gray-600"}`}>
                        Status: {pkg.status === "running" ? "Running" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Indicator */}
        {selectedPackageDetails && (
          <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2 border border-green-200">
            <Check size={16} className="text-[#068847]" />
            <div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {selectedPackageDetails.name} Package Selected
              </h4>
              <p className="text-xs text-gray-600">
                ৳{parseFloat(selectedPackageDetails.monthly_amount).toLocaleString()}/month
              </p>
            </div>
          </div>
        )}

        {/* Validation Message */}
        {!canProceed && (
          <div className="bg-red-50 rounded-lg p-3 flex items-center gap-2 border border-red-200 mt-4">
            <span className="text-xs text-red-700">
              Please select a pension package to continue
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          <ChevronLeft size={18} />
          Previous
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
            canProceed
              ? "bg-[#068847] text-white hover:bg-[#057038]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next & Review
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PensionStep;
