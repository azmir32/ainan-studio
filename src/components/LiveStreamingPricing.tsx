import { PricingCard } from "@/components/PricingCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const LiveStreamingPricing = () => {
  // Live streaming packages data
  const liveStreamingPackages = [
    {
      title: "Package A",
      price: "RM 2500",
      description: "Basic Package",
      features: [
        "2 Camera angles",
        "Full event recording",
        "Crews",
        "Video features",
        "Cabling and setup",
      ],
    },
    {
      title: "Package B",
      price: "RM 3500",
      description: "Advance Package",
      features: [
        "3 Camera angles",
        "Full event recording",
        "Crews",
        "Video features",
        "Cabling and setup",
      ],
    },
    {
      title: "Add-on Package",
      price: "Custom",
      description: "Customize your package",
      features: [
        "Rehearsal session RM 1000 ",
        "Live steaming RM 500 ",
        "Extra Camera angle RM 1000 ",
      ],
    }
  ];

  return (
    <section id="live-streaming-packages" className="py-20 px-6 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Live Feed Packages
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The price is based on normal daily rate
          </p>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[Autoplay({ delay: 5000 })] as unknown as any}
        >
          <CarouselContent className="items-stretch">
            {liveStreamingPackages.map((pkg, index) => (
              <CarouselItem
                key={index}
                className="basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <div
                  className="h-full animate-in fade-in-50 slide-in-from-bottom-4 [animation-fill-mode:backwards]"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <PricingCard {...pkg} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};
