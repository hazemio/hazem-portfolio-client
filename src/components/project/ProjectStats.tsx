import React from 'react';
import { motion } from 'framer-motion';
import {
  FiCheckCircle,
  FiStar,
  FiLayers,
  FiHash,
  FiActivity,
} from 'react-icons/fi';
import { Project } from '../../types';

interface ProjectStatsProps {
  project: Project;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ project }) => {
  const techCount = Array.isArray(project.technologies)
    ? project.technologies.length
    : Array.isArray(project.tags)
    ? project.tags.length
    : 0;

  const stats = [
    {
      label: 'Status',
      value: 'Completed',
      icon: <FiCheckCircle className="w-5 h-5 text-emerald-500" />,
      color: 'text-emerald-500',
    },
    {
      label: 'Featured',
      value: project.featured ? 'Featured Project' : 'Standard Project',
      icon: <FiStar className="w-5 h-5 text-amber-400" />,
      color: project.featured ? 'text-amber-400' : 'text-[var(--text-secondary)]',
    },
    {
      label: 'Tech Stack',
      value: `${techCount} Technologies`,
      icon: <FiLayers className="w-5 h-5 text-brand-500" />,
      color: 'text-brand-500',
    },
    {
      label: 'Display Order',
      value: `Order #${project.order ?? 0}`,
      icon: <FiActivity className="w-5 h-5 text-accent-cyan" />,
      color: 'text-accent-cyan',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="glass-light p-5 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:border-brand-500/30 transition-all card-hover"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider">
                {stat.label}
              </span>
              <div className="p-2 rounded-xl bg-[var(--bg-overlay)]">{stat.icon}</div>
            </div>
            <div className={`font-display font-bold text-lg sm:text-xl ${stat.color}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Small Project ID Badge */}
      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-[var(--text-muted)] font-mono">
        <FiHash className="w-3.5 h-3.5" />
        <span>Project ID: {project.id}</span>
      </div>
    </motion.section>
  );
};
