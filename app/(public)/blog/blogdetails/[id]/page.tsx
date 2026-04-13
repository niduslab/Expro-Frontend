// page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBlog, useBlogs } from "@/lib/hooks/public/useBlogsHook";
import Hero from "../hero";
import { Calendar, Eye, Tag, User } from "lucide-react";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const parseTags = (tags: any): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
};

export default function BlogDetails() {
  const params = useParams();
  const id = String(params?.id);

  const { data: blog, isLoading, isError } = useBlog(id);
  const { data: blogsData } = useBlogs(1, 5);

  const recentPosts =
    blogsData?.data.filter((b) => b.slug !== id).slice(0, 4) ?? [];
  const tags = parseTags(blog?.tags);

  return (
    <>
      <Hero />

      <div className="font-dm-sans container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center bg-gray-50">
          <main className="py-16 flex flex-col lg:flex-row gap-12 w-full">
            {/* Blog Content */}
            <article className="flex-1 flex flex-col gap-8 bg-white p-8 rounded-lg shadow-md">
              {/* Loading Skeleton */}
              {isLoading && (
                <div className="animate-pulse space-y-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="w-full h-96 bg-gray-200 rounded-md" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-full" />
                    <div className="h-4 bg-gray-100 rounded w-5/6" />
                    <div className="h-4 bg-gray-100 rounded w-4/6" />
                  </div>
                </div>
              )}

              {/* Error */}
              {isError && (
                <p className="text-red-500 text-center py-10">
                  Failed to load blog post. Please try again.
                </p>
              )}

              {blog && (
                <>
                  {/* Meta Row */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[#008A4B]" />
                      {formatDate(blog.published_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye size={14} className="text-[#008A4B]" />
                      {blog.view_count.toLocaleString()} views
                    </span>
                    {blog.category?.name && (
                      <span className="inline-flex items-center gap-1.5 bg-[#ECFDF3] text-[#027A48] text-xs font-medium px-2.5 py-1 rounded-full capitalize">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
                        {blog.category.name}
                      </span>
                    )}
                    {blog.is_featured && (
                      <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                    {blog.title}
                  </h1>

                  {/* Featured Image */}
                  {blog.featured_image && (
                    <div className="relative w-full h-96 rounded-md overflow-hidden">
                      <Image
                        src={blog.featured_image || "/fallback.jpg"}
                        alt={blog.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                        unoptimized={blog.featured_image.startsWith("http")}
                      />
                    </div>
                  )}

                  {/* Excerpt */}
                  {blog.excerpt && (
                    <p className="text-gray-600 leading-relaxed text-base italic border-l-4 border-[#008A4B] pl-4 bg-[#F9FAFB] py-3 rounded-r-md">
                      {blog.excerpt}
                    </p>
                  )}

                  {/* Content — rendered as HTML */}
                  <div
                    className="prose prose-gray max-w-none text-gray-700 leading-relaxed
                      prose-headings:font-semibold prose-headings:text-gray-900
                      prose-a:text-[#008A4B] prose-a:no-underline hover:prose-a:underline
                      prose-li:marker:text-[#008A4B]"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />

                  <div className="h-px bg-gray-100" />

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag size={15} className="text-gray-400" />
                      {tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author — only non-sensitive info */}
                  {blog.author && (
                    <div className="flex items-center gap-3 bg-[#F9FAFB] border border-gray-100 rounded-xl px-5 py-4">
                      <div className="w-10 h-10 rounded-full bg-[#008A4B]/10 flex items-center justify-center shrink-0">
                        <User size={18} className="text-[#008A4B]" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                          Written by
                        </p>
                        <p className="text-sm font-semibold text-gray-800">
                          {blog.author.member?.name_english ?? "Expro Team"}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex flex-col gap-6 bg-white p-6 rounded-lg shadow-md h-fit">
              <h2 className="text-2xl font-semibold text-gray-900">
                Recent Posts
              </h2>

              {recentPosts.length === 0 && !isLoading ? (
                <p className="text-gray-400 text-sm">No recent posts.</p>
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/blogdetails/${post.id}`}
                    className="flex gap-4 items-start border-b border-gray-200 pb-4 last:border-b-0 hover:opacity-80 transition-opacity"
                  >
                    <div className="relative w-28 h-28 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={post.featured_image || "/fallback.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized={post.featured_image?.startsWith("http")}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 pt-1">
                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(post.published_at)}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-3">
                        {post.title}
                      </p>
                      {post.category?.name && (
                        <span className="text-xs text-[#008A4B] font-medium">
                          {post.category.name}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </aside>
          </main>
        </div>
      </div>
    </>
  );
}
