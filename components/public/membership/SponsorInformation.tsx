"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Search, CheckCircle, XCircle, Loader2, Lock } from 'lucide-react';
import StepsNavigation from './StepsNavigation';
import { 
  useValidateSponsor, 
  useSearchSponsors,
  SponsorSearchResult,
  SponsorSearchParams 
} from '@/lib/hooks/public/useSponsor';

export type SponsorInfoState = {
  sponsorName: string;
  sponsorMemberId: string;
  sponsorUserId?: number;
  isVerified?: boolean;
};

type FormErrors = Partial<Record<keyof SponsorInfoState, string>>;

const sponsorNamePlaceholder = "Name of referring member";
const sponsorMemberIdPlaceholder = "e.g. EWF-1076";

interface SponsorInformationProps {
  data: SponsorInfoState;
  onUpdate: (data: SponsorInfoState) => void;
  onNext: () => void;
  onPrev: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
  locked?: boolean;
}

const SponsorInformation: React.FC<SponsorInformationProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
  locked = false,
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useState<SponsorSearchParams | null>(null);
  const [shouldValidate, setShouldValidate] = useState(false);

  // React Query hooks
  const { 
    data: validationData, 
    isLoading: isVerifying,
    error: validationError
  } = useValidateSponsor(undefined, data.sponsorMemberId, shouldValidate);

  const { 
    data: searchResults = [], 
    isLoading: isSearching 
  } = useSearchSponsors(searchParams, !!searchParams);

  // Handle validation response
  useEffect(() => {
    if (shouldValidate && validationData) {
      setShouldValidate(false);
      
      if (validationData.is_eligible) {
        // Update form data with verified sponsor info
        onUpdate({
          ...data,
          sponsorName: validationData.name,
          sponsorUserId: validationData.user_id,
          isVerified: true,
        });
        setErrors({});
      } else {
        setErrors({ 
          sponsorMemberId: validationData.reason || "This member is not eligible to be a sponsor" 
        });
        onUpdate({
          ...data,
          isVerified: false,
        });
      }
    }
  }, [validationData, shouldValidate]);

  // Handle validation error
  useEffect(() => {
    if (shouldValidate && validationError) {
      setShouldValidate(false);
      setErrors({ 
        sponsorMemberId: "Sponsor not found. Please check the Member ID." 
      });
      onUpdate({
        ...data,
        isVerified: false,
      });
    }
  }, [validationError, shouldValidate]);

  const handleChange =
    (field: keyof SponsorInfoState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onUpdate({
        ...data,
        [field]: value,
        isVerified: false, // Reset verification when user changes input
      });
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  const handleVerifySponsor = () => {
    if (!data.sponsorMemberId.trim()) {
      setErrors({ sponsorMemberId: "Please enter a Sponsor Member ID" });
      return;
    }

    setErrors({});
    setShouldValidate(true);
  };

  const handleSearchSponsors = () => {
    if (!searchQuery.trim()) {
      return;
    }

    setShowSearchResults(true);
    setSearchParams({
      query: searchQuery,
      eligible_only: true,
      limit: 10,
    });
  };

  const handleSelectSponsor = (sponsor: SponsorSearchResult) => {
    onUpdate({
      ...data,
      sponsorMemberId: sponsor.member_id,
      sponsorName: sponsor.name,
      sponsorUserId: sponsor.user_id,
      isVerified: false, // Will need to verify after selection
    });
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchParams(null);
    
    // Auto-verify after selection
    setTimeout(() => {
      setShouldValidate(true);
    }, 100);
  };

  const validate = () => {
    if (locked) return true;

    const nextErrors: FormErrors = {};

    if (!data.sponsorMemberId.trim()) {
      nextErrors.sponsorMemberId = "Sponsor Member Id is required";
    } else if (!data.isVerified) {
      nextErrors.sponsorMemberId = "Please verify the sponsor before proceeding";
    }

    if (!data.sponsorName.trim()) {
      nextErrors.sponsorName = "Sponsor Name is required";
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
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">Sponsor Information</h2>
            <p className="text-gray-500 text-sm md:text-base">
              {locked
                ? "You are the sponsor for this application"
                : "If you are referred by any existing member, please provide their details"}
            </p>
          </div>

          {/* Steps Navigation */}
          <StepsNavigation
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={onStepClick}
          />

          {/* Locked sponsor view */}
          {locked && (
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-xl mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="font-semibold text-green-900 text-sm">Sponsor Auto-Set</p>
                  <p className="text-xs text-green-700">You are automatically set as the sponsor for this member</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-gray-500 mb-1">Sponsor Name</p>
                  <p className="font-semibold text-gray-900">{data.sponsorName || "—"}</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-xs text-gray-500 mb-1">Sponsor Member ID</p>
                  <p className="font-semibold text-gray-900 font-mono">{data.sponsorMemberId || "—"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 text-green-700">
                <CheckCircle size={16} />
                <span className="text-sm font-medium">Verified and eligible to be a sponsor</span>
              </div>
            </div>
          )}

          {/* Search + manual input — hidden when sponsor is locked */}
          {!locked && (<>
          <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search for Sponsor</h3>
            <p className="text-sm text-gray-600 mb-4">
              Search by name, member ID, email, or phone number to find your sponsor
            </p>
            
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSponsors()}
                  placeholder="Search by name, member ID, email, or phone..."
                  className="w-full px-4 py-3 rounded-md border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400"
                />
              </div>
              <button
                type="button"
                onClick={handleSearchSponsors}
                disabled={isSearching || !searchQuery.trim()}
                className="px-6 py-3 bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search
                  </>
                )}
              </button>
            </div>

            {/* Search Results */}
            {showSearchResults && (
              <div className="mt-4 bg-white rounded-md border border-gray-200 max-h-64 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {searchResults.map((sponsor) => (
                      <button
                        key={sponsor.user_id}
                        type="button"
                        onClick={() => handleSelectSponsor(sponsor)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#008543] rounded-full flex items-center justify-center text-white font-semibold">
                            {sponsor.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{sponsor.name || 'Unknown'}</p>
                            <p className="text-sm text-gray-600">
                              {sponsor.member_id} • {sponsor.email}
                            </p>
                            <p className="text-xs text-gray-500">{sponsor.mobile}</p>
                          </div>
                        </div>
                        {sponsor.is_eligible && (
                          <CheckCircle size={20} className="text-green-600" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Search size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>No eligible sponsors found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            
            {/* Sponsor Member Id with Verify Button */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Sponsor Member Id <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={data.sponsorMemberId}
                    onChange={handleChange("sponsorMemberId")}
                    placeholder={sponsorMemberIdPlaceholder}
                    aria-invalid={Boolean(errors.sponsorMemberId)}
                    className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                      errors.sponsorMemberId ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifySponsor}
                  disabled={isVerifying || !data.sponsorMemberId.trim()}
                  className="px-6 py-3 bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Verify
                    </>
                  )}
                </button>
              </div>
              {errors.sponsorMemberId && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle size={14} />
                  {errors.sponsorMemberId}
                </p>
              )}
            </div>

            {/* Sponsor Information Display */}
            {validationData && validationData.is_eligible && data.isVerified && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {validationData.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{validationData.name || 'Unknown'}</h4>
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Member ID:</span>
                        <span className="ml-2 font-medium text-gray-900">{validationData.member_id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 font-medium text-gray-900">{validationData.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Mobile:</span>
                        <span className="ml-2 font-medium text-gray-900">{validationData.mobile}</span>
                      </div>
                      {validationData.pension_roles && validationData.pension_roles.length > 0 && (
                        <div>
                          <span className="text-gray-600">Roles:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {validationData.pension_roles.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    {validationData.pension_enrollments && validationData.pension_enrollments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">Pension Enrollments:</p>
                        <div className="flex flex-wrap gap-2">
                          {validationData.pension_enrollments.map((enrollment) => (
                            <span
                              key={enrollment.id}
                              className="px-3 py-1 bg-white border border-green-300 rounded-full text-xs font-medium text-gray-700"
                            >
                              {enrollment.package_name} ({enrollment.role})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2 text-green-700">
                      <CheckCircle size={16} />
                      <span className="text-sm font-medium">Verified and eligible to be a sponsor</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sponsor Name (Auto-filled after verification) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Sponsor Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.sponsorName}
                onChange={handleChange("sponsorName")}
                placeholder={sponsorNamePlaceholder}
                readOnly={data.isVerified}
                aria-invalid={Boolean(errors.sponsorName)}
                className={`w-full px-4 py-3 rounded-md border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400 ${
                  errors.sponsorName ? "border-red-500" : "border-gray-200"
                } ${data.isVerified ? "bg-gray-50 cursor-not-allowed" : ""}`}
              />
              {errors.sponsorName && (
                <p className="text-xs text-red-500">{errors.sponsorName}</p>
              )}
            </div>

          </div>
          </>)}
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

export default SponsorInformation;
