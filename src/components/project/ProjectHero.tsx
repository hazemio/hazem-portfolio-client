import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiExternalLink,
  FiGithub,
  FiShare2,
  FiStar,
  FiCheck,
} from 'react-icons/fi';
import { Project } from '../../types';
import toast from 'react-hot-toast';

interface ProjectHeroProps {
  project: Project;
}

export function extractYoutubeId(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const youtubeId = extractYoutubeId(project.youtubeUrl);
  const demoUrl = project.demoUrl || project.liveUrl;

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: project.title,
          text: project.description,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Project link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section className="relative pt-32 pb-12 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Back Navigation Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={() => {
              if (window.history.length > 2) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className="btn-ghost group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full glass-light hover:border-brand-500/40 transition-all"
          >
            <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Projects</span>
          </button>
        </motion.div>

        {/* Hero Content Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          {project.featured && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30 text-brand-500 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md"
            >
              <FiStar className="w-3.5 h-3.5 fill-brand-500/20" />
              <span>Featured Project</span>
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] leading-tight mb-6"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto"
          >
            {project.description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl shadow-brand hover:shadow-brand-lg"
              >
                <FiExternalLink className="w-4 h-4" />
                <span>Visit Live Demo</span>
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2 px-6 py-3 rounded-xl"
              >
                <FiGithub className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}

            <button
              onClick={handleShare}
              className="btn-ghost flex items-center gap-2 px-5 py-3 rounded-xl glass-light border border-[var(--border)] hover:border-brand-500/40"
              title="Share Project"
            >
              {copied ? (
                <FiCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <FiShare2 className="w-4 h-4 text-[var(--text-secondary)]" />
              )}
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </motion.div>
        </div>

        {/* Media Frame (YouTube Embed OR Hero Image) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden glass-light border border-[var(--border)] shadow-brand-lg group"
        >
          {youtubeId ? (
            <div className="relative aspect-video w-full bg-black/90">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
                title={`${project.title} Video Preview`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : project.imageUrl ? (
            <div className="relative overflow-hidden aspect-video w-full bg-[var(--bg-overlay)]">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/60 via-transparent to-transparent pointer-events-none" />
            </div>
          ) : (
            <div className="aspect-video w-full bg-gradient-to-br from-brand-900/40 to-accent-violet/30 flex items-center justify-center p-8 text-center">
              <span className="font-display font-bold text-6xl text-brand-500/30">
                {project.title[0]}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
