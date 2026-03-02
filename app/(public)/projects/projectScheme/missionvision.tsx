import { Eye, Target } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="w-full bg-[#F0F4F2] px-4 sm:px-6 lg:px-[64px] py-16 lg:py-[64px] flex flex-col items-center gap-6">
      {/* Tag */}
      <div className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
        Mission and Vision
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-gray-900 leading-tight text-center">
        Mission and Vision
      </h2>

      {/* Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mission */}
        <div className="flex flex-col items-start gap-6 bg-[#F9FAFB] p-6 rounded-lg">
          <div className="flex items-center justify-center h-14 w-14 rounded-md bg-[#068847] shrink-0">
            <Target className="text-white" />
          </div>

          <div className="space-y-3">
            <p className="text-[#030712] font-semibold text-[20px]">
              Our Mission
            </p>
            <p className="text-[#4A5565] text-[15px] sm:text-[16px] leading-relaxed">
              To provide comprehensive financial security through our pension
              scheme, ensuring that every participant receives guaranteed
              lifetime benefits, monthly dividends, and a secure future
              regardless of their employment status or educational background.
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="flex flex-col items-start gap-6 bg-[#F9FAFB] p-6 rounded-lg">
          <div className="flex items-center justify-center h-14 w-14 rounded-md bg-[#068847] shrink-0">
            <Eye className="text-white" />
          </div>

          <div className="space-y-3">
            <p className="text-[#030712] font-semibold text-[20px]">
              Our Vision
            </p>
            <p className="text-[#4A5565] text-[15px] sm:text-[16px] leading-relaxed">
              The mission of this project is to achieve specific government
              policies—such as poverty alleviation, biodiversity conservation,
              expanding access to universal education and healthcare, and
              building a Digital Bangladesh. Through these initiatives, we aim
              to ensure financial stability for the people of Bangladesh and
              transform the nation into a modern, prosperous, and happy society.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
