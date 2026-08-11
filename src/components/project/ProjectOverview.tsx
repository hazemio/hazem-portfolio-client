import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCompass, FiTarget, FiZap } from 'react-icons/fi';
import { Project } from '../../types';

interface ProjectOverviewProps {
  project: Project;
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
  const content = project.detailedContent || project.description;

  // Split paragraphs by linebreaks or double linebreaks
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="glass-light rounded-2xl p-8 sm:p-10 border border-[var(--border)] shadow-glass relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500">
            <FiCompass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              Project <span className="gradient-text">Overview</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-0.5">
              Detailed Architecture & Objectives
            </p>
          </div>
        </div>

        {/* Detailed Content Paragraphs */}
        <div className="space-y-6 text-[var(--text-secondary)] leading-relaxed text-base sm:text-lg">
          {paragraphs.map((paragraph, idx) => {
            // Check if paragraph starts with bullet indicator or header
            if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
              const items = paragraph.split('\n').map((line) => line.replace(/^[-*]\s*/, '').trim());
              return (
                <ul key={idx} className="space-y-3 my-4">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[var(--text-primary)]">
                      <FiCheckCircle className="w-5 h-5 text-brand-500 shrink-0 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            return (
              <p key={idx} className="text-[var(--text-secondary)]">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Additional Highlights Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mt-10 pt-8 border-t border-[var(--border)]">
          <div className="p-5 rounded-xl bg-[var(--bg-overlay)]/60 border border-[var(--border)]">
            <div className="flex items-center gap-2 text-brand-500 font-semibold mb-2">
              <FiTarget className="w-5 h-5" />
              <span>Core Goal</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Designed to solve real-world problems with scalable architecture, responsive UI/UX, and optimal performance.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--bg-overlay)]/60 border border-[var(--border)]">
            <div className="flex items-center gap-2 text-accent-cyan font-semibold mb-2">
              <FiZap className="w-5 h-5" />
              <span>Execution Strategy</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">
              Iterative development with modern tooling, strict type-safety, and smooth animations.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
