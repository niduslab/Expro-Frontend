"use client";

import React, { useState, ChangeEvent, useRef } from 'react';
import { Upload, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';
import StepsNavigation from './StepsNavigation';

export type NomineeInfoState = {
  nomineeNameBangla: string;
  nomineeNameEnglish: string;
  nomineeDob: string;
  relation: string;
  nid: string;
  photo: File | null;
  nomineeMobile: string;
  nomineeAddress: string;
};

type FormErrors = Partial<Record<keyof NomineeInfoState, string>>;

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

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${month}/${day}/${year}`;
};

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

    if (!data.nomineeDob.trim()) {
      nextErrors.nomineeDob = "Date of Birth is required";
    } else {
      const dobPattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!dobPattern.test(data.nomineeDob.trim())) {
        nextErrors.nomineeDob = "Use valid date format";
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

    if (!data.nomineeMobile.trim()) {
      nextErrors.nomineeMobile = "Nominee mobile number is required";
    } else {
      const mobilePattern = /^01[0-9]{9}$/;
      if (!mobilePattern.test(data.nomineeMobile.trim())) {
        nextErrors.nomineeMobile = "Enter a valid mobile number (e.g., 01712345678)";
      }
    }

    if (!data.nomineeAddress.trim()) {
      nextErrors.nomineeAddress = "Nominee address is required";
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Nominee Information</h2>
        <p className="text-sm text-gray-600 mt-1">Please provide nominee details</p>
      </div>

      <StepsNavigation 
        steps={steps}
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={onStepClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Nominee Name (Bangla) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Nominee Name (Bangla) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nomineeNameBangla}
            onChange={handleChange("nomineeNameBangla")}
            placeholder="আপনার নাম"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.nomineeNameBangla ? "border-red-500" : "border-gray-300"
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
            placeholder="Full name"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.nomineeNameEnglish ? "border-red-500" : "border-gray-300"
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
          <div className="relative">
            <input
              type="date"
              value={data.nomineeDob}
              onChange={handleChange("nomineeDob")}
              className={`peer w-full pl-4 pr-12 py-2.5 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all cursor-pointer text-transparent focus:text-gray-900 ${
                errors.nomineeDob ? "border-red-500" : "border-gray-300"
              } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            />
            <div className="absolute inset-0 pl-4 pr-12 py-2.5 pointer-events-none flex items-center peer-focus:opacity-0">
              <span className={data.nomineeDob ? "text-gray-900" : "text-gray-400"}>
                {data.nomineeDob ? formatDate(data.nomineeDob) : "mm/dd/yyyy"}
              </span>
            </div>
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
          </div>
          {errors.nomineeDob && (
            <p className="text-xs text-red-500">{errors.nomineeDob}</p>
          )}
        </div>

        {/* Relation */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Relation With Applicant <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.relation}
            onChange={handleChange("relation")}
            placeholder="e.g. wife, son, daughter, friend"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.relation ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.relation && (
            <p className="text-xs text-red-500">{errors.relation}</p>
          )}
        </div>

        {/* NID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Nominee National Id No <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nid}
            onChange={handleChange("nid")}
            placeholder="Nominee NID number"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.nid ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nid && (
            <p className="text-xs text-red-500">{errors.nid}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Nominee Mobile <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={data.nomineeMobile}
            onChange={handleChange("nomineeMobile")}
            placeholder="01712345678"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.nomineeMobile ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nomineeMobile && (
            <p className="text-xs text-red-500">{errors.nomineeMobile}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-900">
            Nominee Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.nomineeAddress}
            onChange={handleChange("nomineeAddress")}
            placeholder="Enter nominee's full address"
            rows={3}
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all resize-none ${
              errors.nomineeAddress ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nomineeAddress && (
            <p className="text-xs text-red-500">{errors.nomineeAddress}</p>
          )}
        </div>

        {/* Photo */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Passport Size Photo <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-600">Max 2MB, JPG/PNG</p>
          
          <div className="flex flex-col items-start space-y-3">
            <div className="w-40 h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden">
              {data.photo ? (
                <img 
                  src={URL.createObjectURL(data.photo)} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <Upload size={32} className="mb-2" />
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
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
          onClick={handleNextClick}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#068847] text-white rounded-lg font-medium hover:bg-[#057038] transition-colors"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default NomineeInformation;
