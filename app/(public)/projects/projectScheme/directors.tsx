import Image from "next/image";

export default function Directors() {
  return (
    <>
      <div className="h-[795px] px-[60px] pb-[120px]  w-full text-black flex items-center justify-between gap-[10px]">
        <div className="relative w-[640px] h-[675px] bg-[#F3F4F6] rounded-[8px] overflow-hidden">
          <Image
            src="/images/projectScheme/pd.png"
            alt="project director"
            fill
            className="object-cover scale-100"
            priority
          />
        </div>

        <div className="flex flex-col items-start justify-center w-1/2  gap-[24px]">
          <div className="inline-flex items-center w-[138px] gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
            Project Director
          </div>

          <h2 className="text-5xl md:text-5xl lg:text-[48px] font-bold text-gray-900 leading-[1.2]">
            Md. Mofazzal Hossain Manik
          </h2>
          <div className="space-y-4 text-gray-600 font-dm-sans leading-relaxed text-[14px] md:text-[16px] text-justify">
            Expro Welfare Foundation (EWF) has taken a groundbreaking step with
            its Pension Scheme project. Through this initiative, a new horizon
            of financial security has been opened for the middle- and
            lower-income people of Bangladesh.
          </div>
        </div>
      </div>
      <div className="h-[795px] px-[60px] pb-[120px]  w-full text-black flex items-center justify-between gap-[10px]">
        <div className="flex flex-col items-start justify-center w-1/2  gap-[24px]">
          <div className="inline-flex items-center w-[200px] gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]"></span>
            Assistant Project Director
          </div>

          <h2 className="text-5xl md:text-5xl lg:text-[48px] font-bold text-gray-900 leading-[1.2]">
            Mosammat Sumaiya Jannat
          </h2>
          <div className="space-y-4 text-gray-600 font-dm-sans leading-relaxed text-[14px] md:text-[16px] text-justify">
            Through its pension project, Expro Welfare Foundation will play a
            significant role in improving the socio-economic condition of
            ordinary people.
          </div>
        </div>
        <div className="relative w-[640px] h-[675px] bg-[#F3F4F6] rounded-[8px] overflow-hidden">
          <Image
            src="/images/projectScheme/app.png"
            alt="project director"
            fill
            className="object-cover scale-100"
            priority
          />
        </div>
      </div>
    </>
  );
}
