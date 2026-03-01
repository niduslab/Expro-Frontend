import React from 'react';
import Image from 'next/image';
import { Check } from 'lucide-react';

const WhatWeDo = () => {
  const features = [
    "Enhancing the capacity of the people through training",
    "Reducing poverty through financial services",
    "Ensuring women's participation in society",
    "Providing human rights services for improving social conditions",
    "Providing quality education for the advancement of lives",
    "Transfer of technology to increase productivity",
    "Establishing good governance within the organization",
    "Establishing it as a sustainable model organization"
  ];

  return (
    <section className="py-16 md:py-24 bg-[#F3F4F6] overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
                What We Do
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
                Our Key Features
              </h2>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-5 h-5 rounded-full border-[1.5px] border-[#008A4B] flex items-center justify-center shrink-0">
                    <Check className="text-[#008A4B]" size={10} strokeWidth={4} />
                  </div>
                  <span className="text-gray-700 font-dm-sans text-[15px] md:text-[16px] font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative h-full flex items-center justify-center lg:justify-end">
            <div className="relative w-full lg:w-161 h-125 lg:h-162.5 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/about/what-we-do-img.jpg"
                alt="Global Community Collaboration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
