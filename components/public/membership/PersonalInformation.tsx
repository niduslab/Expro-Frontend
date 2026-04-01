"use client";

import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Camera, ChevronRight, ChevronLeft, Upload, Calendar } from "lucide-react";

export type PersonalInfoState = {
  nameBangla: string;
  nameEnglish: string;
  fatherHusbandName: string;
  motherName: string;
  memberDateOfBirth: string;
  nid: string;
  qualification: string[];
  photo: File | null;
};

type FormErrors = Partial<Record<keyof PersonalInfoState, string>>;

const nameBanglaPlaceholder = "আপনার নাম";
const nameEnglishPlaceholder = "You full name";
const fatherHusbandPlaceholder = "Father's / Husband's Name";
const motherNamePlaceholder = "Mother's name";
const dateOfBirthPlaceholder = "mm/dd/yyyy";
const nidPlaceholder = "Enter your NID number";

import StepsNavigation from "./StepsNavigation";

interface PersonalInformationProps {
  data: PersonalInfoState;
  onUpdate: (data: PersonalInfoState) => void;
  onNext: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${month}/${day}/${year}`;
};

const PersonalInformation: React.FC<PersonalInformationProps> = ({
  data,
  onUpdate,
  onNext,
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const qualifications = ["JSC", "SSC", "HSC", "Bachelor", "Masters", "Others"];

  const handleChange =
    (field: keyof PersonalInfoState) =>
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

  const handleQualificationSelect = (qualification: string) => {
    let newQualifications: string[];
    if (data.qualification.includes(qualification)) {
      newQualifications = data.qualification.filter((q) => q !== qualification);
    } else {
      newQualifications = [...data.qualification, qualification];
    }

    onUpdate({
      ...data,
      qualification: newQualifications,
    });

    if (newQualifications.length > 0 && errors.qualification) {
      setErrors((prev) => ({
        ...prev,
        qualification: undefined,
      }));
    }
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onUpdate({
      ...data,
      photo: file,
    });
    if (errors.photo) {
      setErrors((prev) => ({
        ...prev,
        photo: undefined,
      }));
    }
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!data.nameBangla.trim()) {
      nextErrors.nameBangla = "Name (Bangla) is required";
    }

    if (!data.nameEnglish.trim()) {
      nextErrors.nameEnglish = "Name (English) is required";
    }

    if (!data.fatherHusbandName.trim()) {
      nextErrors.fatherHusbandName = "Father's / Husband's Name is required";
    }

    if (!data.motherName.trim()) {
      nextErrors.motherName = "Mother's Name is required";
    }

    if (!data.memberDateOfBirth.trim()) {
      nextErrors.memberDateOfBirth = "Date of Birth is required";
    } else {
      const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!dobPattern.test(data.memberDateOfBirth.trim())) {
        nextErrors.memberDateOfBirth = "Use valid date format";
      }
    }

    if (!data.nid.trim()) {
      nextErrors.nid = "National/Smart ID No is required";
    } else {
      const nidPattern = /^[0-9]{10,17}$/;
      if (!nidPattern.test(data.nid.trim())) {
        nextErrors.nid = "Enter a valid numeric ID (10–17 digits)";
      }
    }

    if (data.qualification.length === 0) {
      nextErrors.qualification = "Select at least one qualification";
    }

    // Since file cannot be persisted in localStorage, we skip required check if loading from there?
    // No, let's enforce it. If user refreshes, they need to upload again.
    if (!data.photo) {
      nextErrors.photo = "Passport size photo is required";
    } else if (data.photo.size > 2 * 1024 * 1024) {
      nextErrors.photo = "Maximum allowed file size is 2MB";
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
      <div className="container mx-auto px-6 md:px-12 lg:px-20 ">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">
              Personal Information
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Please provide your basic details
            </p>
          </div>

          <StepsNavigation
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={onStepClick}
          />

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Name (Bangla) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Name (Bangla) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.nameBangla}
                onChange={handleChange("nameBangla")}
                placeholder={nameBanglaPlaceholder}
                aria-invalid={Boolean(errors.nameBangla)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.nameBangla ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.nameBangla && (
                <p className="text-xs text-red-500">{errors.nameBangla}</p>
              )}
            </div>

            {/* Name (English) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.nameEnglish}
                onChange={handleChange("nameEnglish")}
                placeholder={nameEnglishPlaceholder}
                aria-invalid={Boolean(errors.nameEnglish)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.nameEnglish ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.nameEnglish && (
                <p className="text-xs text-red-500">{errors.nameEnglish}</p>
              )}
            </div>

            {/* Father's / Husband's Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Father's / Husband's Name{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.fatherHusbandName}
                onChange={handleChange("fatherHusbandName")}
                placeholder={fatherHusbandPlaceholder}
                aria-invalid={Boolean(errors.fatherHusbandName)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.fatherHusbandName
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
              {errors.fatherHusbandName && (
                <p className="text-xs text-red-500">
                  {errors.fatherHusbandName}
                </p>
              )}
            </div>

            {/* Mother's Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.motherName}
                onChange={handleChange("motherName")}
                placeholder={motherNamePlaceholder}
                aria-invalid={Boolean(errors.motherName)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.motherName ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.motherName && (
                <p className="text-xs text-red-500">{errors.motherName}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative bg-white rounded-md">
                <input
                  type="date"
                  value={data.memberDateOfBirth}
                  onChange={handleChange("memberDateOfBirth")}
                  onClick={(e) => {
                    try {
                      if (typeof (e.target as any).showPicker === "function") {
                        (e.target as any).showPicker();
                      }
                    } catch (error) {
                      // ignore
                    }
                  }}
                  aria-invalid={Boolean(errors.memberDateOfBirth)}
                  className={`peer relative z-10 w-full pl-4 pr-12 py-3 bg-transparent rounded-md border focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all cursor-pointer text-transparent focus:text-gray-900 ${
                    errors.memberDateOfBirth ? "border-red-500" : "border-gray-200"
                  } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                />
                {/* Custom Display */}
                <div className="absolute inset-0 pl-4 pr-12 py-3 pointer-events-none flex items-center peer-focus:opacity-0">
                  <span className={data.memberDateOfBirth ? "text-gray-900" : "text-gray-400"}>
                    {data.memberDateOfBirth ? formatDate(data.memberDateOfBirth) : "mm/dd/yyyy"}
                  </span>
                </div>
                <Calendar 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20" 
                  size={20} 
                />
              </div>
              {errors.memberDateOfBirth && (
                <p className="text-xs text-red-500">{errors.memberDateOfBirth}</p>
              )}
            </div>

