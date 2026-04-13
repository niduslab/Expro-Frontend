"use client";

import { useExproMember } from "@/lib/hooks/public/useExpromembers";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const Hero = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { data: member, isLoading, isError } = useExproMember(id);

  return (
    <section className="relative h-[590px] md:h-[600px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={"/images/projects/project/project poster.png"}
          alt={member?.name ? `${member.name} image` : "Member image"}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(80deg, #00341C 0%, #002C18 20%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-black/40 md:hidden" />
      </div>

      {/* Content */}
      <div className="font-dm-sans relative z-10 container mx-auto pt-[50px] md:pt-0 px-6 md:px-12 lg:px-20 flex flex-col justify-center h-full">
        <div className="max-w-2xl text-white space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm md:text-base font-medium">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Home
            </Link>
            <span>•</span>
            <Link
              href="/projects/projectScheme/expromembers"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Expro Members
            </Link>
            <span>•</span>
            <span className="text-[#36F293]">Member Details</span>
          </div>

          {/* Title / Skeleton */}
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-10 md:h-14 bg-white/20 rounded-lg animate-pulse w-3/4" />
              <div className="h-6 bg-white/10 rounded-lg animate-pulse w-1/2" />
            </div>
          ) : isError ? (
            <p className="text-red-400 text-sm">
              Failed to load member details.
            </p>
          ) : member ? (
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {member.name}
              </h1>
              {member.designation && (
                <p className="text-xs md:text-xl text-[#36F293] font-medium">
                  {member.designation}
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
