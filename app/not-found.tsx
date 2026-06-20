"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { Header } from "@/components/public/Header";
import Footer from "@/components/public/layout/Footer";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white font-dm-sans">
      <Header />

      <main className="flex flex-grow items-center justify-center px-6 py-12 sm:py-16 md:py-20">
        <section className="relative w-full max-w-2xl text-center mt-20">
          {/* Soft brand glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(6,136,71,0.10)_0%,_rgba(6,136,71,0)_65%)]"
          />

          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#068847] sm:mb-4 sm:text-xs sm:tracking-[0.35em]">
            Error 404 &mdash; Not Found
          </p>

          <h1 className="select-none font-[var(--font-playfair-display)] text-[clamp(6rem,26vw,12rem)] font-bold leading-none tracking-tight">
            <span className="bg-gradient-to-b from-[#068847] to-[#034d28] bg-clip-text pb-2 text-transparent">
              404
            </span>
          </h1>

          <h2 className="mt-4 text-xl font-semibold tracking-tight text-[#030712] sm:mt-6 sm:text-3xl">
            This page could not be found
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#4A5565] px-2">
            The page you were looking for may have been moved, renamed, or no
            longer exists. Let&rsquo;s get you back on track.
          </p>

          {/* Actions */}
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:mt-9 sm:max-w-none sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#068847] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#057a3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#068847] focus-visible:ring-offset-2 sm:w-auto"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#D1D5DC] px-7 py-3 text-sm font-semibold text-[#4A5565] transition-colors hover:border-[#9CA3AF] hover:text-[#030712] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#068847]/40 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>

          {/* Helpful links */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#6A7282]">
            <Link href="/about" className="transition-colors hover:text-[#068847]">
              About Us
            </Link>
            <span className="h-1 w-1 rounded-full bg-[#D1D5DC]" />
            <Link href="/membership" className="transition-colors hover:text-[#068847]">
              Become a Member
            </Link>
            <span className="h-1 w-1 rounded-full bg-[#D1D5DC]" />
            <Link href="/contact" className="transition-colors hover:text-[#068847]">
              Contact Us
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
