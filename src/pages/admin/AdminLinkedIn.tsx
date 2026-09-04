import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import {
  FiRefreshCw,
  FiLink,
  FiLogOut,
  FiCheckCircle,
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
  FiStar,
  FiTrash2,
  FiExternalLink,
  FiPlus,
  FiEdit2,
  FiX,
  FiCheck,
  FiImage,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks';
import { linkedinApi } from '../../api';
import { LinkedInPost, LinkedInStatus } from '../../types';

interface PostFormData {
  title: string;
  content: string;
  linkedinUrl: string;
  publishedAt: string;
  isVisible: boolean;
  isFeatured: boolean;
  order: number;
}

const DEFAULT_FORM: PostFormData = {
  title: '',
  content: '',
  linkedinUrl: '',
  publishedAt: new Date().toISOString().split('T')[0],
  isVisible: true,
  isFeatured: false,
  order: 0,
};

export default function AdminLinkedIn() {
  const { data: status, refetch: refetchStatus } = useApi<LinkedInStatus>(() =>
    linkedinApi.getStatus(),
  );
  const {
    data: posts,
    loading: loadingPosts,
    refetch: refetchPosts,
  } = useApi<LinkedInPost[]>(() => linkedinApi.getAdminPosts());

  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Manual CRUD modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<LinkedInPost | null>(null);
  const [form, setForm] = useState<PostFormData>(DEFAULT_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Check URL params for OAuth callback return state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('linkedin_connected') === 'true') {
      toast.success('LinkedIn account connected successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
      refetchStatus();
      refetchPosts();
    } else if (params.get('linkedin_error')) {
      const err = params.get('linkedin_error');
      toast.error(`LinkedIn OAuth error: ${err}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refetchStatus, refetchPosts]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await linkedinApi.getAuthUrl();
      if (res.data?.authUrl) {
        window.location.href = res.data.authUrl;
      } else {
        toast.error('Could not obtain LinkedIn Auth URL');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to initiate LinkedIn OAuth');
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await linkedinApi.sync();
      toast.success(res.data?.message || 'LinkedIn posts synced!');
      refetchStatus();
      refetchPosts();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to sync LinkedIn posts');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your LinkedIn account?')) return;
    try {
      await linkedinApi.disconnect();
      toast.success('LinkedIn account disconnected');
      refetchStatus();
      refetchPosts();
    } catch {
      toast.error('Failed to disconnect LinkedIn');
    }
  };

  const handleToggleVisibility = async (post: LinkedInPost) => {
    try {
      await linkedinApi.updateLinkedInPost(post.id, { isVisible: !post.isVisible });
      toast.success(`Post visibility ${!post.isVisible ? 'enabled' : 'hidden'}`);
      refetchPosts();
      refetchStatus();
    } catch {
      toast.error('Failed to update post visibility');
    }
  };

  const handleToggleFeatured = async (post: LinkedInPost) => {
    try {
      await linkedinApi.updateLinkedInPost(post.id, { isFeatured: !post.isFeatured });
      toast.success(`Post ${!post.isFeatured ? 'marked as featured' : 'unfeatured'}`);
      refetchPosts();
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post? This will also remove associated images.')) return;
    setDeletingId(id);
    try {
      await linkedinApi.deleteLinkedInPost(id);
      toast.success('Post deleted successfully');
      refetchPosts();
      refetchStatus();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const openCreateModal = () => {
    setEditingPost(null);
    setForm({
      ...DEFAULT_FORM,
      publishedAt: new Date().toISOString().split('T')[0],
    });
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setModalOpen(true);
  };

  const openEditModal = (post: LinkedInPost) => {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      content: post.content || post.text || '',
      linkedinUrl: post.linkedinUrl || post.postUrl || '',
      publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().split('T')[0] : '',
      isVisible: post.isVisible,
      isFeatured: post.isFeatured,
      order: post.order ?? 0,
    });
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setModalOpen(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setRemoveExistingImage(false);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title.trim());
      fd.append('content', form.content.trim());
      if (form.linkedinUrl) {
        fd.append('linkedinUrl', form.linkedinUrl.trim());
      }
      if (form.publishedAt) {
        fd.append('publishedAt', new Date(form.publishedAt).toISOString());
      }
      fd.append('isVisible', String(form.isVisible));
      fd.append('isFeatured', String(form.isFeatured));
      fd.append('order', String(form.order));

      if (imageFile) {
        fd.append('image', imageFile);
      } else if (removeExistingImage) {
        fd.append('imageUrl', '');
        fd.append('imageId', '');
      }

      if (editingPost) {
        await linkedinApi.updateLinkedInPost(editingPost.id, fd);
        toast.success('Post updated successfully!');
      } else {
        await linkedinApi.createLinkedInPost(fd);
        toast.success('Post created successfully!');
      }

      setModalOpen(false);
      refetchPosts();
      refetchStatus();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const allPosts = posts || [];

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">
            LinkedIn Posts Management
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Create manual posts, manage visibility, or sync automatically with your LinkedIn account.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreateModal}
          className="btn-primary bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-sky-500/20 shrink-0 self-start sm:self-auto"
        >
          <FiPlus size={18} />
          <span>Add Manual Post</span>
        </motion.button>
      </div>

      {/* Connection Status Card (OAuth) */}
      <div className="glass-light rounded-2xl p-6 border border-sky-500/30 mb-8 bg-gradient-to-br from-sky-500/5 to-transparent relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0 shadow-inner">
              <FaLinkedin size={30} />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                  {status?.memberName ? status.memberName : 'LinkedIn Account'}
                </h3>
                {status?.isConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <FiCheckCircle size={12} /> Connected
                  </span>
                ) : status?.isExpired ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    <FiAlertTriangle size={12} /> Token Expired
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] bg-[var(--bg-overlay)] border border-[var(--border)] px-2.5 py-0.5 rounded-full">
                    Not Connected
                  </span>
                )}
              </div>

              {status?.memberEmail && (
                <p className="text-xs text-[var(--text-muted)] mb-1">{status.memberEmail}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-secondary)] mt-2">
                <span>
                  Total Posts: <strong className="text-[var(--text-primary)]">{allPosts.length}</strong>
                </span>
                <span>
                  Visible: <strong className="text-sky-400">{allPosts.filter((p) => p.isVisible).length}</strong>
                </span>
                {status?.lastSyncAt && (
                  <span>
                    Last Sync: <strong className="text-[var(--text-primary)]">{new Date(status.lastSyncAt).toLocaleString()}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {status?.isConnected ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSync}
                  disabled={syncing}
                  className="btn-primary bg-sky-600 hover:bg-sky-500 text-xs py-2 px-4 flex items-center gap-2"
                >
                  <FiRefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
                  <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </motion.button>

                <button
                  onClick={handleDisconnect}
                  className="btn-ghost text-red-400 hover:bg-red-500/10 text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <FiLogOut size={14} /> Disconnect
                </button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConnect}
                disabled={connecting}
                className="btn-primary bg-sky-600 hover:bg-sky-500 text-xs py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <FiLink size={15} />
                <span>{connecting ? 'Redirecting...' : 'Connect LinkedIn'}</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* API Permissions Note Banner */}
        <div className="mt-5 pt-4 border-t border-sky-500/20 text-xs text-[var(--text-secondary)] leading-relaxed">
          <p className="flex items-center gap-1.5 text-sky-400 font-semibold mb-1">
            <FiAlertTriangle size={13} /> Official LinkedIn API Note:
          </p>
          <p className="text-[var(--text-muted)]">
            Manual posts can be created and managed anytime below without requiring LinkedIn OAuth connection.
          </p>
        </div>
      </div>

      {/* Posts Table */}
      <div className="glass-light rounded-2xl border border-[var(--border)] overflow-hidden shadow-glass">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">
              Manual & Synced LinkedIn Posts
            </h3>
            <span className="text-xs text-[var(--text-muted)] font-mono bg-[var(--bg-overlay)] px-2.5 py-0.5 rounded-full border border-[var(--border)]">
              {allPosts.length} Posts
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={openCreateModal}
            className="btn-ghost text-sky-400 hover:bg-sky-500/10 text-xs py-1.5 px-3 flex items-center gap-1.5 font-semibold"
          >
            <FiPlus size={14} />
            <span>New Post</span>
          </motion.button>
        </div>

        {loadingPosts ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : allPosts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-secondary)]">
              <thead className="bg-[var(--bg-overlay)] text-xs uppercase font-mono text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3">Post</th>
                  <th className="px-4 py-3 text-center">Order</th>
                  <th className="px-4 py-3">Published Date</th>
                  <th className="px-4 py-3 text-center">Visibility</th>
                  <th className="px-4 py-3 text-center">Featured</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {allPosts.map((post) => {
                  const targetUrl = post.linkedinUrl || post.postUrl;
                  const postContent = post.content || post.text || '';
                  const isManual = post.source === 'MANUAL' || !post.linkedinId;

                  return (
                    <tr key={post.id} className="hover:bg-[var(--bg-overlay)]/50 transition-colors">
                      {/* Post Info & Image */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3 max-w-lg">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--bg-overlay)] border border-[var(--border)] shrink-0 flex items-center justify-center">
                            {post.imageUrl ? (
                              <img
                                src={post.imageUrl}
                                alt={post.title || 'Post thumbnail'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaLinkedin size={22} className="text-sky-500/60" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">
                                {post.title || 'Untitled Post'}
                              </h4>
                              {isManual ? (
                                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.2 rounded border border-emerald-500/30">
                                  Manual
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono uppercase bg-sky-500/10 text-sky-400 px-2 py-0.2 rounded border border-sky-500/30">
                                  OAuth
                                </span>
                              )}
                            </div>

                            <p className="line-clamp-2 text-xs text-[var(--text-muted)] leading-relaxed">
                              {postContent}
                            </p>

                            {targetUrl && (
                              <a
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-sky-400 hover:underline mt-1 truncate max-w-xs"
                              >
                                <FiExternalLink size={10} />
                                <span className="truncate">{targetUrl}</span>
                              </a>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Order */}
                      <td className="px-4 py-4 text-center whitespace-nowrap text-xs font-mono">
                        <span className="bg-[var(--bg-overlay)] px-2 py-1 rounded border border-[var(--border)]">
                          {post.order ?? 0}
                        </span>
                      </td>

                      {/* Published Date */}
                      <td className="px-4 py-4 whitespace-nowrap text-xs font-mono text-[var(--text-muted)]">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Visibility Toggle */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleVisibility(post)}
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${
                            post.isVisible
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {post.isVisible ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                          {post.isVisible ? 'Visible' : 'Hidden'}
                        </button>
                      </td>

                      {/* Featured Toggle */}
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleFeatured(post)}
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${
                            post.isFeatured
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'text-[var(--text-muted)] border-[var(--border)]'
                          }`}
                        >
                          <FiStar size={12} className={post.isFeatured ? 'fill-amber-400' : ''} />
                          {post.isFeatured ? 'Featured' : 'Standard'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                        {targetUrl && (
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 inline-block rounded-lg text-[var(--text-muted)] hover:text-sky-400 hover:bg-sky-500/10 transition-colors"
                            title="View on LinkedIn"
                          >
                            <FiExternalLink size={15} />
                          </a>
                        )}

                        <button
                          onClick={() => openEditModal(post)}
                          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-brand-500 hover:bg-brand-500/10 transition-colors"
                          title="Edit Post"
                        >
                          <FiEdit2 size={15} />
                        </button>

                        <button
                          onClick={() => handleDeletePost(post.id)}
                          disabled={deletingId === post.id}
                          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-50"
                          title="Delete Post"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-[var(--text-muted)] text-sm">
            <p className="mb-3">No LinkedIn posts yet.</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreateModal}
              className="btn-primary bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs py-2 px-4 inline-flex items-center gap-1.5"
            >
              <FiPlus size={15} />
              <span>Create Your First Post</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {modalOpen && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md"
                  onClick={() => setModalOpen(false)}
                />

                {/* Modal Content */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                  className="relative w-full max-w-xl bg-[var(--bg-base)] dark:bg-[var(--bg-raised)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden z-[10000]"
                >
                  <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                        <FaLinkedin size={18} />
                      </div>
                      <h2 className="font-display font-semibold text-lg text-[var(--text-primary)]">
                        {editingPost ? 'Edit LinkedIn Post' : 'Add Manual LinkedIn Post'}
                      </h2>
                    </div>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-overlay)] transition-colors"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  <form
                    onSubmit={handleFormSubmit}
                    className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar"
                  >
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Title <span className="text-accent-rose">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        placeholder="e.g. Modern Web Architecture with NestJS & React"
                        required
                        className="input-field"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Content <span className="text-accent-rose">*</span>
                      </label>
                      <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        placeholder="Write your LinkedIn post thoughts, insights, or update..."
                        rows={4}
                        required
                        className="input-field resize-none leading-relaxed"
                      />
                    </div>

                    {/* LinkedIn URL */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        LinkedIn URL <span className="text-xs text-[var(--text-muted)]">(Optional)</span>
                      </label>
                      <input
                        type="url"
                        value={form.linkedinUrl}
                        onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                        placeholder="https://www.linkedin.com/posts/..."
                        className="input-field"
                      />
                    </div>

                    {/* Optional Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        Post Image <span className="text-xs text-[var(--text-muted)]">(Optional)</span>
                      </label>

                      {/* If editing and has existing image without new file */}
                      {editingPost?.imageUrl && !imagePreview && !removeExistingImage && (
                        <div className="flex items-center gap-4 mb-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-overlay)]">
                          <img
                            src={editingPost.imageUrl}
                            alt="Current"
                            className="w-16 h-16 rounded-lg object-cover border border-[var(--border)]"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-[var(--text-secondary)] font-medium block">
                              Current Image
                            </span>
                            <button
                              type="button"
                              onClick={() => setRemoveExistingImage(true)}
                              className="text-xs text-rose-400 hover:underline mt-1 flex items-center gap-1"
                            >
                              <FiTrash2 size={12} /> Remove image
                            </button>
                          </div>
                        </div>
                      )}

                      {/* New Image Preview */}
                      {imagePreview && (
                        <div className="flex items-center gap-4 mb-3 p-3 rounded-xl border border-sky-500/30 bg-sky-500/5">
                          <img
                            src={imagePreview}
                            alt="New preview"
                            className="w-16 h-16 rounded-lg object-cover border border-sky-500/30"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs text-sky-400 font-medium block truncate">
                              {imageFile?.name}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {imageFile ? `${(imageFile.size / 1024).toFixed(1)} KB` : ''}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="text-xs text-rose-400 hover:underline mt-1 block"
                            >
                              Clear selected image
                            </button>
                          </div>
                        </div>
                      )}

                      {removeExistingImage && (
                        <p className="text-xs text-amber-400 mb-2 flex items-center gap-1">
                          <FiAlertTriangle size={12} /> Existing image will be deleted upon save.
                          <button
                            type="button"
                            onClick={() => setRemoveExistingImage(false)}
                            className="underline ml-1"
                          >
                            Undo
                          </button>
                        </p>
                      )}

                      <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[var(--border)] hover:border-sky-500/40 rounded-xl p-4 cursor-pointer transition-colors bg-[var(--bg-overlay)]/40 hover:bg-sky-500/5">
                        <FiImage size={18} className="text-sky-400" />
                        <span className="text-xs text-[var(--text-secondary)]">
                          {imageFile ? 'Change image file' : 'Choose image to upload'}
                        </span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Published Date & Order */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                          Published Date
                        </label>
                        <input
                          type="date"
                          value={form.publishedAt}
                          onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                          Display Order
                        </label>
                        <input
                          type="number"
                          value={form.order}
                          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                          placeholder="0"
                          className="input-field"
                        />
                      </div>
                    </div>

                    {/* Checkboxes: Visible & Featured */}
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isVisible}
                          onChange={(e) => setForm({ ...form, isVisible: e.target.checked })}
                          className="w-4 h-4 rounded accent-sky-600"
                        />
                        <span className="text-sm text-[var(--text-primary)]">Visible on Portfolio</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.isFeatured}
                          onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                          className="w-4 h-4 rounded accent-amber-500"
                        />
                        <span className="text-sm text-[var(--text-primary)]">Mark as Featured</span>
                      </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-[var(--bg-base)] dark:bg-[var(--bg-raised)] pb-2 border-t border-[var(--border)]">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="btn-ghost flex-1 justify-center py-2.5 text-sm"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary bg-sky-600 hover:bg-sky-500 flex-1 justify-center py-2.5 text-sm font-semibold flex items-center gap-2"
                      >
                        {saving ? (
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <FiCheck size={16} />
                        )}
                        <span>{saving ? 'Saving...' : editingPost ? 'Update Post' : 'Save Post'}</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
