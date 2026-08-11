import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiGithub, FiYoutube, FiLink } from 'react-icons/fi';
import { Project } from '../../types';

interface ProjectLinksProps {
  project: Project;
}

export const ProjectLinks: React.FC<ProjectLinksProps> = ({ project }) => {
  const demoUrl = project.demoUrl || project.liveUrl;

  const links = [
    demoUrl
      ? {
          title: 'Live Application',
          description: 'Experience the deployed live application interactive demo.',
          url: demoUrl,
          icon: <FiExternalLink className="w-6 h-6 text-brand-500" />,
          buttonText: 'Open Live Demo',
          color: 'hover:border-brand-500/50',
        }
      : null,
    project.githubUrl
      ? {
          title: 'Source Code',
          description: 'Explore the full repository, commit history, and codebase.',
          url: project.githubUrl,
          icon: <FiGithub className="w-6 h-6 text-[var(--text-primary)]" />,
          buttonText: 'View on GitHub',
          color: 'hover:border-brand-500/50',
        }
      : null,
    project.youtubeUrl
      ? {
          title: 'Video Demonstration',
          description: 'Watch the full video walkthrough and feature overview.',
          url: project.youtubeUrl,
          icon: <FiYoutube className="w-6 h-6 text-red-500" />,
          buttonText: 'Watch Video',
          color: 'hover:border-red-500/50',
        }
      : null,
  ].filter(Boolean);

  if (links.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
          <FiLink className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
            Project <span className="gradient-text">Links</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-0.5">
            External Resources & Repository
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {links.map((link: any, index: number) => (
          <motion.a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`glass-light p-6 rounded-2xl border border-[var(--border)] ${link.color} transition-all duration-300 flex flex-col justify-between group card-hover`}
          >
            <div>
              <div className="p-3 rounded-xl bg-[var(--bg-overlay)] w-fit mb-4 group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2 group-hover:text-brand-500 transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                {link.description}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-brand-500 group-hover:translate-x-1 transition-transform">
              <span>{link.buttonText}</span>
              <FiExternalLink className="w-4 h-4" />
            </div>
          </motion.a>
        ))}
      </div>
    </motion.section>
  );
};
