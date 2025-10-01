import { LiveFeedHeader } from "@/components/LiveFeedHeader";
import { LiveFeedPortfolio } from "@/components/LiveFeedPortfolio";
import { LiveFeedFooter } from "@/components/LiveFeedFooter";

export const LiveFeedPortfolioPage = () => {
  return (
    <div className="min-h-screen">
      <LiveFeedHeader />
      <LiveFeedPortfolio />
      <LiveFeedFooter />
    </div>
  );
};
