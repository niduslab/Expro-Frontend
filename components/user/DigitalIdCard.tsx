"use client";

import Image from "next/image";
import { QrCode, Phone, Mail, MapPin, Download, Share2 } from "lucide-react";
import { useState } from "react";

interface DigitalIdCardProps {
  cardData: {
    id: number;
    user_id: number;
    card_number: string;
    qr_code?: string;
    issue_date: string;
    expiry_date: string;
    status: string;
    replaced_by?: number | null;
    card_image?: string;
    member: {
      name: string;
      email: string;
      mobile?: string;
      member_id: string;
      photo?: string;
    };
  };
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function DigitalIdCard({ cardData }: DigitalIdCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Safety check
  if (!cardData) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#6B7280]">No card data available</p>
      </div>
    );
  }
  
  const member = cardData.member;
  
  // Get initials for avatar fallback
  const initials = (member?.name || "?")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = cardData.status === "active";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Container with 3D flip effect */}
      <div
        className="relative w-full cursor-pointer"
        style={{ perspective: "1000px" }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front of Card */}
          <div
            className="w-full rounded-3xl shadow-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Card Header - Green Gradient */}
            <div className="bg-gradient-to-br from-[#068847] to-[#045a2e] px-6 py-6 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24" />
              </div>

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <h2 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                    EXPRO WELFARE FOUNDATION
                  </h2>
                  <p className="text-white/90 text-sm md:text-base mt-1">
                    Official Staff Identity Card
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                  <p className="text-white text-xs font-mono font-semibold">
                    {cardData.card_number || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body - White */}
            <div className="bg-white px-6 py-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo/Avatar Section */}
                <div className="flex-shrink-0">
                  {member?.photo && typeof member.photo === 'string' && member.photo.startsWith('http') ? (
                    <Image
                      src={member.photo}
                      alt={member.name || "Member"}
                      width={140}
                      height={140}
                      unoptimized
                      className="w-32 h-32 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-[#068847]/20 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-[#068847] to-[#045a2e] border-4 border-[#068847]/20 shadow-lg flex items-center justify-center text-white text-4xl font-bold">
                      {initials}
                    </div>
                  )}
                </div>

                {/* Member Info Section */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#030712]">
                      {member?.name || "N/A"}
                    </h3>
                  </div>

                  <div className="inline-flex items-center gap-2 bg-[#068847]/10 text-[#068847] px-4 py-1.5 rounded-full border border-[#068847]/20">
                    <span className="text-sm font-bold font-mono">
                      {member?.member_id || "N/A"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-[#9CA3AF] font-medium">
                          Email
                        </p>
                        <p className="text-sm text-[#030712] break-all">
                          {member?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    {member?.mobile && (
                      <div className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-[#6B7280] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-[#9CA3AF] font-medium">
                            Mobile
                          </p>
                          <p className="text-sm text-[#030712]">
                            {member.mobile}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E5E7EB] my-6" />

              {/* Card Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wide mb-1">
                    Issue Date
                  </p>
                  <p className="text-sm font-semibold text-[#030712]">
                    {cardData.issue_date ? formatDate(cardData.issue_date) : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wide mb-1">
                    Expiry Date
                  </p>
                  <p className="text-sm font-semibold text-[#030712]">
                    {cardData.expiry_date ? formatDate(cardData.expiry_date) : "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wide mb-1">
                    Card Number
                  </p>
                  <p className="text-sm font-semibold text-[#030712] font-mono">
                    {cardData.card_number || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#9CA3AF] font-medium uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                      isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-emerald-500" : "bg-red-500"
                      } animate-pulse`}
                    />
                    {(cardData.status || "inactive").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#E5E7EB] my-6" />

              {/* Footer Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Contact Info */}
                <div className="space-y-2 text-sm text-[#6B7280]">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>01304-493937</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>ewf.bogura.bd@gmail.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="text-xs leading-relaxed">
                      Nishindhara, Bogura Pourashova,
                      <br />
                      Bogura Sadar, Bogura
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                {cardData.qr_code && typeof cardData.qr_code === 'string' && cardData.qr_code.startsWith('http') ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 bg-white border-2 border-[#E5E7EB] rounded-xl p-2 shadow-sm">
                      <Image
                        src={cardData.qr_code}
                        alt="QR Code"
                        width={80}
                        height={80}
                        className="w-full h-full"
                        unoptimized
                      />
                    </div>
                    <p className="text-xs text-[#9CA3AF] font-medium">
                      Scan to verify
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 bg-[#F9FAFB] border-2 border-dashed border-[#E5E7EB] rounded-xl flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-[#D1D5DB]" />
                    </div>
                    <p className="text-xs text-[#9CA3AF] font-medium">
                      Scan to verify
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer - Green Bar */}
            <div className="bg-gradient-to-r from-[#068847] to-[#045a2e] px-6 py-3 flex items-center justify-between">
              <p className="text-white text-xs md:text-sm font-medium">
                This card is the property of Expro Welfare Foundation
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-red-500/20 text-red-100"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isActive ? "bg-white" : "bg-red-200"
                  } animate-pulse`}
                />
                {(cardData.status || "inactive").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Back of Card */}
          <div
            className="absolute inset-0 w-full rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-[#068847] to-[#045a2e]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-32 -translate-x-32" />
              </div>

              <div className="relative z-10 text-center space-y-6">
                <div className="w-32 h-32 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                  <QrCode className="w-20 h-20 text-white" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    EXPRO WELFARE FOUNDATION
                  </h3>
                  <p className="text-white/80 text-sm">
                    Official Digital Identity Card
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-white/90">
                    Card Number: {cardData.card_number || "N/A"}
                  </p>
                  <p className="text-white/90">
                    Valid Until: {cardData.expiry_date ? formatDate(cardData.expiry_date) : "N/A"}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <p className="text-xs text-white/70">
                    For verification, please contact:
                  </p>
                  <p className="text-sm font-medium mt-1">
                    ewf.bogura.bd@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFlipped(!isFlipped);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#E5E7EB] text-[#030712] rounded-lg hover:border-[#068847] hover:text-[#068847] transition-colors font-medium"
        >
          <QrCode className="w-4 h-4" />
          {isFlipped ? "Show Front" : "Show Back"}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement download functionality
            alert("Download functionality coming soon!");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#068847] text-white rounded-lg hover:bg-[#045a2e] transition-colors font-medium"
        >
          <Download className="w-4 h-4" />
          Download
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Implement share functionality
            alert("Share functionality coming soon!");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>

      <p className="text-center text-xs text-[#9CA3AF] mt-4">
        Click on the card to flip and view the back
      </p>
    </div>
  );
}
