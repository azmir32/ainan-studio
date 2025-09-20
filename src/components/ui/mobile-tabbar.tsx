import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Images, Package, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type TabItem = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  isActive: (path: string) => boolean;
};

export const MobileTabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const path = location.pathname + location.hash;

  // Hide on admin pages
  if (path.startsWith("/admin")) return null;

  // Define corporate pages and live feed pages
  const corporatePages = ["/", "/portfolio"];
  const liveFeedPages = ["/livefeed", "/livefeed-portfolio"];

  // Determine current page type and navigation target
  const isCorporatePage = corporatePages.includes(location.pathname);
  const isLiveFeedPage = liveFeedPages.includes(location.pathname);

  const handleNavigation = () => {
    if (isCorporatePage) {
      // From corporate page → go to live feed
      navigate("/livefeed");
    } else if (isLiveFeedPage) {
      // From live feed page → go to corporate home
      navigate("/");
    }
    setIsChatOpen(false);
  };

  const handleClose = () => {
    setIsChatOpen(false);
  };

  const targetPage = isCorporatePage ? "Live Feed" : "Corporate";

  const tabs: TabItem[] = [
    { to: "/", label: "Home", Icon: Home, isActive: (p) => p === "/" || p.startsWith("/#") },
    { to: "/portfolio", label: "Portfolio", Icon: Images, isActive: (p) => p.startsWith("/portfolio") },
    { to: "/packages", label: "Packages", Icon: Package, isActive: (p) => p.startsWith("/packages") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="pointer-events-none h-[68px]" />
      <div
        className="pointer-events-auto mx-auto max-w-7xl"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Chat Popup */}
        {isChatOpen && (
          <div className="mx-3 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-5 animate-in slide-in-from-bottom-2 duration-300">
            {/* Chat Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">AINAN Studio</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="w-7 h-7 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Chat Message */}
            <div className="mb-5">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                Hi! Welcome to AINAN Studio. Would you like to check out our {targetPage} page?
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleNavigation}
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 h-9"
              >
                Yes
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                size="sm"
                className="flex-1 h-9"
              >
                No
              </Button>
            </div>
          </div>
        )}

        <div className="mx-3 mb-3 rounded-2xl border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
          <ul className="grid grid-cols-4">
            {tabs.map(({ to, label, Icon, isActive }) => {
              const active = isActive(location.pathname);
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex flex-col items-center justify-center py-3 px-2 gap-1.5 text-xs transition-colors duration-200 ${
                      active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className={`h-5 w-5 transition-opacity duration-200 ${active ? "" : "opacity-80"}`} />
                    <span className="leading-none font-medium">{label}</span>
                  </Link>
                </li>
              );
            })}
            {/* Chat Tab */}
            <li>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex flex-col items-center justify-center py-3 px-2 gap-1.5 text-xs transition-colors duration-200 ${
                  isChatOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                }`}
                aria-label="Open chat"
              >
                <MessageCircle className={`h-5 w-5 transition-opacity duration-200 ${isChatOpen ? "" : "opacity-80"}`} />
                <span className="leading-none font-medium">Chat</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default MobileTabBar;