            {/* National/Smart ID No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                National/Smart ID No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.nid}
                onChange={handleChange("nid")}
                placeholder={nidPlaceholder}
                aria-invalid={Boolean(errors.nid)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.nid ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.nid && (
                <p className="text-xs text-red-500">{errors.nid}</p>
              )}
            </div>

            {/* Academic Qualification */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Academic Qualification <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {qualifications.map((qual) => (
                  <button
                    key={qual}
                    type="button"
                    onClick={() => handleQualificationSelect(qual)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#008543] ${
                      data.qualification.includes(qual)
                        ? "bg-[#008543] text-white"
                        : "bg-[#F3F4F6] text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {qual}
                  </button>
                ))}
              </div>
              {errors.qualification && (
                <p className="text-xs text-red-500 mt-2">
                  {errors.qualification}
                </p>
              )}
            </div>

            {/* Passport Size Photo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Passport Size Photo <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload a recent passport size photograph (max 2MB, JPG/PNG)
              </p>

              <div className="flex flex-col items-start space-y-3">
                <div className="w-40 h-40 bg-[#F3F4F6] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden">
                  {data.photo ? (
                    <img
                      src={URL.createObjectURL(data.photo)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Camera size={32} className="mb-2" />
                      <span className="text-xs">PP Size Photo</span>
                    </>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors"
                >
                  <Upload size={16} />
                  <span>{data.photo ? "Change Photo" : "Upload Photo"}</span>
                </button>
              </div>
              {errors.photo && (
                <p className="text-xs text-red-500">{errors.photo}</p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button
            type="button"
            className="flex items-center  px-6 py-3 bg-[#F3F4F6] text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors opacity-50 cursor-not-allowed"
            disabled
          >
            <ChevronLeft size={20} className="" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleNextClick}
            className="flex items-center px-8 py-3 cursor-pointer bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors shadow-sm"
          >
            Next
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
