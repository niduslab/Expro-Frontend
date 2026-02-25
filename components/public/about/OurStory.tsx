import React from 'react';
import Image from 'next/image';

const OurStory = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image with Floating Card */}
          <div className="relative">
            <div className="relative h-100 md:h-125 lg:h-174.5 w-full lg:w-161 rounded-lg overflow-hidden">
              <Image
                src="/images/about/our-story-img.jpg"
                alt="Community collaboration"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Floating Card */}
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 bg-white p-6 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center gap-4 max-w-60">
              <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#EBFDF3] flex items-center justify-center text-[#36F293] font-bold text-xl md:text-2xl">
                8+
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg leading-tight">Years of</p>
                <p className="text-gray-500 text-sm">Excellence</p>
              </div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
              Our Story
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
              Building a Better Tomorrow
            </h2>

            <div className="space-y-4 text-gray-600 font-dm-sans leading-relaxed text-[14px] md:text-[16px] text-justify">
              <p>
                <span className="font-bold text-gray-900">Expro Welfare Foundation (EWF)</span> is a Non-government organization established in
                2018 and started its development journey with great enthusiasm and
                encouragement by the community people in order to enhance the socio-economic
                status of the grassroots people in the village area. It was 1st initiated and started in
                development activities at <span className="font-bold text-gray-900">Nishindhara</span> under <span className="font-bold text-gray-900">Bogura Pourashova</span> of <span className="font-bold text-gray-900">Bogura SadarUpazila</span> in <span className="font-bold text-gray-900">Bogura district</span>. This organization registered with the Register of
                Joint Stock Companies & Firms Govt. of Bangladesh. It has been working for last <span className="font-bold text-gray-900">08 years</span> as driving force for transforming societies towards sustainable development
                by promoting, advocating and implementing programs that address root causes of
                problems. Now it has been implemented a number of development programs and
                projects to bring out sustainable development of vulnerable, disadvantaged and
                underprivileged people of the northern parts of the country.
              </p>
              
              <p>
                <span className="font-bold text-gray-900">Expro Welfare Foundation (EWF)</span> undertook a number of development programs
                for its group people utilizing own resources and funds in <span className="font-bold text-gray-900">2018</span>. Expro Welfare
                Foundation (EWF) strengthened its activities and included more intervention like
                institution building, income and employment generating activities, Environment,
                water & sanitation, agriculture, educational activities, fashion design, woman
                entrepreneurship, tailoring tanning, markets and livelihoods program & food-
                processing etc. and expanded its area of operation simultaneously. To implementing
                all over the programs EWF always considering the poverty alleviation issue specially
                entrepreneurship development and take necessary action to successful
                implementation of the program. EWF is implementing its development activities
                through All Upazila under Bogura district then all over Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;

