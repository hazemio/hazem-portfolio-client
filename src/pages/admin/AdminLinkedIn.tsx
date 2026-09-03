import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import { FiRefreshCw, FiLink, FiLogOut, FiCheckCircle, FiAlertTriangle, FiEye, FiEyeOff, FiStar, FiTrash2, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks';
import { linkedinApi } from '../../api';
import { LinkedInPost, LinkedInStatus } from '../../types';

export default function AdminLinkedIn() {
  const { data: status, loading: l1, refetch: refetchStatus } = useApi<LinkedInStatus>(() => linkedinApi.getStatus());
  const { data: posts, loading: l2, refetch: refetchPosts } = useApi<LinkedInPost[]>(() => linkedinApi.getAdminPosts());
  const [syncing, setSyncing] = useState(false);
  const [connecting, setConnecting] = useState(false);

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
      await linkedinApi.updatePost(post.id, { isVisible: !post.isVisible });
      toast.success(`Post visibility ${!post.isVisible ? 'enabled' : 'hidden'}`);
      refetchPosts();
      refetchStatus();
    } catch {
      toast.error('Failed to update post visibility');
    }
  };

  const handleToggleFeatured = async (post: LinkedInPost) => {
    try {
      await linkedinApi.updatePost(post.id, { isFeatured: !post.isFeatured });
      toast.success(`Post ${!post.isFeatured ? 'marked as featured' : 'unfeatured'}`);
      refetchPosts();
    } catch {
      toast.error('Failed to update featured status');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this imported post?')) return;
    try {
      await linkedinApi.deletePost(id);
      toast.success('Post deleted');
      refetchPosts();
      refetchStatus();
    } catch {
      toast.error('Failed to delete post');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">LinkedIn Integration</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          OAuth 2.0 connection, post synchronization, and visibility controls for your portfolio.
        </p>
      </div>

      {/* Connection Status Card */}
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
                <span>Total Posts: <strong className="text-[var(--text-primary)]">{status?.totalPosts ?? 0}</strong></span>
                <span>Visible: <strong className="text-sky-400">{status?.visiblePosts ?? 0}</strong></span>
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
            <FiAlertTriangle size={13} /> Official LinkedIn API Requirement Note:
          </p>
          <p className="text-[var(--text-muted)]">
            To automatically import member posts, LinkedIn requires the application to hold the approved product scope{' '}
            <code className="text-sky-300 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-500/30">r_member_social</code>{' '}
            or Community Management API access. Server OAuth architecture & PostgreSQL syncing pipeline are fully prepared.
          </p>
        </div>
      </div>

      {/* Imported Posts Table */}
      <div className="glass-light rounded-2xl border border-[var(--border)] overflow-hidden shadow-glass">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Imported LinkedIn Posts</h3>
          <span className="text-xs text-[var(--text-muted)] font-mono">{(posts || []).length} Posts</span>
        </div>

        {l2 ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-xl" />
            ))}
          </div>
        ) : (posts || []).length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-secondary)]">
              <thead className="bg-[var(--bg-overlay)] text-xs uppercase font-mono text-[var(--text-muted)] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3">Post Content</th>
                  <th className="px-6 py-3">Published Date</th>
                  <th className="px-6 py-3">Visibility</th>
                  <th className="px-6 py-3">Featured</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {posts!.map((post) => (
                  <tr key={post.id} className="hover:bg-[var(--bg-overlay)]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <p className="line-clamp-2 text-xs text-[var(--text-primary)] font-medium">{post.text}</p>
                        {post.imageUrl && <span className="text-[10px] text-sky-400 font-mono mt-1 block">🖼️ Image Attached</span>}
                        {post.videoUrl && <span className="text-[10px] text-sky-400 font-mono mt-1 block">🎬 Video Attached</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-[var(--text-muted)]">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      {post.postUrl && (
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 inline-block text-[var(--text-muted)] hover:text-sky-400 transition-colors"
                          title="View on LinkedIn"
                        >
                          <FiExternalLink size={15} />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                        title="Delete Post"
                      >
                        <FiTrash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-[var(--text-muted)] text-sm">
            No LinkedIn posts imported yet. Click <strong className="text-sky-400">Connect LinkedIn</strong> or{' '}
            <strong className="text-sky-400">Sync Now</strong> to fetch your posts.
          </div>
        )}
      </div>
    </div>
  );
}
