import ComingSoon from "@/components/coming-soon/page";
import Image from "next/image";

const Donation = () => {
  return (
    <>
      <ComingSoon title="Donate " />
      {/* <div className="">
        <section className="py-10 md:py-14 bg-white overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="relative flex justify-center lg:justify-start ">
                <div className="relative w-full max-w-161 h-125 md:h-150 lg:h-168.75 rounded-2xl overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src="/images/donate/donation-poster.jpeg"
                    alt="Co-Founder"
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 100vw, rounded-2xl 50vw"
                  />
                </div>
              </div>

              <section className="flex flex-col gap-10 ">
                <div className="space-y-6 pt-20">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
                    Donate Now
                  </div>

                  <h2 className=" text-2xl md:text-3xl font-dm-sans text-gray-600 leading-[1.2]">
                    In service of humanity <br />
                    <span className="font-dm-sans relative top-2 font-bold text-gray-900 text-3xl md:text-4xl">
                      “Project Humanity” — Your Donation, A Smiling Face
                    </span>
                  </h2>

                  <div>
                    <p className="font-dm-sans text-lg mb-1 text-gray-700 leading-relaxed max-w-3xl">
                      “Humans are for humanity; life is for one another.”
                    </p>
                    <p className="font-dm-sans text-gray-700 leading-relaxed max-w-3xl">
                      <span className=" text-gray-900">Project Humanity</span>{" "}
                      is a charitable initiative of the Xpro Welfare Foundation.
                      We believe that your small contribution can bring
                      significant change to the lives of neglected and helpless
                      people in society. Join our humanitarian journey today by
                      donating according to your capacity.
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200" />

                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl  text-gray-900 tracking-tight">
                    Activities You Can Support
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    Your donations are directly allocated to the following
                    sectors:
                  </p>

                  <ul className="list-disc list-outside pl-6 space-y-4 text-gray-800 text-base leading-relaxed">
                    <li>
                      <span className="font-bold text-gray-900">
                        Orphan and Disability Welfare:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        Rehabilitation of orphans and persons with disabilities
                        while ensuring their basic rights.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Education and Training:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        Scholarships, education for children with disabilities,
                        vocational training, and special care to help them
                        become self-reliant.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Street and Underprivileged Children Development:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        Rehabilitation and overall development initiatives for
                        disadvantaged and street children.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Disaster Relief:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        Distribution of food, clothing, medical care, and
                        essential relief among people affected by natural
                        disasters.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Healthcare Services:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        {" "}
                        Free medical camps and programs to protect maternal and
                        child health.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Social Development:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        {" "}
                        Anti-drug awareness, old-age home establishment, and
                        blood donation programs.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Environmental Protection:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        {" "}
                        Social afforestation and tree plantation programs to
                        preserve environmental balance.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Development of Religious Institutions:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        Renovation and infrastructural support for mosques,
                        temples, and other community places of worship.
                      </span>
                    </li>

                    <li>
                      <span className="font-bold text-gray-900">
                        Zakat Fund:
                      </span>{" "}
                      <span className="text-[15px] text-gray-600">
                        {" "}
                        Distribution of collected Zakat funds according to
                        Islamic principles for rightful beneficiaries.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-t border-gray-200" />

                <div className="space-y-2">
                  <h3 className="text-2xl md:text-3xl  text-gray-900 tracking-tight">
                    Why Donate to Us?
                  </h3>

                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <ul className="list-disc list-outside pl-6 space-y-3 text-gray-800 leading-relaxed">
                      <li>
                        <span className=" text-gray-900">Transparency:</span>{" "}
                        Every penny of your donation is spent on clearly defined
                        projects.
                      </li>

                      <li>
                        <span className=" text-gray-900">Direct Impact:</span>{" "}
                        Contributions reach marginalized communities directly at
                        their doorstep.
                      </li>

                      <li>
                        <span className=" text-gray-900">
                          Humanitarian Responsibility:
                        </span>{" "}
                        Empowering neglected and oppressed communities to become
                        self-reliant.
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <p className="text-xl  text-gray-900 italic">
                    “Your one small step can change a life.”
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div> */}
    </>
  );
};

export default Donation;
