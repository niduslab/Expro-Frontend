"use client";

import Image from "next/image";
import { Fragment } from "react";

import { Gallery } from "@/lib/types/galleryType";
import { useGalleriespublic } from "@/lib/hooks/public/useGalleriesHook";

const GallerySection = ({ gallery }: { gallery: Gallery }) => {
  const images = gallery.images ?? [];

  return (
    <section className="mb-16">
      {/* Meta */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {gallery.title}
          </h2>

          {/* Description - Rendered as HTML */}
          {gallery.description && (
            <div
              className="text-sm text-gray-500 mt-1 max-w-prose 
      [&>h1]:text-sm [&>h1]:font-semibold [&>h1]:mb-1
      [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-1
      [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:mb-1
      [&>p]:mb-1"
              dangerouslySetInnerHTML={{ __html: gallery.description }}
            />
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {gallery.is_featured && (
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800">
              Featured
            </span>
          )}
          <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
            {gallery.images_count} photos
          </span>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-video overflow-hidden rounded-xl bg-gray-100"
          >
            <Image
              src={img.image_path}
              alt={img.title ?? `Image ${img.id}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  );
};

const Galleries = () => {
  const { data: galleriesData, isLoading, isError } = useGalleriespublic();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-gray-400 text-sm">Loading galleries...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-red-500 text-sm">Failed to load galleries.</p>
      </div>
    );
  }

  const galleries = galleriesData?.data ?? [];

  return (
    <main className="font-dm-sans bg-[#F2F4F7] min-h-screen">
      {/* Page Header — matches Events page hero style */}
      <div className="flex flex-col items-center justify-center pt-40 pb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-2 text-sm font-medium text-[#027A48]">
          <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          Gallery
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
          Moments That Define Our Community
        </h1>
      </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-6 md:px-12 lg:px-20 xl:px-20 pb-20">
        {galleries.length === 0 && (
          <p className="text-center text-gray-400 py-20">No galleries found.</p>
        )}

        {galleries.map((gallery, i) => (
          <Fragment key={gallery.id}>
            <GallerySection gallery={gallery} />
            {i < galleries.length - 1 && (
              <hr className="border-t border-gray-200 mb-16" />
            )}
          </Fragment>
        ))}
      </div>
    </main>
  );
};

export default Galleries;
