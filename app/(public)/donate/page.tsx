import ComingSoon from "@/components/coming-soon/page";
import Image from "next/image";
import Hero from "./hero";
import Donationform from "./donationForm";

const Donation = () => {
  return (
    <>
      {/* <ComingSoon title="Donate " /> */}

      <Hero />

      <section className="py-16  overflow-hidden">
        <div className="container mx-auto px-6 md:px-10 lg:px-20 xl:px-16 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 xl:gap-10  sm:px-2 lg:px-0 xl:px-4 2xl:px-4 items-start">
            {" "}
            {/* Image */}
            <div className="w-full">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/images/donate/donation-poster.jpeg"
                  alt="Donation Poster"
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 40vw"
                  priority
                />
              </div>
            </div>
            {/* Content */}
            <div>
              <div className="mb-4">
                <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                  Activities You Can Support
                </h3>
                <p className="text-gray-600 text-lg">
                  Your donations directly support the following initiatives that
                  help improve lives and strengthen communities.
                </p>
              </div>

              {/* Card Grid */}
              <div className="grid sm:grid-cols-2 gap-2">
                {[
                  {
                    title: "Orphan and Disability Welfare",
                    text: "Rehabilitation of orphans and persons with disabilities while ensuring their basic rights.",
                  },
                  {
                    title: "Education and Training",
                    text: "Scholarships, education for children with disabilities, vocational training, and self-reliance programs.",
                  },
                  {
                    title: "Street Children Development",
                    text: "Rehabilitation and development initiatives for disadvantaged and street children.",
                  },
                  {
                    title: "Disaster Relief",
                    text: "Food, clothing, medical support, and emergency relief for disaster-affected communities.",
                  },
                  {
                    title: "Healthcare Services",
                    text: "Free medical camps and maternal & child healthcare programs.",
                  },
                  {
                    title: "Social Development",
                    text: "Anti-drug awareness, blood donation programs, and elderly care initiatives.",
                  },
                  {
                    title: "Environmental Protection",
                    text: "Tree plantation and social afforestation programs to protect the environment.",
                  },
                  {
                    title: "Religious Institutions",
                    text: "Renovation and infrastructural support for mosques, temples, and community worship places.",
                  },
                  {
                    title: "Zakat Fund",
                    text: "Distribution of Zakat funds according to Islamic principles for eligible beneficiaries.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-300"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="space-y-8 container mx-auto px-6 md:px-12 lg:px-20 xl:px-20 2xl:px-20">
        {/* Heading */}
        <div>
          <h3 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Why Donate to Us?
          </h3>
          <p className="text-gray-600 mt-2">
            Your contribution creates real change and supports people who need
            it most.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            {
              title: "Transparency",
              text: "Every penny of your donation is spent on clearly defined projects.",
            },
            {
              title: "Direct Impact",
              text: "Your contributions reach marginalized communities directly at their doorstep.",
            },
            {
              title: "Humanitarian Responsibility",
              text: "We empower neglected and oppressed communities to become self-reliant.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 font-bold">
                  ✓
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 p-6 rounded-2xl">
          <p className="text-lg md:text-xl italic text-gray-800 text-center">
            “Your one small step can change a life.”
          </p>
        </div>
      </section>
      <section className="container mx-auto my-6 px-6 md:px-12 lg:px-20 xl:px-20 2xl:px-20">
        <Donationform />
      </section>
    </>
  );
};

export default Donation;
