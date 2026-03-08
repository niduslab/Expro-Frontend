import Image from "next/image";

const OurCoFounder = () => {
  return (
    <section className="font-dm-sans py-12 md:py-16 lg:py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:px-2 items-center">
          {/* Left Column: Image */}
          <div className="relative flex justify-center lg:justify-start order-1">
            <div className="relative w-full mx-2 aspect-[4/5] rounded-lg overflow-hidden bg-[#F5F5F5]">
              <Image
                src="/images/about/our-co-founder.png"
                alt="Co-Founder"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-5 md:space-y-6 order-2 px-2 md:px-2">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
              Our Co-Founder
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px]  font-bold text-gray-900 leading-[1.2]">
              About Our Co-Founder
            </h2>

            {/* Content */}
            <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-[15px] md:text-base">
              <p className="font-bold text-gray-900">
                Md. Hashan Sofiul Kabir
                <span className="font-normal text-gray-500">
                  , Co-Founder, Expro Welfare Foundation.
                </span>
              </p>

              <p className="text-justify">
                A dedicated leader and social advocate, our Co-Founder has been
                instrumental in shaping the vision and mission of Expro Welfare
                Foundation. With a strong background in community development
                and social service, they have worked tirelessly to implement
                sustainable solutions for the underprivileged.
              </p>

              <p className="text-justify">
                Driven by compassion and a commitment to equality, they believe
                in the power of collective action to bring about meaningful
                change. Their leadership has been pivotal in expanding the
                foundation's reach and impact across various sectors including
                education, healthcare, and economic empowerment.
              </p>

              <p className="text-justify">
                Through their guidance, Expro Welfare Foundation continues to
                foster a culture of empathy and resilience, ensuring that every
                initiative contributes to the long-term well-being of the
                communities we serve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurCoFounder;
