"use client";

import React from "react";
import Image from "next/image";
import { useGalleryImages } from "@/lib/hooks/public/useGalleriesHook";

type GalleryProps = {
  header2: string;
  galleryId: number; // specify which gallery to display
};

const Gallery: React.FC<GalleryProps> = ({ header2, galleryId }) => {
  const { data: images, isLoading } = useGalleryImages(galleryId);

  return (
    <section className="font-dm-sans py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Header - Always Visible */}
        <div className="text-center pt-10 mb-10 space-y-4">
          <h2 className="font-dm-sans text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            {header2}
          </h2>
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#E8FAF0] text-[#008A4B] text-sm font-medium rounded-full">
            <span className="font-dm-sans w-1.5 h-1.5 rounded-full bg-[#008A4B] mr-2"></span>
            Our Gallery
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-150 animate-pulse">
            {/* Skeleton for Column 1 */}
            <div className="relative w-full h-75 md:h-full rounded-2xl bg-gray-200"></div>

            {/* Skeleton for Column 2 */}
            <div className="flex flex-col gap-6 h-full">
              <div className="relative w-full h-75 md:flex-1 rounded-2xl bg-gray-200"></div>
              <div className="relative w-full h-75 md:flex-1 rounded-2xl bg-gray-200"></div>
            </div>

            {/* Skeleton for Column 3 */}
            <div className="flex flex-col gap-6 h-full">
              <div className="relative w-full h-75 md:flex-1 rounded-2xl bg-gray-200"></div>
              <div className="relative w-full h-75 md:flex-1 rounded-2xl bg-gray-200"></div>
            </div>
          </div>
        ) : !images || images.length === 0 ? (
          // Empty State
          <p className="text-center py-10 text-gray-500">No images found</p>
        ) : (
          // Data Loaded - Render Grid
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-150">
            {/* Column 1 - Large Image */}
            {images[0] && (
              <div className="relative w-full h-75 md:h-full rounded-2xl overflow-hidden group">
                <Image
                  src={images[0].image_path}
                  alt={images[0].title || "Gallery Image 1"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized={images[0].image_path.startsWith("http")}
                />
              </div>
            )}

            {/* Column 2 */}
            <div className="flex flex-col gap-6 h-full">
              {images[1] && (
                <div className="relative w-full h-75 md:flex-1 rounded-2xl overflow-hidden group">
                  <Image
                    src={images[1].image_path}
                    alt={images[1].title || "Gallery Image 2"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={images[1].image_path.startsWith("http")}
                  />
                </div>
              )}
              {images[2] && (
                <div className="relative w-full h-75 md:flex-1 rounded-2xl overflow-hidden group">
                  <Image
                    src={images[2].image_path}
                    alt={images[2].title || "Gallery Image 3"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={images[2].image_path.startsWith("http")}
                  />
                </div>
              )}
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-6 h-full">
              {images[3] && (
                <div className="relative w-full h-75 md:flex-1 rounded-2xl overflow-hidden group">
                  <Image
                    src={images[3].image_path}
                    alt={images[3].title || "Gallery Image 4"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={images[3].image_path.startsWith("http")}
                  />
                </div>
              )}
              {images[4] && (
                <div className="relative w-full h-75 md:flex-1 rounded-2xl overflow-hidden group">
                  <Image
                    src={images[4].image_path}
                    alt={images[4].title || "Gallery Image 5"}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={images[4].image_path.startsWith("http")}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
