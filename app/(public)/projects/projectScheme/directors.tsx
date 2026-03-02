import Image from "next/image";

export default function Directors() {
  return (
    <>
      {/* Director 1 */}
      <section className="w-full px-4 sm:px-6 lg:px-[60px] pb-16 lg:pb-[120px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Image */}
          <div className="relative w-[300px] lg:w-[640px] h-[320px] sm:h-[420px] lg:h-[675px] bg-[#F3F4F6] rounded-lg overflow-hidden">
            <Image
              src="/images/projectScheme/pd.png"
              alt="project director"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center gap-6">
            <div className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
              Project Director
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-gray-900 leading-tight">
              Md. Mofazzal Hossain Manik
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-dm-sans leading-relaxed text-justify">
              Expro Welfare Foundation (EWF) has taken a groundbreaking step
              with its Pension Scheme project. Through this initiative, a new
              horizon of financial security has been opened for the middle- and
              lower-income people of Bangladesh.
            </p>
          </div>
        </div>
      </section>

      {/* Director 2 */}
      <section className="w-full px-4 sm:px-6 lg:px-[60px] pb-16 lg:pb-[120px]">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
          {/* Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start justify-center gap-6">
            <div className="inline-flex items-center w-fit gap-2 px-3 py-1 rounded-md bg-[#EBFDF3] text-[#00341C] text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36F293]" />
              Assistant Project Director
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[44px] font-bold text-gray-900 leading-tight">
              Mosammat Sumaiya Jannat
            </h2>

            <p className="text-sm sm:text-base text-gray-600 font-dm-sans leading-relaxed text-justify">
              Through its pension project, Expro Welfare Foundation will play a
              significant role in improving the socio-economic condition of
              ordinary people.
            </p>
          </div>

          {/* Image */}
          <div className="relative w-[300px] lg:w-[640px] h-[320px] sm:h-[420px] lg:h-[675px] bg-[#F3F4F6] rounded-lg overflow-hidden">
            <Image
              src="/images/projectScheme/app.png"
              alt="assistant project director"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
}
