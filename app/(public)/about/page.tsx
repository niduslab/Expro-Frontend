import AboutHero from '@/components/public/about/AboutHero';
import CorePurpose from '@/components/public/about/CorePurpose';
import CoreValues from '@/components/public/about/CoreValues';
import OurCoFounder from '@/components/public/about/OurCoFounder';
import OurFounder from '@/components/public/about/OurFounder';
import OurStory from '@/components/public/about/OurStory';
import WhatWeDo from '@/components/public/about/WhatWeDo';
import React from 'react';

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <OurStory />
      <OurFounder />
      <OurCoFounder />
      <CorePurpose />
      <CoreValues />
      <WhatWeDo />

      <div className="container mx-auto px-4 py-8">
        {/* Other About page content will go here */}
      </div>
    </main>
  );
}
