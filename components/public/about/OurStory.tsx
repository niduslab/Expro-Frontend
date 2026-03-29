import React from "react";
import Image from "next/image";

const OurStory = () => {
  return (
    <section className="py-14 md:py-20 lg:py-24 md:px-2 lg:px-4  bg-white overflow-hidden font-dm-sans">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center px-2 md:px-0">
          {/* Left Column: Image */}
          <div className="relative w-full">
            <div className="relative w-full aspect-[4/5] md:aspect-[5/6] px-24 rounded-lg overflow-hidden">
              <Image
                src="/images/about/our-story-img.jpg"
                alt="Community collaboration"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating Card */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 bg-white p-4 sm:p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center gap-3 max-w-[200px] sm:max-w-[220px]">
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EBFDF3] flex items-center justify-center text-[#36F293] font-bold text-lg sm:text-xl">
                8+
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base sm:text-lg leading-tight">
                  Years of
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">Excellence</p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5 md:space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
              Our Story
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
              Building a Better Tomorrow
            </h2>

            {/* Content */}
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-[15px] md:text-base text-justify">
              <p>
                <span className="font-bold text-gray-900">
                  Expro Welfare Foundation (EWF)
                </span>{" "}
                is a Non-government organization established in 2018 and started
                its development journey with great enthusiasm and encouragement
                by the community people in order to enhance the socio-economic
                status of the grassroots people in the village area. It was 1st
                initiated and started in development activities at{" "}
                <span className="font-bold text-gray-900">Nishindhara</span>{" "}
                under{" "}
                <span className="font-bold text-gray-900">
                  Bogura Pourashova
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  Bogura Sadar Upazila
                </span>{" "}
                in{" "}
                <span className="font-bold text-gray-900">Bogura district</span>
                . This organization registered with the Register of Joint Stock
                Companies & Firms Govt. of Bangladesh. It has been working for
                last <span className="font-bold text-gray-900">08 years</span>{" "}
                as driving force for transforming societies towards sustainable
                development by promoting, advocating and implementing programs
                that address root causes of problems.
              </p>

              <p>
                <span className="font-bold text-gray-900">
                  Expro Welfare Foundation (EWF)
                </span>{" "}
                undertook a number of development programs for its group people
                utilizing own resources and funds in{" "}
                <span className="font-bold text-gray-900">2018</span>. Expro
                Welfare Foundation strengthened its activities and included more
                interventions like institution building, income and employment
                generating activities, environment, water & sanitation,
                agriculture, educational activities, fashion design, women
                entrepreneurship, tailoring training, markets and livelihoods
                programs, and food-processing initiatives across Bangladesh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
