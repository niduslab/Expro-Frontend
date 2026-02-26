import React from 'react';
import PageHero from '@/components/ui/PageHero';
import MembershipForm from '@/components/public/membership/MembershipForm';

export default function BecomeMemberPage() {
  return (
    <>
      <PageHero 
        title="Become a Member"
        description="Welcome to the Blog & Media hub of Expro Welfare Foundation, where we share stories of impact, community initiatives, events, and important updates."
        bgImage="/images/brcomer-a-member/becomer-member-hero-section-image.jpg"
        pageName="Become a Member"
        objectPosition="top"
      />
      <MembershipForm />
    </>
  );
}
