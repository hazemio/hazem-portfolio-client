import React from 'react';
import { motion } from 'framer-motion';
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNestjs,
  SiPostgresql,
  SiTailwindcss,
  SiDocker,
  SiNextdotjs,
  SiMongodb,
  SiPrisma,
  SiRedux,
  SiExpress,
  SiNodedotjs,
  SiPython,
  SiGit,
  SiVite,
  SiFramer,
  SiCloudinary,
  SiVercel,
} from 'react-icons/si';
import { FiCode, FiCpu } from 'react-icons/fi';
import { Project } from '../../types';

interface ProjectTechProps {
  project: Project;
}

const getTechIcon = (name: string) => {
  const normalized = name.toLowerCase().replace(/[\s.-]/g, '');

  if (normalized.includes('react')) return <SiReact className="text-[#61DAFB]" />;
  if (normalized.includes('typescript') || normalized === 'ts') return <SiTypescript className="text-[#3178C6]" />;
  if (normalized.includes('javascript') || normalized === 'js') return <SiJavascript className="text-[#F7DF1E]" />;
  if (normalized.includes('nest')) return <SiNestjs className="text-[#E0234E]" />;
  if (normalized.includes('postgres')) return <SiPostgresql className="text-[#4169E1]" />;
  if (normalized.includes('tailwind')) return <SiTailwindcss className="text-[#06B6D4]" />;
  if (normalized.includes('docker')) return <SiDocker className="text-[#2496ED]" />;
  if (normalized.includes('next')) return <SiNextdotjs className="text-[var(--text-primary)]" />;
  if (normalized.includes('mongo')) return <SiMongodb className="text-[#47A248]" />;
  if (normalized.includes('prisma')) return <SiPrisma className="text-[#2D3748]" />;
  if (normalized.includes('redux') || normalized.includes('zustand')) return <SiRedux className="text-[#764ABC]" />;
  if (normalized.includes('express')) return <SiExpress className="text-[var(--text-primary)]" />;
  if (normalized.includes('node')) return <SiNodedotjs className="text-[#5FA04E]" />;
  if (normalized.includes('python')) return <SiPython className="text-[#3776AB]" />;
  if (normalized.includes('git')) return <SiGit className="text-[#F05032]" />;
  if (normalized.includes('vite')) return <SiVite className="text-[#646CFF]" />;
  if (normalized.includes('framer') || normalized.includes('motion')) return <SiFramer className="text-[#0055FF]" />;
  if (normalized.includes('cloudinary')) return <SiCloudinary className="text-[#3448C5]" />;
  if (normalized.includes('vercel')) return <SiVercel className="text-[var(--text-primary)]" />;

  return <FiCode className="text-brand-500" />;
};

export const ProjectTech: React.FC<ProjectTechProps> = ({ project }) => {
  const techList =
    Array.isArray(project.technologies) && project.technologies.length > 0
      ? project.technologies
      : Array.isArray(project.tags) && project.tags.length > 0
      ? project.tags
      : [];

  if (techList.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-8"
    >
      <div className="glass-light rounded-2xl p-8 sm:p-10 border border-[var(--border)] shadow-glass">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-accent-violet/10 border border-accent-violet/20 text-accent-violet">
            <FiCpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              Technologies & <span className="gradient-text">Tools</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-0.5">
              Tech Stack Used to Build This Project
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="flex flex-wrap gap-3">
          {techList.map((tech, index) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] hover:border-brand-500/40 text-[var(--text-primary)] font-medium text-sm sm:text-base shadow-sm hover:shadow-brand transition-all cursor-default"
            >
              <span className="text-lg">{getTechIcon(tech)}</span>
              <span>{tech}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};
