import OurCoFounder from "@/components/public/about/OurCoFounder";
import OurFounder from "@/components/public/about/OurFounder";

export default function Founder() {
  return (
    <>
      <div className="pt-36">
        {/* Header */}
        <div className="text-center flex flex-col items-center gap-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Meet Our Founders
          </h2>
          <p className="text-gray-500 max-w-2xl">
            Get to know the journey, challenges, and purpose that started it
            all.
          </p>
        </div>
        <OurFounder />
        <OurCoFounder />
      </div>
    </>
  );
}
