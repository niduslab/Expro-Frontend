"use client";

import { useBlogs } from "@/lib/hooks/public/useBlogsHook";
import Hero from "./hero";
// import { useRouter } from "next/navigation"; // No longer needed for navigation
import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link
import { ArrowUpRight } from "lucide-react";
import Pagination from "@/components/pagination/page";

export default function BlogPage() {
  // const router = useRouter(); // No longer needed
  const [page, setPage] = useState(1);
  const perPage = 10;

  const { data, isLoading, isError } = useBlogs(page, perPage);

  // Filter published blogs
  const blogs = data?.data?.filter((b: any) => b.status === "published") || [];

  // Calculate total pages for accurate button disabling
  const totalItems = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / perPage);

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#068847]"></div>
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error loading blogs.
      </div>
    );

  return (
    <>
      <Hero />
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <section className="bg-white py-24">
          <div className="mx-auto flex flex-col items-center gap-16">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center px-4 py-1 bg-[#D8FFEB] rounded-md gap-2">
                <span className="text-[#36F293] text-xl leading-none">•</span>
                <span className="font-dm-sans text-sm font-medium text-[#030712]">
                  Blog & Media
                </span>
              </div>

              <h2 className="font-dm-sans text-2xl md:text-3xl xl:text-5xl font-semibold leading-tight text-[#030712]">
                Take a look at the latest
                <span className="block">article and blog</span>
              </h2>
            </div>

            {/* Blog Grid */}
            <div className="font-dm-sans grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {blogs.length > 0 ? (
                blogs.map((blog: any) => (
                  <div
                    key={blog.id || blog.slug}
                    className="w-full rounded-lg border border-gray-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer bg-white group flex flex-col h-full"
                  >
                    {/* Image - Optional: Wrap in Link if you want image click to work too */}
                    <div className="relative w-full h-64 rounded-md overflow-hidden bg-gray-100">
                      <Image
                        src={blog.featured_image || "/fallback.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={blog.featured_image?.startsWith("http")}
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-6 space-y-4 flex-1 flex flex-col">
                      <div className="space-y-3 flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-[#068847] transition-colors">
                          {blog.title}
                        </h3>

                        {/* Excerpt Only - Rendered as HTML */}
                        {blog.excerpt && (
                          <div
                            className="text-gray-600 text-sm leading-relaxed line-clamp-3 [&>p]:mb-0"
                            dangerouslySetInnerHTML={{
                              __html: blog.excerpt,
                            }}
                          />
                        )}
                      </div>

                      {/* Learn More Button with Link */}
                      <div className="pt-2">
                        <Link
                          href={`/blog/blogdetails/${blog.id}`}
                          className="inline-flex items-center gap-2 text-[#068847] font-semibold group-hover:gap-3 transition-all"
                        >
                          <span>Learn More</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-gray-500 py-10">
                  No published blogs found.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center pb-10">
            <Pagination
              page={page}
              perPage={perPage}
              total={totalItems}
              dataLength={blogs.length}
              onNext={handleNext}
              onPrev={handlePrev}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </>
  );
}
