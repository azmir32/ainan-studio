import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import SmartMobileTabBar from "@/components/ui/SmartMobileTabBar";
import { SEOHead } from "@/components/seo/SEOHead";
import { 
  PAGE_SEO_DATA, 
  generateLocalBusinessSchema, 
  generateOrganizationSchema 
} from "@/lib/seo";

// Lazy load all page components for faster initial load
const Index = lazy(() => import("./pages/Index"));
const LiveFeed = lazy(() => import("./pages/LiveFeed"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PortfolioPage = lazy(() => import("./pages/portfolio-page").then(module => ({ default: module.PortfolioPage })));
const LiveFeedPortfolioPage = lazy(() => import("./pages/LiveFeedPortfolioPage").then(module => ({ default: module.LiveFeedPortfolioPage })));
const ContactPage = lazy(() => import("./pages/contact-pages").then(module => ({ default: module.ContactPage })));
const PackagesPage = lazy(() => import("./pages/packages-page").then(module => ({ default: module.PackagesPage })));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

const queryClient = new QueryClient();

// SEO wrapper component for each page
const SEOWrapper: React.FC<{ 
  children: React.ReactNode; 
  pageKey: keyof typeof PAGE_SEO_DATA;
  structuredData?: any[];
}> = ({ children, pageKey, structuredData = [] }) => {
  const seoData = PAGE_SEO_DATA[pageKey];
  const allStructuredData = [
    generateLocalBusinessSchema(),
    generateOrganizationSchema(),
    ...structuredData
  ];

  return (
    <>
      <SEOHead seoData={seoData} structuredData={allStructuredData} />
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route 
              path="/" 
              element={
                <SEOWrapper pageKey="home">
                  <Index />
                </SEOWrapper>
              } 
            />
            <Route 
              path="/livefeed" 
              element={
                <SEOWrapper pageKey="livefeed">
                  <LiveFeed />
                </SEOWrapper>
              } 
            />
            <Route 
              path="/portfolio" 
              element={
                <SEOWrapper pageKey="portfolio">
                  <PortfolioPage />
                </SEOWrapper>
              } 
            />
            <Route 
              path="/livefeed-portfolio" 
              element={
                <SEOWrapper pageKey="portfolio">
                  <LiveFeedPortfolioPage />
                </SEOWrapper>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <SEOWrapper pageKey="contact">
                  <ContactPage />
                </SEOWrapper>
              } 
            />
            <Route 
              path="/packages" 
              element={
                <SEOWrapper pageKey="packages">
                  <PackagesPage />
                </SEOWrapper>
              } 
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <SmartMobileTabBar />
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
