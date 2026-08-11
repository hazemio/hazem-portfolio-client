import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowLeft, FiHome } from 'react-icons/fi';
import { useProject } from '../../hooks';
import { ProjectHero } from '../../components/project/ProjectHero';
import { ProjectOverview } from '../../components/project/ProjectOverview';
import { ProjectTech } from '../../components/project/ProjectTech';
import { ProjectStats } from '../../components/project/ProjectStats';
import { ProjectLinks } from '../../components/project/ProjectLinks';
import { ProjectGallery } from '../../components/project/ProjectGallery';
import { RelatedProjects } from '../../components/project/RelatedProjects';
import { ProjectCTA } from '../../components/project/ProjectCTA';

export default function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { project, loading, error } = useProject(id);

  // Scroll to top on route change / project ID change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [id]);

  // Update Page Title and Meta for SEO
  useEffect(() => {
    if (project) {
      document.title = `${project.title} — Portfolio Project`;
    } else if (error) {
      document.title = `Project Not Found — Portfolio`;
    } else {
      document.title = `Loading Project... — Portfolio`;
    }

    return () => {
      document.title = `Hazem — Full Stack Developer Portfolio`;
    };
  }, [project, error]);

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 container-custom">
        <div className="skeleton h-10 w-36 rounded-full mb-8" />
        <div className="max-w-4xl mx-auto text-center mb-12 space-y-4">
          <div className="skeleton h-14 w-3/4 mx-auto rounded-2xl" />
          <div className="skeleton h-6 w-1/2 mx-auto rounded-xl" />
        </div>
        <div className="max-w-5xl mx-auto skeleton aspect-video rounded-2xl mb-12" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-64 rounded-2xl mb-8" />
      </div>
    );
  }

  // 2. Error / 404 Not Found State
  if (error || !project) {
    return (
      <div className="min-h-[80vh] pt-32 pb-20 container-custom flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-light p-10 sm:p-14 rounded-3xl border border-[var(--border)] text-center max-w-lg shadow-brand-lg"
        >
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 w-fit mx-auto mb-6">
            <FiAlertCircle className="w-10 h-10" />
          </div>

          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mb-3">
            Project Not Found
          </h1>

          <p className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed mb-8">
            {error || "The requested project doesn't exist or may have been removed."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl"
            >
              <FiHome className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/#projects"
              className="btn-outline flex items-center gap-2 px-6 py-3 rounded-xl"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>All Projects</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. Full Project Details View
  return (
    <div className="min-h-screen">
      {/* Hero Section with Video / Main Banner & Action Buttons */}
      <ProjectHero project={project} />

      {/* Main Details Body Container */}
      <div className="container-custom space-y-4 pb-20">
        {/* Project Metrics & Stats Grid */}
        <ProjectStats project={project} />

        {/* Project Detailed Architecture & Overview */}
        <ProjectOverview project={project} />

        {/* Technologies & Tech Stack Badges */}
        <ProjectTech project={project} />

        {/* Available External Links */}
        <ProjectLinks project={project} />

        {/* High-Res Gallery & Screenshots */}
        <ProjectGallery project={project} />

        {/* Related Projects Recommendations */}
        <RelatedProjects currentProjectId={project.id} />

        {/* Call To Action */}
        <ProjectCTA />
      </div>
    </div>
  );
}
