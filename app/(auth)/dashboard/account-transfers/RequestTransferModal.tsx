import { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useRequestTransfer, useTransferEligibility } from "@/lib/hooks/user/useAccountTransfers";
import { useMyPensionEnrollments } from "@/lib/hooks/user/usePensionEnrollment";
import { PersonalInfoState } from "@/components/public/membership/PersonalInformation";
import { AddressFormState } from "@/components/public/membership/AddressSection";
import { NomineeInfoState } from "@/components/public/membership/NomineeInformation";

interface RequestTransferModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const initialPersonalInfo: PersonalInfoState = {
  nameBangla: "",
  nameEnglish: "",
  fatherHusbandName: "",
  motherName: "",
  memberDateOfBirth: "",
  nid: "",
  qualification: [],
  photo: null,
  nidFrontPhoto: null,
  nidBackPhoto: null,
  signature: null,
};

const initialAddressInfo: AddressFormState = {
  permanentAddress: "",
  presentAddress: "",
  mobileNumber: "",
  email: "",
  religion: "",
  gender: "",
};

const initialNomineeInfo: NomineeInfoState = {
  nomineeNameBangla: "",
  nomineeNameEnglish: "",
  nomineeDob: "",
  relation: "",
  nid: "",
  photo: null,
  nomineeMobile: "",
  nomineeAddress: "",
};

