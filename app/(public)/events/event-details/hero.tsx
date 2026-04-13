// hero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEvent } from "@/lib/hooks/public/useEventHooks";

const Hero = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { data: event, isLoading } = useEvent(id);

  return (
    <section className="relative h-[590px] md:h-[600px] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={
            event?.image ||
            "/images/landing-page/events/4054bc10557d09dffea4f8c04b8bc54930895f16.jpg"
          }
          alt={event?.title || "Event banner"}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
          unoptimized={
            !!(
              event?.image?.startsWith("http") || event?.image?.startsWith("/")
            )
          }
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
          <div className="flex items-center space-x-2 text-sm md:text-base font-medium mb-2">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Home
            </Link>
            <span>•</span>
            <Link
              href="/events"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Events
            </Link>
            <span>•</span>
            <span className="text-[#36F293]">Event Details</span>
          </div>

          {/* Title / Skeleton */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 md:h-16 bg-white/20 rounded-lg animate-pulse w-3/4" />
              <div className="h-5 bg-white/10 rounded-lg animate-pulse w-full max-w-xl" />
              <div className="h-5 bg-white/10 rounded-lg animate-pulse w-2/3" />
            </div>
          ) : event ? (
            <>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                {event.title}
              </h1>
              <p className="font-dm-sans text-[16px] md:text-[18px] font-normal leading-[160%] text-gray-200 max-w-xl">
                {event.description}
              </p>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
