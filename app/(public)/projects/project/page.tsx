"use client";

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
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/hooks/public/useProjects";
import Link from "next/link";
import { useState } from "react";
import Pagination from "@/components/pagination/page";

// const projects = [
//   {
//     title: "Agriculture Development",
//     description:
//       "Supporting sustainable farming practices, providing resources and training for rural farmers.",
//     icon: <Sprout className="text-white h-9 w-7" />,
//     image: "/images/projects/project/project-one.jpg",
//   },
//   {
//     title: "Health Programs",
//     description:
//       "Providing accessible healthcare services, medical camps, and health awareness programs to underserved communities.",
//     icon: <HeartPulse className="text-white h-9 w-7" />,
//     image: "/images/projects/project/project-two.jpg",
//   },
//   {
//     title: "Education Support",
//     description:
//       "Empowering through knowledge with scholarships, schools, and educational resources for children and adults.",
//     icon: <GraduationCap className="text-white h-9 w-7" />,
//     image: "/images/projects/project/project-three.jpg",
//   },
//   {
//     title: "Women Entrepreneurship",
//     description:
//       "Providing resources and mentorship to empower women-led businesses and entrepreneurship.",
//     icon: <Users className="text-white h-9 w-7" />,
//     image: "/images/projects/project/project-four.jpg",
//   },
//   {
//     title: "Humanity Initiatives",
//     description:
//       "Disaster relief, humanitarian aid, and support for families in crisis situations.",
//     icon: <HandHeart className="text-white h-9 w-7" />,
//     image: "/images/projects/project/project-five.jpg",
//   },
//   {
//     title: "Media & Awareness",
//     description:
//       "Spreading awareness, sharing stories of impact, and promoting transparency through media initiatives.",
//     icon: <Tv className="text-white h-9 w-7" />,
//     image: "/images/projects/project/project-six.jpg",
//   },
// ];

export default function Project() {
  const [page, setPage] = useState(1); // Initial page is 1
  const perPage = 10; // Items per page

  const { data, isLoading, isError } = useProjects(page, perPage);

  const projects = data?.data ?? [];

  const nextPage = () => {
    if (projects.length === perPage) {
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const router = useRouter();
  return (
    <>
      <Hero />
      <div className="container mx-auto px-6 md:px-12 lg:px-20 ">
        <div className="font-dm-sans text-black flex flex-col items-center bg-gray-50 py-16 ">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center bg-[#D8FFEB] rounded-md px-3 py-1 gap-1 mb-4">
              <span className="text-[#36F293] text-2xl leading-none">•</span>
              <span className="text-[#030712] font-medium text-sm">
                Our Projects
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl xl:text-5xl font-semibold leading-tight">
              Our Impact Areas – “What We Do”
            </h2>
          </div>
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error loading projects.</div>}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 container">
            {projects.map((project, idx) => (
              <div
                key={idx}
                onClick={() => router.push("/projects/project-details")}
                className="bg-white text-black rounded-lg shadow-md border border-gray-200 p-6 flex flex-col justify-between h-[538px]"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-16 h-16 flex items-center justify-center rounded-md bg-[#068847]">
                    {project.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">{project.title}</h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {project.description}
                  </p>
                </div>
                <div className="mt-4">
                  <button className="flex items-center cursor-pointer gap-2 text-[#068847] font-semibold">
                    Learn More <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4">
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={373}
                    height={192} // fixed height
                    className="rounded-md w-full h-[192px] object-cover"
                  />
                </div>
              </div>
            ))}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 xl:gap-16 mb-16 xl:container  ">
            {data?.data ? (
              <>
                {data?.data.map((service: any, index: any) => (
                  <div
                    key={index}
                    data-whatwedo-card
                    className="bg-white rounded-[8px] p-[24px]  shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex flex-col h-[538px] w-full max-w-[421px] mx-auto group"
                  >
                    <div className="mb-6">
                      {/* <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white">
                      <service.icon size={24} strokeWidth={1.5} />
                    </div> */}
                      <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                        {service.title?.charAt(0)}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-green-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed line-clamp-4">
                      {service.description}
                    </p>

                    <Link
                      href={service.title}
                      className="inline-flex items-center text-green-700 font-semibold hover:text-green-800 mb-8 transition-colors group/link"
                    >
                      Learn More
                      <ArrowUpRight
                        size={16}
                        className="ml-1 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"
                      />
                    </Link>

                    <div className="relative h-[192px] w-full rounded-[4px] overflow-hidden mt-auto shrink-0">
                      <Image
                        src={
                          service.featured_image ||
                          "/images/dashboard/memberApproval/1.jpg"
                        }
                        alt={service.title}
                        width={32}
                        height={32}
                        className=" object-cover w-full h-full"
                        unoptimized={service.featured_image?.startsWith("http")}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {" "}
                <div>No projects available.</div>
              </>
            )}
          </div>
          {/* Pagination Controls */}
          <Pagination
            page={page}
            perPage={perPage}
            total={data?.pagination?.total}
            dataLength={projects.length}
            onNext={nextPage}
            onPrev={prevPage}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </div>
    </>
  );
}
