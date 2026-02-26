import React from "react";
import Hero from "./hero";
import BlogItems from "./blogitems/blogitems1";
import BlogItem1 from "./blogitems/blogitems1";
import BlogItems2 from "./blogitems/blogitems2";
import BlogItems3 from "./blogitems/blogitems3";
import BlogItems4 from "./blogitems/blogitems4";
import BlogItems5 from "./blogitems/blogitems5";
import BlogItems6 from "./blogitems/blogitems6";
import BlogItems7 from "./blogitems/blogitems7";
import BlogItems9 from "./blogitems/blogitems9";
import BlogItems8 from "./blogitems/blogitems8";

export default function BlogPage() {
  return (
    <>
      <div className="w-[1440px] h-[3717px] bg-white">
        {" "}
        <div className=" h-[590px] w-[1440px]">
          <Hero />
        </div>
        <div className="bg-white flex flex-row w-[1440px] h-[2030px]  pt-[120px] pr-[64px] pb-[120px] pl-[64px] gap-[10px]">
          <div className=" flex flex-col w-[1312px]  items-center h-[1790px] gap-[60px]">
            <div className=" flex flex-col items-center w-[516px] h-[164px] gap-4">
              <div className="flex flex-col items-center w-[516px] h-[164px] opacity-100 gap-[16px]">
                <div className="flex items-center justify-center h-[32px] w-[133px] bg-[#D8FFEB] rounded-[6px] gap-[4px]">
                  <span className="inline-block text-[#36F293] text-[32px] leading-none">
                    •
                  </span>

                  <span className=" text-[#030712] text-[14px] font-['DM_Sans'] font-medium leading-[150%] tracking-[-0.01em]">
                    Blog & Media
                  </span>
                </div>
                <p className=" w-[596px] h-[116px] font-['DM_Sans'] text-center font-semibold text-[48px] leading-[120%] tracking-[-0.01em] text-[#030712]">
                  Take a look at the latest
                  <span className="block">article and blog</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col w-[1312px] h-[1566px] gap-[24px] bg-white">
              <div className="flex  w-[1312px] h-[506px] gap-[24px]">
                <section>
                  <BlogItem1 />
                </section>
                <section>
                  <BlogItems2 />
                </section>
                <section>
                  <BlogItems3 />
                </section>
              </div>
              <div className="flex  w-[1312px] h-[506px] gap-[24px]">
                <section>
                  <BlogItems4 />
                </section>
                <section>
                  <BlogItems5 />
                </section>
                <section>
                  <BlogItems6 />
                </section>
              </div>
              <div className="flex  w-[1312px] h-[506px] gap-[24px]">
                <section>
                  <BlogItems7 />
                </section>
                <section>
                  <BlogItems8 />
                </section>
                <section>
                  <BlogItems9 />
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
