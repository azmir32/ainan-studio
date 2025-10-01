import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Video, Images, Package } from "lucide-react";

type TabItem = {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  isActive: (path: string) => boolean;
  onClick?: () => void;
};

export const LiveFeedMobileTabBar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname + location.hash;

  // Hide on admin pages
  if (path.startsWith("/admin")) return null;

  const scrollToPackages = () => {
    const packagesSection = document.getElementById('packages');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tabs: TabItem[] = [
    { to: "/livefeed", label: "Live Feed", Icon: Video, isActive: (p) => p === "/livefeed" || p.startsWith("/livefeed#") },
    { to: "/livefeed-portfolio", label: "Recordings", Icon: Images, isActive: (p) => p.startsWith("/livefeed-portfolio") },
    { to: "#packages", label: "Packages", Icon: Package, isActive: (p) => p.includes("#packages"), onClick: scrollToPackages },
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
        <div className="mx-3 mb-3 rounded-2xl border border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-lg">
          <ul className="grid grid-cols-3">
            {tabs.map(({ to, label, Icon, isActive, onClick }) => {
              const active = isActive(location.pathname);
              return (
                <li key={to}>
                  {onClick ? (
                    <button
                      onClick={onClick}
                      className={`flex flex-col items-center justify-center py-3 px-2 gap-1.5 text-xs transition-colors duration-200 ${
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                      }`}
                      aria-label={label}
                    >
                      <Icon className={`h-5 w-5 transition-opacity duration-200 ${active ? "" : "opacity-80"}`} />
                      <span className="leading-none font-medium">{label}</span>
                    </button>
                  ) : (
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
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default LiveFeedMobileTabBar;
