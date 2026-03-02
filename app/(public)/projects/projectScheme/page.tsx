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

export default function ProjectScheme() {
  return (
    <>
      <Hero />
      <OverviewScheme />
      <Directors />
      <ProjectMembers
        badgeText="Project Members"
        headingText="Project Brand Ambassadors"
      />
      <KeyObjectives />
      <CoreFocusArea />
      <PensionPackage />
      <MissionVision />
    </>
  );
}
