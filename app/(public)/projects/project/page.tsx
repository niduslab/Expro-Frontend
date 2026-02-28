import {
  ArrowUpRight,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Sprout,
  Tv,
  Users,
} from "lucide-react";
import Hero from "./hero";
import Image from "next/image";

export default function Project() {
  return (
    <>
      <Hero />

      <div className="  text-white flex relative items-center justify-start  w-[1440px] h-[1506px] pt-[120px] pr-16 pb-[120px] pl-16  flex-col gap-6 opacity-100">
        <div className="flex flex-col items-center w-[1312px] h-[1266px] gap-[60px] opacity-100 ">
          <div className=" flex flex-col items-center w-[516px] h-[164px] gap-[60px]">
            <div className="flex flex-col items-center w-[714px] h-[106px] opacity-100 gap-[16px]">
              <div className="flex items-center justify-center h-[32px] w-[129px] bg-[#D8FFEB] rounded-[6px] gap-[4px]">
                <span className="inline-block text-[#36F293] text-[32px] leading-none">
                  •
                </span>

                <span className=" text-[#030712] text-[14px] font-['DM_Sans'] font-medium leading-[150%] tracking-[-0.01em]">
                  Our Projects
                </span>
              </div>
              <p className=" w-[714px] h-[58px] font-['DM_Sans'] whitespace-nowrap text-center font-semibold text-[48px] leading-[120%] tracking-[-0.01em] text-[#030712]">
                Our Impact Areas – “What We Do”
              </p>
            </div>
            <div className="flex w-[1312px] h-[1100px] gap-6 opacity-100">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-black w-[431px] h-[538px] p-6 gap-[10px] border border-[#F3F4F6] shadow-[0_4px_40px_0_#00000014] rounded-[8px]">
                  <div className="w-[373px] h-[490px] flex flex-col justify-between items-start">
                    <div className="w-[373px] h-[230px] flex flex-col gap-[24px]">
                      <div className="w-[64px] h-[64px] flex items-center justify-center rounded-[6px] bg-[#068847]">
                        <Sprout className="text-white h-9 w-7" />
                      </div>
                      <div className="flex flex-col w-[373px] h-[142px] gap-[16px]">
                        <div className=" w-[373px] h-[102px] gap-[16px] flex flex-col">
                          <div className="h-[38px] w-[373px]">
                            <p className="mr-1 text-[#000000] font-['DM_Sans'] font-semibold text-[30px] leading-[120%] tracking-[-0.01em]">
                              Agriculture Development
                            </p>
                          </div>
                          <div className="h-[48px] w-[383px]">
                            <p className="text-[#4A5565] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                              Supporting sustainable farming practices,
                              providing resources and training for rural
                              farmers.
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center w-[113px]  gap-[8px] h-[24px]">
                          <span className="w-[85px] h-[24px]">
                            <p className="opacity-100 whitespace-nowrap font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] text-[#068847]">
                              Learn More
                            </p>
                          </span>
                          <ArrowUpRight className="text-[#068847] h-[20px] w-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <Image
                        src="/images/projects/project/project-one.jpg"
                        alt="project one"
                        height={192}
                        width={373}
                        className="h-[192px] w-[373px] rounded-[4px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-black w-[431px] h-[538px] p-6 gap-[10px] border border-[#F3F4F6] shadow-[0_4px_40px_0_#00000014] rounded-[8px]">
                  <div className="w-[373px] h-[490px] flex flex-col justify-between items-start">
                    <div className="w-[373px] h-[254px] flex flex-col gap-[24px]">
                      <div className="w-[64px] h-[64px] flex items-center justify-center rounded-[6px] bg-[#068847]">
                        <HeartPulse className="text-white h-9 w-7" />
                      </div>
                      <div className="flex flex-col w-[373px] h-[166px] gap-[16px]">
                        <div className=" w-[373px] h-[126px] gap-[16px] flex flex-col">
                          <div className="h-[38px] w-[373px]">
                            <p className="mr-1 text-[#000000] font-['DM_Sans'] font-semibold text-[30px] leading-[120%] tracking-[-0.01em]">
                              Health Programs
                            </p>
                          </div>
                          <div className="h-[48px] w-[383px]">
                            <p className="text-[#4A5565] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                              Providing accessible healthcare services, medical
                              camps, and health awareness programs to
                              underserved communities.
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center w-[113px]  gap-[8px] h-[24px]">
                          <span className="w-[85px] h-[24px]">
                            <p className="opacity-100 whitespace-nowrap font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] text-[#068847]">
                              Learn More
                            </p>
                          </span>
                          <ArrowUpRight className="text-[#068847] h-[20px] w-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <Image
                        src="/images/projects/project/project-two.jpg"
                        alt="project two"
                        height={192}
                        width={373}
                        className="h-[192px] w-[373px] rounded-[4px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-black w-[431px] h-[538px] p-6 gap-[10px] border border-[#F3F4F6] shadow-[0_4px_40px_0_#00000014] rounded-[8px]">
                  <div className="w-[373px] h-[490px] flex flex-col justify-between items-start">
                    <div className="w-[373px] h-[254px] flex flex-col gap-[24px]">
                      <div className="w-[64px] h-[64px] flex items-center justify-center rounded-[6px] bg-[#068847]">
                        <GraduationCap className="text-white h-9 w-7" />
                      </div>
                      <div className="flex flex-col w-[373px] h-[166px] gap-[16px]">
                        <div className=" w-[373px] h-[126px] gap-[16px] flex flex-col">
                          <div className="h-[38px] w-[373px]">
                            <p className="mr-1 text-[#000000] font-['DM_Sans'] font-semibold text-[30px] leading-[120%] tracking-[-0.01em]">
                              Education Support
                            </p>
                          </div>
                          <div className="h-[48px] w-[383px]">
                            <p className="text-[#4A5565] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                              Empowering through knowledge with scholarships,
                              schools, and educational resources for children
                              and adults.
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center w-[113px]  gap-[8px] h-[24px]">
                          <span className="w-[85px] h-[24px]">
                            <p className="opacity-100 whitespace-nowrap font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] text-[#068847]">
                              Learn More
                            </p>
                          </span>
                          <ArrowUpRight className="text-[#068847] h-[20px] w-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <Image
                        src="/images/projects/project/project-three.jpg"
                        alt="project three"
                        height={192}
                        width={373}
                        className="h-[192px] w-[373px] rounded-[4px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-black w-[431px] h-[538px] p-6 gap-[10px] border border-[#F3F4F6] shadow-[0_4px_40px_0_#00000014] rounded-[8px]">
                  <div className="w-[373px] h-[490px] flex flex-col justify-between items-start">
                    <div className="w-[373px] h-[254px] flex flex-col gap-[24px]">
                      <div className="w-[64px] h-[64px] flex items-center justify-center rounded-[6px] bg-[#068847]">
                        <Users className="text-white h-9 w-7" />
                      </div>
                      <div className="flex flex-col w-[373px] h-[166px] gap-[16px]">
                        <div className=" w-[373px] h-[126px] gap-[16px] flex flex-col">
                          <div className="h-[38px] w-[373px]">
                            <p className="mr-1 text-[#000000] font-['DM_Sans'] font-semibold text-[30px] leading-[120%] whitespace-nowrap tracking-[-0.01em]">
                              Women Entrepreneurship
                            </p>
                          </div>
                          <div className="h-[48px] w-[383px]">
                            <p className="text-[#4A5565] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                              Providing accessible healthcare services, medical
                              camps, and health awareness programs to
                              underserved communities.
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center w-[113px]  gap-[8px] h-[24px]">
                          <span className="w-[85px] h-[24px]">
                            <p className="opacity-100 whitespace-nowrap font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] text-[#068847]">
                              Learn More
                            </p>
                          </span>
                          <ArrowUpRight className="text-[#068847] h-[20px] w-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <Image
                        src="/images/projects/project/project-four.jpg"
                        alt="project four"
                        height={192}
                        width={373}
                        className="h-[192px] w-[373px] rounded-[4px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-black w-[431px] h-[538px] p-6 gap-[10px] border border-[#F3F4F6] shadow-[0_4px_40px_0_#00000014] rounded-[8px]">
                  <div className="w-[373px] h-[490px] flex flex-col justify-between items-start">
                    <div className="w-[373px] h-[230px] flex flex-col gap-[24px]">
                      <div className="w-[64px] h-[64px] flex items-center justify-center rounded-[6px] bg-[#068847]">
                        <HandHeart className="text-white h-9 w-7" />
                      </div>
                      <div className="flex flex-col w-[373px] h-[142px] gap-[16px]">
                        <div className=" w-[373px] h-[102px] gap-[16px] flex flex-col">
                          <div className="h-[38px] w-[373px]">
                            <p className="mr-1 text-[#000000] font-['DM_Sans'] font-semibold text-[30px] leading-[120%] tracking-[-0.01em]">
                              Humanity Initiatives
                            </p>
                          </div>
                          <div className="h-[48px] w-[383px]">
                            <p className="text-[#4A5565] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                              Disaster relief, humanitarian aid, and support for
                              families in crisis situations.
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center w-[113px]  gap-[8px] h-[24px]">
                          <span className="w-[85px] h-[24px]">
                            <p className="opacity-100 whitespace-nowrap font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] text-[#068847]">
                              Learn More
                            </p>
                          </span>
                          <ArrowUpRight className="text-[#068847] h-[20px] w-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <Image
                        src="/images/projects/project/project-five.jpg"
                        alt="project five"
                        height={192}
                        width={373}
                        className="h-[192px] w-[373px] rounded-[4px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-black w-[431px] h-[538px] p-6 gap-[10px] border border-[#F3F4F6] shadow-[0_4px_40px_0_#00000014] rounded-[8px]">
                  <div className="w-[373px] h-[490px] flex flex-col justify-between items-start">
                    <div className="w-[373px] h-[254px] flex flex-col gap-[24px]">
                      <div className="w-[64px] h-[64px] flex items-center justify-center rounded-[6px] bg-[#068847]">
                        <Tv className="text-white h-9 w-7" />
                      </div>
                      <div className="flex flex-col w-[373px] h-[166px] gap-[16px]">
                        <div className=" w-[373px] h-[126px] gap-[16px] flex flex-col">
                          <div className="h-[38px] w-[373px]">
                            <p className="mr-1 text-[#000000] font-['DM_Sans'] font-semibold text-[30px] leading-[120%] tracking-[-0.01em]">
                              Media & Awareness
                            </p>
                          </div>
                          <div className="h-[48px] w-[383px]">
                            <p className="text-[#4A5565] font-['DM_Sans'] font-normal text-[16px] leading-[150%] tracking-[-0.01em]">
                              Spreading awareness, sharing stories of impact,
                              and promoting transparency through media
                              initiatives.
                            </p>
                          </div>
                        </div>
                        <button className="flex items-center w-[113px]  gap-[8px] h-[24px]">
                          <span className="w-[85px] h-[24px]">
                            <p className="opacity-100 whitespace-nowrap font-['DM_Sans'] font-semibold text-[16px] leading-[150%] tracking-[-0.01em] text-[#068847]">
                              Learn More
                            </p>
                          </span>
                          <ArrowUpRight className="text-[#068847] h-[20px] w-[20px]" />
                        </button>
                      </div>
                    </div>
                    <div className="">
                      <Image
                        src="/images/projects/project/project-six.jpg"
                        alt="project six"
                        height={192}
                        width={373}
                        className="h-[192px] w-[373px] rounded-[4px]"
                      />
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
