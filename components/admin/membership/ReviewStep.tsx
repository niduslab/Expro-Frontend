"use client";

import React, { useState } from "react";
import { ChevronLeft, X } from "lucide-react";
import StepsNavigation from "./StepsNavigation";
import { AdminMembershipData } from "./AdminMembershipForm";
import { usePensionPackages } from "@/lib/hooks/public/usePensionPackagesHook";
import { useCreateMemberByAdmin } from "@/lib/hooks/admin/useAdminMembership";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewStepProps {
  data: AdminMembershipData;
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
  const { data: packagesData } = usePensionPackages(1, 100);
  const packages = packagesData?.data || [];
  const router = useRouter();
  const { mutate, isPending } = useCreateMemberByAdmin();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [memberId, setMemberId] = useState<number | null>(null);

  const getPensionPackageDetails = (packageId: number | null) => {
    if (!packageId) {
      return { name: "Not Selected", price: 0 };
    }
    
    const selectedPackage = packages.find((p) => p.id === packageId);
    if (selectedPackage) {
      return {
        name: selectedPackage.name,
        price: parseFloat(selectedPackage.monthly_amount),
      };
    }
    
    return { name: "Unknown", price: 0 };
  };

  const pensionDetails = getPensionPackageDetails(
    data.pensionInfo.selectedPackage,
  );
  const membershipFee = 400;
  const totalDue = membershipFee + pensionDetails.price;

  const formatDate = (date?: string) => {
    if (!date) return "";
    
    // If it's already in YYYY-MM-DD format (from native date picker), return as is
    if (date.includes("-")) {
      return date;
    }
    
    // Fallback for any old MM/DD/YYYY formats
    const parts = date.split("/");
    if (parts.length === 3) {
      const [m, d, y] = parts;
      return `${y}-${m}-${d}`;
    }
    
    return date;
  };

  const handleSubmit = () => {
    if (!data.pensionInfo.selectedPackage) {
      toast.error("Please select a pension package");
      return;
    }

    const mappedPayload = {
      name_bangla: data.personalInfo.nameBangla,
      name_english: data.personalInfo.nameEnglish,
      father_husband_name: data.personalInfo.fatherHusbandName || "",
      mother_name: data.personalInfo.motherName || "",
      date_of_birth: formatDate(data.personalInfo.memberDateOfBirth),
      nid_number: data.personalInfo.nid || "",
      academic_qualification: data.personalInfo.qualification?.[0]?.toLowerCase() || "",
      permanent_address: data.addressInfo.permanentAddress || "",
      present_address: data.addressInfo.presentAddress || "",
      religion: data.addressInfo.religion || "",
      gender: data.addressInfo.gender?.toLowerCase() || "",
      mobile: data.addressInfo.mobileNumber,
      email: data.addressInfo.email,
      membership_type: "general",
      sponsor_id: data.sponsorInfo.sponsorMemberId ? Number(data.sponsorInfo.sponsorMemberId) : undefined,
      pension_package_id: data.pensionInfo.selectedPackage,
      nominees: [
        {
          name: data.nomineeInfo.nomineeNameEnglish,
          relation: data.nomineeInfo.relation,
          dob: formatDate(data.nomineeInfo.nomineeDob),
          nominee_mobile: data.nomineeInfo.nomineeMobile,
          nominee_address: data.nomineeInfo.nomineeAddress,
        },
      ],
      photo: data.personalInfo.photo || null,
      nid_front_photo: data.personalInfo.nidFrontPhoto || null,
      nid_back_photo: data.personalInfo.nidBackPhoto || null,
      signature: data.personalInfo.signature || null,
      payment_method: "bkash" as const,
    };

    console.log("=".repeat(80));
    console.log("📋 ADMIN MEMBER CREATION PAYLOAD - READY FOR SUBMISSION");
    console.log("=".repeat(80));
    console.log("\n📦 Complete Form Data (Raw):");
    console.log(JSON.stringify(data, null, 2));
    console.log("\n🔄 Mapped Payload (Sent to Backend):");
    console.log(JSON.stringify(mappedPayload, null, 2));
    console.log("\n💰 Payment Summary:");
    console.log(`  - Membership Fee: ৳${membershipFee}`);
    console.log(`  - Pension Package: ${pensionDetails.name} (৳${pensionDetails.price})`);
    console.log(`  - Total Due: ৳${totalDue}`);
    console.log("\n" + "=".repeat(80));

    toast.loading("Creating member...", { id: "submit" });

    mutate(mappedPayload, {
      onSuccess: (res) => {
        console.log("✅ Backend Response (Success):", res);
        console.log("📦 Payment Data:", res.data?.payment);
        toast.success(res.message || "Member created successfully!", { id: "submit" });
        
        // Backend returns payment data in response
        if (res.data?.payment) {
          const paymentData = res.data.payment;
          
          // Store member and payment details
          setMemberId(res.data.member?.id || null);
          
          console.log("🔗 Redirecting to payment URL:", paymentData.bkashURL);
          
          // Redirect to payment gateway directly
          if (paymentData.payment_method === 'bkash' && paymentData.bkashURL) {
            // Direct redirect to bKash payment page
            window.location.href = paymentData.bkashURL;
          } else if (paymentData.gateway_url) {
            window.location.href = paymentData.gateway_url;
          } else {
            console.error("❌ No payment URL found in response");
            toast.error("Payment URL not found. Please contact support.");
            setShowPaymentModal(true);
          }
        } else {
          console.error("❌ No payment data in response");
          // Fallback: show payment modal
          setMemberId(res.data?.member?.id || null);
          setShowPaymentModal(true);
        }
      },
      onError: (err: any) => {
        console.error("❌ Backend Response (Error):", err?.response?.data);
        toast.error(err?.response?.data?.message || "Failed to create member!", {
          id: "submit",
        });
      },
    });
  };

  const SectionRow = ({
    label,
    value,
    image,
  }: {
    label: string;
    value?: string;
    image?: File | null;
  }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 last:mb-0">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      {image ? (
        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-200">
          <img
            src={URL.createObjectURL(image)}
            alt={label}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <span className="text-gray-900 text-sm break-words">
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
    <div className="rounded-lg p-5 mb-5 bg-gray-50 border border-gray-200">
      <h3 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-300 pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Review Application</h2>
        <p className="text-sm text-gray-600 mt-1">Verify all information before submitting</p>
      </div>

      <StepsNavigation
        steps={steps}
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={onStepClick}
      />

      {/* Personal Information */}
      <SectionCard title="Personal Information">
        <div className="space-y-2">
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
            value={data.personalInfo.memberDateOfBirth}
          />
          <SectionRow
            label="Qualification"
            value={data.personalInfo.qualification.join(", ")}
          />
          <SectionRow label="Photo" image={data.personalInfo.photo} />
        </div>
        <div className="space-y-2">
          <SectionRow
            label="Name (English)"
            value={data.personalInfo.nameEnglish}
          />
          <SectionRow
            label="Mother's Name"
            value={data.personalInfo.motherName}
          />
          <SectionRow label="National ID" value={data.personalInfo.nid} />
          <SectionRow label="NID Front" image={data.personalInfo.nidFrontPhoto} />
          <SectionRow label="NID Back" image={data.personalInfo.nidBackPhoto} />
          <SectionRow label="Signature" image={data.personalInfo.signature} />
        </div>
      </SectionCard>

      {/* Contact & Address */}
      <SectionCard title="Contact & Address">
        <div className="space-y-2">
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
        <div className="space-y-2">
          <SectionRow label="Gender" value={data.addressInfo.gender} />
          <SectionRow label="Email" value={data.addressInfo.email} />
        </div>
      </SectionCard>

      {/* Nominee Details */}
      <SectionCard title="Nominee Details">
        <div className="space-y-2">
          <SectionRow
            label="Name (Bangla)"
            value={data.nomineeInfo.nomineeNameBangla}
          />
          <SectionRow
            label="Date of Birth"
            value={data.nomineeInfo.nomineeDob}
          />
          <SectionRow label="Mobile" value={data.nomineeInfo.nomineeMobile} />
          <SectionRow label="Photo" image={data.nomineeInfo.photo} />
        </div>
        <div className="space-y-2">
          <SectionRow
            label="Name (English)"
            value={data.nomineeInfo.nomineeNameEnglish}
          />
          <SectionRow label="Relation" value={data.nomineeInfo.relation} />
          <SectionRow label="Address" value={data.nomineeInfo.nomineeAddress} />
        </div>
      </SectionCard>

      {/* Sponsor Details */}
      <SectionCard title="Sponsor Details">
        <div className="space-y-2">
          <SectionRow
            label="Sponsor Name"
            value={data.sponsorInfo.sponsorName}
          />
        </div>
        <div className="space-y-2">
          <SectionRow
            label="Sponsor ID"
            value={data.sponsorInfo.sponsorMemberId}
          />
        </div>
      </SectionCard>

      {/* Pension Package */}
      <SectionCard title="Pension Package & Payment">
        <div className="space-y-2">
          <SectionRow label="Selected Package" value={pensionDetails.name} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <span className="text-gray-600 text-sm font-medium">Membership Fee:</span>
            <span className="text-[#008543] text-sm font-bold">৳{membershipFee}</span>
          </div>
        </div>
        <div className="space-y-2">
          <SectionRow 
            label="Monthly Amount" 
            value={pensionDetails.price > 0 ? `৳${pensionDetails.price}` : "N/A"} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <span className="text-gray-600 text-sm font-medium">Total Due Today:</span>
            <span className="text-gray-900 text-sm font-bold">৳{totalDue}</span>
          </div>
        </div>
      </SectionCard>

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
          onClick={handleSubmit}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#068847] text-white rounded-lg font-medium hover:bg-[#057038] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isPending ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-[#00341C]">Payment in Progress</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Member Created!</strong> A payment window has been opened. Please complete the payment to activate the membership.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-blue-900 mb-3">Payment Instructions:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>Complete the payment in the opened bKash window</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>You will be redirected back after payment completion</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>If the window closed, you can retry payment from the member's profile</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Membership Fee:</span>
                  <span className="text-lg font-bold text-[#008543]">৳{membershipFee}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Pension Package ({pensionDetails.name}):</span>
                  <span className="text-lg font-bold text-[#008543]">৳{pensionDetails.price}</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-[#008543]">৳{totalDue}</span>
                  </div>
                </div>
              </div>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-600">
                  Payment window didn't open?
                </p>
                <button
                  onClick={() => {
                    if (memberId) {
                      router.push(`/admin/members/${memberId}`);
                    }
                  }}
                  className="text-[#008543] hover:underline font-medium"
                >
                  Go to member profile to retry payment
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    router.push('/admin/members');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Go to members list
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
