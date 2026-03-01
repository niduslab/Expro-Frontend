import Hero from "./hero";

export default function ProjectScheme() {
  return (
    <>
      <Hero />

      <div className="flex h-[758px] bg-red-500 pt-[120px] pb-[120px] gap-[10px]">
        <div className="bg-green-500 h-[758px] pr-[64px] pl-[64px] gap-[10px] w-full">
          <div className="flex flex-col justify-between h-[518px] bg-blue-500"></div>
        </div>
      </div>
    </>
  );
}
