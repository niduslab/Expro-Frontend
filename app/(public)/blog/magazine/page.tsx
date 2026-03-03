"use client";

import { jsPDF } from "jspdf";
import Link from "next/link";

type MagazineCardProps = {
  year: string;
  title: string;
  description: string;
  image: string;
  className?: string;
};

const MagazineCard = ({
  year,
  title,
  description,
  image,
  className,
}: MagazineCardProps) => {
  const handleDownload = async () => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous"; // required if image is from a different origin
      img.src = image;
      img.onload = () => {
        // Create PDF with A4 size (approx 595x842 px)
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        // Scale image to fit A4 while keeping aspect ratio
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
        const imgWidth = img.width * ratio;
        const imgHeight = img.height * ratio;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(img, "PNG", x, y, imgWidth, imgHeight);
        pdf.save(`${title}-${year}.pdf`);
      };
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden group ${className}`}
    >
      <div className="h-30 md:h-42 xl:h-52 overflow-hidden">
        <img
          src={image}
          alt={`${title} cover`}
          className="group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">
          {title} {year}
        </h3>
        <p className="text-gray-600 mt-3 text-sm">{description}</p>

        <div className="flex gap-3 mt-6">
          {/* Disabled Read button */}
          <Link
            href="#"
            className="flex-1 text-center bg-gray-200 text-gray-400 py-2 rounded-lg cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
          >
            Read
          </Link>

          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 bg-[#068847] text-white py-2 rounded-lg hover:text-gray-300 hover:scale-102 transition"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

const MagazinePage = () => {
  const previousEditions = [
    {
      year: "2025",
      title: "Magazine",
      description:
        "Financial expansion, automation updates and pension system upgrades.",
      image: "/images/megazine/cover-2025.png",
    },
    {
      year: "2024",
      title: "Magazine",
      description:
        "Community medical programs and structured growth milestones.",
      image: "/images/megazine/cover-2024.png",
    },
    {
      year: "2023",
      title: "Magazine",
      description: "Foundation expansion and digital transformation journey.",
      image: "/images/megazine/cover-2023.png",
    },
  ];

  return (
    <section className="bg-white min-h-screen pt-32 pb-24 px-6">
      {/* HERO */}

      <div className="text-center mb-16 flex flex-col items-center gap-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF3] px-4 py-1.5 text-sm font-medium text-[#027A48]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#027A48]" />
          2026 Digital Edition
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
          Our Magazine
        </h2>

        <p className="text-gray-500 max-w-2xl">
          A transparent, innovative and impact-driven publication highlighting
          pension growth, humanitarian projects and community development.
        </p>
      </div>

      {/* FEATURED CARD */}
      <div className="max-w-6xl mx-auto mb-24">
        <MagazineCard
          year="2026"
          title="Annual Edition"
          description="Impact highlights, pension transparency, growth roadmap and chairman’s editorial for 2026."
          image="/images/megazine/cover-2026u.png"
        />
      </div>

      {/* PREVIOUS EDITIONS */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-14 text-gray-800">
          Previous Editions
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {previousEditions.map((edition) => (
            <MagazineCard key={edition.year} {...edition} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MagazinePage;
