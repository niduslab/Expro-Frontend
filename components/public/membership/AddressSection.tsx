"use client";

import React, { useState, ChangeEvent } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type AddressFormState = {
  permanentAddress: string;
  presentAddress: string;
  mobileNumber: string;
  email: string;
  religion: string;
  gender: string;
};

type AddressFormErrors = Partial<Record<keyof AddressFormState, string>>;

const permanentAddressPlaceholder = "Village, Post Office, Upazilla, District";
const presentAddressPlaceholder = "Current residential address";
const mobilePlaceholder = "01XXXXXXXXX";
const emailPlaceholder = "example@gmail.com";

import StepsNavigation from './StepsNavigation';

interface AddressSectionProps {
  data: AddressFormState;
  onUpdate: (data: AddressFormState) => void;
  onNext: () => void;
  onPrev: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const [errors, setErrors] = useState<AddressFormErrors>({});

  const religiousOptions = ["Islam", "Hindu", "Christian", "Buddhism", "Other"];
  const genderOptions = ["Male", "Female", "Other"];

  const handleChange =
    (field: keyof AddressFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleReligionSelect = (religion: string) => {
    onUpdate({
      ...data,
      religion,
    });
    if (errors.religion) {
      setErrors((prev) => ({
        ...prev,
        religion: undefined,
      }));
    }
  };

  const handleGenderSelect = (gender: string) => {
    onUpdate({
      ...data,
      gender,
    });
    if (errors.gender) {
      setErrors((prev) => ({
        ...prev,
        gender: undefined,
      }));
    }
  };

  const validate = () => {
    const nextErrors: AddressFormErrors = {};

    if (!data.permanentAddress.trim()) {
      nextErrors.permanentAddress = "Permanent Address is required";
    } else if (data.permanentAddress.trim().length < 10) {
      nextErrors.permanentAddress = "Provide a more detailed permanent address";
    }

    if (!data.presentAddress.trim()) {
      nextErrors.presentAddress = "Present Address is required";
    } else if (data.presentAddress.trim().length < 10) {
      nextErrors.presentAddress = "Provide a more detailed present address";
    }

    if (!data.mobileNumber.trim()) {
      nextErrors.mobileNumber = "Mobile Number is required";
    } else {
      const mobilePattern = /^01[0-9]{9}$/;
      if (!mobilePattern.test(data.mobileNumber.trim())) {
        nextErrors.mobileNumber = "Enter a valid Bangladeshi mobile number (01XXXXXXXXX)";
      }
    }

    if (!data.email.trim()) {
      nextErrors.email = "Email Address is required";
    } else {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(data.email.trim())) {
        nextErrors.email = "Enter a valid email address";
      }
    }

    if (!data.religion) {
      nextErrors.religion = "Select a religion";
    }

    if (!data.gender) {
      nextErrors.gender = "Select a gender";
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
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">Address</h2>
            <p className="text-gray-500 text-sm md:text-base">
              Please fill out all required fields to complete your application.
            </p>
          </div>

          <StepsNavigation 
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={onStepClick}
          />

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Permanent Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={data.permanentAddress}
                onChange={handleChange("permanentAddress")}
                placeholder={permanentAddressPlaceholder}
                aria-invalid={Boolean(errors.permanentAddress)}
                rows={3}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.permanentAddress ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.permanentAddress && (
                <p className="text-xs text-red-500">{errors.permanentAddress}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Present Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={data.presentAddress}
                onChange={handleChange("presentAddress")}
                placeholder={presentAddressPlaceholder}
                aria-invalid={Boolean(errors.presentAddress)}
                rows={3}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.presentAddress ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.presentAddress && (
                <p className="text-xs text-red-500">{errors.presentAddress}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={data.mobileNumber}
                  onChange={handleChange("mobileNumber")}
                  placeholder={mobilePlaceholder}
                  aria-invalid={Boolean(errors.mobileNumber)}
                  className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.mobileNumber && (
                  <p className="text-xs text-red-500">{errors.mobileNumber}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={data.email}
                  onChange={handleChange("email")}
                  placeholder={emailPlaceholder}
                  aria-invalid={Boolean(errors.email)}
                  className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Religion <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {religiousOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleReligionSelect(option)}
                      className={`px-6 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#008543] ${
                        data.religion === option
                          ? "bg-[#008543] text-white"
                          : "bg-[#F3F4F6] text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {errors.religion && (
                  <p className="text-xs text-red-500">{errors.religion}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap items-center gap-6">
                  {genderOptions.map((option) => (
                    <label key={option} className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={data.gender === option}
                        onChange={() => handleGenderSelect(option)}
                        className="h-4 w-4 border-gray-300 text-[#008543] focus:ring-[#008543]"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-xs text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>
        </div>

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

export default AddressSection;
