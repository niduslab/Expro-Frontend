import { Header } from "@/components/public/Header";
import Footer from "@/components/public/layout/Footer";
import { CtaSection } from "@/components/public/layout/CtaSection";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow">{children}</main>
      <CtaSection />
      <Footer />
    </div>
  );
}
