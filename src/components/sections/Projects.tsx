import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiGithub, FiStar, FiArrowRight } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { projectsApi } from '../../api';
import { Project } from '../../types';

function getProjectRole(project: Project): string {
  const techs = (project.technologies || []).map((t) => t.toLowerCase()).join(' ');
  const tags = (project.tags || []).map((t) => t.toLowerCase()).join(' ');
  const combined = `${techs} ${tags} ${project.title.toLowerCase()}`;

  if (
    combined.includes('security') ||
    combined.includes('vapt') ||
    combined.includes('owasp') ||
    combined.includes('penetration') ||
    combined.includes('auth')
  ) {
    return 'Backend & Security';
  }
  if (combined.includes('next') || combined.includes('react') || combined.includes('full') || combined.includes('node')) {
    return 'Full-Stack';
  }
  return 'Full-Stack';
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);
  const roleBadge = getProjectRole(project);
  const liveLink = project.demoUrl || project.liveUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      className="group relative glass-light rounded-2xl overflow-hidden border border-[var(--border)] hover:border-brand-500/40 transition-all duration-300 card-hover flex flex-col justify-between h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex-1 flex flex-col">
        {/* Media Container */}
        <Link
          to={`/projects/${project.id}`}
          className="block relative h-48 sm:h-52 overflow-hidden bg-[var(--bg-overlay)] shrink-0"
        >
          {project.imageUrl ? (
            <motion.img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-600/20 to-accent-violet/20 flex items-center justify-center">
              <span className="font-display font-bold text-5xl text-brand-500/30">
                {project.title[0]}
              </span>
            </div>
          )}

          {/* Badges Overlay */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
            {project.featured ? (
              <div className="flex items-center gap-1.5 bg-brand-500/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs">
                <FiStar size={11} />
                <span>Featured</span>
              </div>
            ) : (
              <div />
            )}

            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-black/65 backdrop-blur-md text-brand-300 border border-brand-500/30">
              {roleBadge}
            </span>
          </div>

          {/* Gradient shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/80 via-transparent to-transparent opacity-60" />
        </Link>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/projects/${project.id}`}>
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2 group-hover:text-brand-400 transition-colors line-clamp-1">
                {project.title}
              </h3>
            </Link>
            <p className="text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          {Array.isArray(project.technologies) && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {project.technologies.slice(0, 4).map((tech) => (
                <span key={tech} className="tag text-[11px] py-0.5 px-2">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span className="tag text-[11px] py-0.5 px-2 text-[var(--text-muted)]">
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Direct Action Footer - Always visible without hover */}
      <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--border)]/60 flex items-center justify-between gap-2 bg-[var(--bg-overlay)]/40 shrink-0">
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 hover:translate-x-0.5 transition-all"
        >
          <span>Details</span>
          <FiArrowRight size={13} />
        </Link>

        <div className="flex items-center gap-1.5">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/10 border border-[var(--border)] transition-colors"
              title="View GitHub Repository"
            >
              <FiGithub size={13} />
              <span className="hidden xs:inline">Code</span>
            </a>
          )}

          {liveLink && (
            <a
              href={liveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-brand-500 hover:bg-brand-400 shadow-xs transition-colors"
              title="Open Live Application"
            >
              <FiExternalLink size={13} />
              <span>Live Demo</span>
            </a>
          )}
        </div>
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
