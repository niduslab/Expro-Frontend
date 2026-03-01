"use client";
import Hero from "./hero";
import BlogItem1 from "./blogitems/blogitems1";
import BlogItems2 from "./blogitems/blogitems2";
import BlogItems3 from "./blogitems/blogitems3";
import BlogItems4 from "./blogitems/blogitems4";
import BlogItems5 from "./blogitems/blogitems5";
import BlogItems6 from "./blogitems/blogitems6";
import BlogItems7 from "./blogitems/blogitems7";
import BlogItems8 from "./blogitems/blogitems8";
import BlogItems9 from "./blogitems/blogitems9";

export default function BlogPage() {
  return (
    <>
      <Hero />

      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-16">
          {/* Header */}
          <div className="text-center max-w-2xl space-y-4">
            <div className="inline-flex items-center justify-center px-4 py-1 bg-[#D8FFEB] rounded-md gap-2">
              <span className="text-[#36F293] text-xl leading-none">•</span>
              <span className="text-sm font-medium text-[#030712]">
                Blog & Media
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-[#030712]">
              Take a look at the latest
              <span className="block">article and blog</span>
            </h2>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <BlogItem1 />
            <BlogItems2 />
            <BlogItems3 />
            <BlogItems4 />
            <BlogItems5 />
            <BlogItems6 />
            <BlogItems7 />
            <BlogItems8 />
            <BlogItems9 />
          </div>
        </div>
      </section>
    </>
  );
}
