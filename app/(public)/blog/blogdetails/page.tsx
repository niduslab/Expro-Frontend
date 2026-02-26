import Image from "next/image";
import Hero from "./hero";

export default function BlogDetails() {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="w-full">
          <Hero />
        </div>{" "}
        <div className="relative  flex w-[1440px] h-[1813px] pt-[120px] pr-16 pb-[120px] pl-16 gap-2.5">
          <div className="w-[1312px]  bg-green-500 h-[1573px] flex justify-between opacity-100">
            <div className="flex flex-col bg-white text-[#030712] w-[867px] h-[1573px] gap-6 opacity-100">
              <div className="w-[867px] h-[24px]">
                <p className="font-['DM_Sans'] text-[#4A5565] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                  Published On: 12 Feb 2026
                </p>
              </div>
              <div className="w-[867px] h-[116px]">
                <p className="font-['DM_Sans'] font-semibold text-[48px] leading-[120%] tracking-[-0.01em]">
                  Empowering Communities Through Sustainable Welfare
                </p>
              </div>
              <div className="">
                <Image
                  src="/images/blog-details/poster.jpg"
                  alt="Blog Hero Background"
                  width={867}
                  height={410}
                  className=" opacity-100 rounded-[8px]"
                />
              </div>
              <div className="w-[867px] h-[96px]">
                <p className="font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                  Sustainable welfare goes beyond short-term assistance—it
                  focuses on creating systems that empower individuals and
                  communities to become self-reliant, resilient, and
                  future-ready. At Expro Welfare Foundation, we believe that
                  true development happens when people are equipped with the
                  tools, knowledge, and support they need to shape their own
                  futures.
                </p>
              </div>
              <div className="w-[867px] h-[117px] flex flex-col gap-[16px]">
                <span className="font-['DM_Sans'] w-[867px] h-[29px] font-semibold text-[24px] leading-[120%] tracking-[-0.01em]">
                  What Sustainable Welfare Really Means
                </span>
                <span className="w-[867px] h-[72px] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                  Sustainable welfare is about designing solutions that address
                  root causes rather than temporary symptoms. Instead of
                  one-time support, it focuses on building skills, financial
                  stability, and access to opportunities that continue to
                  benefit individuals over time.
                </span>
              </div>
              <div className="w-[867px] h-[172px] flex flex-col gap-[16px] items-start">
                <span className="w-[867px] h-[24px] font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em]">
                  At Expro Welfare Foundation, our welfare approach is centered
                  on:
                </span>
                <div className=" w-[867px] h-[132px] gap-[12px] ">
                  <li className="w-[867px] h-[24px] relative left-[24px]">
                    <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                      Empowering people through education and skill development
                    </p>
                  </li>
                  <li className="w-[867px] h-[24px] relative left-[24px]">
                    <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                      Providing financial security through structured
                      contribution and pension systems
                    </p>
                  </li>
                  <li className="w-[867px] h-[24px] relative left-[24px]">
                    <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                      Promoting social inclusion and equal participation
                    </p>
                  </li>
                  <li className="w-[867px] h-[24px] relative left-[24px]">
                    <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                      Strengthening communities through collaboration and shared
                      responsibility
                    </p>
                  </li>
                </div>
                <div className="w-[867px] h-[189px] flex flex-col gap-[16px]">
                  <span className="font-['DM_Sans'] w-[867px] h-[29px] font-semibold text-[24px] leading-[120%] tracking-[-0.01em]">
                    Empowerment Through Education and Skills
                  </span>
                  <span className="w-[867px] h-[144px] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                    Education and training are powerful tools for change. By
                    offering skill development programs, awareness initiatives,
                    and capacity-building opportunities, we help individuals
                    improve their livelihoods and confidence. These programs
                    enable people to contribute meaningfully to their families,
                    communities, and the broader economy.
                    <br />
                    <br />
                    When individuals gain skills and knowledge, they move from
                    dependence to self-reliance—creating a ripple effect of
                    positive change.
                  </span>
                </div>
                <div className="w-[867px] h-[93px] flex flex-col gap-[16px]">
                  <span className="font-['DM_Sans'] w-[867px] h-[29px] font-semibold text-[24px] leading-[120%] tracking-[-0.01em]">
                    Financial Security as a Foundation for Stability
                  </span>
                  <span className="w-[867px] h-[48px] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                    Economic uncertainty is one of the biggest challenges facing
                    underprivileged communities. Structured financial support
                    and pension-based systems play a critical role in ensuring
                    long-term stability and dignity.
                  </span>
                </div>
                <div>
                  <span className="w-[867px] h-[24px] font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em]">
                    Expro Welfare Foundation’s financial initiatives are
                    designed to:
                  </span>
                  <div className=" w-[867px] h-[132px] gap-[12px] ">
                    <li className="w-[867px] h-[24px] relative left-[24px]">
                      <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                        Encourage responsible savings and contributions
                      </p>
                    </li>
                    <li className="w-[867px] h-[24px] relative left-[24px]">
                      <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                        Provide long-term pension security
                      </p>
                    </li>
                    <li className="w-[867px] h-[24px] relative left-[24px]">
                      <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                        Support individuals during times of need
                      </p>
                    </li>
                    <li className="w-[867px] h-[24px] relative left-[24px]">
                      <p className="font-['DM_Sans'] font-normal text-[#0F2C24] text-[16px] leading-[150%] tracking-[-0.01em]">
                        Promote transparency and trust in financial processes
                      </p>
                    </li>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[421px] h-[713px] opacity-100 rounded-[8px] bg-white border border-[#E5E7EB] shadow-[0_4px_40px_0_#00000014]"></div>
          </div>
        </div>
      </div>
    </>
  );
}
