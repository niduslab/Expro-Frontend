"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { Upload, Calendar, ChevronRight } from "lucide-react";
import StepsNavigation from "./StepsNavigation";

export type PersonalInfoState = {
  nameBangla: string;
  nameEnglish: string;
  fatherHusbandName: string;
  motherName: string;
  memberDateOfBirth: string;
  nid: string;
  qualification: string[];
  photo: File | null;
  nidFrontPhoto: File | null;
  nidBackPhoto: File | null;
  signature: File | null;
};

type FormErrors = Partial<Record<keyof PersonalInfoState, string>>;

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
  const nidFrontInputRef = useRef<HTMLInputElement | null>(null);
  const nidBackInputRef = useRef<HTMLInputElement | null>(null);
  const signatureInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleNidFrontChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onUpdate({
      ...data,
      nidFrontPhoto: file,
    });
    if (errors.nidFrontPhoto) {
      setErrors((prev) => ({
        ...prev,
        nidFrontPhoto: undefined,
      }));
    }
  };

  const handleNidBackChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onUpdate({
      ...data,
      nidBackPhoto: file,
    });
    if (errors.nidBackPhoto) {
      setErrors((prev) => ({
        ...prev,
        nidBackPhoto: undefined,
      }));
    }
  };

  const handleSignatureChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onUpdate({
      ...data,
      signature: file,
    });
    if (errors.signature) {
      setErrors((prev) => ({
        ...prev,
        signature: undefined,
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

    if (!data.photo) {
      nextErrors.photo = "Passport size photo is required";
    } else if (data.photo.size > 2 * 1024 * 1024) {
      nextErrors.photo = "Maximum allowed file size is 2MB";
    }

    if (!data.nidFrontPhoto) {
      nextErrors.nidFrontPhoto = "NID front photo is required";
    } else if (data.nidFrontPhoto.size > 2 * 1024 * 1024) {
      nextErrors.nidFrontPhoto = "Maximum allowed file size is 2MB";
    }

    if (!data.nidBackPhoto) {
      nextErrors.nidBackPhoto = "NID back photo is required";
    } else if (data.nidBackPhoto.size > 2 * 1024 * 1024) {
      nextErrors.nidBackPhoto = "Maximum allowed file size is 2MB";
    }

    if (!data.signature) {
      nextErrors.signature = "Signature is required";
    } else if (data.signature.size > 2 * 1024 * 1024) {
      nextErrors.signature = "Maximum allowed file size is 2MB";
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
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <p className="text-sm text-gray-600 mt-1">Please provide member's basic details</p>
      </div>

      <StepsNavigation
        steps={steps}
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={onStepClick}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Name (Bangla) */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Name (Bangla) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nameBangla}
            onChange={handleChange("nameBangla")}
            placeholder="আপনার নাম"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.nameBangla ? "border-red-500" : "border-gray-300"
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
            placeholder="Full name in English"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.nameEnglish ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nameEnglish && (
            <p className="text-xs text-red-500">{errors.nameEnglish}</p>
          )}
        </div>

        {/* Father's / Husband's Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Father's / Husband's Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.fatherHusbandName}
            onChange={handleChange("fatherHusbandName")}
            placeholder="Father's or Husband's name"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.fatherHusbandName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fatherHusbandName && (
            <p className="text-xs text-red-500">{errors.fatherHusbandName}</p>
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
            placeholder="Mother's name"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.motherName ? "border-red-500" : "border-gray-300"
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
          <div className="relative">
            <input
              type="date"
              value={data.memberDateOfBirth}
              onChange={handleChange("memberDateOfBirth")}
              className={`peer w-full pl-4 pr-12 py-2.5 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all cursor-pointer text-transparent focus:text-gray-900 ${
                errors.memberDateOfBirth ? "border-red-500" : "border-gray-300"
              } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
            />
            <div className="absolute inset-0 pl-4 pr-12 py-2.5 pointer-events-none flex items-center peer-focus:opacity-0">
              <span className={data.memberDateOfBirth ? "text-gray-900" : "text-gray-400"}>
                {data.memberDateOfBirth ? formatDate(data.memberDateOfBirth) : "mm/dd/yyyy"}
              </span>
            </div>
            <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
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
            placeholder="Enter NID number"
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.nid ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.nid && <p className="text-xs text-red-500">{errors.nid}</p>}
        </div>

        {/* Academic Qualification */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Academic Qualification <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {qualifications.map((qual) => (
              <button
                key={qual}
                type="button"
                onClick={() => handleQualificationSelect(qual)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  data.qualification.includes(qual)
                    ? "bg-[#068847] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {qual}
              </button>
            ))}
          </div>
          {errors.qualification && (
            <p className="text-xs text-red-500 mt-2">{errors.qualification}</p>
          )}
        </div>
      </div>

      {/* Document Uploads */}
      <div className="mt-8">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload size={20} />
            Document Uploads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Passport Photo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Passport Photo <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600">Max 2MB</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group cursor-pointer"
              >
                <div className="w-full aspect-[3/2] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden hover:border-[#068847] transition-all">
                  {data.photo ? (
                    <>
                      <img
                        src={URL.createObjectURL(data.photo)}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                      <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" size={24} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <Upload size={20} className="mb-1 text-gray-400 group-hover:text-[#068847] transition-colors" />
                      <span className="text-xs text-center">Click to Upload</span>
                    </div>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {errors.photo && <p className="text-xs text-red-500">{errors.photo}</p>}
            </div>

            {/* NID Front */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                NID Front <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600">Max 2MB</p>
              <div
                onClick={() => nidFrontInputRef.current?.click()}
                className="group cursor-pointer"
              >
                <div className="w-full aspect-[3/2] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden hover:border-[#068847] transition-all">
                  {data.nidFrontPhoto ? (
                    <>
                      <img
                        src={URL.createObjectURL(data.nidFrontPhoto)}
                        alt="NID Front"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                      <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" size={24} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <Upload size={20} className="mb-1 text-gray-400 group-hover:text-[#068847] transition-colors" />
                      <span className="text-xs text-center">Click to Upload</span>
                    </div>
                  )}
                </div>
              </div>
              <input
                ref={nidFrontInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleNidFrontChange}
              />
              {errors.nidFrontPhoto && <p className="text-xs text-red-500">{errors.nidFrontPhoto}</p>}
            </div>

            {/* NID Back */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                NID Back <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600">Max 2MB</p>
              <div
                onClick={() => nidBackInputRef.current?.click()}
                className="group cursor-pointer"
              >
                <div className="w-full aspect-[3/2] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden hover:border-[#068847] transition-all">
                  {data.nidBackPhoto ? (
                    <>
                      <img
                        src={URL.createObjectURL(data.nidBackPhoto)}
                        alt="NID Back"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                      <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" size={24} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <Upload size={20} className="mb-1 text-gray-400 group-hover:text-[#068847] transition-colors" />
                      <span className="text-xs text-center">Click to Upload</span>
                    </div>
                  )}
                </div>
              </div>
              <input
                ref={nidBackInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleNidBackChange}
              />
              {errors.nidBackPhoto && <p className="text-xs text-red-500">{errors.nidBackPhoto}</p>}
            </div>

            {/* Signature */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Signature <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-600">Max 2MB</p>
              <div
                onClick={() => signatureInputRef.current?.click()}
                className="group cursor-pointer"
              >
                <div className="w-full aspect-[3/2] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden hover:border-[#068847] transition-all">
                  {data.signature ? (
                    <>
                      <img
                        src={URL.createObjectURL(data.signature)}
                        alt="Signature"
                        className="absolute inset-0 w-full h-full object-contain p-2"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                      <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10" size={24} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center p-4">
                      <Upload size={20} className="mb-1 text-gray-400 group-hover:text-[#068847] transition-colors" />
                      <span className="text-xs text-center">Click to Upload</span>
                    </div>
                  )}
                </div>
              </div>
              <input
                ref={signatureInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                className="hidden"
                onChange={handleSignatureChange}
              />
              {errors.signature && <p className="text-xs text-red-500">{errors.signature}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end mt-6">
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

export default PersonalInformation;
