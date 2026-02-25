import React from 'react';
import Image from 'next/image';

const OurFounder = () => {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Content */}
          <div className="space-y-6">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
              Our Founder
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
              About Our Founder
            </h2>

            <div className="space-y-4 text-gray-600 font-dm-sans leading-relaxed text-[15px] md:text-[16px]">
              <p className="font-bold text-gray-900">
                Md. Motaher Hossain<span className="font-normal text-gray-500">, Founder Chairman, Expro Welfare Foundation.</span>
              </p>
              
              <p className="text-justify">
                A Visionary Educator and Reformer <span className="font-bold text-gray-900">Md. Motaher Hossain</span> is a distinguished
                academician and a pioneer in the social and economic development of modern
                Bangladesh. As a College Principal by profession, he has dedicated his
                life to education, character building and the empowerment of the youth.
              </p>
              
              <p className="text-justify">
                Core Philosophy His life and work are guided by the resilient motto: <span className="font-bold italic text-gray-900">"Winner never
                quit, quitter never win, so never never quit."</span>
              </p>
              
              <p className="text-justify">
                Social and Economic Impact Driven by a deep sense of patriotism, he established
                the <span className="font-bold text-gray-900">Expro Welfare Foundation</span> to bridge the gap between education and economic
                growth. He is actively working toward social upliftment an poverty alleviation,
                believing that true progress is achieved when every citizen contributes to the
                nation's prosperity. Under his leadership, Expro foundation continues to strive for a
                sustainable and prosperous future for Bangladesh.
              </p>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[644px] h-[500px] md:h-[600px] lg:h-[675px] rounded-[8px] overflow-hidden bg-[#F5F5F5]">
              <Image
                src="/images/about/our-founder.png"
                alt="Md. Motaher Hossain - Founder Chairman"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default OurFounder;
