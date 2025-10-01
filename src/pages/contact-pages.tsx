import { CorporateHeader } from "@/components/CorporateHeader";
import { Footer } from "@/components/Footer";
import { ContactSection } from "@/components/ui/contact-section";

export const ContactPage = () => {
  return (
    <div className="min-h-screen">
      <CorporateHeader />
      <ContactSection />
      <Footer />
    </div>
  );
};