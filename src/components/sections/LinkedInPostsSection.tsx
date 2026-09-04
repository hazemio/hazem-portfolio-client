import { FaLinkedin } from 'react-icons/fa';
import { useScrollReveal, useApi } from '../../hooks';
import { linkedinApi, profileApi } from '../../api';
import { LinkedInPost, Profile } from '../../types';
import LinkedInPostCard from '../cards/LinkedInPostCard';

export default function LinkedInPostsSection() {
  const sectionRef = useScrollReveal();
  const { data: posts, loading } = useApi<LinkedInPost[]>(() => linkedinApi.getPosts());
  const { data: profile } = useApi<Profile>(() => profileApi.get());

  const authorName = profile?.name || 'Hazem Gamal';
  const authorRole = profile?.role || 'Full Stack Developer';
  const authorImage = profile?.imageUrl || profile?.heroImageUrl;

  const hasPosts = Boolean(posts && posts.length > 0);

  // Safety: If not loading and there are no posts, completely hide the section from the homepage
  if (!loading && !hasPosts) {
    return null;
  }

  return (
    <section id="linkedin-posts" className="section-padding relative overflow-hidden bg-[var(--bg-raised)]/30">
      {/* Ambient background light matching portfolio palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-brand-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10" ref={sectionRef as any}>
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            <FaLinkedin size={14} className="text-[#0a66c2]" />
            Social & Insights
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Latest from <span className="gradient-text">LinkedIn</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-[420px] rounded-2xl border border-[var(--border)]/40" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            {posts!.map((post, index) => (
              <LinkedInPostCard
                key={post.id}
                post={post}
                index={index}
                authorName={authorName}
                authorRole={authorRole}
                authorImage={authorImage}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
