import Image from "next/image";
import Hero from "./hero";
import { CheckCircle } from "lucide-react";
import OverviewScheme from "./overview";
import Directors from "./directors";
import CoreFocusArea from "./corefocusarea";
import MissionVision from "./missionvision";
import KeyObjectives from "./keyobjectives";
import PensionPackage from "./pensionpackage";
import ProjectMembers from "./projectMembers";
import OurFounder from "@/components/public/about/OurFounder";
import OurCoFounder from "@/components/public/about/OurCoFounder";

export default function ProjectScheme() {
  return (
    <>
      <Hero />
      <OverviewScheme />
      {/* <Directors /> */}
      <OurFounder />
      <OurCoFounder />
      <ProjectMembers
        badgeText="Project Members"
        headingText="Project Brand Ambassadors"
      />
      {/* <KeyObjectives />
      <CoreFocusArea />
      <PensionPackage />
      <MissionVision /> */}
    </>
  );
}