export default function RequestTransferModal({ onClose, onSuccess }: RequestTransferModalProps) {
  const [step, setStep] = useState(1);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    transfer_reason: "",
    reason_details: "",
    personalInfo: initialPersonalInfo,
    addressInfo: initialAddressInfo,
    nomineeInfo: initialNomineeInfo,
  });
  const [documents, setDocuments] = useState<File[]>([]);

  const requestMutation = useRequestTransfer();
  
  // Fetch real pension enrollments
  const { data: enrollmentsResponse, isLoading: loadingEnrollments } = useMyPensionEnrollments();
  const myEnrollments = enrollmentsResponse?.data?.filter((e: any) => e.status === 'active') || [];
  
  // Automatically check eligibility when enrollment is selected
  const { data: eligibility, isLoading: checkingEligibility, error: eligibilityError } = useTransferEligibility(selectedEnrollmentId);
  
  // Debug logging
  useEffect(() => {
    if (eligibility) {
      console.log('Eligibility data:', eligibility);
    }
    if (eligibilityError) {
      console.error('Eligibility error:', eligibilityError);
    }
  }, [eligibility, eligibilityError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocumentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const updatePersonalInfo = (data: PersonalInfoState) => {
    setFormData(prev => ({ ...prev, personalInfo: data }));
  };

  const updateAddressInfo = (data: AddressFormState) => {
    setFormData(prev => ({ ...prev, addressInfo: data }));
  };

  const updateNomineeInfo = (data: NomineeInfoState) => {
    setFormData(prev => ({ ...prev, nomineeInfo: data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEnrollmentId) {
      alert("Please select a pension enrollment");
      return;
    }

    const submitData = new FormData();
    submitData.append('pension_enrollment_id', selectedEnrollmentId.toString());
    submitData.append('transfer_reason', formData.transfer_reason);
    submitData.append('reason_details', formData.reason_details);
    
    // Personal Information
    submitData.append('new_member_name_bangla', formData.personalInfo.nameBangla);
    submitData.append('new_member_name_english', formData.personalInfo.nameEnglish);
    submitData.append('new_member_father_husband_name', formData.personalInfo.fatherHusbandName);
    submitData.append('new_member_mother_name', formData.personalInfo.motherName);
    submitData.append('new_member_date_of_birth', formData.personalInfo.memberDateOfBirth);
    submitData.append('new_member_nid', formData.personalInfo.nid);
    submitData.append('new_member_qualification', JSON.stringify(formData.personalInfo.qualification));
    
    if (formData.personalInfo.photo) {
      submitData.append('new_member_photo', formData.personalInfo.photo);
    }
    if (formData.personalInfo.nidFrontPhoto) {
      submitData.append('new_member_nid_front', formData.personalInfo.nidFrontPhoto);
    }
    if (formData.personalInfo.nidBackPhoto) {
      submitData.append('new_member_nid_back', formData.personalInfo.nidBackPhoto);
    }
    if (formData.personalInfo.signature) {
      submitData.append('new_member_signature', formData.personalInfo.signature);
    }
    
    // Address Information
    submitData.append('new_member_permanent_address', formData.addressInfo.permanentAddress);
    submitData.append('new_member_present_address', formData.addressInfo.presentAddress);
    submitData.append('new_member_mobile', formData.addressInfo.mobileNumber);
    submitData.append('new_member_email', formData.addressInfo.email);
    submitData.append('new_member_religion', formData.addressInfo.religion);
    submitData.append('new_member_gender', formData.addressInfo.gender);
    
    // Nominee Information
    submitData.append('nominee_name_bangla', formData.nomineeInfo.nomineeNameBangla);
    submitData.append('nominee_name_english', formData.nomineeInfo.nomineeNameEnglish);
    submitData.append('nominee_dob', formData.nomineeInfo.nomineeDob);
    submitData.append('nominee_relation', formData.nomineeInfo.relation);
    submitData.append('nominee_nid', formData.nomineeInfo.nid);
    submitData.append('nominee_mobile', formData.nomineeInfo.nomineeMobile);
    submitData.append('nominee_address', formData.nomineeInfo.nomineeAddress);
    
    if (formData.nomineeInfo.photo) {
      submitData.append('nominee_photo', formData.nomineeInfo.photo);
    }

    documents.forEach((doc, index) => {
      submitData.append(`documents[${index}]`, doc);
    });

    // ============================================================
    // CONSOLE LOG: Account Transfer Request Data
    // ============================================================
    console.log("=".repeat(80));
    console.log("📋 ACCOUNT TRANSFER REQUEST - DATA BEING SENT TO BACKEND");
    console.log("=".repeat(80));
    
    console.log("\n🎯 TRANSFER DETAILS:");
    console.log("  Pension Enrollment ID:", selectedEnrollmentId);
    console.log("  Transfer Reason:", formData.transfer_reason);
    console.log("  Reason Details:", formData.reason_details);
    
    console.log("\n👤 NEW MEMBER - PERSONAL INFORMATION:");
    console.log("  Name (Bangla):", formData.personalInfo.nameBangla);
    console.log("  Name (English):", formData.personalInfo.nameEnglish);
    console.log("  Father/Husband Name:", formData.personalInfo.fatherHusbandName);
    console.log("  Mother Name:", formData.personalInfo.motherName);
    console.log("  Date of Birth:", formData.personalInfo.memberDateOfBirth);
    console.log("  NID:", formData.personalInfo.nid);
    console.log("  Qualifications:", formData.personalInfo.qualification);
    console.log("  Photo:", formData.personalInfo.photo ? `${formData.personalInfo.photo.name} (${(formData.personalInfo.photo.size / 1024).toFixed(2)} KB)` : "Not provided");
    console.log("  NID Front:", formData.personalInfo.nidFrontPhoto ? `${formData.personalInfo.nidFrontPhoto.name} (${(formData.personalInfo.nidFrontPhoto.size / 1024).toFixed(2)} KB)` : "Not provided");
    console.log("  NID Back:", formData.personalInfo.nidBackPhoto ? `${formData.personalInfo.nidBackPhoto.name} (${(formData.personalInfo.nidBackPhoto.size / 1024).toFixed(2)} KB)` : "Not provided");
    console.log("  Signature:", formData.personalInfo.signature ? `${formData.personalInfo.signature.name} (${(formData.personalInfo.signature.size / 1024).toFixed(2)} KB)` : "Not provided");
    
    console.log("\n📍 NEW MEMBER - ADDRESS INFORMATION:");
    console.log("  Permanent Address:", formData.addressInfo.permanentAddress);
    console.log("  Present Address:", formData.addressInfo.presentAddress);
    console.log("  Mobile Number:", formData.addressInfo.mobileNumber);
    console.log("  Email:", formData.addressInfo.email);
    console.log("  Religion:", formData.addressInfo.religion);
    console.log("  Gender:", formData.addressInfo.gender);
    
    console.log("\n👥 NOMINEE INFORMATION:");
    console.log("  Name (Bangla):", formData.nomineeInfo.nomineeNameBangla);
    console.log("  Name (English):", formData.nomineeInfo.nomineeNameEnglish);
    console.log("  Date of Birth:", formData.nomineeInfo.nomineeDob);
    console.log("  Relation:", formData.nomineeInfo.relation);
    console.log("  NID:", formData.nomineeInfo.nid);
    console.log("  Mobile:", formData.nomineeInfo.nomineeMobile);
    console.log("  Address:", formData.nomineeInfo.nomineeAddress);
    console.log("  Photo:", formData.nomineeInfo.photo ? `${formData.nomineeInfo.photo.name} (${(formData.nomineeInfo.photo.size / 1024).toFixed(2)} KB)` : "Not provided");
    
    console.log("\n📎 SUPPORTING DOCUMENTS:");
    if (documents.length > 0) {
      documents.forEach((doc, index) => {
        console.log(`  Document ${index + 1}:`, `${doc.name} (${(doc.size / 1024).toFixed(2)} KB)`);
      });
    } else {
      console.log("  No supporting documents attached");
    }
    
    console.log("\n📦 FORMDATA ENTRIES (All fields being sent):");
    const formDataEntries: any = {};
    submitData.forEach((value, key) => {
      if (value instanceof File) {
        formDataEntries[key] = `[File: ${value.name}, ${(value.size / 1024).toFixed(2)} KB]`;
      } else {
        formDataEntries[key] = value;
      }
    });
    console.table(formDataEntries);
    
    console.log("\n" + "=".repeat(80));
    console.log("✅ Data prepared and ready to send to backend API");
    console.log("=".repeat(80) + "\n");

    try {
      await requestMutation.mutateAsync(submitData);
      alert("Transfer request submitted successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("❌ SUBMISSION ERROR:", error);
      console.error("Error Response:", error.response?.data);
      alert(error.response?.data?.message || "Failed to submit transfer request");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full my-8">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Request Account Transfer</h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of 6</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              Select Enrollment
            </span>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              Transfer Reason
            </span>
            <span className={`text-xs font-medium ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              Personal Info
            </span>
            <span className={`text-xs font-medium ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              Address
            </span>
            <span className={`text-xs font-medium ${step >= 5 ? 'text-blue-600' : 'text-gray-400'}`}>
              Nominee
            </span>
            <span className={`text-xs font-medium ${step >= 6 ? 'text-blue-600' : 'text-gray-400'}`}>
              Review
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {/* Step 1: Select Enrollment */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Select the pension enrollment you want to transfer to a new member.
                  </p>
                </div>

                {loadingEnrollments ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : myEnrollments.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No active pension enrollments found</p>
                    <p className="text-xs text-gray-500 mt-1">You need an active enrollment to request a transfer</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myEnrollments.map((enrollment: any) => (
                      <div
                        key={enrollment.id}
                        onClick={() => setSelectedEnrollmentId(enrollment.id)}
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          selectedEnrollmentId === enrollment.id
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{enrollment.enrollment_number}</p>
                            <p className="text-sm text-gray-600">
                              {typeof enrollment.pension_package_id === 'object' && enrollment.pension_package_id?.name 
                                ? enrollment.pension_package_id.name 
                                : "Package ID: " + enrollment.pension_package_id || "Unknown Package"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Status: {enrollment.status}</p>
                          </div>
                          {selectedEnrollmentId === enrollment.id && (
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedEnrollmentId && (
                  checkingEligibility ? (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-600">Checking eligibility...</p>
                      </div>
                    </div>
                  ) : eligibilityError ? (
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                      <h3 className="font-semibold text-sm mb-2 text-red-900">Error Checking Eligibility</h3>
                      <p className="text-sm text-red-800">
                        {(eligibilityError as any)?.response?.data?.message || "Failed to check eligibility. Please try again."}
                      </p>
                    </div>
                  ) : eligibility ? (
                    <div className={`border rounded-lg p-4 ${eligibility.eligible === true ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <h3 className="font-semibold text-sm mb-2">Eligibility Check</h3>
                      
                      {eligibility.eligible === true ? (
                        <div className="space-y-2 text-sm">
                          <p className="text-green-800 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            This enrollment is eligible for transfer
                          </p>
                          <div className="border-t border-green-200 pt-2 mt-2 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-700">Outstanding Balance:</span>
                              <span className="font-medium text-gray-900">
                                ৳{(eligibility.outstanding_balance || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Transfer Fee (2%):</span>
                              <span className="font-medium text-gray-900">
                                ৳{(eligibility.transfer_fee || 0).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between border-t border-green-200 pt-1 mt-1">
                              <span className="text-gray-700 font-medium">Total to Clear:</span>
                              <span className="font-bold text-green-700">
                                ৳{(eligibility.total_amount_to_clear || 0).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {eligibility.reasons && eligibility.reasons.length > 0 ? (
                            eligibility.reasons.map((reason: string, index: number) => (
                              <p key={index} className="text-sm text-red-800 flex items-start gap-2">
                                <XCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                {reason}
                              </p>
                            ))
                          ) : (
                            <p className="text-sm text-red-800">This enrollment is not eligible for transfer.</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            )}

            {/* Step 2: Transfer Reason */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Please provide a detailed reason for the transfer request.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transfer Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="transfer_reason"
                    value={formData.transfer_reason}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select reason</option>
                    <option value="unable_to_continue">Unable to Continue</option>
                    <option value="financial_difficulties">Financial Difficulties</option>
                    <option value="relocation">Relocation</option>
                    <option value="health_issues">Health Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="reason_details"
                    value={formData.reason_details}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Please provide detailed reason for transfer..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Personal Information */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>New Member Personal Information</strong> - Please provide complete details
                  </p>
                </div>
                
                {/* Personal Info Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (Bangla) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.nameBangla}
                      onChange={(e) => updatePersonalInfo({ ...formData.personalInfo, nameBangla: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.nameEnglish}
                      onChange={(e) => updatePersonalInfo({ ...formData.personalInfo, nameEnglish: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Father's/Husband's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.fatherHusbandName}
                      onChange={(e) => updatePersonalInfo({ ...formData.personalInfo, fatherHusbandName: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mother's Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.motherName}
                      onChange={(e) => updatePersonalInfo({ ...formData.personalInfo, motherName: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.personalInfo.memberDateOfBirth}
                      onChange={(e) => updatePersonalInfo({ ...formData.personalInfo, memberDateOfBirth: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personalInfo.nid}
                      onChange={(e) => updatePersonalInfo({ ...formData.personalInfo, nid: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Qualification <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["JSC", "SSC", "HSC", "Bachelor", "Masters", "Others"].map((qual) => (
                      <button
                        key={qual}
                        type="button"
                        onClick={() => {
                          const current = formData.personalInfo.qualification;
                          const updated = current.includes(qual)
                            ? current.filter(q => q !== qual)
                            : [...current, qual];
                          updatePersonalInfo({ ...formData.personalInfo, qualification: updated });
                        }}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          formData.personalInfo.qualification.includes(qual)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {qual}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Photo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updatePersonalInfo({ ...formData.personalInfo, photo: file });
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NID Front <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updatePersonalInfo({ ...formData.personalInfo, nidFrontPhoto: file });
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NID Back <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updatePersonalInfo({ ...formData.personalInfo, nidBackPhoto: file });
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Signature <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        updatePersonalInfo({ ...formData.personalInfo, signature: file });
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Address Information */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>New Member Address Information</strong> - Contact and location details
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permanent Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.addressInfo.permanentAddress}
                    onChange={(e) => updateAddressInfo({ ...formData.addressInfo, permanentAddress: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Present Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.addressInfo.presentAddress}
                    onChange={(e) => updateAddressInfo({ ...formData.addressInfo, presentAddress: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.addressInfo.mobileNumber}
                      onChange={(e) => updateAddressInfo({ ...formData.addressInfo, mobileNumber: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.addressInfo.email}
                      onChange={(e) => updateAddressInfo({ ...formData.addressInfo, email: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Religion <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.addressInfo.religion}
                      onChange={(e) => updateAddressInfo({ ...formData.addressInfo, religion: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select religion</option>
                      <option value="Islam">Islam</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Christian">Christian</option>
                      <option value="Buddhism">Buddhism</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.addressInfo.gender}
                      onChange={(e) => updateAddressInfo({ ...formData.addressInfo, gender: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Nominee Information */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nominee Information</strong> - Beneficiary details for the new member
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nominee Name (Bangla) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nomineeInfo.nomineeNameBangla}
                      onChange={(e) => updateNomineeInfo({ ...formData.nomineeInfo, nomineeNameBangla: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nominee Name (English) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nomineeInfo.nomineeNameEnglish}
                      onChange={(e) => updateNomineeInfo({ ...formData.nomineeInfo, nomineeNameEnglish: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.nomineeInfo.nomineeDob}
                      onChange={(e) => updateNomineeInfo({ ...formData.nomineeInfo, nomineeDob: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nomineeInfo.relation}
                      onChange={(e) => updateNomineeInfo({ ...formData.nomineeInfo, relation: e.target.value })}
                      required
                      placeholder="e.g. wife, son, daughter"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nomineeInfo.nid}
                      onChange={(e) => updateNomineeInfo({ ...formData.nomineeInfo, nid: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.nomineeInfo.nomineeMobile}
                      onChange={(e) => updateNomineeInfo({ ...formData.nomineeInfo, nomineeMobile: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.nomineeInfo.nomineeAddress}
                    onChange={(e) => updateNomineeInfo({ ...formData.nomineeInfo, nomineeAddress: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Photo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateNomineeInfo({ ...formData.nomineeInfo, photo: file });
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    Please review all information before submitting. Once submitted, the admin will review your request.
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Transfer Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enrollment:</span>
                      <span className="font-medium">
                        {myEnrollments.find((e: any) => e.id === selectedEnrollmentId)?.enrollment_number || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">
                        {(() => {
                          const enrollment = myEnrollments.find((e: any) => e.id === selectedEnrollmentId);
                          const packageId = enrollment?.pension_package_id;
                          if (typeof packageId === 'object' && packageId !== null) {
                            return (packageId as any).name || "N/A";
                          }
                          return packageId ? `Package ID: ${packageId}` : "N/A";
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason:</span>
                      <span className="font-medium">{formData.transfer_reason.replace('_', ' ')}</span>
                    </div>
                    {eligibility && (
                      <>
                        <div className="flex justify-between border-t pt-2 mt-2">
                          <span className="text-gray-600">Outstanding Balance:</span>
                          <span className="font-medium">৳{eligibility.outstanding_balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Transfer Fee (2%):</span>
                          <span className="font-medium">৳{eligibility.transfer_fee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2 bg-blue-50 -mx-4 px-4 py-2 rounded">
                          <span className="text-gray-900 font-semibold">Total Amount to Clear:</span>
                          <span className="font-bold text-blue-600 text-lg">
                            ৳{eligibility.total_amount_to_clear.toLocaleString()}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">New Member Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name (English):</span>
                      <span className="font-medium">{formData.personalInfo.nameEnglish}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name (Bangla):</span>
                      <span className="font-medium">{formData.personalInfo.nameBangla}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.addressInfo.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{formData.addressInfo.mobileNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NID:</span>
                      <span className="font-medium">{formData.personalInfo.nid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{formData.addressInfo.gender}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Nominee Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name (English):</span>
                      <span className="font-medium">{formData.nomineeInfo.nomineeNameEnglish}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Relation:</span>
                      <span className="font-medium">{formData.nomineeInfo.relation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mobile:</span>
                      <span className="font-medium">{formData.nomineeInfo.nomineeMobile}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleDocumentsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Accepted: PDF, JPG, PNG (Max 5MB each)
                  </p>
                  {documents.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {documents.map((doc, index) => (
                        <p key={index} className="text-xs text-gray-600">
                          ✓ {doc.name} ({(doc.size / 1024).toFixed(2)} KB)
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-between sticky bottom-0 bg-white rounded-b-xl">
            <button
              type="button"
              onClick={() => {
                if (step === 1) {
                  onClose();
                } else {
                  setStep(step - 1);
                }
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={requestMutation.isPending}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>

            {step < 6 ? (
              <button
                type="button"
                onClick={() => {
                  // Validate step 1: enrollment selected and eligible
                  if (step === 1) {
                    if (!selectedEnrollmentId) {
                      alert("Please select a pension enrollment");
                      return;
                    }
                    if (checkingEligibility) {
                      alert("Please wait while we check eligibility");
                      return;
                    }
                    if (eligibility && !eligibility.eligible) {
                      alert("This enrollment is not eligible for transfer. Please check the reasons above.");
                      return;
                    }
                  }
                  // Validate step 2: transfer reason
                  if (step === 2) {
                    if (!formData.transfer_reason) {
                      alert("Please select a transfer reason");
                      return;
                    }
                    if (!formData.reason_details.trim()) {
                      alert("Please provide detailed reason for transfer");
                      return;
                    }
                  }
                  setStep(step + 1);
                }}
                disabled={(step === 1 && (!selectedEnrollmentId || checkingEligibility)) || (step === 1 && eligibility && !eligibility.eligible)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 1 && checkingEligibility ? "Checking..." : "Next"}
              </button>
            ) : (
              <button
                type="submit"
                disabled={requestMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {requestMutation.isPending ? "Submitting..." : "Submit Request"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
