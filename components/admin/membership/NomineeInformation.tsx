"use client";

import React, { useState, ChangeEvent, useRef } from 'react';
import { Upload, ChevronRight, ChevronLeft, Calendar, Loader2, ScanText } from 'lucide-react';
import { toast } from 'sonner';
import StepsNavigation from './StepsNavigation';
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

      {/* OCR loading banner */}
      {isExtracting && (
        <div className="bg-[#F0FDF4] border border-[#A8DAC3] rounded-lg px-4 py-3 mt-6">
          <div className="flex items-center gap-3 text-[#068847] text-sm font-medium mb-2">
            <Loader2 size={16} className="animate-spin" />
            <ScanText size={16} />
            {isExtractingFront
              ? "Reading nominee NID front... filling fields automatically"
              : "Reading nominee NID back... filling the address automatically"}
          </div>
          <div className="w-full bg-[#D1FAE5] rounded-full h-2">
            <div
              className="bg-[#068847] h-2 rounded-full transition-all duration-300"
              style={{ width: `${ocrProgress}%` }}
            />
          </div>
          <p className="text-xs text-[#068847] mt-1">{ocrProgress}%</p>
        </div>
      )}

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
      </div>

      {/* Document Uploads */}
      <div className="mt-8">
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Upload size={20} />
            Document Uploads
          </h3>
          <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
            <ScanText size={13} />
            Uploading the nominee's NID Front auto-fills name, date of birth and NID number; NID Back fills the address.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                NID Front
              </label>
              <p className="text-xs text-gray-600">Auto-fills fields · Max 2MB</p>
              <div
                onClick={() => !isExtracting && nidFrontInputRef.current?.click()}
                className={`group ${isExtracting ? "cursor-wait" : "cursor-pointer"}`}
              >
                <div className={`w-full aspect-[3/2] bg-white border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden transition-all ${isExtractingFront ? "border-[#068847] bg-[#F0FDF4]" : "border-gray-300 hover:border-[#068847]"}`}>
                  {isExtractingFront ? (
                    <div className="flex flex-col items-center gap-2 p-4 w-full px-6">
                      <Loader2 size={24} className="animate-spin text-[#068847]" />
                      <span className="text-xs text-[#068847] text-center font-medium">Scanning... {ocrProgress}%</span>
                      <div className="w-full bg-[#D1FAE5] rounded-full h-1.5 mt-1">
                        <div className="bg-[#068847] h-1.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                      </div>
                    </div>
                  ) : data.nidFrontPhoto ? (
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
                NID Back
              </label>
              <p className="text-xs text-gray-600">Auto-fills address · Max 2MB</p>
              <div
                onClick={() => !isExtracting && nidBackInputRef.current?.click()}
                className={`group ${isExtracting ? "cursor-wait" : "cursor-pointer"}`}
              >
                <div className={`w-full aspect-[3/2] bg-white border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-400 relative overflow-hidden transition-all ${isExtractingBack ? "border-[#068847] bg-[#F0FDF4]" : "border-gray-300 hover:border-[#068847]"}`}>
                  {isExtractingBack ? (
                    <div className="flex flex-col items-center gap-2 p-4 w-full px-6">
                      <Loader2 size={24} className="animate-spin text-[#068847]" />
                      <span className="text-xs text-[#068847] text-center font-medium">Scanning... {ocrProgress}%</span>
                      <div className="w-full bg-[#D1FAE5] rounded-full h-1.5 mt-1">
                        <div className="bg-[#068847] h-1.5 rounded-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                      </div>
                    </div>
                  ) : data.nidBackPhoto ? (
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
          </div>
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
          disabled={isExtracting}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#068847] text-white rounded-lg font-medium hover:bg-[#057038] transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default NomineeInformation;
