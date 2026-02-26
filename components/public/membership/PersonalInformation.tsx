import React, { useState } from 'react';
import { Camera, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

const PersonalInformation = () => {
  const [formData, setFormData] = useState({
    nameBangla: 'আপনার নাম',
    nameEnglish: 'You full name',
    fatherHusbandName: "Father's / Husband's Name",
    motherName: "Mother's name",
    dateOfBirth: 'mm/dd/yyyy',
    nid: 'Enter your NID number',
    qualification: '',
    photo: null,
  });

  const steps = [
    { label: 'Personal Information', active: true },
    { label: 'Address', active: false },
    { label: 'Nominee', active: false },
    { label: 'Sponsor', active: false },
    { label: 'Pension', active: false },
    { label: 'Review', active: false },
  ];

  const qualifications = ['JSC', 'SSC', 'HSC', 'Bachelor', 'Masters', 'Others'];

  return (
    <div className="w-full bg-[#F3F4F6] py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
        
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[#00341C] text-3xl font-bold mb-2">Personal Information</h2>
            <p className="text-gray-500 text-sm md:text-base">Please provide your basic details</p>
          </div>

          {/* Steps Navigation */}
          <div className="bg-[#F3F4F6] rounded-lg p-2 mb-10 overflow-x-auto">
            <div className="flex items-center min-w-max space-x-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    step.active
                      ? 'bg-[#008543] text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {step.label}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Name (Bangla) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Name (Bangla) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={formData.nameBangla}
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Name (English) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Name (English) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={formData.nameEnglish}
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Father's / Husband's Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Father's / Husband's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={formData.fatherHusbandName}
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Mother's Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Mother's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={formData.motherName}
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={formData.dateOfBirth}
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* National/Smart ID No */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">
                National/Smart ID No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={formData.nid}
                className="w-full px-4 py-3 rounded-md border border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#008543] focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Academic Qualification */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Academic Qualification <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {qualifications.map((qual) => (
                  <button
                    key={qual}
                    className="px-6 py-2 rounded-md bg-[#F3F4F6] text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-[#008543] focus:bg-[#E8F5E9] focus:text-[#008543]"
                  >
                    {qual}
                  </button>
                ))}
              </div>
            </div>

            {/* Passport Size Photo */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Passport Size Photo <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload a recent passport size photograph (max 2MB, JPG/PNG)
              </p>
              
              <div className="flex flex-col items-start space-y-3">
                <div className="w-40 h-40 bg-[#F3F4F6] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
                  <Camera size={32} className="mb-2" />
                  <span className="text-xs">PP Size Photo</span>
                </div>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-[#E5E7EB] hover:bg-gray-300 text-gray-700 rounded-md text-sm font-medium transition-colors">
                  <Upload size={16} />
                  <span>Upload Photo</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center mt-8">
          <button className="flex items-center px-6 py-3 bg-[#F3F4F6] text-gray-600 rounded-md font-medium hover:bg-gray-200 transition-colors">
            <ChevronLeft size={20} className="mr-2" />
            Previous
          </button>
          
          <button className="flex items-center px-8 py-3 bg-[#008543] text-white rounded-md font-medium hover:bg-[#006C36] transition-colors shadow-sm">
            Next
            <ChevronRight size={20} className="ml-2" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default PersonalInformation;
