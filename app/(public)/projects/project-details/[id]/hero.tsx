"use client";

import { useProject } from "@/lib/hooks/public/useProjects";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const statusStyles: Record<string, string> = {
  ongoing: "bg-emerald-500/20 border-emerald-400/40 text-emerald-300",
  completed: "bg-blue-500/20 border-blue-400/40 text-blue-300",
  upcoming: "bg-amber-500/20 border-amber-400/40 text-amber-300",
};

const Hero = () => {
  const params = useParams();
  const id = Number(params?.id);
  const { data: project, isLoading, isError } = useProject(id);

  const title = project?.title ?? "Project Details";
  const titleBangla = project?.title_bangla;
  const description =
    project?.short_description ??
    "Investigating how strategic pension initiatives, accountability, and community-centered approaches foster lasting retirement security and social impact.";
  const featuredImage = project?.featured_image ?? "/fallback.jpg";
  const category = project?.category ?? "";
  const status = project?.status ?? "";

  return (
    <section className="relative h-[590px] md:h-[600px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={featuredImage}
          alt={title}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
          unoptimized={featuredImage?.startsWith("http")}
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
              href="/projects"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Projects
            </Link>
            <span>•</span>
            <span className="text-[#36F293]">Project Details</span>
          </div>

          {/* {!isLoading && (category || status) && (
            <div className="flex items-center gap-3 flex-wrap">
              {category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#36F293] tracking-wide uppercase">
                  {category}
                </span>
              )}
              {status && (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full tracking-wide uppercase border ${
                    statusStyles[status] ?? statusStyles["upcoming"]
                  }`}
                >
                  {status}
                </span>
              )}
            </div>
          )} */}
          {/* Title */}
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-10 md:h-14 bg-white/20 rounded-lg animate-pulse w-3/4" />
              <div className="h-6 bg-white/10 rounded-lg animate-pulse w-1/2" />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold leading-tight tracking-tight text-white">
                {title}
              </h1>
              {titleBangla && (
                <p className="mt-1 text-[#36F293]/80 text-lg md:text-xl font-normal">
                  {titleBangla}
                </p>
              )}
            </div>
          )}
          {/* Description */}
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded animate-pulse w-full" />
              <div className="h-4 bg-white/15 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-white/10 rounded animate-pulse w-4/6" />
            </div>
          ) : (
            <div
              className="text-[16px] md:text-[18px] font-normal leading-[160%] text-gray-200 max-w-xl [&>p]:mb-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          {isError && (
            <p className="text-red-400 text-sm">
              Failed to load project details.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
