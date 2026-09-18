import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  FiImage,
  FiMaximize2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
  FiGrid,
  FiEye,
} from 'react-icons/fi';
import { Project, ProjectImage } from '../../types';

interface ProjectGalleryProps {
  project: Project;
}

const springTransition = {
  type: 'spring' as const,
  stiffness: 320,
  damping: 32,
};

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 32 },
      opacity: { duration: 0.28, ease: 'easeOut' },
      scale: { duration: 0.28, ease: 'easeOut' },
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.96,
    transition: {
      x: { type: 'spring', stiffness: 320, damping: 32 },
      opacity: { duration: 0.2, ease: 'easeIn' },
      scale: { duration: 0.2, ease: 'easeIn' },
    },
  }),
};

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
  // Sort and resolve gallery images or fallback to main cover
  const galleryImages: ProjectImage[] = useMemo(() => {
    if (project.images && project.images.length > 0) {
      return [...project.images].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }
    if (project.imageUrl) {
      return [
        {
          id: 'main-cover',
          imageUrl: project.imageUrl,
          alt: project.title,
          order: 0,
          projectId: project.id,
        },
      ];
    }
    return [];
  }, [project.images, project.imageUrl, project.title, project.id]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<number>(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // References for touch & scroll
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const activeThumbnailRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const total = galleryImages.length;
  const hasMultiple = total > 1;
  const currentImg = galleryImages[activeIndex] || galleryImages[0];

  // Keep index within bounds if data updates
  useEffect(() => {
    if (activeIndex >= total && total > 0) {
      setActiveIndex(0);
    }
  }, [total, activeIndex]);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (!hasMultiple) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [hasMultiple, total]);

  const handlePrev = useCallback(() => {
    if (!hasMultiple) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [hasMultiple, total]);

  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex],
  );

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbnailRef.current && thumbnailContainerRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeIndex]);

  // Preload next and previous images for instantaneous response
  useEffect(() => {
    if (total <= 1) return;
    const nextIdx = (activeIndex + 1) % total;
    const prevIdx = (activeIndex - 1 + total) % total;
    const img1 = new Image();
    img1.src = galleryImages[nextIdx].imageUrl;
    const img2 = new Image();
    img2.src = galleryImages[prevIdx].imageUrl;
  }, [activeIndex, total, galleryImages]);

  // Slideshow auto-advance timer
  useEffect(() => {
    if (!isPlaying || !hasMultiple || isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, hasMultiple, isHovered, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Lightbox open: active keyboard listening
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === ' ') {
          e.preventDefault();
          setIsPlaying((p) => !p);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  // Body scroll lock during Lightbox
  useEffect(() => {
    if (lightboxOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [lightboxOpen]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 45; // Minimum px for swipe
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // If no images are available, clean minimal fallback (omit section entirely)
  if (total === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-8 sm:py-12"
      aria-label="Project Visual Gallery"
    >
      {/* ─── 1. GALLERY HEADER ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-start gap-4">
          {/* Dual-tone gradient icon container */}
          <div className="relative p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-brand-500/15 via-accent-violet/15 to-accent-cyan/15 border border-brand-500/30 text-brand-400 shadow-sm shrink-0 mt-0.5">
            <FiImage className="w-6 h-6 sm:w-7 sm:h-7" />
            <div className="absolute inset-0 rounded-2xl bg-brand-400/20 blur-lg pointer-events-none opacity-40" />
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] tracking-tight">
                Project <span className="gradient-text">Gallery</span>
              </h2>

              {/* Status & Counter Badge */}
              <div className="hidden xs:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
                <span>
                  {total} {total === 1 ? 'Preview' : 'Captures'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-1 flex items-center gap-2">
              <span>High-Resolution Architectural Previews & UI Captures</span>
            </p>
          </div>
        </div>

        {/* Header Action Controls */}
        {hasMultiple && (
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Slideshow Play / Pause Button */}
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-brand-500/20 border-brand-500/40 text-brand-300 shadow-sm'
                  : 'glass-light border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-brand-500/30'
              }`}
              title={isPlaying ? 'Pause Auto-Slideshow' : 'Start Auto-Slideshow'}
              aria-label={isPlaying ? 'Pause Auto-Slideshow' : 'Start Auto-Slideshow'}
            >
              {isPlaying ? (
                <>
                  <FiPause className="w-3.5 h-3.5 text-accent-cyan" />
                  <span className="hidden sm:inline">Playing</span>
                </>
              ) : (
                <>
                  <FiPlay className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            {/* Prev / Next Header Arrows */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl glass-light border border-[var(--border)]">
              <button
                onClick={handlePrev}
                aria-label="Previous image"
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-brand-400 hover:bg-brand-500/10 transition-colors cursor-pointer"
                title="Previous (Left Arrow)"
              >
                <FiChevronLeft className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-[var(--text-muted)] px-1">
                {activeIndex + 1}/{total}
              </span>

              <button
                onClick={handleNext}
                aria-label="Next image"
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-brand-400 hover:bg-brand-500/10 transition-colors cursor-pointer"
                title="Next (Right Arrow)"
              >
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ─── 2. MAIN GALLERY SHOWCASE ─────────────────────────────────── */}
      <div
        className="glass-light rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[var(--border)] shadow-2xl relative overflow-hidden backdrop-blur-xl group/card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Dynamic ambient reflection backdrop based on current image */}
        <div className="absolute inset-0 -m-10 pointer-events-none opacity-20 dark:opacity-30 blur-3xl transition-opacity duration-700 overflow-hidden">
          <img
            src={currentImg.imageUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover scale-150 filter blur-3xl"
          />
        </div>

        {/* Main Image Stage */}
        <div
          onClick={() => setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[var(--bg-overlay)] cursor-zoom-in group select-none shadow-inner border border-[var(--border)]/40"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setLightboxOpen(true);
            }
          }}
          aria-label="Click to enlarge image in fullscreen lightbox"
        >
          {/* Animated Image Transition */}
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentImg.id || currentImg.imageUrl}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentImg.imageUrl}
                alt={currentImg.alt || `${project.title} - Showcase preview ${activeIndex + 1}`}
                className="w-full h-full object-cover sm:object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="eager"
              />
            </motion.div>
          </AnimatePresence>

          {/* Top-Right: Fullscreen Glass Pill */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium border border-white/15 transition-all shadow-lg group-hover:scale-105">
              <FiMaximize2 className="w-3.5 h-3.5 text-accent-cyan" />
              <span className="hidden xs:inline">Fullscreen</span>
            </div>
          </div>

          {/* Top-Left: Index Badge */}
          {hasMultiple && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white/90 text-xs font-mono font-medium border border-white/15 shadow-lg flex items-center gap-2">
                <FiEye className="w-3 h-3 text-brand-400" />
                <span>
                  {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}

          {/* Floating Next/Prev Arrow Overlays on the image stage */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/90 hover:text-white border border-white/15 hover:border-white/30 shadow-xl opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Previous Image"
              >
                <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white/90 hover:text-white border border-white/15 hover:border-white/30 shadow-xl opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
                title="Next Image"
              >
                <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Bottom-Left: Caption & Description Overlay */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto z-20 max-w-xl">
            <div className="px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md text-white border border-white/15 shadow-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-accent-cyan shrink-0" />
              <p className="text-xs sm:text-sm font-medium tracking-wide truncate">
                {currentImg.alt || `${project.title} — Showcase Preview ${activeIndex + 1}`}
              </p>
            </div>
          </div>

          {/* Bottom Border Progress Bar */}
          {hasMultiple && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-500 via-accent-violet to-accent-cyan"
                initial={{ width: '0%' }}
                animate={{ width: `${((activeIndex + 1) / total) * 100}%` }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </div>
          )}
        </div>

        {/* ─── 3. THUMBNAILS CAROUSEL STRIP ─────────────────────────── */}
        {hasMultiple && (
          <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-[var(--border)]/60">
            <div className="flex items-center justify-between gap-3 mb-2.5 px-1">
              <span className="text-xs font-mono font-medium text-[var(--text-muted)] flex items-center gap-1.5">
                <FiGrid className="w-3.5 h-3.5 text-brand-400" />
                <span>Gallery Thumbnails</span>
              </span>
              <span className="text-[11px] font-mono text-[var(--text-muted)]">
                Click to switch • Arrow keys to browse
              </span>
            </div>

            <div
              ref={thumbnailContainerRef}
              className="flex items-center gap-2.5 sm:gap-3.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin scroll-smooth"
            >
              {galleryImages.map((img, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={img.id || idx}
                    ref={isActive ? activeThumbnailRef : undefined}
                    onClick={() => handleSelect(idx)}
                    className={`relative w-24 sm:w-32 md:w-36 aspect-[16/10] shrink-0 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer group focus:outline-hidden ${
                      isActive
                        ? 'ring-2 ring-brand-400 ring-offset-2 ring-offset-[var(--bg-base)] shadow-brand scale-[1.03]'
                        : 'opacity-55 hover:opacity-100 hover:scale-[1.01] border border-[var(--border)] hover:border-brand-500/40'
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  >
                    <img
                      src={img.imageUrl}
                      alt={img.alt || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Active highlight overlay with animated Framer Motion layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="activeGalleryThumbnailRing"
                        className="absolute inset-0 rounded-xl border-2 border-brand-400 pointer-events-none"
                        transition={springTransition}
                      />
                    )}

                    {/* Thumbnail Index Marker */}
                    <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur-xs text-[10px] font-mono text-white/90 border border-white/10">
                      {idx + 1}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── 4. CINEMATIC FULLSCREEN LIGHTBOX ────────────────────────── */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-between select-none"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Lightbox Ambient Backdrop Glow */}
            <div className="absolute inset-0 pointer-events-none opacity-25 blur-3xl overflow-hidden">
              <img
                src={currentImg.imageUrl}
                alt=""
                className="w-full h-full object-cover scale-150 filter blur-3xl"
              />
            </div>

            {/* Top Toolbar */}
            <div
              className="relative z-10 flex items-center justify-between gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white/10 text-brand-300 border border-white/15 hidden sm:flex">
                  <FiImage className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm sm:text-base tracking-wide flex items-center gap-2">
                    <span>{project.title}</span>
                    <span className="text-white/40 text-xs">•</span>
                    <span className="text-white/70 text-xs font-mono">
                      {currentImg.alt || `Preview ${activeIndex + 1}`}
                    </span>
                  </h3>
                  <p className="text-white/40 text-xs font-mono hidden sm:block">
                    High-Resolution Fullscreen Inspector
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Counter Badge */}
                <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-mono font-medium">
                  {activeIndex + 1} of {total}
                </div>

                {/* Slideshow Button in Lightbox */}
                {hasMultiple && (
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors cursor-pointer"
                    title={isPlaying ? 'Pause Slideshow (Space)' : 'Play Slideshow (Space)'}
                    aria-label="Toggle Slideshow"
                  >
                    {isPlaying ? <FiPause className="w-4 h-4 text-accent-cyan" /> : <FiPlay className="w-4 h-4" />}
                  </button>
                )}

                {/* Close Button with Esc indicator */}
                <button
                  onClick={() => setLightboxOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer group shadow-lg"
                  title="Close Fullscreen (Esc)"
                  aria-label="Close Lightbox"
                >
                  <span className="text-xs font-mono text-white/70 group-hover:text-white hidden sm:inline">
                    ESC
                  </span>
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Stage: High-Resolution Viewer */}
            <div
              className="relative z-10 flex-1 flex items-center justify-center my-4 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Prev Navigation Button */}
              {hasMultiple && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer z-30 shadow-2xl"
                  aria-label="Previous image"
                  title="Previous (Left Arrow)"
                >
                  <FiChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              )}

              {/* Next Navigation Button */}
              {hasMultiple && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-black/85 text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer z-30 shadow-2xl"
                  aria-label="Next image"
                  title="Next (Right Arrow)"
                >
                  <FiChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
                </button>
              )}

              {/* Main Lightbox Image with Smooth Slide/Fade */}
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentImg.id || currentImg.imageUrl}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="max-w-full max-h-[74vh] flex items-center justify-center p-2"
                >
                  <img
                    src={currentImg.imageUrl}
                    alt={currentImg.alt || project.title}
                    className="max-w-full max-h-[72vh] sm:max-h-[74vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 select-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Bar: Thumbnail Strip & Keyboard Hint */}
            <div
              className="relative z-10 flex flex-col items-center gap-3 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              {hasMultiple && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-2xl px-2 py-1 scrollbar-none">
                  {galleryImages.map((img, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={img.id || idx}
                        onClick={() => handleSelect(idx)}
                        className={`relative w-14 sm:w-18 aspect-[16/10] shrink-0 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'ring-2 ring-brand-400 opacity-100 scale-105'
                            : 'opacity-40 hover:opacity-80'
                        }`}
                        aria-label={`Jump to image ${idx + 1}`}
                      >
                        <img
                          src={img.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="text-white/40 text-[11px] font-mono flex items-center gap-3">
                <span>[← / →] Navigate</span>
                <span>•</span>
                <span>[Space] Slideshow</span>
                <span>•</span>
                <span>[Esc] Close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
