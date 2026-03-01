"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BlogItems5() {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/blog/blogdetails")}
      className="w-full rounded-lg border border-gray-200 p-6 shadow-md hover:shadow-xl transition cursor-pointer bg-white"
    >
      {/* Image */}
      <div className="relative w-full h-64 rounded-md overflow-hidden">
        <Image
          src="/images/blog-media/blog-item-five.jpg"
          alt="Blog Item five image"
          fill
          sizes=""
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="mt-6 space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">
            From Support to Self-Reliance: The Power of Skill Development
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            Empowering through knowledge with scholarships, schools, and
            educational resources...
          </p>
        </div>

        <div className="flex items-center gap-2 text-[#068847] font-semibold">
          <span>Learn More</span>
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
