import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import { FiExternalLink, FiCalendar, FiStar } from 'react-icons/fi';
import { LinkedInPost } from '../../types';

interface LinkedInPostCardProps {
  post: LinkedInPost;
  authorName?: string;
  authorRole?: string;
  authorImage?: string;
  index?: number;
}

export default function LinkedInPostCard({
  post,
  authorName = 'Hazem Gamal',
  authorRole = 'Full Stack Developer',
  authorImage,
  index = 0,
}: LinkedInPostCardProps) {
  const [imgError, setImgError] = useState(false);
  const targetUrl = post.linkedinUrl || post.postUrl;
  const postContent = post.content || post.text || '';
  const hasImage = Boolean(post.imageUrl && !imgError);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recent Post';

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      className={`group relative glass-light rounded-2xl overflow-hidden border transition-all duration-300 card-hover flex flex-col justify-between h-full ${
        post.isFeatured
          ? 'border-brand-500/40 shadow-[0_0_30px_rgba(99,102,241,0.15)] bg-gradient-to-b from-brand-500/5 to-transparent'
          : 'border-[var(--border)] hover:border-brand-500/30'
      }`}
    >
      <div>
        {/* Top Area: Author & Date & Badge */}
        <div className="p-5 pb-4 flex items-center justify-between gap-3 border-b border-[var(--border)]/40">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0 shadow-inner">
              {authorImage ? (
                <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                <FaLinkedin size={20} className="text-brand-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-semibold text-sm text-[var(--text-primary)] truncate group-hover:text-brand-400 transition-colors">
                  {authorName}
                </h4>
                {post.isFeatured && (
                  <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono font-semibold uppercase bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                    <FiStar size={10} className="fill-amber-400" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate">{authorRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-overlay)] px-2.5 py-1 rounded-full border border-[var(--border)] shrink-0">
            <FiCalendar size={11} className="text-brand-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Media Area: Consistent Aspect Ratio Image or Aesthetic Fallback */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[var(--bg-overlay)] border-b border-[var(--border)]/40">
          {hasImage ? (
            <img
              src={post.imageUrl}
              alt={post.title || 'LinkedIn post preview'}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          ) : (
            /* Neutral Brand Placeholder Pattern */
            <div className="w-full h-full flex flex-col items-center justify-center relative p-6 overflow-hidden bg-gradient-to-br from-brand-950/40 via-[var(--bg-overlay)] to-accent-cyan/5">
              {/* Subtle background glow */}
              <div className="absolute w-32 h-32 bg-brand-500/10 rounded-full filter blur-2xl pointer-events-none" />
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300">
                <FaLinkedin size={24} />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                LinkedIn Update
              </span>
            </div>
          )}

          {/* Discreet LinkedIn Source Tag */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-white/90 border border-white/10 shadow-sm pointer-events-none">
            <FaLinkedin size={11} className="text-[#0a66c2]" />
            <span>Post</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-5 pt-4">
          <h3 className="font-display font-semibold text-base sm:text-lg text-[var(--text-primary)] leading-snug line-clamp-2 mb-2 group-hover:text-brand-400 transition-colors">
            {post.title || 'LinkedIn Post'}
          </h3>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
            {postContent}
          </p>
        </div>
      </div>

      {/* Bottom Area: Action Button */}
      <div className="p-5 pt-0 mt-auto">
        <div className="pt-4 border-t border-[var(--border)]/40 flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-[var(--text-muted)] truncate">
            {post.source === 'OAUTH' ? 'Imported from LinkedIn' : 'Shared on LinkedIn'}
          </div>

          {targetUrl ? (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold bg-brand-500/10 hover:bg-brand-500 text-brand-400 hover:text-white border border-brand-500/20 hover:border-brand-500 transition-all duration-200 shrink-0 shadow-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]"
            >
              <span>View on LinkedIn</span>
              <FiExternalLink size={12} />
            </a>
          ) : (
            <div className="text-xs text-[var(--text-muted)] italic">No link available</div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
