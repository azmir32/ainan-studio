import { Header } from "@/components/Header";
import { LiveFeedPortfolio } from "@/components/LiveFeedPortfolio";
import { Footer } from "@/components/Footer";

export const LiveFeedPortfolioPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <LiveFeedPortfolio />
      <Footer />
    </div>
  );
};
