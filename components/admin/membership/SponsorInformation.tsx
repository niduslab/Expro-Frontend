"use client";

import React, { useState, ChangeEvent, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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

interface SponsorInformationProps {
  data: SponsorInfoState;
  onUpdate: (data: SponsorInfoState) => void;
  onNext: () => void;
  onPrev: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
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
}) => {
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useState<SponsorSearchParams | null>(null);
  const [shouldValidate, setShouldValidate] = useState(false);

  const { 
    data: validationData, 
    isLoading: isVerifying,
    error: validationError
  } = useValidateSponsor(undefined, data.sponsorMemberId, shouldValidate);

  const { 
    data: searchResults = [], 
    isLoading: isSearching 
  } = useSearchSponsors(searchParams, !!searchParams);

  useEffect(() => {
    if (shouldValidate && validationData) {
      setShouldValidate(false);
      
      if (validationData.is_eligible) {
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
        isVerified: false,
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
      isVerified: false,
    });
    setSearchQuery("");
    setShowSearchResults(false);
    setSearchParams(null);
    
    setTimeout(() => {
      setShouldValidate(true);
    }, 100);
  };

  const validate = () => {
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Sponsor Information</h2>
        <p className="text-sm text-gray-600 mt-1">Provide sponsor details if applicable</p>
      </div>

      <StepsNavigation 
        steps={steps}
        currentStep={currentStep}
        maxStepReached={maxStepReached}
        onStepClick={onStepClick}
      />

      {/* Search Sponsor Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Search for Sponsor</h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSponsors()}
            placeholder="Search by name, member ID, email, or phone..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all text-sm"
          />
          <button
            type="button"
            onClick={handleSearchSponsors}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2.5 bg-[#068847] text-white rounded-lg font-medium hover:bg-[#057038] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {isSearching ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search size={16} />
                Search
              </>
            )}
          </button>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="mt-3 bg-white rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {searchResults.map((sponsor) => (
                  <button
                    key={sponsor.user_id}
                    type="button"
                    onClick={() => handleSelectSponsor(sponsor)}
                    className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-[#068847] rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {sponsor.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{sponsor.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-600">
                          {sponsor.member_id} • {sponsor.email}
                        </p>
                      </div>
                    </div>
                    {sponsor.is_eligible && (
                      <CheckCircle size={16} className="text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-gray-500 text-sm">
                <Search size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No eligible sponsors found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-xs text-gray-500 font-medium">OR</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Sponsor Member Id with Verify Button */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Sponsor Member Id <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.sponsorMemberId}
              onChange={handleChange("sponsorMemberId")}
              placeholder="e.g. EWF-1076"
              className={`flex-1 px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
                errors.sponsorMemberId ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={handleVerifySponsor}
              disabled={isVerifying || !data.sponsorMemberId.trim()}
              className="px-4 py-2.5 bg-[#068847] text-white rounded-lg font-medium hover:bg-[#057038] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap text-sm"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Verify
                </>
              )}
            </button>
          </div>
          {errors.sponsorMemberId && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <XCircle size={12} />
              {errors.sponsorMemberId}
            </p>
          )}
        </div>

        {/* Sponsor Information Display */}
        {validationData && validationData.is_eligible && data.isVerified && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {validationData.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{validationData.name || 'Unknown'}</h4>
                  <CheckCircle size={16} className="text-green-600" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Member ID:</span>
                    <span className="ml-1 font-medium text-gray-900">{validationData.member_id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-1 font-medium text-gray-900">{validationData.email}</span>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-1 text-green-700">
                  <CheckCircle size={14} />
                  <span className="text-xs font-medium">Verified and eligible</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sponsor Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">
            Sponsor Name (English) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.sponsorName}
            onChange={handleChange("sponsorName")}
            placeholder="Name of referring member"
            readOnly={data.isVerified}
            className={`w-full px-4 py-2.5 rounded-lg border text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#068847] focus:border-transparent transition-all ${
              errors.sponsorName ? "border-red-500" : "border-gray-300"
            } ${data.isVerified ? "bg-gray-50 cursor-not-allowed" : ""}`}
          />
          {errors.sponsorName && (
            <p className="text-xs text-red-500">{errors.sponsorName}</p>
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

export default SponsorInformation;
