import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

interface FloatingButtonProps {
  className?: string;
}

export const FloatingButton = ({ className = "" }: FloatingButtonProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Don't show button on admin pages or other non-main pages
  if (!isCorporatePage && !isLiveFeedPage) {
    return null;
  }

  const targetPage = isCorporatePage ? "Live Feed" : "Corporate";

  return (
    <div className={`fixed bottom-6 right-6 z-50 hidden md:block ${className}`}>
      {/* Chat Popup */}
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-80 animate-in slide-in-from-bottom-2 duration-300">
          {/* Chat Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-medium text-sm">AINAN Studio</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="w-6 h-6 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Chat Message */}
          <div className="mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Hi! Welcome to AINAN Studio. Would you like to check out our {targetPage} page?
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              onClick={handleNavigation}
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Yes
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              No
            </Button>
          </div>
        </div>
      )}
      
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full 
          bg-primary hover:bg-primary/90 
          shadow-lg hover:shadow-xl 
          transition-all duration-300 
          flex items-center justify-center
          group
        `}
        size="icon"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground group-hover:scale-110 transition-transform duration-200" />
      </Button>
    </div>
  );
};
