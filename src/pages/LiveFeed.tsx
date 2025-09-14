import { Header } from "@/components/Header";
import { LiveFeedHero } from "@/components/LiveFeedHero";
import { Gallery } from "@/components/Gallery";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { Trusted } from "@/components/Trusted";

const LiveFeed = () => {
  return (
    <div className="min-h-screen pb-tabbar-safe">
      <Header />
      <LiveFeedHero />
      <Gallery />
      <PricingSection />
      <Testimonials />
      <Trusted />
      <Footer />
    </div>
  );
};

export default LiveFeed;
