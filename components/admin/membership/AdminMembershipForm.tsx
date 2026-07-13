"use client";

import React, { useState } from 'react';
import PersonalInformation, { PersonalInfoState } from './PersonalInformation';
import AddressSection, { AddressFormState } from './AddressSection';
import NomineeInformation, { NomineeInfoState } from './NomineeInformation';
import SponsorInformation, { SponsorInfoState } from './SponsorInformation';
import PensionStep, { PensionInfoState } from './PensionStep';
import ReviewStep from './ReviewStep';
import StepsNavigation from './StepsNavigation';

export type AdminMembershipData = {
  personalInfo: PersonalInfoState;
  addressInfo: AddressFormState;
  nomineeInfo: NomineeInfoState;
  sponsorInfo: SponsorInfoState;
  pensionInfo: PensionInfoState;
};

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
  nidFrontPhoto: null,
  nidBackPhoto: null,
  nomineeMobile: "",
  nomineeAddress: "",
};

const initialSponsorInfo: SponsorInfoState = {
  sponsorName: "",
  sponsorMemberId: "",
};

const initialPensionInfo: PensionInfoState = {
  selectedPackage: null,
};

const steps = [
  { label: 'Personal Information', id: 'personal' },
  { label: 'Address', id: 'address' },
  { label: 'Nominee', id: 'nominee' },
  { label: 'Sponsor', id: 'sponsor' },
  { label: 'Pension', id: 'pension' },
  { label: 'Review', id: 'review' },
];

const AdminMembershipForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [formData, setFormData] = useState<AdminMembershipData>({
    personalInfo: initialPersonalInfo,
    addressInfo: initialAddressInfo,
    nomineeInfo: initialNomineeInfo,
    sponsorInfo: initialSponsorInfo,
    pensionInfo: initialPensionInfo,
  });

  const updateFormData = (section: keyof AdminMembershipData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached(Math.max(maxStepReached, nextStep));
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
    if (index <= maxStepReached) {
      setCurrentStep(index);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    console.log("=".repeat(80));
    console.log("📋 ADMIN MEMBERSHIP FORM PAYLOAD - READY FOR SUBMISSION");
    console.log("=".repeat(80));
    
    console.log("\n👤 Personal Information:");
    console.log(JSON.stringify(formData.personalInfo, null, 2));
    
    console.log("\n📍 Address Information:");
    console.log(JSON.stringify(formData.addressInfo, null, 2));
    
    console.log("\n👥 Nominee Information:");
    console.log(JSON.stringify(formData.nomineeInfo, null, 2));
    
    console.log("\n🤝 Sponsor Information:");
    console.log(JSON.stringify(formData.sponsorInfo, null, 2));
    
    console.log("\n💰 Pension Information:");
    console.log(JSON.stringify(formData.pensionInfo, null, 2));
    
    console.log("\n📦 Complete Payload (JSON):");
    console.log(JSON.stringify(formData, null, 2));
    
    console.log("\n" + "=".repeat(80));
    console.log("✅ Payload logged successfully. Check console for details.");
    console.log("=".repeat(80) + "\n");
    
    // Here you would typically submit the formData to your API
    alert("Member Created Successfully! Check console for payload details.");
    
    // Reset form after successful submission
    setFormData({
      personalInfo: initialPersonalInfo,
      addressInfo: initialAddressInfo,
      nomineeInfo: initialNomineeInfo,
      sponsorInfo: initialSponsorInfo,
      pensionInfo: initialPensionInfo,
    });
    setCurrentStep(0);
    setMaxStepReached(0);
  };

  const renderStep = () => {
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
          <div className="bg-white rounded-lg shadow-sm p-6">
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
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {renderStep()}
    </div>
  );
};

export default AdminMembershipForm;
