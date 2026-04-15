"use client";

import LoadMore from "@/components/loadMore/page";
import { useYouTubeVideos } from "@/lib/hooks/public/Useytvideoshook";
import { YouTubeVideo } from "@/lib/types/admin/Ytvideostype";
import { useEffect, useState } from "react";

const PER_PAGE = 12;

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 animate-pulse">
    <div className="aspect-video w-full bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-5/6" />
    </div>
  </div>
);

// ─── Video Card (click-to-play — no iframe until user clicks) ─────────────────

const VideoCard = ({ video }: { video: YouTubeVideo }) => {
  const [playing, setPlaying] = useState(false);

  const thumbnail =
    video.thumbnail_url ||
    `https://i.ytimg.com/vi/${video.youtube_video_id}/hqdefault.jpg`;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100">
      {/* Thumbnail / Player */}
      <div
        className="aspect-video w-full relative cursor-pointer group"
        onClick={() => setPlaying(true)}
      >
        {playing ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtube_video_id}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* Static thumbnail — zero YouTube network cost */}
            <img
              src={thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition duration-300" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                <svg
                  className="w-6 h-6 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {video.description}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const Videos = () => {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState<YouTubeVideo[]>([]);

  const { data, isLoading, isFetching, isError } = useYouTubeVideos({
    per_page: PER_PAGE,
    page,
  });

  // Append new page results — runs only when data changes
  useEffect(() => {
    if (!data?.data?.length) return;
    setAllVideos((prev) => {
      const existingIds = new Set(prev.map((v) => v.id));
      const incoming = data.data.filter((v) => !existingIds.has(v.id));
      return incoming.length ? [...prev, ...incoming] : prev;
    });
  }, [data]);

  const pagination = data?.pagination;
  const hasMore = pagination
    ? pagination.current_page < pagination.last_page
    : false;
  const totalCount = pagination?.total ?? 0;
  const isInitialLoad = isLoading && allVideos.length === 0;
  const isLoadingMore = isFetching && allVideos.length > 0;

  return (
    <div className="container mx-auto px-6 md:px-12 lg:px-20">
      <section className="bg-white min-h-screen pt-36 py-20">
        {/* Header */}
        <div className="text-center mb-10 pt-6 flex flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 text-sm font-medium text-[#027A48]">
            <span className="font-dm-sans h-1.5 w-1.5 rounded-full bg-[#027A48]" />
            Videos
          </div>
          <h2 className="font-dm-sans text-3xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            EWF Digital Content & Videos
          </h2>
        </div>

        {/* Initial skeleton */}
        {isInitialLoad && (
          <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && !isInitialLoad && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-500 text-lg">
              Failed to load videos. Please try again later.
            </p>
          </div>
        )}

        {/* No Videos Found */}
        {!isLoading && !isError && allVideos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <p className="text-gray-700 text-xl font-semibold">
              No videos found
            </p>
            <p className="text-gray-400 text-sm">
              Check back later for new content.
            </p>
          </div>
        )}

        {/* Video Grid */}
        {allVideos.length > 0 && (
          <>
            <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {allVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}

              {/* Append skeletons while fetching next page */}
              {isLoadingMore &&
                Array.from({ length: PER_PAGE }).map((_, i) => (
                  <SkeletonCard key={`sk-${i}`} />
                ))}
            </div>

            <LoadMore
              hasMore={hasMore}
              isLoading={isFetching}
              onLoadMore={() => setPage((p) => p + 1)}
              loadedCount={allVideos.length}
              totalCount={totalCount}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default Videos;
