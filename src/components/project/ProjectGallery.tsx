import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiMaximize2, FiX } from 'react-icons/fi';
import { Project } from '../../types';

interface ProjectGalleryProps {
  project: Project;
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!project.imageUrl) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-accent-violet/10 border border-accent-violet/20 text-accent-violet">
          <FiImage className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
            Project <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-0.5">
            High-Resolution Preview & Screenshots
          </p>
        </div>
      </div>

      <div className="glass-light p-4 rounded-2xl border border-[var(--border)] shadow-glass group relative overflow-hidden">
        <div
          onClick={() => setSelectedImage(project.imageUrl || null)}
          className="relative aspect-video w-full overflow-hidden rounded-xl bg-[var(--bg-overlay)] cursor-pointer"
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Hover overlay with zoom hint */}
          <div className="absolute inset-0 bg-brand-950/40 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm">
            <FiMaximize2 className="w-5 h-5" />
            <span>Click to Expand</span>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md p-4 sm:p-10 flex items-center justify-center cursor-zoom-out"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              alt="Expanded Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};
