// hero.tsx
"use client";

import { useBlog } from "@/lib/hooks/public/useBlogsHook";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const Hero = () => {
  const params = useParams();
  const id = String(params?.id);
  const { data: blog, isLoading } = useBlog(id);

  return (
    <section className="relative h-[590px] md:h-[600px] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={blog?.featured_image || "/fallback.jpg"}
          alt={blog?.title || "Blog banner"}
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center top" }}
          priority
          unoptimized={
            !!(
              blog?.featured_image?.startsWith("http") ||
              blog?.featured_image?.startsWith("/")
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
      <div className="relative z-10 container mx-auto pt-[50px] md:pt-0 px-6 md:px-12 lg:px-20 flex flex-col justify-center h-full">
        <div className="max-w-2xl text-white space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm md:text-base font-medium mb-2">
            <Link
              href="/"
              className="font-dm-sans text-white hover:text-gray-200 transition-colors"
            >
              Home
            </Link>
            <span className="text-white">•</span>
            <Link
              href="/blogs"
              className="font-dm-sans text-white hover:text-gray-200 transition-colors"
            >
              Blogs
            </Link>
            <span className="text-white">•</span>
            <span className="text-[#36F293]">Blog Details</span>
          </div>

          {/* Title / Skeleton */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-12 md:h-16 bg-white/20 rounded-lg animate-pulse w-3/4" />
              <div className="h-5 bg-white/10 rounded-lg animate-pulse w-full max-w-xl" />
              <div className="h-5 bg-white/10 rounded-lg animate-pulse w-2/3" />
            </div>
          ) : blog ? (
            <>
              {/* Category Badge */}
              {blog.category?.name && (
                <span className="inline-flex items-center gap-1.5 bg-[#ECFDF3]/20 border border-[#36F293]/30 text-[#36F293] text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                  {blog.category.name}
                </span>
              )}
              <h1 className="font-dm-sans text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                {blog.title}
              </h1>
              {blog.excerpt && (
                <p className="font-dm-sans text-[16px] md:text-[18px] font-normal leading-[160%] text-gray-200 max-w-xl">
                  {blog.excerpt}
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Hero;
