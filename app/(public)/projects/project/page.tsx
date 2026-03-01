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

const projects = [
  {
    title: "Agriculture Development",
    description:
      "Supporting sustainable farming practices, providing resources and training for rural farmers.",
    icon: <Sprout className="text-white h-9 w-7" />,
    image: "/images/projects/project/project-one.jpg",
  },
  {
    title: "Health Programs",
    description:
      "Providing accessible healthcare services, medical camps, and health awareness programs to underserved communities.",
    icon: <HeartPulse className="text-white h-9 w-7" />,
    image: "/images/projects/project/project-two.jpg",
  },
  {
    title: "Education Support",
    description:
      "Empowering through knowledge with scholarships, schools, and educational resources for children and adults.",
    icon: <GraduationCap className="text-white h-9 w-7" />,
    image: "/images/projects/project/project-three.jpg",
  },
  {
    title: "Women Entrepreneurship",
    description:
      "Providing resources and mentorship to empower women-led businesses and entrepreneurship.",
    icon: <Users className="text-white h-9 w-7" />,
    image: "/images/projects/project/project-four.jpg",
  },
  {
    title: "Humanity Initiatives",
    description:
      "Disaster relief, humanitarian aid, and support for families in crisis situations.",
    icon: <HandHeart className="text-white h-9 w-7" />,
    image: "/images/projects/project/project-five.jpg",
  },
  {
    title: "Media & Awareness",
    description:
      "Spreading awareness, sharing stories of impact, and promoting transparency through media initiatives.",
    icon: <Tv className="text-white h-9 w-7" />,
    image: "/images/projects/project/project-six.jpg",
  },
];

export default function Project() {
  return (
    <>
      <Hero />
      <div className="text-black flex flex-col items-center bg-gray-50 py-16 px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-[#D8FFEB] rounded-md px-3 py-1 gap-1 mb-4">
            <span className="text-[#36F293] text-2xl leading-none">•</span>
            <span className="text-[#030712] font-medium text-sm">
              Our Projects
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
            Our Impact Areas – “What We Do”
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full">
          {projects.map((project, idx) => (
            <div
              key={idx}
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
                <button className="flex items-center gap-2 text-[#068847] font-semibold">
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
        </div>
      </div>
    </>
  );
}
