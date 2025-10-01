import { CorporateHeader } from "@/components/CorporateHeader";
import { Portfolio } from "@/components/Portfolio";
import { Footer } from "@/components/Footer";

export const PortfolioPage = () => {
  return (
    <div className="min-h-screen">
      <CorporateHeader />
      <Portfolio />
      <Footer />
    </div>
  );
};
