"use Client";
const videoData = [
  {
    id: 1,
    title: "Founder's Message on Expro Welfare Foundation",
    description:
      "Expro welfare foundation এর বর্তমান ও ভবিষ্যত পরিকল্পনা সম্পর্কে আলোচনা করলেন সপ্তম প্রতিষ্ঠা বার্ষিকীতে। চেয়ারম্যান জনাব মোঃ মোতাহার হোসেন।",
    youtubeId: "ZQAbg08FcMk",
  },
  {
    id: 2,
    title: "Our Workshop and Celebration",
    description:
      "Expro welfare foundation এর স্পেশাল ওয়ার্কশপ ও সেলিব্রেশন প্রোগ্রাম।",
    youtubeId: "-XMYsvm6ing",
  },
  {
    id: 3,
    title: "7th Anniversary Event",
    description:
      "Expro Welfare Foundation এর ৭ম প্রতিষ্ঠা বার্ষিকীর বিশেষ আয়োজন।",
    youtubeId: "W9u_JYnAbvM",
  },
];

const Videos = () => {
  return (
    <section className="bg-white min-h-screen px-6 pt-32 md:px-16 py-20">
      {/* Header */}
      <div className="text-center mb-16 flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          Our Videos
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Digital Content & Videos
        </h2>

        <p className="text-gray-500 max-w-2xl">
          Insights. Inspiration. Impact.
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {videoData.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100"
          >
            {/* Video */}
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                frameBorder="0"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-gray-600 text-sm">{video.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Videos;
