"use client";

import Hero from "./hero";
import Image from "next/image";

export default function BlogDetails() {
  return (
    <>
      <Hero />
      <div className="flex flex-col items-center bg-gray-50">
        <main className="w-full max-w-7xl px-6 py-16 flex flex-col lg:flex-row gap-12">
          {/* Blog Content */}
          <article className="flex-1 flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm">Published On: 12 Feb 2026</p>
            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
              Empowering Communities Through Sustainable Welfare
            </h1>

            <div className="relative w-full h-96 rounded-md overflow-hidden">
              <Image
                src="/images/blog-details/poster.jpg"
                alt="Blog poster"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-gray-700 leading-relaxed text-base">
              Sustainable welfare goes beyond short-term assistance—it focuses
              on creating systems that empower individuals and communities to
              become self-reliant, resilient, and future-ready. At Expro Welfare
              Foundation, true development happens when people are equipped with
              the tools, knowledge, and support they need to shape their own
              futures.
            </p>

            {/* Section: Sustainable Welfare */}
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                What Sustainable Welfare Really Means
              </h2>
              <p className="text-gray-700 leading-relaxed text-base">
                Sustainable welfare is about designing solutions that address
                root causes rather than temporary symptoms. Instead of one-time
                support, it focuses on building skills, financial stability, and
                access to opportunities that continue to benefit individuals
                over time.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                At Expro Welfare Foundation, our welfare approach is centered
                on:
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-800 text-base">
                <li>
                  Empowering people through education and skill development
                </li>
                <li>
                  Providing financial security through structured contribution
                  and pension systems
                </li>
                <li>Promoting social inclusion and equal participation</li>
                <li>
                  Strengthening communities through collaboration and shared
                  responsibility
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Empowerment Through Education and Skills
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Education and training are powerful tools for change. By
                offering skill development programs, awareness initiatives, and
                capacity-building opportunities, we help individuals improve
                their livelihoods and confidence. These programs enable people
                to contribute meaningfully to their families, communities, and
                the broader economy.
                <br />
                <br />
                When individuals gain skills and knowledge, they move from
                dependence to self-reliance—creating a ripple effect of positive
                change.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Financial Security as a Foundation for Stability
              </h3>
              <p className="text-gray-700 leading-relaxed text-base">
                Economic uncertainty is one of the biggest challenges facing
                underprivileged communities. Structured financial support and
                pension-based systems play a critical role in ensuring long-term
                stability and dignity.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mt-4">
                Expro Welfare Foundation’s financial initiatives are designed
                to:
              </h4>
              <ul className="list-disc list-inside space-y-2 text-gray-800 text-base">
                <li>Encourage responsible savings and contributions</li>
                <li>Provide long-term pension security</li>
                <li>Support individuals during times of need</li>
                <li>Promote transparency and trust in financial processes</li>
              </ul>
            </section>
          </article>

          {/* Sidebar: Recent Posts */}
          <aside className="w-full lg:w-80 flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recent Posts
            </h2>

            {[
              {
                title: "Why Pension Security Matters for a Stable...",
                date: "March 12, 2026",
                image: "/images/blog-media/blog-item-two.jpg",
              },
              {
                title: "Women Empowerment: Building Stronger...",
                date: "March 12, 2026",
                image: "/images/blog-media/blog-item-three.jpg",
              },
              {
                title: "Technology as a Tool for Social Transformation...",
                date: "March 12, 2026",
                image: "/images/blog-details/poster-one.jpg",
              },
              {
                title: "Education as the Gateway to Opportunity...",
                date: "March 12, 2026",
                image: "/images/blog-media/blog-item-nine.jpg",
              },
            ].map((post, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="relative w-28 h-28 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm">{post.date}</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {post.title}
                  </p>
                </div>
              </div>
            ))}
          </aside>
        </main>
      </div>
    </>
  );
}
