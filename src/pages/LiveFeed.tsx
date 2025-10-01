import { LiveFeedHeader } from "@/components/LiveFeedHeader";
import { LiveFeedHero } from "@/components/LiveFeedHero";
import { LiveFeedPortfolio } from "@/components/LiveFeedPortfolio";
import { PricingSection } from "@/components/PricingSection";
import { LiveFeedFooter } from "@/components/LiveFeedFooter";
import { Testimonials } from "@/components/Testimonials";
import { Trusted } from "@/components/Trusted";
import { LiveStreamingPricing } from "@/components/LiveStreamingPricing";

const LiveFeed = () => {
  return (
    <div className="min-h-screen pb-tabbar-safe">
      <LiveFeedHeader />
      <LiveFeedHero />
      <LiveFeedPortfolio />
      <LiveStreamingPricing />
      <Testimonials />
      <Trusted />
      <LiveFeedFooter />
    </div>
  );
};

export default LiveFeed;
