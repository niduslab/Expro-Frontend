import React from 'react';
import Hero from '@/components/public/landing/Hero';
import WhoWeAre from '@/components/public/landing/WhoWeAre';
import WhatWeDo from '@/components/public/landing/WhatWeDo';
import Leadership from '@/components/public/landing/Leadership';
import FocusAreas from '@/components/public/landing/FocusAreas';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <WhoWeAre />
      <WhatWeDo />
      <FocusAreas />
      <Leadership />
    </>
  );
}
