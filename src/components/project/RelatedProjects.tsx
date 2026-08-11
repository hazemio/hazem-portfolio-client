import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiExternalLink, FiStar, FiGrid } from 'react-icons/fi';
import { useRelatedProjects } from '../../hooks';
import { Project } from '../../types';

interface RelatedProjectsProps {
  currentProjectId: string;
}

export const RelatedProjects: React.FC<RelatedProjectsProps> = ({
  currentProjectId,
}) => {
  const { relatedProjects, loading } = useRelatedProjects(currentProjectId);

  if (loading || relatedProjects.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12 border-t border-[var(--border)]"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500">
            <FiGrid className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)]">
              More <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] font-mono mt-0.5">
              Explore Related Work
            </p>
          </div>
        </div>

        <Link
          to="/#projects"
          className="btn-ghost text-sm font-semibold flex items-center gap-2 text-brand-500 hover:translate-x-1 transition-transform"
        >
          <span>View All</span>
          <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedProjects.map((project: Project, index: number) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group glass-light rounded-2xl overflow-hidden border border-[var(--border)] hover:border-brand-500/40 transition-all card-hover flex flex-col justify-between"
          >
            <div>
              {/* Card Image */}
              <div className="relative h-44 overflow-hidden bg-[var(--bg-overlay)]">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-600/20 to-accent-violet/20 flex items-center justify-center">
                    <span className="font-display font-bold text-4xl text-brand-500/30">
                      {project.title[0]}
                    </span>
                  </div>
                )}

                {project.featured && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-brand-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <FiStar size={11} />
                    <span>Featured</span>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-brand-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-0">
              <Link
                to={`/projects/${project.id}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full btn-outline flex items-center justify-center gap-2 py-2 text-sm rounded-xl"
              >
                <span>View Details</span>
                <FiExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
