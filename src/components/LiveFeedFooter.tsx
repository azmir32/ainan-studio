import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";

export const LiveFeedFooter = () => {
  return (
    <footer id="contact" className="bg-primary text-primary-foreground py-12 md:py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
              Book now for consultation
            </h2>
            <p className="text-base sm:text-lg mb-8 text-primary-foreground/80">
              Contact us today to book your date now.
            </p>
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => window.open('https://wa.me/60136390429?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20session%20with%20Ainan%20Media%20Sdn%20Bhd.', '_blank')}
            >
              Contact Us
            </Button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm md:text-base">Call Us</div>
                <div className="text-primary-foreground/80 text-sm md:text-base">+60 13-639 0429</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm md:text-base">Email Us</div>
                <div className="text-primary-foreground/80 text-sm md:text-base">team@ainanstudio.com</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm md:text-base">Service Area</div>
                <div className="text-primary-foreground/80 text-sm md:text-base">All Around Malaysia</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/60 text-sm md:text-base">
            © {new Date().getFullYear()} Ainan Media Sdn Bhd. All rights reserved. Professional livestreaming and photography services in Kuala Lumpur.
          </p>
        </div>
      </div>
    </footer>
  );
};
