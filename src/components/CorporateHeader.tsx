import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown, Building2, Video } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CorporateHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();


  return (
    <header className="w-full py-3 md:py-4 px-4 md:px-6 border-b border-border/50 bg-background/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-200">
              <img 
                src="/Logo/AINAN-Logo-02.webp" 
                alt="Ainan Studio Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-tight">AINAN</span>
              <span className="text-sm font-medium text-muted-foreground leading-tight">STUDIO</span>
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8"> 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 text-foreground/80 hover:text-foreground">
                <span className="font-medium">Portfolio</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => navigate("/portfolio")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Building2 className="w-4 h-4" />
                <div>
                  <div className="font-medium">Corporate Portfolio</div>
                  <div className="text-sm text-muted-foreground">Professional headshots & events</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate("/livefeed")}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <div>
                  <div className="font-medium">Live Streaming</div>
                  <div className="text-sm text-muted-foreground">Professional live streaming services</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          <Button 
            variant="premium" 
            className="shadow-lg hover:shadow-xl transition-all duration-200 hidden md:inline-flex"
            onClick={() => window.open('https://wa.me/60127704714?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20session%20with%20Ainan%20Media%20Sdn%20Bhd.', '_blank')}
          >
            Book Now
          </Button>
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] sm:w-[360px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="border-b pb-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Portfolio</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          navigate("/portfolio");
                          const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
                          closeButton?.click();
                        }}
                        className="flex items-center gap-3 w-full text-left py-2"
                      >
                        <Building2 className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Corporate Portfolio</div>
                          <div className="text-sm text-muted-foreground">Professional headshots & events</div>
                        </div>
                      </button>
                      <button 
                        onClick={() => {
                          navigate("/livefeed");
                          const closeButton = document.querySelector('[data-state="open"] button[aria-label="Close"]') as HTMLButtonElement;
                          closeButton?.click();
                        }}
                        className="flex items-center gap-3 w-full text-left py-2"
                      >
                        <Video className="w-4 h-4" />
                        <div>
                          <div className="font-medium">Live Streaming</div>
                          <div className="text-sm text-muted-foreground">Professional live streaming services</div>
                        </div>
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    variant="premium" 
                    className="mt-4"
                    onClick={() => window.open('https://wa.me/60127704714?text=Hi%2C%20I%27m%20interested%20in%20booking%20a%20session%20with%20Ainan%20Media%20Sdn%20Bhd.', '_blank')}
                  >
                    Book Now
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
