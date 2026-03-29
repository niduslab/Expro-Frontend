"use client";

import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import StepsNavigation from "./StepsNavigation";
import { MembershipData } from "./MembershipForm";
import { useCreateMembershipApplication } from "@/lib/hooks/public/useMembershipApplicationHook";
import { toast } from "sonner";

interface ReviewStepProps {
  data: MembershipData;
  onPrev: () => void;
  onSubmit: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onPrev,
  onSubmit,
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const getPensionPackageDetails = (packageId: string) => {
    const packages: Record<string, { name: string; price: number }> = {
      basic: { name: "Basic", price: 300 },
      standard: { name: "Standard", price: 500 },
      advanced: { name: "Advanced", price: 1000 },
      premium: { name: "Premium", price: 1500 },
      skip: { name: "Skipped", price: 0 },
    };
    return packages[packageId] || { name: "Unknown", price: 0 };
  };

  const pensionDetails = getPensionPackageDetails(
    data.pensionInfo.selectedPackage,
  );
  const membershipFee = 400;
  const totalDue = membershipFee + pensionDetails.price;

  const SectionRow = ({
    label,
    value,
    image,
  }: {
    label: string;
    value?: string;
    image?: File | null;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-3 last:mb-0">
      <span className="text-gray-500 text-sm font-medium">{label}:</span>
      {image ? (
        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
          <img
            src={URL.createObjectURL(image)}
            alt={label}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <span className="text-gray-900 text-sm font-medium break-words">
          {value || "-"}
        </span>
      )}
    </div>
  );

  const SectionCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div
      className="rounded-xl p-6 mb-6"
      style={{ background: "linear-gradient(90deg, #F0F4F2 0%, #F2F2E7 100%)" }}
    >
      <h3 className="text-xl font-bold text-[#00341C] mb-6 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        {children}
      </div>
    </div>
  );

  const { mutate, isPending } = useCreateMembershipApplication();
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const formatDate = (date?: string) => {
    if (!date) return "";
    const [d, m, y] = date.split("/");
    return `${y}-${m}-${d}`;
  };

  const mapPackageToId = (pkg: string) => {
    const map: Record<string, number> = {
      basic: 1,
      standard: 2,
      advanced: 3,
      premium: 4,
    };
    return map[pkg];
  };

