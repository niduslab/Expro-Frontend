"use client";
import { useBlogs } from "@/lib/hooks/public/useBlogsHook";
import Hero from "./hero";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Pagination from "@/components/pagination/page";

export default function BlogPage() {
  const [page, setPage] = useState(1); // Initial page is 1
  const perPage = 10; // Items per page

  const { data, isLoading, isError } = useBlogs(page, perPage);

  const projects =
    data?.data?.filter((b: any) => b.status === "published") || [];

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
        <section className="bg-white py-24 ">
          <div className=" mx-auto flex flex-col items-center gap-16">
            {/* Header */}
            <div className="text-center  space-y-4">
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

            {isLoading && <div>Loading...</div>}
            {isError && <div>Error loading projects.</div>}

            {/* Blog Grid */}
            <div
              className="font-dm-sans grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 "
              onClick={() => router.push("/blog/blogdetails")}
            >
              {data && (
                <>
                  {projects.map((blog: any, index: any) => (
                    <div
                      key={index}
                      className="w-full rounded-lg border border-gray-200 p-6 shadow-md hover:shadow-xl transition cursor-pointer bg-white"
                    >
                      {/* Image */}
                      <div className="relative w-full h-64 rounded-md overflow-hidden">
                        <Image
                          src={blog.featured_image || "/fallback.jpg"}
                          alt="Blog Item image"
                          fill
                          sizes=""
                          className="object-cover"
                          priority
                          unoptimized={blog.featured_image?.startsWith("http")}
                        />
                      </div>

                      {/* Content */}
                      <div className="mt-6 space-y-4">
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                            {blog.title}
                          </h3>

                          <p className="text-gray-600 text-sm leading-relaxed">
                            {blog.content}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[#068847] font-semibold">
                          <span>Learn More</span>
                          <ArrowUpRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
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
        </section>
      </div>
    </>
  );
}
