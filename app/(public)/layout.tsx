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
          position="bottom-right"
          richColors
          toastOptions={{
            duration: 2500,
            classNames: {
              toast:
                "relative overflow-hidden rounded-lg px-4 py-3 font-medium",
            },
          }}
        />
      </main>
      <CtaSection />
      <Footer />
    </div>
  );
}
