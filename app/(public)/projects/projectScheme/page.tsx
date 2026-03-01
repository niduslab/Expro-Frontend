import Image from "next/image";
import Hero from "./hero";
import { CheckCircle } from "lucide-react";
import OverviewScheme from "./overview";
import Directors from "./directors";
import CoreFocusArea from "./corefocusarea";
import MissionVision from "./missionvision";

export default function ProjectScheme() {
  return (
    <>
      <Hero />
      <OverviewScheme />
      <Directors />
      <CoreFocusArea />
      <MissionVision />
    </>
  );
}
