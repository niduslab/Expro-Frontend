"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const featuredArticle = {
  title: "Empowering Rural Communities Through Digital Education",
  date: "29 January 2026",
  image:
    "/images/landing-page/news-articles/03bd5239104db81558f6719f369a859738745006.jpg",
  link: "/blog",
};

const articles = [
  {
    title: "Success Stories: Women Entrepreneurs Making a Difference",
    date: "29 January 2026",
    image:
      "/images/landing-page/news-articles/a219485de1d6d9b32269b25fa62578c5deca26a2.jpg",
    link: "/blog",
  },
  {
    title: "Pension Scheme: Securing Your Financial Future",
    date: "29 January 2026",
    image:
      "/images/landing-page/news-articles/e5d0015f1fb74183f7a0e248c7f6ff85af0306cb.jpg",
    link: "/blog",
  },
  {
    title: "Investing 101: Building Wealth with a Strategic Investment Plan",
    date: "29 January 2026",
    image:
      "/images/landing-page/news-articles/f59cd0ed0506a9cd50194461aaecc6eaede4eb1b.jpg",
    link: "/blog",
  },
];

gsap.registerPlugin(ScrollTrigger);

const NewsArticles = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) {
      return;
    }

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

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-32">
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
              Latest News & Articles
            </h2>
          </div>
          <div className="shrink-0">
            <Link href="/blog">
              <Button className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-8">
          <article
            data-news-featured
            className="bg-white rounded-2xl border border-[#EAECF0] shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div className="relative h-70 md:h-90 w-full">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
            </div>
            <div className="p-6 md:p-8">
              <p className="text-sm font-medium text-[#667085] mb-3">
                {featuredArticle.date}
              </p>
              <h3 className="text-2xl md:text-3xl font-semibold text-[#101828] mb-6">
                {featuredArticle.title}
              </h3>
              <Link href={featuredArticle.link}>
                <Button className="inline-block px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
                  Learn More
                </Button>
              </Link>
            </div>
          </article>

          <div data-news-list className="flex flex-col gap-6">
            {articles.map((article, index) => (
              <article
                key={index}
                data-news-card
                className="bg-white rounded-2xl border border-[#EAECF0] p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative w-full sm:w-45 h-35 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 180px"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#667085] mb-2">
                    {article.date}
                  </p>
                  <h4 className="text-lg md:text-xl font-semibold text-[#101828] mb-4">
                    {article.title}
                  </h4>
                  <Link
                    href={article.link}
                    className="inline-flex items-center gap-2 text-[#027A48] text-sm font-semibold hover:text-[#068847] transition-colors"
                  >
                    Learn More
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsArticles;
