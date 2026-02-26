import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PageHeroProps {
  title: string;
  description: string;
  bgImage: string;
  pageName: string; // Used for breadcrumb and alt text
  height?: string; // CSS class for height, e.g., "h-[600px]"
  objectPosition?: string; // CSS object-position value
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  description,
  bgImage,
  pageName,
  height = "h-[590px] md:h-[600px]",
  objectPosition = "center"
}) => {
  return (
    <section className={`relative ${height} flex items-center overflow-hidden`}>
      {/* Background Layer with Image and Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={`${pageName} Hero Background`}
          fill
          style={{ objectFit: 'cover', objectPosition: "center" }}
          priority
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay - Matching Landing Page Style */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(80deg, #00341C 0%, #002C18 20%, transparent 70%)'
          }}
        />
        {/* Mobile Overlay for readability */}
        <div className="absolute inset-0 bg-black/30 md:hidden" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center h-full">
        <div className="max-w-2xl text-white space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm md:text-base font-medium mb-2">
            <Link href="/" className="text-white hover:text-gray-200 transition-colors">
              Home
            </Link>
            <span className="text-white">•</span>
            <span className="text-[#36F293]">{pageName}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            {title}
          </h1>
          
          <p className="font-dm-sans text-[16px] md:text-[18px] font-normal leading-[160%] text-gray-200 max-w-xl">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
