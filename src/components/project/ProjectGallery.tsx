import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiImage,
  FiMaximize2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { Project } from '../../types';

interface ProjectGalleryProps {
  project: Project;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
  // Collect all gallery images or fallback to main cover image
  const galleryImages = (project.images && project.images.length > 0)
    ? project.images
    : (project.imageUrl ? [{ id: 'main-cover', imageUrl: project.imageUrl, alt: project.title, order: 0, projectId: project.id }] : []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Keep index within bounds if gallery changes
  useEffect(() => {
    if (activeIndex >= galleryImages.length) {
      setActiveIndex(0);
    }
  }, [galleryImages.length, activeIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  if (galleryImages.length === 0) return null;

  const currentImg = galleryImages[activeIndex] || galleryImages[0];
  const hasMultiple = galleryImages.length > 1;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      {/* Section Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-accent-violet/10 border border-accent-violet/20 text-accent-violet">
            <FiImage className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              Project <span className="gradient-text">Gallery</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-0.5">
              High-Resolution Preview & Screenshots ({galleryImages.length} image{galleryImages.length !== 1 ? 's' : ''})
            </p>
          </div>
        </div>

        {hasMultiple && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="p-2 rounded-xl glass-light border border-[var(--border)] hover:border-brand-500/40 text-[var(--text-secondary)] hover:text-brand-400 transition-colors"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="p-2 rounded-xl glass-light border border-[var(--border)] hover:border-brand-500/40 text-[var(--text-secondary)] hover:text-brand-400 transition-colors"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Image Showcase */}
      <div className="glass-light p-4 rounded-2xl border border-[var(--border)] shadow-glass group relative overflow-hidden">
        <div
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--bg-overlay)] cursor-pointer"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImg.imageUrl}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={currentImg.imageUrl}
              alt={currentImg.alt || project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </AnimatePresence>

          {/* Hover overlay with zoom hint */}
          <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm">
            <FiMaximize2 className="w-5 h-5" />
            <span>Click to Expand</span>
          </div>

          {/* Counter Badge */}
          {hasMultiple && (
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/10">
              {activeIndex + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails Row */}
        {hasMultiple && (
          <div className="mt-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {galleryImages.map((img, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={img.id || idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative w-20 sm:w-24 aspect-video shrink-0 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'border-brand-500 ring-2 ring-brand-500/40 scale-105'
                      : 'border-[var(--border)] opacity-60 hover:opacity-100 hover:border-brand-500/30'
                  }`}
                >
                  <img
                    src={img.imageUrl}
                    alt={img.alt || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center"
          >
            {/* Top Toolbar */}
            <div className="absolute top-4 sm:top-6 left-6 right-6 flex items-center justify-between z-10">
              <div className="text-white/80 font-mono text-xs sm:text-sm">
                {currentImg.alt || project.title} ({activeIndex + 1} / {galleryImages.length})
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Close (Esc)"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            {/* Prev / Next buttons in Lightbox */}
            {hasMultiple && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer z-10"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all cursor-pointer z-10"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image display */}
            <motion.img
              key={currentImg.imageUrl}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={currentImg.imageUrl}
              alt={currentImg.alt || project.title}
              className="max-w-full max-h-[82vh] object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

