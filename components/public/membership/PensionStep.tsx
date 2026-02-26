"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ShieldCheck, Wallet, Check, Circle, CheckCircle } from 'lucide-react';
import StepsNavigation from './StepsNavigation';

export type PensionInfoState = {
  selectedPackage: 'skip' | 'basic' | 'standard' | 'advanced' | 'premium';
};

const packages = [
  {
    id: 'basic',
    name: 'Basic',
    price: 300,
    features: [
      'Total Months 100',
      'Maturity Amount ৳50,000',
      'Status Closed',
      'Join Commission Closed'
    ]
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 500,
    isPopular: true,
    features: [
      'Total Months 100',
      'Maturity Amount ৳85,000',
      'Status Closed',
      'Join Commission Closed'
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    price: 1000,
    features: [
      'Total Months 100',
      'Maturity Amount ৳172,000',
      'Status Closed',
      'Join Commission ৳600'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1500,
    features: [
      'Total Months 100',
      'Maturity Amount ৳260,000',
      'Status Running',
      'Join Commission ৳700'
    ]
  }
];

interface PensionStepProps {
  data: PensionInfoState;
  onUpdate: (data: PensionInfoState) => void;
  onNext: () => void;
  onPrev: () => void;
  steps: { label: string; id: string }[];
  currentStep: number;
  maxStepReached: number;
  onStepClick: (index: number) => void;
}

const PensionStep: React.FC<PensionStepProps> = ({
  data,
  onUpdate,
  onNext,
  onPrev,
  steps,
  currentStep,
  maxStepReached,
  onStepClick,
}) => {
  const [membershipFee] = useState(400);

  const handlePackageSelect = (packageId: PensionInfoState['selectedPackage']) => {
    onUpdate({ selectedPackage: packageId });
  };

  const getSelectedPackageDetails = () => {
    return packages.find(p => p.id === data.selectedPackage);
  };

  const selectedPackageDetails = getSelectedPackageDetails();
  const totalDue = membershipFee + (selectedPackageDetails?.price || 0);

  return (
    <div className="w-full bg-[#F3F4F6] py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-8">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">Membership Fee</h2>
            <p className="text-gray-500 text-sm md:text-base">One-time registration fee</p>
          </div>

          {/* Steps Navigation */}
          <StepsNavigation 
            steps={steps}
            currentStep={currentStep}
            maxStepReached={maxStepReached}
            onStepClick={onStepClick}
          />

          {/* Membership Fee Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-12">
            {/* Foundation Membership Card */}
            <div 
              className="rounded-xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              style={{ background: 'linear-gradient(90deg, #F0F4F2 0%, #F2F2E7 100%)' }}
            >
              <div className="flex items-start gap-4">
                <div className="bg-[#E8F5E9] p-3 rounded-full text-[#008543]">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#00341C] mb-2">Foundation Membership</h3>
                  <p className="text-gray-600 text-sm mb-4">Get access to all foundation benefits and programs</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-[#008543]" />
                      <span>Access to all welfare programs</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-[#008543]" />
                      <span>Eligible for pension scheme enrollment</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-[#008543]" />
                      <span>Member ID card & benefits</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[#00341C]">৳400</p>
                <p className="text-xs text-gray-500">One-time fee</p>
              </div>
            </div>

            {/* Secure Payment Info */}
            <div className="rounded-xl p-6 flex items-start gap-4" style={{ background: 'linear-gradient(90deg, #F0F4F2 0%, #F2F2E7 100%)' }}>
              <div className="bg-[#E8F5E9] p-3 rounded-full text-[#008543]">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="font-bold text-[#00341C] mb-1">Secure Payment via SSLCommerz</h3>
                <p className="text-sm text-gray-600">
                  Payment will be processed after form submission using SSLCommerz secure gateway
                </p>
              </div>
            </div>
          </div>

          {/* Pension Package Section */}
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">Pension Package</h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">Choose a package or skip for now</p>

            {/* Note */}
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-8">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Note:</span> you can choose a pension package now or enroll later from your member dashboard. Pension payments will be managed separately after your membership is confirmed.
              </p>
            </div>

            {/* Skip Option */}
            <div 
              onClick={() => handlePackageSelect('skip')}
              style={{ background: 'linear-gradient(90deg, #F0F4F2 0%, #F2F2E7 100%)' }}
              className={`border rounded-lg p-4 mb-8 cursor-pointer transition-all flex items-center gap-4 ${
                data.selectedPackage === 'skip' 
                  ? 'border-[#00341C]' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                data.selectedPackage === 'skip' ? 'border-[#00341C]' : 'border-gray-400'
              }`}>
                {data.selectedPackage === 'skip' && <div className="w-3 h-3 bg-[#00341C] rounded-full" />}
              </div>
              <div>
                <h4 className="font-bold text-[#00341C]">Skip Pension Package for Now</h4>
                <p className="text-sm text-gray-500">You can enroll in a pension package later from your dashboard</p>
              </div>
            </div>

            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {packages.map((pkg) => {
                const isSelected = data.selectedPackage === pkg.id;
                
                return (
                  <div 
                    key={pkg.id}
                    onClick={() => handlePackageSelect(pkg.id as any)}
                    className={`border rounded-xl p-5 cursor-pointer transition-all flex flex-col h-full relative ${
                      isSelected 
                        ? 'bg-[#00341C] text-white border-[#00341C] shadow-lg transform scale-[1.02]' 
                        : 'bg-white text-gray-900 border-gray-200 hover:border-[#008543]'
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute top-4 right-4 bg-[#36F293] text-[#00341C] text-[10px] font-bold px-2 py-0.5 rounded">
                        POPULAR
                      </span>
                    )}
                    
                    <h3 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-[#00341C]'}`}>
                      {pkg.name}
                    </h3>
                    
                    <div className="flex items-baseline mb-4">
                      <span className={`text-2xl font-bold ${isSelected ? 'text-white' : 'text-[#00341C]'}`}>
                        ৳{pkg.price}
                      </span>
                      <span className={`text-xs ml-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                        /month
                      </span>
                    </div>

                    <button 
                      className={`w-full py-2 rounded border text-sm font-medium mb-6 transition-colors ${
                        isSelected 
                          ? 'bg-[#008543] border-[#008543] text-white' 
                          : 'bg-white border-gray-300 text-[#00341C] hover:border-[#00341C]'
                      }`}
                    >
                      {isSelected ? `Selected ${pkg.name}` : `Choose ${pkg.name} Package`}
                    </button>

                    <p className={`text-xs font-bold mb-3 ${isSelected ? 'text-gray-300' : 'text-[#00341C]'}`}>
                      Core Feature
                    </p>

                    <div className="space-y-2 flex-grow">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check size={14} className={`mt-0.5 ${isSelected ? 'text-[#36F293]' : 'text-[#008543]'}`} />
                          <span className={`text-xs ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Indicator */}
            {data.selectedPackage !== 'skip' && selectedPackageDetails && (
              <div className="bg-[#E8F5E9] rounded-lg p-4 flex items-center gap-3 border border-[#008543]/20">
                <Check size={20} className="text-[#008543]" />
                <div>
                  <h4 className="font-bold text-[#00341C] text-sm">{selectedPackageDetails.name} Package Selected</h4>
                  <p className="text-xs text-gray-600">
                    ৳{selectedPackageDetails.price}/month • Maturity: {selectedPackageDetails.features[1].split('৳')[1]}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary Card */}
        <div className="bg-[#00341C] rounded-xl p-6 md:p-8 text-white mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Payment Summary</h3>
            <span className="text-xl font-bold">৳{totalDue}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-300 mb-6 border-b border-white/10 pb-6">
            <span>Membership Fee (Required)</span>
            <span>৳{membershipFee}</span>
          </div>
          
          {data.selectedPackage !== 'skip' && selectedPackageDetails && (
             <div className="flex justify-between items-center text-sm text-gray-300 mb-6 border-b border-white/10 pb-6">
               <span>{selectedPackageDetails.name} Package (1st Month)</span>
               <span>৳{selectedPackageDetails.price}</span>
             </div>
          )}

          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Total Due Today</h3>
            <span className="text-xl font-bold">৳{totalDue}</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * Subsequent pension payments can be made from your member dashboard
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
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
            onClick={onNext}
            className="flex items-center px-8 py-3 bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors shadow-sm"
          >
            Next & Review
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default PensionStep;
