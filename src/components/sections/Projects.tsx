import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiGithub, FiStar, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { projectsApi } from '../../api';
import { Project } from '../../types';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      className="group relative glass-light rounded-2xl overflow-hidden border border-[var(--border)] hover:border-brand-500/40 transition-all duration-300 card-hover flex flex-col justify-between"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        {/* Image */}
        <Link to={`/projects/${project.id}`} className="block relative h-52 overflow-hidden bg-[var(--bg-overlay)]">
          {project.imageUrl ? (
            <motion.img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.07 : 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-600/30 to-accent-violet/30 flex items-center justify-center">
              <span className="font-display font-bold text-5xl text-brand-500/30">
                {project.title[0]}
              </span>
            </div>
          )}

          {/* Overlay on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-brand-950/60 backdrop-blur-xs flex items-center justify-center gap-4 z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {(project.demoUrl || project.liveUrl) && (
                  <a
                    href={project.demoUrl || project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-brand-500 rounded-full border border-white/20 text-white transition-all duration-200 hover:scale-110"
                    title="Live Demo"
                  >
                    <FiExternalLink size={18} />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 hover:bg-brand-500 rounded-full border border-white/20 text-white transition-all duration-200 hover:scale-110"
                    title="GitHub Repository"
                  >
                    <FiGithub size={18} />
                  </a>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {project.featured && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-500/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm z-20">
              <FiStar size={11} />
              <span>Featured</span>
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-6">
          <Link to={`/projects/${project.id}`}>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-brand-500 transition-colors">
              {project.title}
            </h3>
          </Link>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>

          {/* Tags */}
          {Array.isArray(project.technologies) && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <span key={tech} className="tag text-xs">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="tag text-xs">+{project.technologies.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-0">
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-500 hover:translate-x-1 transition-transform"
        >
          <span>View Full Project</span>
          <FiArrowRight size={13} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const sectionRef = useScrollReveal();
  const { data: projects, loading } = useApi<Project[]>(() => projectsApi.getAll());
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const displayed =
    filter === 'featured'
      ? (projects || []).filter((p) => p.featured)
      : projects || [];

  return (
    <section id="projects" className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent-cyan/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom" ref={sectionRef as any}>
        <div className="mb-12 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            My Work
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
            A selection of projects I've built — from full-stack web apps to creative experiments.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(['all', 'featured'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                filter === f
                  ? 'bg-brand-500 text-white shadow-brand'
                  : 'glass-light border border-[var(--border)] text-[var(--text-secondary)] hover:border-brand-500/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-2xl" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-[var(--text-muted)]">
            No projects found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayed.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
