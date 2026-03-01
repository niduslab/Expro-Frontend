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
          <div className="w-[1312px] h-[1573px] flex justify-between opacity-100">
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
              <div className="relative w-full h-[410px] rounded-[8px] overflow-hidden">
                <Image
                  src="/images/blog-details/poster.jpg"
                  alt="Blog poster"
                  fill
                  className="object-cover opacity-100"
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

            <div className="flex flex-col w-[421px] h-[713px] opacity-100 rounded-[8px] bg-white border border-[#E5E7EB] shadow-[0_4px_40px_0_#00000014]">
              <div className="relative top-6 left-6 w-[191px] h-[29px] opacity-100">
                <p className="font-['DM_Sans'] font-semibold text-[24px] leading-[120%] tracking-[-0.01em] text-[#030712]">
                  Recent Posts
                </p>
                <div className="absolute top-[41px] w-[421px] h-0 border left-[-24px] opacity-100"></div>
              </div>
              <div className="relative top-[65px] w-[421px] h-[600px] flex flex-col gap-6 opacity-100 ">
                <div className="w-[421px] flex h-[138px] gap-[24px] px-6  border-b border-b-[#E5E7EB] ">
                  <div className="w-[421px] flex h-[138px] gap-[16px]">
                    <div className=" ">
                      <Image
                        src="/images/blog-media/blog-item-two.jpg"
                        alt="Blog Item two"
                        height={166}
                        width={114}
                        className="h-[114px] w-[168px] opacity-100 rounded-[4px]"
                      />
                    </div>
                    <div className=" h-[114px] w-[200px] p-[4px] my-[2px] flex flex-col gap-[8px]">
                      <div className="w-[191px] h-[24px] ">
                        <p className="font-['DM_Sans'] text-[#4A5565] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                          March 12, 2026
                        </p>
                      </div>
                      <div>
                        <span className="h-[191px] w-[72px]">
                          <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                            Why Pension Security Matters for a Stable...
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[421px] flex h-[138px] gap-[24px] px-6  border-b border-b-[#E5E7EB]">
                  <div className="w-[421px] flex h-[138px] gap-[16px]">
                    <div className=" ">
                      <Image
                        src="/images/blog-media/blog-item-three.jpg"
                        alt="Blog Item three"
                        height={166}
                        width={114}
                        className="h-[114px] w-[168px] opacity-100 rounded-[4px]"
                      />
                    </div>
                    <div className=" h-[114px] w-[200px] p-[4px] my-[2px] flex flex-col gap-[8px]">
                      <div className="w-[191px] h-[24px] ">
                        <p className="font-['DM_Sans'] text-[#4A5565] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                          March 12, 2026
                        </p>
                      </div>
                      <div>
                        <span className="h-[191px] w-[72px]">
                          <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                            Women Empowerment: Building Stronger...
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[421px] flex h-[138px] gap-[24px] px-6  border-b border-b-[#E5E7EB] ">
                  <div className="w-[421px] flex h-[138px] gap-[16px]">
                    <div className=" ">
                      <Image
                        src="/images/blog-details/poster-one.jpg"
                        alt="Blog Poster "
                        height={166}
                        width={114}
                        className="h-[114px] w-[168px] opacity-100 rounded-[4px]"
                      />
                    </div>
                    <div className=" h-[114px] w-[200px] p-[4px] my-[2px] flex flex-col gap-[8px]">
                      <div className="w-[191px] h-[24px] ">
                        <p className="font-['DM_Sans'] text-[#4A5565] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                          March 12, 2026
                        </p>
                      </div>
                      <div>
                        <span className="h-[191px] w-[72px]">
                          <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                            Technology as a Tool for Social Transformation...
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[421px] flex h-[138px] gap-[24px] px-6">
                  <div className="w-[421px] flex h-[138px] gap-[16px]">
                    <div className="">
                      <Image
                        src="/images/blog-media/blog-item-nine.jpg"
                        alt="Blog Item Nine"
                        height={166}
                        width={114}
                        className="h-[114px] w-[168px] opacity-100 rounded-[4px]"
                      />
                    </div>
                    <div className=" h-[114px] w-[200px] p-[4px] my-[2px] flex flex-col gap-[8px]">
                      <div className="w-[191px] h-[24px] ">
                        <p className="font-['DM_Sans'] text-[#4A5565] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                          March 12, 2026
                        </p>
                      </div>
                      <div>
                        <span className="h-[191px] w-[72px]">
                          <p className="font-['DM_Sans'] text-[#030712] font-semibold text-[20px] leading-[120%] tracking-[-0.01em]">
                            Education as the Gateway to Opportunity...
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
