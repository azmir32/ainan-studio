import { useMemo, useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Folder, Images, Eye, ArrowRight, ArrowLeft } from "lucide-react";

// Import corporate image albums
import CyncoImages from "@/assets/coporate-image/Cynco.io";
import AmranImages from "@/assets/coporate-image/Amran";
import BNIKarismaImages from "@/assets/coporate-image/BNI Karisma";
import DrAdamImages from "@/assets/coporate-image/Dr Adam Zubir Photoshoot";
import HazliImages from "@/assets/coporate-image/Hazli Johar Office Photoshoot";
import FarhanaImages from "@/assets/coporate-image/Jul -24 FREE Farhana Headshot";
import NabilahImages from "@/assets/coporate-image/Nabilah Photoshoot";

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
  imageCount: number;
  category: string;
}

const PortfolioMasonryTile = ({
  album,
  index,
  onOpen,
}: {
  album: Album;
  index: number;
  onOpen: () => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const tileRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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

  const handleImageLoad = () => {
    setLoaded(true);
  };

  // Simplified image loading without srcset for now
  // TODO: Implement proper image optimization later

  return (
    <div
      ref={tileRef}
      className="group relative overflow-hidden bg-black/5 backdrop-blur-sm border border-white/10 transition-all duration-700 ease-out transform-gpu hover:scale-[1.02] hover:z-10 break-inside-avoid mb-6"
      style={{
        borderRadius: index % 3 === 0 ? "2rem 0.5rem 2rem 0.5rem" : index % 2 === 0 ? "0.5rem 2rem 0.5rem 2rem" : "1rem",
        transform: isVisible ? "translateY(0)" : "translateY(2rem)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDelay: `${index * 100}ms`,
      }}
    >
      {album.coverImage ? (
        <button type="button" className="block w-full group" onClick={onOpen} aria-label={`Open ${album.title} album`}>
          {!loaded && (
            <div className="w-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            ref={imgRef}
            src={album.coverImage}
            alt={album.title}
            loading="lazy"
            decoding="async"
            className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-105 will-change-transform"
            style={{ 
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'scale(1)' : 'scale(1.05)',
              transition: 'all 0.3s ease-in-out',
              display: loaded ? 'block' : 'none'
            }}
            onLoad={handleImageLoad}
            onError={(e) => {
              console.warn('Failed to load image:', album.coverImage);
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        </button>
      ) : (
        <div className="w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center" style={{ aspectRatio: '3/2' }}>
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-gray-400 opacity-30">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      )}

      {/* Overlays - only show when image is loaded */}
      {loaded && album.coverImage && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/10 mix-blend-overlay pointer-events-none" />

          {/* Album Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/20">
              <Folder className="w-3 h-3" />
              <span>{album.imageCount} photos</span>
            </div>
          </div>

          {/* Icons */}
          <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Images className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 pointer-events-none">
            <div className="transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <h3 className="text-white font-bold mb-2 drop-shadow-lg text-lg">
                {album.title}
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {album.description}
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-white/90 text-sm font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:text-white pointer-events-auto"
                onClick={onOpen}
              >
                <span>View Album</span>
                <ArrowRight className="w-4 h-4 transition-transform md:group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-t-2 border-white/20 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-b-2 border-white/20 opacity-30 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </>
      )}
    </div>
  );
};

export const Portfolio = () => {
  
  // Create albums from corporate image folders
  const albums = useMemo<Album[]>(() => {
    return [
      {
        id: "cynco",
        title: "Cynco.io Corporate Photography",
        description: "Comprehensive corporate photography session for Cynco.io, showcasing professional headshots and office environment",
        coverImage: `/src/assets/coporate-image/Cynco.io/${CyncoImages[0]}`,
        images: CyncoImages.map(img => `/src/assets/coporate-image/Cynco.io/${img}`),
        imageCount: CyncoImages.length,
        category: "Corporate"
      },
      {
        id: "amran",
        title: "Amran Professional Headshots",
        description: "Professional headshot session featuring high-quality corporate portraits",
        coverImage: `/src/assets/coporate-image/Amran/${AmranImages[0]}`,
        images: AmranImages.map(img => `/src/assets/coporate-image/Amran/${img}`),
        imageCount: AmranImages.length,
        category: "Corporate"
      },
      {
        id: "bni-karisma",
        title: "BNI Karisma Event Photography",
        description: "Complete coverage of BNI Karisma corporate event with professional photography",
        coverImage: `/src/assets/coporate-image/BNI Karisma/${BNIKarismaImages[0]}`,
        images: BNIKarismaImages.map(img => `/src/assets/coporate-image/BNI Karisma/${img}`),
        imageCount: BNIKarismaImages.length,
        category: "Events"
      },
      {
        id: "dr-adam",
        title: "Dr Adam Zubir Photoshoot",
        description: "Professional photography session for Dr Adam Zubir with corporate and portrait shots",
        coverImage: `/src/assets/coporate-image/Dr Adam Zubir Photoshoot/${DrAdamImages[0]}`,
        images: DrAdamImages.map(img => `/src/assets/coporate-image/Dr Adam Zubir Photoshoot/${img}`),
        imageCount: DrAdamImages.length,
        category: "Corporate"
      },
      {
        id: "hazli",
        title: "Hazli Johar Office Photoshoot",
        description: "Corporate office photography session for Hazli Johar with professional headshots",
        coverImage: `/src/assets/coporate-image/Hazli Johar Office Photoshoot/${HazliImages[0]}`,
        images: HazliImages.map(img => `/src/assets/coporate-image/Hazli Johar Office Photoshoot/${img}`),
        imageCount: HazliImages.length,
        category: "Corporate"
      },
      {
        id: "farhana",
        title: "Farhana Headshot Session",
        description: "Professional headshot photography session for Farhana",
        coverImage: `/src/assets/coporate-image/Jul -24 FREE Farhana Headshot/${FarhanaImages[0]}`,
        images: FarhanaImages.map(img => `/src/assets/coporate-image/Jul -24 FREE Farhana Headshot/${img}`),
        imageCount: FarhanaImages.length,
        category: "Corporate"
      },
      {
        id: "nabilah",
        title: "Nabilah Photoshoot",
        description: "Professional photography session for Nabilah with creative and corporate shots",
        coverImage: `/src/assets/coporate-image/Nabilah Photoshoot/${NabilahImages[0]}`,
        images: NabilahImages.map(img => `/src/assets/coporate-image/Nabilah Photoshoot/${img}`),
        imageCount: NabilahImages.length,
        category: "Corporate"
      }
    ];
  }, []);

  // Lightbox state
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const isLightboxOpen = activeAlbum !== null;
  
  // Get photos for the active album
  const photos = activeAlbum?.images || [];

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen || photos.length === 0) return;
    
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveAlbum(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) => (i - 1 + photos.length) % photos.length);
    };
    
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isLightboxOpen, photos.length]);

  return (
    // Main section container with padding and background styling
    <section className="py-20 px-6 bg-[radial-gradient(1200px_800px_at_50%_-10%,hsl(var(--accent)/0.12),transparent_60%)]">
      {/* Centered container with max width for better readability */}
      <div className="max-w-7xl mx-auto">
        
        {/* Section header with title and description */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Showcasing our expertise in delivering exceptional photography services across Malaysia
          </p>
        </div>

        {/* Masonry layout using CSS columns */}
        <div 
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 mb-16"
          style={{
            columnFill: 'balance',
            columnGap: '1.5rem'
          }}
        >
          {albums.map((album, index) => (
            <PortfolioMasonryTile
              key={album.id}
              album={album}
              index={index}
              onOpen={() => {
                setActiveAlbum(album);
                setLightboxIndex(0);
              }}
            />
          ))}
        </div>
      </div>

      {/* Album Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={(open) => {
        if (!open) {
          setActiveAlbum(null);
          setLightboxIndex(0);
        }
      }}>
        <DialogContent className="p-0 sm:max-w-5xl bg-black">
          <DialogTitle className="sr-only">
            {activeAlbum ? `${activeAlbum.title} - Image ${lightboxIndex + 1} of ${activeAlbum.images.length}` : 'Album Viewer'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {activeAlbum ? activeAlbum.description : 'Album image viewer'}
          </DialogDescription>
          {activeAlbum && (
            <div className="relative">
              <img
                src={activeAlbum.images[lightboxIndex]}
                alt={`${activeAlbum.title} - Image ${lightboxIndex + 1}`}
                className="w-full h-auto object-contain max-h-[80vh]"
                loading="eager"
                style={{ 
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
              {/* Prev/Next controls */}
              <button
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setLightboxIndex((i) => (i + activeAlbum.images.length - 1) % activeAlbum.images.length)}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center"
                onClick={() => setLightboxIndex((i) => (i + 1) % activeAlbum.images.length)}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
              {/* Album info and image counter */}
              <div className="absolute bottom-3 left-4 right-4 text-white/90 text-sm">
                <div className="flex justify-between items-center">
                  <span>{activeAlbum.title}</span>
                  <span>{lightboxIndex + 1} / {activeAlbum.images.length}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
