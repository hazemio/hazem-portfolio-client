import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin } from 'react-icons/fa';
import { FiExternalLink, FiCalendar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { linkedinApi, profileApi, socialLinksApi } from '../../api';
import { LinkedInPost, Profile, SocialLink } from '../../types';

function PostCard({ post, authorName, authorRole, authorImage }: { post: LinkedInPost; authorName: string; authorRole: string; authorImage?: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLongText = post.text.length > 240;
  const displayText = isLongText && !expanded ? `${post.text.slice(0, 240)}...` : post.text;

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Recent Post';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className={`glass-light rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between group ${
        post.isFeatured
          ? 'border-sky-500/40 shadow-[0_0_20px_rgba(14,165,233,0.15)] bg-sky-500/5'
          : 'border-[var(--border)] hover:border-sky-500/30 shadow-glass'
      }`}
    >
      <div>
        {/* Post Header: Author Avatar & LinkedIn Badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden bg-sky-500/10 border border-sky-500/30 flex items-center justify-center shrink-0 shadow-inner">
              {authorImage ? (
                <img src={authorImage} alt={authorName} className="w-full h-full object-cover" />
              ) : (
                <FaLinkedin size={22} className="text-sky-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-display font-semibold text-sm text-[var(--text-primary)] group-hover:text-sky-400 transition-colors">
                  {authorName}
                </h4>
                {post.isFeatured && (
                  <span className="text-[10px] font-mono uppercase bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full font-bold border border-sky-500/30">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-[var(--text-muted)] truncate max-w-[180px] sm:max-w-[240px]">{authorRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-muted)] bg-[var(--bg-overlay)] px-2.5 py-1 rounded-full border border-[var(--border)] shrink-0">
            <FiCalendar size={11} className="text-sky-500" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Post Content */}
        <div className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line mb-4">
          {displayText}
          {isLongText && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 ml-1 text-xs font-semibold text-sky-400 hover:underline focus:outline-none"
            >
              {expanded ? (
                <>
                  Show less <FiChevronUp size={12} />
                </>
              ) : (
                <>
                  Show more <FiChevronDown size={12} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Media Preview (Image or Video) */}
        {post.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-[var(--border)] bg-black/40 max-h-64">
            <img src={post.imageUrl} alt="LinkedIn Post Media" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
          </div>
        )}

        {post.videoUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-[var(--border)] bg-black/60 max-h-64">
            <video src={post.videoUrl} controls className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      {/* Post Footer Action */}
      <div className="pt-3 border-t border-[var(--border)]/60 flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5 text-xs text-sky-500 font-medium">
          <FaLinkedin size={14} />
          <span>LinkedIn Post</span>
        </div>

        {post.postUrl && (
          <a
            href={post.postUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-lg border border-sky-500/20 transition-all"
          >
            <span>View on LinkedIn</span>
            <FiExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function LinkedInPostsSection() {
  const sectionRef = useScrollReveal();
  const { data: posts, loading } = useApi<LinkedInPost[]>(() => linkedinApi.getPosts());
  const { data: profile } = useApi<Profile>(() => profileApi.get());
  const { data: socials } = useApi<SocialLink[]>(() => socialLinksApi.getAll());

  // Find LinkedIn profile URL from social links or default
  const linkedInSocial = (socials || []).find(
    (s) => s.platform.toLowerCase().includes('linkedin') || s.url.includes('linkedin.com')
  );
  const linkedInUrl = linkedInSocial?.url || 'https://www.linkedin.com';

  const authorName = profile?.name || 'Hazem Gamal';
  const authorRole = profile?.role || 'Full Stack Developer';
  const authorImage = profile?.imageUrl || profile?.heroImageUrl;

  const hasPosts = posts && posts.length > 0;

  return (
    <section id="linkedin-posts" className="section-padding relative overflow-hidden bg-[var(--bg-raised)]/20">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10" ref={sectionRef as any}>
        <div className="mb-14 text-center" data-reveal>
          <span className="font-mono text-xs font-semibold text-sky-500 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-sky-500/50" />
            <FaLinkedin size={14} className="text-sky-500" />
            Social & Activity
            <span className="w-8 h-px bg-sky-500/50" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Latest from <span className="text-sky-400">LinkedIn</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        ) : hasPosts ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                authorName={authorName}
                authorRole={authorRole}
                authorImage={authorImage}
              />
            ))}
          </div>
        ) : (
          /* Polished Empty State Card */
          <div className="max-w-2xl mx-auto glass-light rounded-2xl p-8 border border-sky-500/30 text-center shadow-glass relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FaLinkedin size={32} />
            </div>

            <h3 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
              Connect with me on LinkedIn
            </h3>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto mb-6 leading-relaxed">
              Follow my latest professional updates, technical posts, software development insights, and career achievements.
            </p>

            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl border border-sky-400/30 shadow-lg shadow-sky-500/20 transition-all hover:scale-102"
            >
              <FaLinkedin size={18} />
              <span>View LinkedIn Profile</span>
              <FiExternalLink size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
