import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const AboutHero = () => {
  return (
    <section className="relative h-[700px] flex items-center overflow-hidden">
      {/* Background Layer with Image and Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about/about-hero-img.jpg"
          alt="About Us Hero Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(80deg, #00341C 0%, #002C18 20%, transparent 70%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center">
        <div className="max-w-2xl text-white space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm md:text-base font-medium mb-2">
            <Link href="/" className="text-white hover:text-gray-200 transition-colors">
              Home
            </Link>
            <span className="text-white">•</span>
            <span className="text-[#36F293]">About Us</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
            About Us
          </h1>
          
          <p className="font-dm-sans text-[16px] md:text-[18px] font-normal leading-[160%] text-gray-200 max-w-xl">
            Expro Welfare Foundation (EWF) empowers underprivileged and
            vulnerable communities through training, financial support, and
            sustainable development initiatives to create lasting positive change.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
