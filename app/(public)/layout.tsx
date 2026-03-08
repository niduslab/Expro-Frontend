import { Header } from "@/components/public/Header";
import Footer from "@/components/public/layout/Footer";
import { CtaSection } from "@/components/public/layout/CtaSection";
import { Toaster } from "sonner";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white font-dm-sans ">
      <Header />
      <main className="flex-grow">
        {children}
        <Toaster
          position="bottom-right" // top-left, bottom-right, etc.
          richColors // enables richer colors for success/error/warning
          toastOptions={{
            duration: 2000, // time before auto-dismiss
            style: {
              background: "#36F293", // custom background
              color: "#000000", // custom text color
              fontWeight: "500",
              borderRadius: "0.5rem",
              padding: "1rem",
            },
          }}
        />
      </main>
      <CtaSection />
      <Footer />
    </div>
  );
}
