import Image from "next/image";
import Hero from "./hero";
import { CheckCircle } from "lucide-react";
import OverviewScheme from "./overview";
import Directors from "./directors";

export default function ProjectScheme() {
  return (
    <>
      <Hero />
      <OverviewScheme />
      <Directors />
    </>
  );
}
