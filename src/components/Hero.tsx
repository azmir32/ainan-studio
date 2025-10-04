import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AssistantChat } from "./ui/assistant-chat";
import heroImage from "@/assets/heroImage";


export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* Enhanced overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm shadow-lg">
          <MapPin className="w-4 h-4 mr-2" />
          Kuala Lumpur On-Site Service
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-2xl">
        Nak gambar professional?

          <span className="text-6xl block text-accent drop-shadow-2xl">Tapi malas ke studio
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            variant="hero"
            className="shadow-2xl backdrop-blur-sm"
            onClick={() => navigate('/packages')}
          >
            <Camera className="w-5 h-5 mr-2" />
            View Packages
          </Button>
          <Button
            variant="outline"
            className="bg-white/20 border-white/40 text-white hover:bg-white/30 backdrop-blur-sm shadow-lg"
            onClick={() => navigate('/portfolio')}
          >
            <Clock className="w-5 h-5 mr-2" />
            See Our Portfolio
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-8 max-w-2xl mx-auto">
          <div className="text-center backdrop-blur-sm bg-black/30 px-6 py-4 rounded-lg shadow-lg">
            <div className="text-2xl md:text-3xl font-bold text-accent drop-shadow-lg">48h</div>
            <div className="text-white/90 drop-shadow-md">Rush Delivery</div>
          </div>
          <div className="text-center backdrop-blur-sm bg-black/30 px-6 py-4 rounded-lg shadow-lg">
            <div className="text-2xl md:text-3xl font-bold text-accent drop-shadow-lg">100%</div>
            <div className="text-white/90 drop-shadow-md">On-Site Service</div>
          </div>
        </div>
      </div>

      {/* Floating chat assistant */}
      <AssistantChat />
    </section>
  );
};