"use client";

import React, { useState, ChangeEvent } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import StepsNavigation from './StepsNavigation';

export type SponsorInfoState = {
  sponsorName: string;
  sponsorMemberId: string;
};

type FormErrors = Partial<Record<keyof SponsorInfoState, string>>;

const sponsorNamePlaceholder = "Name of referring member";
const sponsorMemberIdPlaceholder = "e.g. EWF-1076";

interface SponsorInformationProps {
  data: SponsorInfoState;
  onUpdate: (data: SponsorInfoState) => void;
  onNext: () => void;
  onPrev: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const SponsorInformation: React.FC<SponsorInformationProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange =
    (field: keyof SponsorInfoState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onUpdate({
        ...data,
        [field]: value,
      });
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!data.sponsorName.trim()) {
      nextErrors.sponsorName = "Sponsor Name (English) is required";
    }

    if (!data.sponsorMemberId.trim()) {
      nextErrors.sponsorMemberId = "Sponsor Member Id is required";
    } else {
      // Optional: Add validation for EWF-XXXX format if strictly required
      // For now, checking if it's not empty as per typical "required" asterisk
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="w-full bg-[#F3F4F6] py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">Sponsor Information</h2>
            <p className="text-gray-500 text-sm md:text-base">
              If you are referred by any existing member, please provide their details
            </p>
          </div>

          {/* Steps Navigation */}
          <StepsNavigation 
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={onStepClick}
          />

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Sponsor Name (English) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Sponsor Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.sponsorName}
                onChange={handleChange("sponsorName")}
                placeholder={sponsorNamePlaceholder}
                aria-invalid={Boolean(errors.sponsorName)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.sponsorName ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.sponsorName && (
                <p className="text-xs text-red-500">{errors.sponsorName}</p>
              )}
            </div>

            {/* Sponsor Member Id */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Sponsor Member Id <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.sponsorMemberId}
                onChange={handleChange("sponsorMemberId")}
                placeholder={sponsorMemberIdPlaceholder}
                aria-invalid={Boolean(errors.sponsorMemberId)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.sponsorMemberId ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.sponsorMemberId && (
                <p className="text-xs text-red-500">{errors.sponsorMemberId}</p>
              )}
            </div>

          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center px-6 py-3 bg-[#F3F4F6] text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>
          
          <button
            type="button"
            onClick={handleNextClick}
            className="flex items-center px-8 py-3 bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors shadow-sm"
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default SponsorInformation;
