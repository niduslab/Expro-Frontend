import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background Layer with Image and Gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landing-page/hero/Hero Section.png"
          alt="Hero Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center right' }}
          priority
          className="ml-auto w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(80deg, #00341C 0%, #002C18 20%, transparent 70%)'
          }}
        />
        {/* Mobile Gradient Overlay for better text readability on small screens */}
        {/* <div className="absolute inset-0 bg-black/40 md:hidden" /> */}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 h-full flex flex-col justify-center">
        <div className="max-w-2xl text-white space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Empowering Lives <br />
            <span className="font-serif italic text-[#36F293]">Building</span> Brighter <br />
            Futures
          </h1>
          
          <p className="font-dm-sans text-[16px] font-normal not-italic leading-[150%] tracking-[-0.16px] text-gray-200 max-w-lg">
            Expro Welfare Foundation is a people-first organization dedicated to
            sustainable welfare, pension security, and community-driven
            development. Join hands with us to build a future of dignity,
            opportunity, and collective growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/membership" 
              className="inline-flex items-center justify-center bg-[#36F293] hover:bg-[#2ed682] text-[#00341C] font-bold py-3.5 px-8 rounded-md transition-colors duration-300"
            >
              Become a Member
            </Link>
            <Link 
              href="/programs" 
              className="inline-flex items-center justify-center bg-transparent border border-white hover:bg-white/10 text-white font-medium py-3.5 px-8 rounded-md transition-colors duration-300"
            >
              Explore Our Programs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
