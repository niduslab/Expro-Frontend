"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, X } from "lucide-react";
import StepsNavigation from "./StepsNavigation";
import { MembershipData } from "./MembershipForm";
import { useCreateMembershipApplication } from "@/lib/hooks/public/useMembershipApplicationHook";
import { usePensionPackages } from "@/lib/hooks/public/usePensionPackagesHook";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  // Fetch pension packages from API
  const { data: packagesData } = usePensionPackages(1, 100);
  const packages = packagesData?.data || [];

  const getPensionPackageDetails = (packageId: "skip" | number) => {
    if (packageId === "skip") {
      return { name: "Skipped", price: 0 };
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);
  const router = useRouter();

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

    membership_type: "general", // or dynamic

    sponsor_id: data.sponsorInfo.sponsorMemberId ? Number(data.sponsorInfo.sponsorMemberId) : undefined,
    // Use the actual package ID from the API (or undefined if skipped)
    pension_package_id: data.pensionInfo.selectedPackage === "skip" ? undefined : data.pensionInfo.selectedPackage,

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
    
    // Payment method selection
    payment_method: "bkash", // or "sslcommerz"
  };
  const handleSubmit = () => {
    setErrors({});

    // Log payload data before submission for backend verification
    console.log("=".repeat(80));
    console.log("📋 MEMBERSHIP APPLICATION PAYLOAD - READY FOR SUBMISSION");
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
    console.log("✅ Payload logged successfully. Submitting to backend...");
    console.log("=".repeat(80) + "\n");

    toast.loading("Submitting...", { id: "submit" });

    mutate(mappedPayload, {
      onSuccess: (res) => {
        console.log("✅ Backend Response (Success):", res);
        console.log("📦 Payment Data:", res.data?.payment);
        toast.success(res.message || "Application submitted successfully!", { id: "submit" });
        
        // Backend returns payment data in response
        if (res.data?.payment) {
          const paymentData = res.data.payment;
          
          // Store application and payment details
          setApplicationId(res.data.application?.id || null);
          localStorage.setItem('application_id', res.data.application?.id?.toString() || '');
          localStorage.setItem('payment_id', paymentData.payment_id?.toString() || '');
          
          // Clear form data since application is created
          localStorage.removeItem('membership_form_data');
          localStorage.removeItem('membership_max_step');
          
          console.log("🔗 Redirecting to payment URL:", paymentData.bkashURL);
          
          // Redirect to payment gateway directly
          if (paymentData.payment_method === 'bkash' && paymentData.bkashURL) {
            // Direct redirect to bKash payment page
            // bKash will redirect back to /payment/bkash/callback after payment
            window.location.href = paymentData.bkashURL;
          } else if (paymentData.gateway_url) {
            // For SSLCommerz, redirect directly
            window.location.href = paymentData.gateway_url;
          } else {
            console.error("❌ No payment URL found in response");
            toast.error("Payment URL not found. Please contact support.");
            setShowPaymentModal(true);
          }
        } else {
          console.error("❌ No payment data in response");
          // Fallback: show payment modal
          setApplicationId(res.data?.application?.id || null);
          setShowPaymentModal(true);
        }
      },
      onError: (err: any) => {
        console.error("❌ Backend Response (Error):", err?.response?.data);
        toast.error(err?.response?.data?.message || "Failed!", {
          id: "submit",
        });

        setErrors(err?.response?.data?.errors || {});
      },
    });
  };

  const handlePaymentSuccess = (payment: any) => {
    console.log("✅ Payment successful:", payment);
    toast.success("Payment completed successfully!");
    
    // Clear form data from localStorage
    localStorage.removeItem('membership_form_data');
    localStorage.removeItem('membership_max_step');
    
    // Redirect to success page or dashboard
    router.push('/membership/success?payment=success');
  };

  const handlePaymentError = (error: any) => {
    console.error("❌ Payment error:", error);
    toast.error("Payment failed. Please try again.");
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
                value={data.personalInfo.memberDateOfBirth}
              />
              <SectionRow
                label="Academic Qualification"
                value={data.personalInfo.qualification.join(", ")}
              />
              <SectionRow label="Photo" image={data.personalInfo.photo} />
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
              <SectionRow label="NID Front" image={data.personalInfo.nidFrontPhoto} />
              <SectionRow label="NID Back" image={data.personalInfo.nidBackPhoto} />
              <SectionRow label="Signature" image={data.personalInfo.signature} />
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
                value={data.nomineeInfo.nomineeDob}
              />
              <SectionRow label="Mobile" value={data.nomineeInfo.nomineeMobile} />
              <SectionRow label="Photo" image={data.nomineeInfo.photo} />
            </div>
            <div className="space-y-3">
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
                    <strong>Application Submitted!</strong> A payment window has been opened. Please complete the payment to activate your membership.
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
                      <span>If the window closed, you can retry payment from the link sent to your email</span>
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
                      const paymentId = localStorage.getItem('payment_id');
                      if (applicationId) {
                        router.push(`/membership/payment-retry?application_id=${applicationId}`);
                      }
                    }}
                    className="text-[#008543] hover:underline font-medium"
                  >
                    Click here to retry payment
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      router.push('/');
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800 underline"
                  >
                    I'll complete payment later
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewStep;
