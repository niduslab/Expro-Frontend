"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useBlogs } from "@/lib/hooks/public/useBlogsHook";

gsap.registerPlugin(ScrollTrigger);

const NewsArticles = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-news-header]", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-news-header]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-news-featured]", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "[data-news-featured]",
          start: "top 85%",
          once: true,
        },
      });

      gsap.from("[data-news-card]", {
        opacity: 0,
        y: 18,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: "[data-news-list]",
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const { data, isLoading, error } = useBlogs(1, 1000);

  // ✅ ONLY published blogs
  const blogs =
    data?.data?.filter((b: any) => b.status === "published").slice(0, 4) || [];

  if (error) return <div>Error: {error.message}</div>;

  return (
    <section ref={sectionRef} className="font-dm-sans py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-20">
        {/* Header */}
        <div
          data-news-header
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
              News & Blogs
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-[#101828]">
              Latest News & Blogs
            </h2>
          </div>

          <Link href="/blog">
            <Button className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg">
              View All Blogs
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center mt-8">
            <div className="spinner" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8">
            {/* ✅ Featured (first published only) */}
            {blogs.length > 0 && (
              <article
                data-news-featured
                className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm hover:shadow-md overflow-hidden"
              >
                <div className="relative h-70 md:h-90 w-full">
                  <Image
                    src={blogs[0].featured_image || "/fallback.jpg"}
                    alt={blogs[0].title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-sm text-[#667085] mb-3">
                    {new Date(blogs[0].published_at).toLocaleDateString()}
                  </p>

                  <h3 className="text-2xl md:text-3xl font-semibold text-[#101828] mb-6">
                    {blogs[0].title}
                  </h3>

                  <Link href={`/blog/${blogs[0].slug}`}>
                    <Button className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </article>
            )}

            {/* ✅ List (rest of published only) */}
            <div data-news-list className="flex flex-col gap-6">
              {blogs.slice(1).map((blog: any, index: number) => (
                <article
                  key={index}
                  data-news-card
                  className="bg-white rounded-2xl border border-[#EAECF0] p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start shadow-sm hover:shadow-md"
                >
                  <div className="relative w-full sm:w-45 h-35 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={blog.featured_image || "/fallback.jpg"}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#667085] mb-2">
                      {new Date(blog.published_at).toLocaleDateString()}
                    </p>

                    <h4 className="text-lg md:text-xl font-semibold text-[#101828] mb-4">
                      {blog.title}
                    </h4>

                    <Link
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center gap-2 text-[#027A48] text-sm font-semibold hover:text-[#068847]"
                    >
                      Learn More
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsArticles;
