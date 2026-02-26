"use client";

import React, { useState, useEffect } from 'react';
import PersonalInformation, { PersonalInfoState } from './PersonalInformation';
import AddressSection, { AddressFormState } from './AddressSection';
import NomineeInformation, { NomineeInfoState } from './NomineeInformation';
import SponsorInformation, { SponsorInfoState } from './SponsorInformation';
import PensionStep, { PensionInfoState } from './PensionStep';
import ReviewStep from './ReviewStep';
import StepsNavigation from './StepsNavigation';

const STORAGE_KEY = 'membership_form_data';
const MAX_STEP_KEY = 'membership_max_step';

export type MembershipData = {
  personalInfo: PersonalInfoState;
  addressInfo: AddressFormState;
  nomineeInfo: NomineeInfoState;
  sponsorInfo: SponsorInfoState;
  pensionInfo: PensionInfoState;
  // Add other steps data here
};

const initialPersonalInfo: PersonalInfoState = {
  nameBangla: "",
  nameEnglish: "",
  fatherHusbandName: "",
  motherName: "",
  dateOfBirth: "",
  nid: "",
  qualification: [],
  photo: null,
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
  dateOfBirth: "",
  relation: "",
  nid: "",
  photo: null,
};

const initialSponsorInfo: SponsorInfoState = {
  sponsorName: "",
  sponsorMemberId: "",
};

const initialPensionInfo: PensionInfoState = {
  selectedPackage: 'skip',
};

const steps = [
  { label: 'Personal Information', id: 'personal' },
  { label: 'Address', id: 'address' },
  { label: 'Nominee', id: 'nominee' },
  { label: 'Sponsor', id: 'sponsor' },
  { label: 'Pension', id: 'pension' },
  { label: 'Review', id: 'review' },
];

const MembershipForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [formData, setFormData] = useState<MembershipData>({
    personalInfo: initialPersonalInfo,
    addressInfo: initialAddressInfo,
    nomineeInfo: initialNomineeInfo,
    sponsorInfo: initialSponsorInfo,
    pensionInfo: initialPensionInfo,
  });

  // Load from local storage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedMaxStep = localStorage.getItem(MAX_STEP_KEY);

    if (savedMaxStep) {
      setMaxStepReached(parseInt(savedMaxStep, 10));
    }

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // We need to merge with initial state to ensure all fields exist
        // Note: File objects (photo) cannot be stored in localStorage, so they will be null
        setFormData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, ...parsedData.personalInfo, photo: null },
          addressInfo: { ...prev.addressInfo, ...parsedData.addressInfo },
          nomineeInfo: { ...prev.nomineeInfo, ...parsedData.nomineeInfo, photo: null },
          sponsorInfo: { ...prev.sponsorInfo, ...parsedData.sponsorInfo },
          pensionInfo: { ...prev.pensionInfo, ...parsedData.pensionInfo },
        }));
      } catch (error) {
        console.error("Failed to load form data from storage", error);
      }
    }
  }, []);

  // Save to local storage on change
  const updateFormData = (section: keyof MembershipData, data: any) => {
    const newData = {
      ...formData,
      [section]: data,
    };
    setFormData(newData);
    
    // Create a version without File objects for storage
    const storageData = {
      ...newData,
      personalInfo: {
        ...newData.personalInfo,
        photo: null // Exclude file from storage
      },
      nomineeInfo: {
        ...newData.nomineeInfo,
        photo: null // Exclude file from storage
      },
      sponsorInfo: newData.sponsorInfo,
      pensionInfo: newData.pensionInfo,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      const newMaxStep = Math.max(maxStepReached, nextStep);
      setMaxStepReached(newMaxStep);
      localStorage.setItem(MAX_STEP_KEY, newMaxStep.toString());
      
      window.scrollTo(0, 0);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleStepClick = (index: number) => {
    // Only allow navigation to steps that have been reached
    if (index <= maxStepReached) {
      setCurrentStep(index);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    // Here you would typically submit the formData to your API
    console.log("Submitting Membership Data:", formData);
    alert("Application Submitted! Proceeding to Payment...");
    // Redirect to payment gateway or success page
  };

  const renderStep = () => {
    // Common props for all steps
    const commonProps = {
      onNext: handleNextStep,
      onPrev: handlePrevStep,
      steps: steps,
      currentStep: currentStep,
      maxStepReached: maxStepReached,
      onStepClick: handleStepClick,
    };

    switch (currentStep) {
      case 0:
        return (
          <PersonalInformation 
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData('personalInfo', data)}
            {...commonProps}
          />
        );
      case 1:
        return (
          <AddressSection 
            data={formData.addressInfo}
            onUpdate={(data) => updateFormData('addressInfo', data)}
            {...commonProps}
          />
        );
      case 2:
        return (
          <NomineeInformation 
            data={formData.nomineeInfo}
            onUpdate={(data) => updateFormData('nomineeInfo', data)}
            {...commonProps}
          />
        );
      case 3:
        return (
          <SponsorInformation 
            data={formData.sponsorInfo}
            onUpdate={(data) => updateFormData('sponsorInfo', data)}
            {...commonProps}
          />
        );
      case 4:
        return (
          <PensionStep 
            data={formData.pensionInfo}
            onUpdate={(data) => updateFormData('pensionInfo', data)}
            {...commonProps}
          />
        );
      case 5:
        return (
          <ReviewStep 
            data={formData}
            onSubmit={handleSubmit}
            onPrev={handlePrevStep}
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={handleStepClick}
          />
        );
      default:
        return (
          <div className="w-full bg-[#F3F4F6] py-12">
            <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
                <StepsNavigation 
                  steps={steps}
                  currentStep={currentStep}
                  maxStepReached={maxStepReached}
                  onStepClick={handleStepClick}
                />
                <div className="p-8 text-center text-gray-500">
                  Step {currentStep + 1} ({steps[currentStep]?.label}) content coming soon...
                </div>
                <div className="flex justify-between items-center mt-8">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-6 py-3 bg-[#F3F4F6] text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors"
                  >
                    Previous
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {renderStep()}
    </>
  );
};

export default MembershipForm;
