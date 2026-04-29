import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { profileApi } from '../../api';
import { Profile } from '../../types';

export default function AboutSection() {
  const sectionRef = useScrollReveal({ stagger: 0.15 });
  const { data: profile, loading } = useApi<Profile>(() => profileApi.get());

  const infoItems = [
    { icon: FiMapPin,    label: 'Location', value: profile?.location || 'Cairo, Egypt' },
    { icon: FiMail,      label: 'Email',    value: profile?.email    || 'hazem@example.com' },
    { icon: FiPhone,     label: 'Phone',    value: profile?.phone    || '+20 100 000 0000' },
    { icon: FiCalendar,  label: 'Available', value: 'Full-time / Freelance' },
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-accent-violet/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom" ref={sectionRef as any}>
        {/* Section header */}
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            About Me
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Crafting Digital <span className="gradient-text">Experiences</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — image with decorative elements */}
          <div className="relative" data-reveal>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0">
              {loading ? (
                <div className="skeleton w-full h-full" />
              ) : profile?.imageUrl ? (
                <img src={profile.imageUrl} alt={profile?.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-600 to-accent-violet flex items-center justify-center">
                  <span className="font-display font-bold text-8xl text-white/20">
                    {(profile?.name || 'HG').split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
            </div>

            {/* Decorative border */}
            <div className="absolute -bottom-4 -right-4 w-full h-full max-w-md rounded-3xl border-2 border-brand-500/20 -z-10 mx-auto lg:mx-0" />

            {/* Floating card */}
            <motion.div
              className="absolute top-6 -right-6 glass-light rounded-2xl p-4 shadow-glass border border-[var(--border)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-2xl font-display font-bold gradient-text">- - -</div>
              <div className="text-xs text-[var(--text-muted)]">Years Exp.</div>
            </motion.div>
          </div>

          {/* Right — bio + info */}
          <div className="space-y-8">
            <div data-reveal>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-4">
                Hi, I'm{' '}
                <span className="gradient-text">{profile?.name || 'Hazem Gamal'}</span>
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                {profile?.bio ||
                  "I'm a passionate full-stack developer with a love for building beautiful, performant, and accessible web applications. I specialize in React, Node.js, and modern web technologies."}
              </p>
            </div>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-4" data-reveal>
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="glass-light rounded-xl p-4 border border-[var(--border)] hover:border-brand-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                      <Icon size={15} />
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] font-medium">{label}</div>
                      <div className="text-sm text-[var(--text-primary)] font-medium truncate max-w-[140px]">{value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div data-reveal className="flex gap-4 flex-wrap">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <span>Let's Talk</span>
              </button>
              {profile?.cvUrl && (
                <a href={profile.cvUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  View CV
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