  const mappedPayload = {
    name_bangla: data.personalInfo.nameBangla,
    name_english: data.personalInfo.nameEnglish,
    father_husband_name: data.personalInfo.fatherHusbandName || "",
    mother_name: data.personalInfo.motherName || "",
    date_of_birth: formatDate(data.personalInfo.dateOfBirth),
    nid_number: data.personalInfo.nid || "",

    academic_qualification: data.personalInfo.qualification?.[0],

    permanent_address: data.addressInfo.permanentAddress || "",
    present_address: data.addressInfo.presentAddress || "",
    religion: data.addressInfo.religion || "",
    gender: data.addressInfo.gender || "",

    mobile: data.addressInfo.mobileNumber,
    email: data.addressInfo.email,

    membership_type: "general", // or dynamic

    sponsor_id: Number(data.sponsorInfo.sponsorMemberId), // ⚠️ ensure valid DB id
    pension_package_id: mapPackageToId(data.pensionInfo.selectedPackage),

    nominees: [
      {
        name: data.nomineeInfo.nomineeNameEnglish,
        relation: data.nomineeInfo.relation,
        dob: formatDate(data.nomineeInfo.dateOfBirth),
      },
    ],

    photo: data.personalInfo.photo || null,
  };
  const handleSubmit = () => {
    setErrors({});

    toast.loading("Submitting...", { id: "submit" });

    mutate(mappedPayload, {
      onSuccess: (res) => {
        toast.success(res.message || "Submitted!", { id: "submit" });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed!", {
          id: "submit",
        });

        setErrors(err?.response?.data?.errors || {});
      },
    });
  };
  return (
    <div className="w-full bg-[#F3F4F6] py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">
              Review Your Application
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Please verify all information before submitting
            </p>
          </div>

          {/* Steps Navigation */}
          <StepsNavigation
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={onStepClick}
          />

          {/* Personal Information */}
          <SectionCard title="Personal Information">
            <div className="space-y-3">
              <SectionRow
                label="Name (Bangla)"
                value={data.personalInfo.nameBangla}
              />
              <SectionRow
                label="Father/Husband"
                value={data.personalInfo.fatherHusbandName}
              />
              <SectionRow
                label="Date of Birth"
                value={data.personalInfo.dateOfBirth}
              />
              <SectionRow
                label="Academic Qualification"
                value={data.personalInfo.qualification.join(", ")}
              />
            </div>
            <div className="space-y-3">
              <SectionRow
                label="Name (English)"
                value={data.personalInfo.nameEnglish}
              />
              <SectionRow
                label="Mother's Name"
                value={data.personalInfo.motherName}
              />
              <SectionRow label="National ID" value={data.personalInfo.nid} />
              <SectionRow label="Photo" image={data.personalInfo.photo} />
            </div>
          </SectionCard>

          {/* Contact & Address */}
          <SectionCard title="Contact & Address">
            <div className="space-y-3">
              <SectionRow
                label="Permanent Address"
                value={data.addressInfo.permanentAddress}
              />
              <SectionRow
                label="Present Address"
                value={data.addressInfo.presentAddress}
              />
              <SectionRow label="Religion" value={data.addressInfo.religion} />
              <SectionRow
                label="Mobile"
                value={data.addressInfo.mobileNumber}
              />
            </div>
            <div className="space-y-3">
              <div className="md:mt-0"></div>{" "}
              {/* Spacer for alignment if needed, or just let grid flow */}
              <SectionRow label="Gender" value={data.addressInfo.gender} />
              <SectionRow label="Email" value={data.addressInfo.email} />
            </div>
          </SectionCard>

          {/* Nominee Details */}
          <SectionCard title="Nominee Details">
            <div className="space-y-3">
              <SectionRow
                label="Name (Bangla)"
                value={data.nomineeInfo.nomineeNameBangla}
              />
              <SectionRow
                label="Date of Birth"
                value={data.nomineeInfo.dateOfBirth}
              />
            </div>
            <div className="space-y-3">
              <SectionRow
                label="Name (English)"
                value={data.nomineeInfo.nomineeNameEnglish}
              />
              <SectionRow label="Relation" value={data.nomineeInfo.relation} />
              <SectionRow label="Photo" image={data.nomineeInfo.photo} />
            </div>
          </SectionCard>

          {/* Sponsor Details */}
          <SectionCard title="Sponsor Details">
            <div className="space-y-3">
              <SectionRow
                label="Sponsor Name"
                value={data.sponsorInfo.sponsorName}
              />
            </div>
            <div className="space-y-3">
              <SectionRow
                label="Sponsor ID"
                value={data.sponsorInfo.sponsorMemberId}
              />
            </div>
          </SectionCard>

          {/* Payment & Pension */}
          <SectionCard title="Payment & Pension">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-3">
                <span className="text-gray-500 text-sm font-medium">
                  Membership Fee:
                </span>
                <span className="text-[#008543] text-sm font-bold">
                  ৳{membershipFee}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-3">
                <span className="text-gray-500 text-sm font-medium">
                  First Month Payment:
                </span>
                <span className="text-[#008543] text-sm font-bold">
                  ৳{pensionDetails.price}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <SectionRow label="Pension Package" value={pensionDetails.name} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-3">
                <span className="text-gray-500 text-sm font-medium">
                  Total Due Today:
                </span>
                <span className="text-gray-900 text-sm font-bold">
                  ৳{totalDue}
                </span>
              </div>
            </div>
          </SectionCard>
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
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center px-8 py-3 bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors shadow-sm"
          >
            Proceed to Payment
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
