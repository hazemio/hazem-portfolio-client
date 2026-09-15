import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiStar,
  FiExternalLink,
  FiGithub,
  FiYoutube,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiCheck,
  FiUpload,
  FiImage,
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiLayers,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks';
import { projectsApi } from '../../api';
import { Project, ProjectImage } from '../../types';

// Helper to normalize tech array or string
const normalizeTech = (t: any): string[] => {
  if (!t) return [];
  if (Array.isArray(t)) return t;
  return String(t)
    .split(',')
    .map((x: string) => x.trim())
    .filter(Boolean);
};

interface ProjectFormData {
  title: string;
  description: string;
  detailedContent: string;
  demoUrl: string;
  youtubeUrl: string;
  githubUrl: string;
  technologies: string;
  featured: boolean;
  order: number;
}

const DEFAULT_FORM: ProjectFormData = {
  title: '',
  description: '',
  detailedContent: '',
  demoUrl: '',
  youtubeUrl: '',
  githubUrl: '',
  technologies: '',
  featured: false,
  order: 0,
};

export default function AdminProjects() {
  const { data: projects, loading, refetch } = useApi<Project[]>(() => projectsApi.getAll());
  const items = projects || [];

  // Modals state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);

  // Form state
  const [form, setForm] = useState<ProjectFormData>(DEFAULT_FORM);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'cover' | 'gallery'>('details');

  // Gallery state
  const [projectGalleryImages, setProjectGalleryImages] = useState<ProjectImage[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const quickGalleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Open Add Project Modal
  const handleOpenAdd = () => {
    setEditingProject(null);
    setForm(DEFAULT_FORM);
    setCoverFile(null);
    setCoverPreview(null);
    setProjectGalleryImages([]);
    setActiveTab('details');
    setProjectModalOpen(true);
  };

  // Open Edit Project Modal
  const handleOpenEdit = async (p: Project) => {
    setEditingProject(p);
    setForm({
      title: p.title || '',
      description: p.description || '',
      detailedContent: p.detailedContent || '',
      demoUrl: p.demoUrl || '',
      youtubeUrl: p.youtubeUrl || '',
      githubUrl: p.githubUrl || '',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
      featured: Boolean(p.featured),
      order: p.order ?? 0,
    });
    setCoverFile(null);
    setCoverPreview(p.imageUrl || null);
    setProjectGalleryImages(p.images || []);
    setActiveTab('details');
    setProjectModalOpen(true);

    // Fetch latest gallery images
    try {
      const res = await projectsApi.getGalleryImages(p.id);
      setProjectGalleryImages(res.data);
    } catch {
      // ignore
    }
  };

  // Open Quick Gallery Manager
  const handleOpenQuickGallery = async (p: Project) => {
    setGalleryProject(p);
    setProjectGalleryImages(p.images || []);
    setGalleryModalOpen(true);

    try {
      const res = await projectsApi.getGalleryImages(p.id);
      setProjectGalleryImages(res.data);
    } catch {
      // ignore
    }
  };

  // Handle Cover Image selection
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Handle Project Form Submission (Create or Update)
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      detailedContent: form.detailedContent.trim() || undefined,
      demoUrl: form.demoUrl.trim() || undefined,
      youtubeUrl: form.youtubeUrl.trim() || undefined,
      githubUrl: form.githubUrl.trim() || undefined,
      technologies: normalizeTech(form.technologies),
      featured: form.featured,
      order: Number(form.order) || 0,
    };

    try {
      let savedProjectId = editingProject?.id;

      if (editingProject) {
        await projectsApi.update(editingProject.id, payload);
        toast.success('Project updated successfully');
      } else {
        const res = await projectsApi.create(payload);
        savedProjectId = res.data.id;
        toast.success('Project created successfully');
      }

      // If a cover file was selected, upload it
      if (coverFile && savedProjectId) {
        toast.loading('Uploading main cover image...', { id: 'cover-upload' });
        await projectsApi.uploadImage(savedProjectId, coverFile);
        toast.success('Cover image uploaded', { id: 'cover-upload' });
      }

      setProjectModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  // Delete project
  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}" and all its gallery images?`)) return;
    setDeletingId(id);
    try {
      await projectsApi.delete(id);
      toast.success('Project and associated assets deleted');
      refetch();
    } catch {
      toast.error('Failed to delete project');
    } finally {
      setDeletingId(null);
    }
  };

  // Upload multiple gallery images
  const handleUploadGalleryImages = async (projectId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    setUploadingGallery(true);
    toast.loading(`Uploading ${fileArray.length} gallery image(s)...`, { id: 'gallery-upload' });

    try {
      const res = await projectsApi.uploadGalleryImages(projectId, fileArray);
      toast.success('Gallery images uploaded successfully', { id: 'gallery-upload' });
      const updatedImages = [...projectGalleryImages, ...res.data];
      setProjectGalleryImages(updatedImages);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload gallery images', { id: 'gallery-upload' });
    } finally {
      setUploadingGallery(false);
    }
  };

  // Delete single gallery image
  const handleDeleteGalleryImage = async (projectId: string, imageId: string) => {
    try {
      await projectsApi.deleteGalleryImage(projectId, imageId);
      setProjectGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Gallery image removed');
      refetch();
    } catch {
      toast.error('Failed to remove gallery image');
    }
  };

  // Move gallery image up/down
  const handleMoveGalleryImage = async (projectId: string, index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projectGalleryImages.length) return;

    const newImages = [...projectGalleryImages];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;

    setProjectGalleryImages(newImages);

    try {
      const imageIds = newImages.map((img) => img.id);
      await projectsApi.reorderGalleryImages(projectId, imageIds);
      toast.success('Gallery order updated');
      refetch();
    } catch {
      toast.error('Failed to update gallery order');
    }
  };

  // Update gallery image caption / alt
  const handleUpdateImageAlt = async (projectId: string, imageId: string, alt: string) => {
    try {
      await projectsApi.updateGalleryImage(projectId, imageId, { alt });
      setProjectGalleryImages((prev) =>
        prev.map((img) => (img.id === imageId ? { ...img, alt } : img)),
      );
    } catch {
      toast.error('Failed to update caption');
    }
  };

  // Filtered projects
  const filteredProjects = items.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesTitle = p.title?.toLowerCase().includes(q);
    const matchesTech = (p.technologies || []).some((t) => t.toLowerCase().includes(q));
    return matchesTitle || matchesTech;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Projects</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            Manage projects, main cover art, and high-resolution photo galleries ({items.length} total)
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleOpenAdd}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <FiPlus size={16} />
          <span>Add Project</span>
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative max-w-md">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search projects by title or tech tag..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-brand-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Projects Table */}
      <div className="glass-light rounded-2xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-muted)]">
            <FiLayers size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">No projects found</p>
            <p className="text-xs mt-1">Click "Add Project" to publish your first work.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-overlay)] text-left text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  <th className="px-6 py-3.5">Cover &amp; Project</th>
                  <th className="px-4 py-3.5">Links &amp; Tags</th>
                  <th className="px-4 py-3.5">Gallery</th>
                  <th className="px-4 py-3.5">Order</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-sm">
                {filteredProjects.map((p) => {
                  const galleryCount = p.images?.length || 0;
                  return (
                    <tr key={p.id} className="hover:bg-[var(--bg-overlay)]/50 transition-colors group">
                      {/* Cover & Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[var(--bg-overlay)] border border-[var(--border)] shrink-0">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-brand-500 font-bold text-lg bg-brand-500/10">
                                {p.title[0]}
                              </div>
                            )}
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-white/90 py-0.5">
                              Cover
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[var(--text-primary)] truncate max-w-xs sm:max-w-sm">
                                {p.title}
                              </span>
                              {p.featured && (
                                <span className="flex items-center gap-1 text-[10px] font-semibold text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded-full shrink-0">
                                  <FiStar size={10} />
                                  <span>Featured</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5 max-w-md">
                              {p.description}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Links & Tags */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {p.demoUrl && (
                              <a
                                href={p.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-brand-400 flex items-center gap-1 hover:underline"
                              >
                                <FiExternalLink size={11} />
                                Live
                              </a>
                            )}
                            {p.youtubeUrl && (
                              <a
                                href={p.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-red-400 flex items-center gap-1 hover:underline"
                              >
                                <FiYoutube size={11} />
                                Video
                              </a>
                            )}
                            {p.githubUrl && (
                              <a
                                href={p.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[var(--text-muted)] flex items-center gap-1 hover:underline"
                              >
                                <FiGithub size={11} />
                                Code
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            {(p.technologies || []).slice(0, 3).map((t) => (
                              <span key={t} className="tag text-[10px] py-0 px-1.5">
                                {t}
                              </span>
                            ))}
                            {(p.technologies || []).length > 3 && (
                              <span className="text-[10px] text-[var(--text-muted)]">
                                +{(p.technologies || []).length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Gallery Badge & Quick Manager */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => handleOpenQuickGallery(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                            galleryCount > 0
                              ? 'bg-accent-violet/10 text-accent-violet border-accent-violet/30 hover:bg-accent-violet/20'
                              : 'bg-white/5 text-[var(--text-muted)] border-[var(--border)] hover:bg-white/10'
                          }`}
                          title="Manage Gallery Images"
                        >
                          <FiImage size={13} />
                          <span>{galleryCount} Photo{galleryCount !== 1 ? 's' : ''}</span>
                        </button>
                      </td>

                      {/* Order */}
                      <td className="px-4 py-4 font-mono text-xs text-[var(--text-muted)]">
                        {p.order ?? 0}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenQuickGallery(p)}
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent-violet hover:bg-accent-violet/10 transition-colors cursor-pointer"
                            title="Manage Gallery"
                          >
                            <FiImage size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-brand-500 hover:bg-brand-500/10 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(p.id, p.title)}
                            disabled={deletingId === p.id}
                            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent-rose hover:bg-accent-rose/10 transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Project"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PROJECT FORM MODAL (Add / Edit) ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {projectModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-md"
                onClick={() => setProjectModalOpen(false)}
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-3xl glass-card rounded-2xl border border-[var(--border)] shadow-2xl p-6 sm:p-8 z-10 my-8 max-h-[90vh] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
                  <div>
                    <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
                      {editingProject ? `Edit "${editingProject.title}"` : 'Create New Project'}
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Configure project metadata, main cover image, and gallery screenshots
                    </p>
                  </div>
                  <button
                    onClick={() => setProjectModalOpen(false)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] transition-colors cursor-pointer"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Section Navigation Tabs */}
                <div className="flex items-center gap-2 pt-4 pb-2 shrink-0 border-b border-[var(--border)]">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]'
                    }`}
                  >
                    1. Basic Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cover')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      activeTab === 'cover'
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]'
                    }`}
                  >
                    2. Cover Image {coverPreview && '✓'}
                  </button>
                  {editingProject && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('gallery')}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        activeTab === 'gallery'
                          ? 'bg-brand-500 text-white shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]'
                      }`}
                    >
                      3. Gallery ({projectGalleryImages.length})
                    </button>
                  )}
                </div>

                {/* Body / Scrollable Area */}
                <form onSubmit={handleSubmitProject} className="overflow-y-auto flex-1 py-4 pr-1 space-y-5">
                  {/* TAB 1: BASIC DETAILS */}
                  {activeTab === 'details' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                          Project Title <span className="text-accent-rose">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. Enterprise Cyber Threat Dashboard"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                          Short Description <span className="text-accent-rose">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Brief overview of the problem solved and core capabilities..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                          Detailed Content (Markdown / Long Form)
                        </label>
                        <textarea
                          rows={5}
                          value={form.detailedContent}
                          onChange={(e) => setForm({ ...form, detailedContent: e.target.value })}
                          placeholder="In-depth case study description, architecture decisions, challenges..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none font-mono text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            Live Demo URL
                          </label>
                          <input
                            type="url"
                            value={form.demoUrl}
                            onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            GitHub Repository URL
                          </label>
                          <input
                            type="url"
                            value={form.githubUrl}
                            onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                            placeholder="https://github.com/..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            YouTube Video Demo URL (Optional)
                          </label>
                          <input
                            type="url"
                            value={form.youtubeUrl}
                            onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            Technologies / Tags (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={form.technologies}
                            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                            placeholder="React, NestJS, Docker, PostgreSQL"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={form.order}
                            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-sm text-[var(--text-primary)] focus:border-brand-500 focus:outline-none"
                          />
                        </div>

                        <div className="flex items-center gap-3 pt-6">
                          <label className="relative flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={form.featured}
                              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                              className="w-4 h-4 rounded text-brand-500 focus:ring-brand-500"
                            />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                              Mark as Featured Project
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MAIN COVER IMAGE */}
                  {activeTab === 'cover' && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs text-[var(--text-secondary)]">
                        <strong className="text-brand-400">Main Cover Image:</strong> This is the primary hero image displayed on the project card thumbnail and banner.
                      </div>

                      {coverPreview ? (
                        <div className="relative aspect-video w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-[var(--border)] bg-black/40">
                          <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 cursor-pointer">
                              <FiUpload size={14} />
                              <span>Replace Image</span>
                              <input type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setCoverFile(null);
                                setCoverPreview(null);
                              }}
                              className="p-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors cursor-pointer"
                              title="Remove"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center aspect-video w-full max-w-lg mx-auto rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-brand-500/50 bg-[var(--bg-overlay)] cursor-pointer transition-colors p-6 text-center">
                          <FiUpload size={32} className="text-brand-400 mb-2" />
                          <span className="text-sm font-semibold text-[var(--text-primary)]">
                            Choose Main Cover Image
                          </span>
                          <span className="text-xs text-[var(--text-muted)] mt-1">
                            PNG, JPG, WebP up to 5MB
                          </span>
                          <input type="file" accept="image/*" onChange={handleCoverSelect} className="hidden" />
                        </label>
                      )}
                    </div>
                  )}

                  {/* TAB 3: GALLERY SECTION */}
                  {activeTab === 'gallery' && editingProject && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-accent-violet/5 border border-accent-violet/20">
                        <div>
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-accent-violet">
                            Project Photo Gallery
                          </h4>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            Upload multiple screenshots or detail images. Users can browse these in a responsive carousel &amp; lightbox.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => galleryFileInputRef.current?.click()}
                          disabled={uploadingGallery}
                          className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                        >
                          <FiUpload size={14} />
                          <span>{uploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
                        </button>
                        <input
                          ref={galleryFileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadGalleryImages(editingProject.id, e.target.files)}
                        />
                      </div>

                      {projectGalleryImages.length === 0 ? (
                        <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[var(--border)] text-[var(--text-muted)]">
                          <FiImage size={32} className="mx-auto mb-2 opacity-30 text-accent-violet" />
                          <p className="text-sm">No gallery images uploaded yet.</p>
                          <p className="text-xs mt-1">Click "Upload Photos" above to select multiple images.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                          {projectGalleryImages.map((img, idx) => (
                            <div
                              key={img.id}
                              className="p-3 rounded-xl glass-light border border-[var(--border)] flex items-center gap-3 group relative"
                            >
                              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/30 shrink-0">
                                <img src={img.imageUrl} alt={img.alt || `Photo ${idx + 1}`} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-white/80">
                                  #{idx + 1}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <input
                                  type="text"
                                  defaultValue={img.alt || ''}
                                  placeholder="Caption / Alt text"
                                  onBlur={(e) => handleUpdateImageAlt(editingProject.id, img.id, e.target.value)}
                                  className="w-full text-xs px-2 py-1 rounded bg-[var(--bg-overlay)] border border-[var(--border)] focus:border-brand-500 focus:outline-none"
                                />
                                <div className="flex items-center gap-1 mt-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveGalleryImage(editingProject.id, idx, 'up')}
                                    disabled={idx === 0}
                                    className="p-1 rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-white disabled:opacity-30 cursor-pointer"
                                    title="Move Up"
                                  >
                                    <FiArrowUp size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveGalleryImage(editingProject.id, idx, 'down')}
                                    disabled={idx === projectGalleryImages.length - 1}
                                    className="p-1 rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-white disabled:opacity-30 cursor-pointer"
                                    title="Move Down"
                                  >
                                    <FiArrowDown size={13} />
                                  </button>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(editingProject.id, img.id)}
                                className="p-1.5 rounded-lg text-accent-rose hover:bg-accent-rose/10 transition-colors cursor-pointer"
                                title="Remove Image"
                              >
                                <FiTrash2 size={15} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)] shrink-0">
                    <button
                      type="button"
                      onClick={() => setProjectModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary text-sm px-6 py-2 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <FiCheck size={16} />
                      <span>{saving ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      {/* ── QUICK GALLERY MANAGER MODAL ── */}
      {mounted && createPortal(
        <AnimatePresence>
          {galleryModalOpen && galleryProject && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/75 backdrop-blur-md"
                onClick={() => setGalleryModalOpen(false)}
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative w-full max-w-2xl glass-card rounded-2xl border border-[var(--border)] shadow-2xl p-6 z-10 my-8 max-h-[85vh] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border)] shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
                      <FiImage size={20} />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">
                        Gallery for "{galleryProject.title}"
                      </h2>
                      <p className="text-xs text-[var(--text-muted)]">
                        {projectGalleryImages.length} image{projectGalleryImages.length !== 1 ? 's' : ''} in gallery
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setGalleryModalOpen(false)}
                    className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)] transition-colors cursor-pointer"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                {/* Upload Action */}
                <div className="py-4 shrink-0 flex items-center justify-between gap-4 border-b border-[var(--border)]">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Upload multiple screenshots or images at once. Drag &amp; drop or click the button.
                  </p>
                  <button
                    type="button"
                    onClick={() => quickGalleryInputRef.current?.click()}
                    disabled={uploadingGallery}
                    className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <FiUpload size={14} />
                    <span>{uploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
                  </button>
                  <input
                    ref={quickGalleryInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadGalleryImages(galleryProject.id, e.target.files)}
                  />
                </div>

                {/* Image List */}
                <div className="overflow-y-auto flex-1 py-4 space-y-3">
                  {projectGalleryImages.length === 0 ? (
                    <div className="py-14 text-center rounded-xl border-2 border-dashed border-[var(--border)] text-[var(--text-muted)]">
                      <FiImage size={36} className="mx-auto mb-2 opacity-30 text-accent-violet" />
                      <p className="text-sm font-medium">Gallery is currently empty</p>
                      <p className="text-xs mt-1">Upload photos to display a high-resolution preview carousel on the project page.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projectGalleryImages.map((img, idx) => (
                        <div
                          key={img.id}
                          className="p-3 rounded-xl glass-light border border-[var(--border)] flex items-center gap-3 group"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black/40 shrink-0">
                            <img src={img.imageUrl} alt={img.alt || `Photo ${idx + 1}`} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-center text-white/80">
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              defaultValue={img.alt || ''}
                              placeholder="Caption / Alt text"
                              onBlur={(e) => handleUpdateImageAlt(galleryProject.id, img.id, e.target.value)}
                              className="w-full text-xs px-2 py-1 rounded bg-[var(--bg-overlay)] border border-[var(--border)] focus:border-brand-500 focus:outline-none"
                            />
                            <div className="flex items-center gap-1 mt-1.5">
                              <button
                                type="button"
                                onClick={() => handleMoveGalleryImage(galleryProject.id, idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Up"
                              >
                                <FiArrowUp size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveGalleryImage(galleryProject.id, idx, 'down')}
                                disabled={idx === projectGalleryImages.length - 1}
                                className="p-1 rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-white disabled:opacity-30 cursor-pointer"
                                title="Move Down"
                              >
                                <FiArrowDown size={13} />
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(galleryProject.id, img.id)}
                            className="p-1.5 rounded-lg text-accent-rose hover:bg-accent-rose/10 transition-colors cursor-pointer"
                            title="Delete Image"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[var(--border)] shrink-0 flex justify-end">
                  <button
                    onClick={() => setGalleryModalOpen(false)}
                    className="btn-primary text-xs py-2 px-4 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}