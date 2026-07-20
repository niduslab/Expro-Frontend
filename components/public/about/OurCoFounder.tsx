"use client";

import { useExproMembers } from "@/lib/hooks/public/useExpromembers";
import Image from "next/image";

const OurCoFounder = () => {
  const { data, isLoading } = useExproMembers(1, 50);

  // Find the Co-Founder specifically
  const coFounder = data?.data?.find((m) => m.designation === "Co-Founder");

  // 1. Loading State
  if (isLoading) {
    return (
      <section className="font-dm-sans py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="animate-pulse flex flex-col lg:flex-row gap-10 items-center">
            {/* Image Skeleton */}
            <div className="w-full lg:w-1/2 aspect-[4/5] bg-gray-200 rounded-lg"></div>

            {/* Content Skeleton */}
            <div className="w-full lg:w-1/2 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 2. No Live Data — fall back to static co-founder content
  if (!coFounder) {
    return (
      <section className="font-dm-sans py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:px-2 items-center">
            {/* Left Column: Image */}
            <div className="relative flex justify-center lg:justify-start order-1">
              <div className="relative w-full mx-2 aspect-[4/5] rounded-lg overflow-hidden bg-[#F5F5F5]">
                <Image
                  src="/images/about/our-co-founder.png"
                  alt="Executive Director & Co-Founder - Expro Welfare Foundation"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="space-y-5 md:space-y-6 order-2 px-2 md:px-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
                Our Co-Founder
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
                Executive Director &amp; Co-Founder
              </h2>

              <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-[15px] md:text-base">
                <p className="text-justify">
                  A Commitment Rooted in Service — Serving as the{" "}
                  <span className="font-bold text-gray-900">
                    Executive Director and Co-Founder
                  </span>{" "}
                  of Expro Welfare Foundation is more than just a professional
                  role for me; it is a profound opportunity to serve humanity. A
                  significant part of my career was spent in the healthcare
                  sector, providing dedicated service in hospitals. Those years
                  allowed me to witness the suffering and needs of people
                  closely, which ignited a deep-seated passion within me to
                  create a lasting positive impact on society.
                </p>

                <p className="text-justify">
                  Merging Professionalism with Compassion — Today, as a
                  businessman and entrepreneur, I aim to bridge strategic
                  business vision with social welfare. I believe that a truly
                  successful entrepreneur is one who can bring about meaningful
                  social change.
                </p>

                <p className="text-justify">
                  Our Objective — As the Executive Director, my primary focus is
                  to ensure that every project in education, healthcare, and
                  social development is executed with absolute transparency and
                  discipline. We strive for long-term improvement in the quality
                  of human life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 3. Success State
  return (
    <section className="font-dm-sans py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:px-2 items-center">
          {/* Left Column: Image */}
          <div className="relative flex justify-center lg:justify-start order-1">
            <div className="relative w-full mx-2 aspect-[4/5] rounded-lg overflow-hidden bg-[#F5F5F5]">
              <Image
                src={
                  coFounder.image_url ||
                  "/images/dashboard/memberApproval/1.jpg"
                }
                alt={`${coFounder.name} - ${coFounder.designation}`}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized={coFounder.image_url?.startsWith("http")}
              />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-5 md:space-y-6 order-2 px-2 md:px-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
              Our Co-Founder
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.2]">
              About Our Co-Founder
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-[15px] md:text-base">
              <p className="font-bold text-gray-900">
                {coFounder.name}
                <span className="font-normal text-gray-500">
                  , Co-Founder, Expro Welfare Foundation.
                </span>
              </p>

              <p className="text-justify">
                A dedicated leader and social advocate, {coFounder.name} has
                been instrumental in shaping the vision and mission of Expro
                Welfare Foundation.
              </p>

              <p className="text-justify">
                Driven by compassion and a commitment to equality, they believe
                in the power of collective action to bring about meaningful
                change.
              </p>

              <p className="text-justify">
                Through their guidance, Expro Welfare Foundation continues to
                foster a culture of empathy and resilience across communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCoFounder;
