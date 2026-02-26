"use client";

import React, { useState, ChangeEvent, useRef } from 'react';
import { Camera, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

export type NomineeInfoState = {
  nomineeNameBangla: string;
  nomineeNameEnglish: string;
  dateOfBirth: string;
  relation: string;
  nid: string;
  photo: File | null;
};

type FormErrors = Partial<Record<keyof NomineeInfoState, string>>;

const nameBanglaPlaceholder = "আপনার নাম";
const nameEnglishPlaceholder = "You full name";
const dateOfBirthPlaceholder = "mm/dd/yyyy";
const relationPlaceholder = "e.g. wife, son, daughter friend";
const nidPlaceholder = "Nominee national ID number if available";

import StepsNavigation from './StepsNavigation';

interface NomineeInformationProps {
  data: NomineeInfoState;
  onUpdate: (data: NomineeInfoState) => void;
  onNext: () => void;
  onPrev: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const NomineeInformation: React.FC<NomineeInformationProps> = ({
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange =
    (field: keyof NomineeInfoState) =>
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

    if (!data.nomineeNameBangla.trim()) {
      nextErrors.nomineeNameBangla = "Nominee Name (Bangla) is required";
    }

    if (!data.nomineeNameEnglish.trim()) {
      nextErrors.nomineeNameEnglish = "Nominee Name (English) is required";
    }

    if (!data.dateOfBirth.trim()) {
      nextErrors.dateOfBirth = "Date of Birth is required";
    } else {
      const dobPattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!dobPattern.test(data.dateOfBirth.trim())) {
        nextErrors.dateOfBirth = "Use mm/dd/yyyy format";
      }
    }

    if (!data.relation.trim()) {
      nextErrors.relation = "Relation With Applicant's is required";
    }

    if (!data.nid.trim()) {
      nextErrors.nid = "Nominee National Id No is required";
    } else {
      const nidPattern = /^[0-9]{10,17}$/;
      if (!nidPattern.test(data.nid.trim())) {
        nextErrors.nid = "Enter a valid numeric ID (10–17 digits)";
      }
    }

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
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">Nominee Information</h2>
            <p className="text-gray-500 text-sm md:text-base">Please fill out all required fields to complete your application.</p>
          </div>

          <StepsNavigation 
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={onStepClick}
          />

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Nominee Name (Bangla) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Nominee Name (Bangla) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.nomineeNameBangla}
                onChange={handleChange("nomineeNameBangla")}
                placeholder={nameBanglaPlaceholder}
                aria-invalid={Boolean(errors.nomineeNameBangla)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.nomineeNameBangla ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.nomineeNameBangla && (
                <p className="text-xs text-red-500">{errors.nomineeNameBangla}</p>
              )}
            </div>

            {/* Nominee Name (English) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Nominee Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.nomineeNameEnglish}
                onChange={handleChange("nomineeNameEnglish")}
                placeholder={nameEnglishPlaceholder}
                aria-invalid={Boolean(errors.nomineeNameEnglish)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.nomineeNameEnglish ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.nomineeNameEnglish && (
                <p className="text-xs text-red-500">{errors.nomineeNameEnglish}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.dateOfBirth}
                onChange={handleChange("dateOfBirth")}
                placeholder={dateOfBirthPlaceholder}
                aria-invalid={Boolean(errors.dateOfBirth)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Relation With Applicant's */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Relation With Applicant's <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.relation}
                onChange={handleChange("relation")}
                placeholder={relationPlaceholder}
                aria-invalid={Boolean(errors.relation)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.relation ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.relation && (
                <p className="text-xs text-red-500">{errors.relation}</p>
              )}
            </div>

            {/* Nominee National Id No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Nominee National Id No <span className="text-red-500">*</span>
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

export default NomineeInformation;
