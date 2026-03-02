import Image from "next/image";
import { CheckCircle } from "lucide-react";

export default function OverviewScheme() {
  return (
    <div className="flex pt-16 pb-16 lg:pt-[120px] lg:pb-[120px]">
      <div className="w-full px-4 sm:px-6 lg:px-[64px]">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
          {/* Image */}
          <div className="relative w-full lg:w-[644px] h-[280px] sm:h-[360px] lg:h-[518px] rounded-lg overflow-hidden">
            <Image
              src="/images/about/our-story-img.jpg"
              alt="Community collaboration"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 644px"
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 lg:gap-[36px]">
            {/* Tag */}
            <div className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
              Overview
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-gray-900 leading-tight">
              Empowering Today, Envisioning Tomorrow
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-dm-sans leading-relaxed text-justify">
              Financial stability is the foundation of a peaceful retirement. To
              empower the lower-middle-class community and ensure financial
              independence in old age, Expro Welfare Foundation introduces a
              specialized Pension Scheme. This is more than just a savings
              plan—it is a commitment to your lifelong security.
            </p>

            {/* List */}
            <div className="flex flex-col gap-4">
              {[
                "Your contributions are strategically invested in productive and service-oriented sectors.",
                "30% of total profits generated from investments are distributed among members as regular pension.",
                "Sustainable and long-term income stream guaranteed.",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 text-[#068847]" />
                  <p className="text-base text-[#4A5565] leading-[150%] tracking-[-0.01em]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
