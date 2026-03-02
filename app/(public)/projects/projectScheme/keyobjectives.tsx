import { CheckCircle } from "lucide-react";
import Image from "next/image";

export default function KeyObjectives() {
  return (
    <section className="w-full bg-[#F0F4F2] px-4 sm:px-6 lg:px-[64px] py-16 lg:py-[120px]">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Content */}
        <div className="w-full lg:w-1/2 flex items-center">
          <div className="w-full space-y-10">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
                Key Objectives
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-gray-900 leading-tight">
                What We Aim to Achieve
              </h2>
            </div>

            {/* Objectives */}
            <div className="flex flex-col gap-4">
              {[
                "Ensure financial independence in old age for lower-middle-class communities.",
                "Provide sustainable and long-term income streams through strategic investments.",
                "Promote disciplined savings culture among members.",
                "Promote disciplined savings culture among members.",
              ].map((text, i) => (
                <div
                  key={i}
                  className="bg-white flex items-start rounded-lg py-4 px-3 border border-[#E5E7EB] gap-2"
                >
                  <CheckCircle className="w-5 h-5 shrink-0 mt-1 text-[#068847]" />
                  <p className="text-[15px] sm:text-[17px] text-[#4A5565] leading-relaxed tracking-[-0.01em]">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full lg:w-1/2 h-[280px] sm:h-[380px] lg:h-[703px]">
          <Image
            src="/images/projectScheme/keyobjectposter.jpg"
            alt="Key object poster"
            fill
            sizes="573px"
            className="ml-auto w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
