import React from 'react';
import ContactHero from '@/components/public/contact/ContactHero';
import ContactFormSection from '@/components/public/contact/ContactFormSection';
import ContactMap from '@/components/public/contact/ContactMap';

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <ContactMap />
    </>
  );
}
