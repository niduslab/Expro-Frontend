'use client';

import React from 'react';
import Image from 'next/image';

const galleryImages = [
  '/images/landing-page/gallery/75078fcca13640498f537bb1ed99fec6fdf3bbff.jpg',
  '/images/landing-page/gallery/29b8f955feee723d75cdfbde39b8f13c16cf3517.jpg',
  '/images/landing-page/gallery/a8e7ad2df1a93ece6fa17575882ece9001a367af.jpg',
  '/images/landing-page/gallery/7c8e0916f9f2764fde3c5c3298b7c1a2e8be3374.jpg',
  '/images/landing-page/gallery/a7b8440868a04a45cc452a7925eb10e54e747be6.jpg',
];

const Gallery = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#E8FAF0] text-[#008A4B] text-sm font-medium rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008A4B] mr-2"></span>
            Our Gallery
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
            Visual Stories of Service
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
          {/* Column 1 - Large Image */}
          <div className="relative w-full h-[300px] md:h-full rounded-2xl overflow-hidden group">
            <Image
              src={galleryImages[0]}
              alt="Gallery Image 1"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6 h-full">
            <div className="relative w-full h-[300px] md:flex-1 rounded-2xl overflow-hidden group">
              <Image
                src={galleryImages[1]}
                alt="Gallery Image 2"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative w-full h-[300px] md:flex-1 rounded-2xl overflow-hidden group">
              <Image
                src={galleryImages[2]}
                alt="Gallery Image 3"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6 h-full">
             <div className="relative w-full h-[300px] md:flex-1 rounded-2xl overflow-hidden group">
              <Image
                src={galleryImages[3]}
                alt="Gallery Image 4"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative w-full h-[300px] md:flex-1 rounded-2xl overflow-hidden group">
              <Image
                src={galleryImages[4]}
                alt="Gallery Image 5"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
