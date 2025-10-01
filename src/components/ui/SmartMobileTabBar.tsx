import React from "react";
import { useLocation } from "react-router-dom";
import CorporateMobileTabBar from "./CorporateMobileTabBar";
import LiveFeedMobileTabBar from "./LiveFeedMobileTabBar";

export const SmartMobileTabBar: React.FC = () => {
  const location = useLocation();
  
  // Define corporate pages and live feed pages
  const corporatePages = ["/", "/portfolio", "/contact", "/packages"];
  const liveFeedPages = ["/livefeed", "/livefeed-portfolio"];
  
  // Determine which tab bar to show
  const isCorporatePage = corporatePages.includes(location.pathname);
  const isLiveFeedPage = liveFeedPages.includes(location.pathname);
  
  // Don't show tab bar on admin pages or other non-main pages
  if (location.pathname.startsWith("/admin") || (!isCorporatePage && !isLiveFeedPage)) {
    return null;
  }
  
  // Return appropriate tab bar
  if (isLiveFeedPage) {
    return <LiveFeedMobileTabBar />;
  }
  
  // Default to corporate tab bar
  return <CorporateMobileTabBar />;
};

export default SmartMobileTabBar;
