"use client";

import Hero from "./hero";
import Image from "next/image";

export default function ProjectDetails() {
  return (
    <>
      <Hero />
      <div className="font-dm-sans flex flex-col items-center bg-gray-50">
        <main className="w-full max-w-7xl px-6 py-16 flex flex-col lg:flex-row gap-12">
          {/* Project Content */}
          <article className="flex-1 flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md">
            <p className="text-gray-500 text-sm">
              Project Duration: Jan 2025 – Dec 2025
            </p>

            <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
              Agriculture Development
            </h1>

            <div className="relative w-full h-96 rounded-md overflow-hidden duration-500 hover:scale-102 hover:transition-transform hover:duration-500">
              <Image
                src="/images/projects/project/project poster.png"
                alt="Project banner"
                fill
                className="object-cover"
              />
            </div>

            <p className="text-gray-700 leading-relaxed text-base">
              The Community Skills Development & Empowerment Program is designed
              to equip individuals with practical, income-generating skills that
              foster independence and long-term sustainability. This initiative
              focuses on vocational training, entrepreneurship development, and
              financial literacy to uplift underserved communities.
            </p>

            {/* Section: Project Overview */}
            <section className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                Project Overview
              </h2>

              <p className="text-gray-700 leading-relaxed text-base">
                This project addresses unemployment and economic instability by
                providing structured training programs and mentorship
                opportunities. Participants gain hands-on experience in
                high-demand skills, along with guidance on starting and managing
                small businesses.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-4">
                Key Objectives:
              </h3>

              <ul className="list-disc list-inside space-y-2 text-gray-800 text-base">
                <li>Provide market-relevant vocational training</li>
                <li>Enhance financial literacy and savings culture</li>
                <li>Support small business startups through mentorship</li>
                <li>Encourage community collaboration and peer learning</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Implementation Strategy
              </h3>

              <p className="text-gray-700 leading-relaxed text-base">
                The program is implemented through partnerships with local
                trainers, community leaders, and financial advisors. Training
                sessions are conducted in phases, combining theoretical
                knowledge with real-world practical applications.
                <br />
                <br />
                Continuous monitoring and evaluation ensure measurable impact
                and sustainable outcomes for participants.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6">
                Expected Impact
              </h3>

              <ul className="list-disc list-inside space-y-2 text-gray-800 text-base">
                <li>Improved employability and income levels</li>
                <li>Increased number of small-scale entrepreneurs</li>
                <li>Strengthened local economic resilience</li>
                <li>Enhanced confidence and leadership among participants</li>
              </ul>
            </section>
          </article>

          {/* Sidebar: Other Projects */}
          <aside className="w-full lg:w-80 flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-900">
              Other Projects
            </h2>

            {[
              {
                title: "Comprehensive Community Health Programs ...",
                date: "2024-2025",
                image: "/images/projects/project/project-two.jpg",
              },
              {
                title: "Educational Support and Development...",
                date: "2024-2025",
                image: "/images/projects/project/project-three.jpg",
              },
              {
                title: "Empowering Women Through Entrepreneurship...",
                date: "2023-2024",
                image: "/images/projects/project/project-four.jpg",
              },
            ].map((project, idx) => (
              <div
                key={idx}
                className="font-dm-sans flex gap-4 items-start border-b border-gray-200 pb-4 last:border-b-0"
              >
                <div className="relative w-28 h-28 flex-shrink-0 rounded-md overflow-hidden ">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-gray-500 text-sm">{project.date}</p>
                  <p className="font-semibold text-gray-900 text-base">
                    {project.title}
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
