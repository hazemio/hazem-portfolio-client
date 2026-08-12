import { useApi } from '../../hooks';
import { profileApi } from '../../api';
import { Profile } from '../../types';
import { motion } from 'framer-motion';
import { FaFutbol, FaTrophy, FaStar } from 'react-icons/fa';

function getEmbeddableYoutubeUrl(url?: string): string | null {
  if (!url) return null;
  let videoId = '';
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  } else if (url.includes('youtube.com/watch')) {
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    videoId = searchParams.get('v') || '';
  } else if (url.includes('youtube.com/embed/')) {
    videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
  }
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=0` : null;
}

export default function FootballHeroesSection() {
  const { data: profile, loading } = useApi<Profile>(() => profileApi.get());

  if (loading || !profile) return null;

  const { footballVideoType, footballVideoUrl, footballYoutubeUrl } = profile;

  const videoTypeStr = (footballVideoType as string) || '';
  const hasCloudinary =
    (videoTypeStr === 'CLOUDINARY_UPLOAD' ||
      videoTypeStr === 'CLOUDINARY_URL' ||
      videoTypeStr === 'CLOUDINARY') &&
    !!footballVideoUrl;

  const youtubeEmbedUrl =
    videoTypeStr === 'YOUTUBE' ? getEmbeddableYoutubeUrl(footballYoutubeUrl) : null;
  const hasYoutube = videoTypeStr === 'YOUTUBE' && !!youtubeEmbedUrl;

  // Hide section gracefully if no video configured
  if (!hasCloudinary && !hasYoutube) {
    return null;
  }

  return (
    <section id="football-heroes" className="py-20 relative overflow-hidden">
      {/* Decorative background ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 filter blur-3xl rounded-full" />
        <div className="blob absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-accent-cyan/10 dark:bg-accent-cyan/5 filter blur-3xl rounded-full" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-light border border-brand-500/30 text-brand-500 font-mono text-xs font-semibold mb-4 shadow-sm"
          >
            <FaFutbol className="animate-spin-slow text-accent-cyan text-sm" />
            <span>Football Heroes • أبطال الكرة</span>
            <FaTrophy className="text-amber-400 text-xs" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-[var(--text-primary)]"
          >
            Passion, Skill & <span className="gradient-text">Energy</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[var(--text-secondary)] mt-3 text-base sm:text-lg"
          >
            Unleashing team spirit and youthful determination on and off the field.
          </motion.p>
        </div>

        {/* Reusable Responsive Video Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 200, damping: 25 }}
          className="max-w-4xl mx-auto relative group"
        >
          {/* Subtle playful corner badges */}
          <div className="absolute -top-3 -left-3 z-20 hidden sm:flex items-center gap-1 bg-amber-400 text-slate-900 font-extrabold text-xs px-3 py-1 rounded-full shadow-lg transform -rotate-6">
            <FaStar size={12} /> Featured Match
          </div>
          <div className="absolute -bottom-3 -right-3 z-20 hidden sm:flex items-center gap-1 bg-brand-500 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-lg transform rotate-6">
            <FaFutbol size={12} /> Play Highlights
          </div>

          <div className="glass-light rounded-3xl p-3 sm:p-5 border border-brand-500/20 shadow-glass backdrop-blur-xl relative overflow-hidden">
            {hasCloudinary && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 shadow-inner">
                <video
                  src={footballVideoUrl}
                  controls
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            )}

            {hasYoutube && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/60 shadow-inner">
                <iframe
                  src={youtubeEmbedUrl!}
                  title="Football Heroes Video"
                  className="w-full h-full border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
