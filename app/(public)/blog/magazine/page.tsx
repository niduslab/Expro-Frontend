"use client";

import { jsPDF } from "jspdf";

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
          <a
            href="#"
            className="flex-1 text-center bg-gray-200 text-gray-400 py-2 rounded-lg cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
          >
            Read
          </a>

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
      <div className="max-w-6xl mx-auto text-center mb-20">
        <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
          2026 Digital Edition
        </span>

        <h1 className="text-5xl font-extrabold mt-6 text-gray-900">
          Expro Welfare Foundation Magazine
        </h1>

        <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
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
