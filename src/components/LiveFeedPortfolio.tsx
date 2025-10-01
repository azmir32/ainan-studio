import { useMemo, useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface LiveFeedItem {
  id: string;
  title: string;
  description: string;
  category: string;
  coverUrl: string;
  photos: string[];
  videoUrl?: string;
}

// Import images directly
import image1 from "@/assets/imagesCarousel/20191208-LAN_0281.webp";
import image2 from "@/assets/imagesCarousel/AIN00523.webp";
import image3 from "@/assets/imagesCarousel/AIN00718.webp";
import image4 from "@/assets/imagesCarousel/Amin-Rashidi-Studio-664.webp";
import image5 from "@/assets/imagesCarousel/DSC_3411.webp";
import image6 from "@/assets/imagesCarousel/FKP03731.webp";
import image7 from "@/assets/imagesCarousel/FKP03833.webp";
import image8 from "@/assets/imagesCarousel/FKP03935.webp";
import image9 from "@/assets/imagesCarousel/0FK_1526.webp";
import image10 from "@/assets/imagesCarousel/0FK_0696.webp";

const LiveFeedMasonryTile = ({
  item,
  index,
  onOpen,
}: {
  item: LiveFeedItem;
  index: number;
  onOpen: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.1 }
    );
    if (tileRef.current) observer.observe(tileRef.current);
    return () => observer.disconnect();
  }, [index]);

  const handleVideoLoad = () => {
    setLoaded(true);
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Create YouTube embed URL with autoplay and loop
  const getEmbedUrl = (videoUrl: string) => {
    const videoId = getYouTubeVideoId(videoUrl);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&mute=1&controls=1&showinfo=0&rel=0`;
  };

  return (
    <div
      ref={tileRef}
      className="group relative overflow-hidden bg-white shadow-soft hover:shadow-elegant transition-all duration-700 ease-out transform-gpu hover:scale-[1.02] hover:z-10 break-inside-avoid mb-6 rounded-lg"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(2rem)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {item.videoUrl ? (
        <div className="w-full" style={{ aspectRatio: '16/9' }}>
          {!loaded && (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <iframe
            src={getEmbedUrl(item.videoUrl) || ''}
            title={item.title}
            className="w-full h-full rounded-t-lg transition-all duration-700 group-hover:scale-105 will-change-transform"
            style={{ 
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 0.3s ease-in-out',
              display: loaded ? 'block' : 'none'
            }}
            onLoad={handleVideoLoad}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="w-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center rounded-t-lg" style={{ aspectRatio: '16/9' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-400 opacity-30">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>
      )}

      {/* Live Feed Badge */}
      {loaded && item.videoUrl && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {item.category}
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {item.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};

// Static live feed portfolio data
const staticLiveFeedData: LiveFeedItem[] = [
    {
      id: "1",
      title: "Tech Conference Live Stream",
      description: "Multi-camera setup for 1,000+ attendees with real-time streaming and interactive Q&A sessions.",
      category: "Live Stream",
      coverUrl: image10, // 0FK_0696.webp
      photos: [
        image10, // 0FK_0696.webp
        image2,  // AIN00523.webp
        image6   // FKP03731.webp
      ],
      videoUrl: "https://youtu.be/G4bVqO4GDWo?si=aI2QViMGcnOSh-0b"
    },
    {
      id: "2",
      title: "Corporate Training Session",
      description: "Multi-location training session with interactive Q&A, ensuring seamless knowledge transfer across teams.",
      category: "Live Stream",
      coverUrl: image5, // DSC_3411.webp
      photos: [
        image5, // DSC_3411.webp
        image6, // FKP03731.webp
        image10 // 0FK_0696.webp
      ]
    },
    {
      id: "3",
      title: "Product Launch Event",
      description: "High-end product photography and live streaming for brand launch, reaching global audience in real-time.",
      category: "Live Stream",
      coverUrl: image3, // AIN00718.webp
      photos: [
        image3, // AIN00718.webp
        image9, // 0FK_1526.webp
        image2  // AIN00523.webp
      ]
    },
    {
      id: "4",
      title: "Award Ceremony Coverage",
      description: "Red carpet photography and live award ceremony streaming, capturing the glamour and excitement of the event.",
      category: "Live Stream",
      coverUrl: image7, // FKP03833.webp
      photos: [
        image7, // FKP03833.webp
        image8, // FKP03935.webp
        image3  // AIN00718.webp
      ]
    },
    {
      id: "5",
      title: "Wedding Live Coverage",
      description: "Complete ceremony and reception with cinematic highlights, capturing every precious moment of the special day.",
      category: "Live Stream",
      coverUrl: image6, // FKP03731.webp
      photos: [
        image6, // FKP03731.webp
        image7, // FKP03833.webp
        image8  // FKP03935.webp
      ]
    },
    {
      id: "6",
      title: "Corporate Webinar Series",
      description: "Professional webinar production with multi-camera setup, graphics overlay, and real-time audience interaction.",
      category: "Live Stream",
      coverUrl: image2, // AIN00523.webp
      photos: [
        image2, // AIN00523.webp
        image3, // AIN00718.webp
        image5  // DSC_3411.webp
      ]
    },
    {
      id: "7",
      title: "Virtual Conference Platform",
      description: "Complete virtual conference setup with live streaming, breakout rooms, and interactive features for 500+ participants.",
      category: "Live Stream",
      coverUrl: image9, // 0FK_1526.webp
      photos: [
        image9, // 0FK_1526.webp
        image6, // FKP03731.webp
        image3  // AIN00718.webp
      ]
    },
    {
      id: "8",
      title: "Live Music Event Streaming",
      description: "High-quality live streaming of music events with professional audio mixing and multi-angle camera coverage.",
      category: "Live Stream",
      coverUrl: image1, // 20191208-LAN_0281.webp
      photos: [
        image1, // 20191208-LAN_0281.webp
        image3, // AIN00718.webp
        image5  // DSC_3411.webp
      ]
    }
  ];

export const LiveFeedPortfolio = () => {
  const items = useMemo(
    () => {
      return staticLiveFeedData.map((i: LiveFeedItem) => ({
        id: i.id,
        title: i.title,
        description: i.description,
        category: i.category,
        coverUrl: i.coverUrl,
        photos: i.photos,
        videoUrl: i.videoUrl
      }));
    },
    []
  );

  // Lightbox state
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const isLightboxOpen = activeAlbumId !== null;
  
  // Get photos for the active album
  const activeAlbum = items.find(item => item.id === activeAlbumId);
  const photos = activeAlbum?.photos || [];

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen || photos.length === 0) return;
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveAlbumId(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isLightboxOpen, photos.length]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-gray-800 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Live Feed Portfolio
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Showcasing our expertise in professional live streaming and real-time event coverage
          </p>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Masonry layout using CSS columns */}
          <div 
            className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6"
            style={{
              columnFill: 'balance',
              columnGap: '1.5rem'
            }}
          >
            {items.map((item, index) => (
              <LiveFeedMasonryTile
                key={item.id}
                item={item}
                index={index}
                onOpen={() => {
                  setActiveAlbumId(item.id);
                  setLightboxIndex(0);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Album Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={(open) => setActiveAlbumId(open ? activeAlbumId : null)}>
        <DialogContent className="max-w-5xl">
          <div className="space-y-3">
            <DialogHeader>
              <DialogTitle>
                {activeAlbum?.title || "Album"}
              </DialogTitle>
              <DialogDescription>
                {activeAlbum?.description || ""}
              </DialogDescription>
            </DialogHeader>

            <div className="w-full max-h-[80vh] flex items-center justify-center bg-black/5 rounded">
              {photos.length === 0 ? (
                <div className="p-16 text-sm text-muted-foreground">No photos in this album yet.</div>
              ) : (
                <img
                  src={photos[lightboxIndex]}
                  srcSet={`${photos[lightboxIndex]} 1600w`}
                  sizes="100vw"
                  alt={activeAlbum?.title || ""}
                  className="max-h-[78vh] w-auto object-contain cursor-pointer"
                  onClick={() => setLightboxIndex((i) => (i + 1) % photos.length)}
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {photos.length > 0 ? `${lightboxIndex + 1} / ${photos.length} — Use ← → or click image to navigate` : ""}
              </div>
              {photos.length > 0 && (
                <a
                  className="text-sm underline"
                  href={photos[lightboxIndex]}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open original
                </a>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
