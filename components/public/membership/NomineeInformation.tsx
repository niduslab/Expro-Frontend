"use client";

import React, { useState, ChangeEvent, useRef } from 'react';
import { Camera, ChevronRight, ChevronLeft, Upload, Calendar, Loader2, ScanText } from 'lucide-react';
import { toast } from 'sonner';
import { extractNidFront, extractNidBack, NidOcrProgress } from '@/lib/utils/nidOcr';

export type NomineeInfoState = {
  nomineeNameBangla: string;
  nomineeNameEnglish: string;
  nomineeDob: string;
  relation: string;
  nid: string;
  photo: File | null;
  nidFrontPhoto: File | null;
  nidBackPhoto: File | null;
  nomineeMobile: string;
  nomineeAddress: string;
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
  const [isExtractingFront, setIsExtractingFront] = useState(false);
  const [isExtractingBack, setIsExtractingBack] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const nidFrontInputRef = useRef<HTMLInputElement | null>(null);
  const nidBackInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleNidFrontChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onUpdate({ ...data, nidFrontPhoto: file });
    if (errors.nidFrontPhoto) setErrors((prev) => ({ ...prev, nidFrontPhoto: undefined }));

    if (!file) return;

    setIsExtractingFront(true);
    setOcrProgress(0);

    try {
      const extracted = await extractNidFront(file, (p: NidOcrProgress) => {
        setOcrProgress(p.progress);
      });

      const updates: Partial<NomineeInfoState> = {};
      if (extracted.name_bn)       updates.nomineeNameBangla  = extracted.name_bn;
      if (extracted.name_en)       updates.nomineeNameEnglish = extracted.name_en;
      if (extracted.date_of_birth) updates.nomineeDob         = extracted.date_of_birth;
      if (extracted.nid_number)    updates.nid                = extracted.nid_number;

      if (Object.keys(updates).length > 0) {
        onUpdate({ ...data, nidFrontPhoto: file, ...updates });
        toast.success("Nominee NID data extracted and filled automatically");
      } else {
        toast.warning("Could not read nominee NID fields clearly. Please fill manually.");
      }
    } catch (err) {
      console.error("Nominee OCR error:", err);
      toast.error("OCR failed. Please fill the fields manually.");
    } finally {
      setIsExtractingFront(false);
      setOcrProgress(0);
    }
  };

  const handleNidBackChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onUpdate({ ...data, nidBackPhoto: file });
    if (errors.nidBackPhoto) setErrors((prev) => ({ ...prev, nidBackPhoto: undefined }));

    if (!file) return;

    setIsExtractingBack(true);
    setOcrProgress(0);

    try {
      const extracted = await extractNidBack(file, (p: NidOcrProgress) => {
        setOcrProgress(p.progress);
      });

      if (extracted.address) {
        onUpdate({ ...data, nidBackPhoto: file, nomineeAddress: extracted.address });
        if (errors.nomineeAddress) setErrors((prev) => ({ ...prev, nomineeAddress: undefined }));
        toast.success("Nominee address extracted from NID back");
      } else {
        toast.warning("Could not read the address clearly. Please fill manually.");
      }
    } catch (err) {
      console.error("Nominee NID back OCR error:", err);
      toast.error("OCR failed. Please fill the address manually.");
    } finally {
      setIsExtractingBack(false);
      setOcrProgress(0);
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

    if (data.nidFrontPhoto && data.nidFrontPhoto.size > 2 * 1024 * 1024) {
      nextErrors.nidFrontPhoto = "Maximum allowed file size is 2MB";
    }

    if (data.nidBackPhoto && data.nidBackPhoto.size > 2 * 1024 * 1024) {
      nextErrors.nidBackPhoto = "Maximum allowed file size is 2MB";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNextClick = () => {
    if (validate()) {
      onNext();
    }
  };

  const isExtracting = isExtractingFront || isExtractingBack;

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

          {/* OCR loading banner */}
          {isExtracting && (
            <div className="bg-[#F0FDF4] border border-[#A8DAC3] rounded-lg px-4 py-3 mb-6">
              <div className="flex items-center gap-3 text-[#008543] text-sm font-medium mb-2">
                <Loader2 size={16} className="animate-spin" />
                <ScanText size={16} />
                {isExtractingFront
                  ? "Reading nominee NID front... filling fields automatically"
                  : "Reading nominee NID back... filling the address automatically"}
              </div>
              <div className="w-full bg-[#D1FAE5] rounded-full h-2">
                <div
                  className="bg-[#008543] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
              <p className="text-xs text-[#008543] mt-1">{ocrProgress}%</p>
            </div>
          )}

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
              <div className="relative bg-white rounded-md">
                <input
                  type="date"
                  value={data.nomineeDob}
                  onChange={handleChange("nomineeDob")}
                  onClick={(e) => {
                    try {
                      if (typeof (e.target as any).showPicker === "function") {
                        (e.target as any).showPicker();
                      }
                    } catch (error) {
                      // ignore
                    }
                  }}
                  aria-invalid={Boolean(errors.nomineeDob)}
                  className={`peer relative z-10 w-full pl-4 pr-12 py-3 bg-transparent rounded-md border focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all cursor-pointer text-transparent focus:text-gray-900 ${
                    errors.nomineeDob ? "border-red-500" : "border-gray-200"
                  } [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                />
                {/* Custom Display */}
                <div className="absolute inset-0 pl-4 pr-12 py-3 pointer-events-none flex items-center peer-focus:opacity-0">
                  <span className={data.nomineeDob ? "text-gray-900" : "text-gray-400"}>
                    {data.nomineeDob ? formatDate(data.nomineeDob) : "mm/dd/yyyy"}
                  </span>
                </div>
                <Calendar
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-20"
                  size={20}
                />
              </div>
              {errors.nomineeDob && (
                <p className="text-xs text-red-500">{errors.nomineeDob}</p>
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

            {/* Nominee Mobile */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Nominee Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={data.nomineeMobile}
                onChange={handleChange("nomineeMobile")}
                placeholder="e.g. 01712345678"
                aria-invalid={Boolean(errors.nomineeMobile)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.nomineeMobile ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.nomineeMobile && (
                <p className="text-xs text-red-500">{errors.nomineeMobile}</p>
              )}
            </div>

            {/* Nominee Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-900">
                Nominee Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={data.nomineeAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  onUpdate({
                    ...data,
                    nomineeAddress: value,
                  });
                  if (errors.nomineeAddress) {
                    setErrors((prev) => ({
                      ...prev,
                      nomineeAddress: undefined,
                    }));
                  }
                }}
                placeholder="Enter nominee's full address"
                rows={3}
                aria-invalid={Boolean(errors.nomineeAddress)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 resize-none ${
                  errors.nomineeAddress ? "border-red-500" : "border-gray-200"
                }`}
              />
              {errors.nomineeAddress && (
                <p className="text-xs text-red-500">{errors.nomineeAddress}</p>
              )}
            </div>
          </div>

          {/* Document Uploads Section */}
          <div className="col-span-1 md:col-span-2 mt-8">
            <div className="bg-gradient-to-r from-[#F0F9FF] to-[#F0FDF4] rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-[#00341C] mb-2 flex items-center">
                <Upload className="mr-2" size={24} />
                Document Uploads
              </h3>
              <p className="text-xs text-gray-500 mb-6 flex items-center gap-1">
                <ScanText size={13} />
                Uploading the nominee's NID Front auto-fills name, date of birth and NID number; NID Back fills the address.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Passport Size Photo */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    Passport Photo <span className="text-red-500">*</span>
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Recent passport size (max 2MB)</p>
                  <div onClick={() => fileInputRef.current?.click()} className="group cursor-pointer">
                    <div className="w-full aspect-[3/2] bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 relative overflow-hidden hover:border-[#008543] transition-all">
                      {data.photo ? (
                        <>
                          <img src={URL.createObjectURL(data.photo)} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-0" />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity z-10" />
                          <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20" size={28} />
                        </>
                      ) : (
                        <div className="flex flex-col items-center p-8">
                          <Camera size={20} className="mb-1 text-gray-400 group-hover:text-[#008543] transition-colors" />
                          <span className="text-xs text-center px-2">Click to Upload</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handlePhotoChange} />
                  {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}
                </div>

                {/* NID Front Photo */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    NID Front
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Auto-fills fields · Max 2MB</p>
                  <div
                    onClick={() => !isExtracting && nidFrontInputRef.current?.click()}
                    className={`group ${isExtracting ? "cursor-wait" : "cursor-pointer"}`}
                  >
                    <div className={`w-full aspect-[3/2] bg-white border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 relative overflow-hidden transition-all ${isExtractingFront ? "border-[#008543] bg-[#F0FDF4]" : "border-gray-300 hover:border-[#008543]"}`}>
                      {isExtractingFront ? (
                        <div className="flex flex-col items-center gap-2 p-4 w-full px-6">
                          <Loader2 size={24} className="animate-spin text-[#008543]" />
                          <span className="text-xs text-[#008543] text-center font-medium">Scanning... {ocrProgress}%</span>
                          <div className="w-full bg-[#D1FAE5] rounded-full h-1.5 mt-1">
                            <div className="bg-[#008543] h-1.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                          </div>
                        </div>
                      ) : data.nidFrontPhoto ? (
                        <>
                          <img src={URL.createObjectURL(data.nidFrontPhoto)} alt="NID Front" className="absolute inset-0 w-full h-full object-cover z-0" />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity z-10" />
                          <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20" size={28} />
                        </>
                      ) : (
                        <div className="flex flex-col items-center p-8">
                          <Upload size={20} className="mb-1 text-gray-400 group-hover:text-[#008543] transition-colors" />
                          <span className="text-xs text-center px-2">Click to Upload</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <input ref={nidFrontInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleNidFrontChange} />
                  {errors.nidFrontPhoto && <p className="text-xs text-red-500 mt-1">{errors.nidFrontPhoto}</p>}
                </div>

                {/* NID Back Photo */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-900">
                    NID Back
                  </label>
                  <p className="text-xs text-gray-600 mb-2">Auto-fills address · Max 2MB</p>
                  <div
                    onClick={() => !isExtracting && nidBackInputRef.current?.click()}
                    className={`group ${isExtracting ? "cursor-wait" : "cursor-pointer"}`}
                  >
                    <div className={`w-full aspect-[3/2] bg-white border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-gray-400 relative overflow-hidden transition-all ${isExtractingBack ? "border-[#008543] bg-[#F0FDF4]" : "border-gray-300 hover:border-[#008543]"}`}>
                      {isExtractingBack ? (
                        <div className="flex flex-col items-center gap-2 p-4 w-full px-6">
                          <Loader2 size={24} className="animate-spin text-[#008543]" />
                          <span className="text-xs text-[#008543] text-center font-medium">Scanning... {ocrProgress}%</span>
                          <div className="w-full bg-[#D1FAE5] rounded-full h-1.5 mt-1">
                            <div className="bg-[#008543] h-1.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                          </div>
                        </div>
                      ) : data.nidBackPhoto ? (
                        <>
                          <img src={URL.createObjectURL(data.nidBackPhoto)} alt="NID Back" className="absolute inset-0 w-full h-full object-cover z-0" />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity z-10" />
                          <Upload className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20" size={28} />
                        </>
                      ) : (
                        <div className="flex flex-col items-center p-8">
                          <Upload size={20} className="mb-1 text-gray-400 group-hover:text-[#008543] transition-colors" />
                          <span className="text-xs text-center px-2">Click to Upload</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <input ref={nidBackInputRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handleNidBackChange} />
                  {errors.nidBackPhoto && <p className="text-xs text-red-500 mt-1">{errors.nidBackPhoto}</p>}
                </div>
              </div>
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
            disabled={isExtracting}
            className="flex items-center px-8 py-3 bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-wait"
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
