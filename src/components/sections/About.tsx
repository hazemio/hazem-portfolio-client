import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiMail, FiPhone, FiCalendar, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { profileApi } from '../../api';
import { Profile } from '../../types';

const DEFAULT_ABOUT_BIO =
  "I am a Full-Stack Developer and Cybersecurity Engineer dedicated to building robust, scalable web architectures and securing modern digital systems. With deep experience across React, Node.js, TypeScript, and relational databases, I specialize in designing high-performance REST APIs and responsive user interfaces with clean architecture at their core. In parallel, my cybersecurity background—fortified by specialized training with DEPI and ITI in Vulnerability Assessment and Penetration Testing (VAPT)—enables me to integrate security into every phase of the software development lifecycle, mitigating OWASP Top 10 risks from code to deployment. I deliver reliable, enterprise-grade digital solutions engineered for performance and resilience.";

export default function AboutSection() {
  const sectionRef = useScrollReveal({ stagger: 0.15 });
  const { data: profile, loading } = useApi<Profile>(() => profileApi.get());

  const infoItems = [
    { icon: FiMapPin,    label: 'Location', value: profile?.location || 'Benisuef, Egypt' },
    { icon: FiMail,      label: 'Email',    value: profile?.email    || 'hazemgmall45@gmail.com' },
    { icon: FiPhone,     label: 'Phone',    value: profile?.phone    || '+20 102 554 7663' },
    { icon: FiCalendar,  label: 'Focus',    value: 'Full-Stack & Web Security' },
  ];

  const highlights = [
    'Clean Architecture & Scalable REST APIs',
    'VAPT & OWASP Top 10 Security Hardening',
    'DEPI & ITI Specialized Cybersecurity Training',
    'Enterprise-Grade Reliability & Performance',
  ];

  const bioContent =
    profile?.bio &&
    profile.bio !== "I'm a passionate full-stack developer with a love for building beautiful, performant, and accessible web applications. I specialize in React, Node.js, and modern web technologies."
      ? profile.bio
      : DEFAULT_ABOUT_BIO;

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
            Engineering Secure &amp; Scalable <span className="gradient-text">Solutions</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left — image with decorative elements */}
          <div className="lg:col-span-5 relative" data-reveal>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-md mx-auto">
              {loading ? (
                <div className="skeleton w-full h-full" />
              ) : profile?.imageUrl ? (
                <img src={profile.imageUrl} alt={profile?.name || 'Hazem Gamal'} className="w-full h-full object-cover" />
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
            <div className="absolute -bottom-4 -right-4 w-full h-full max-w-md rounded-3xl border-2 border-brand-500/20 -z-10 mx-auto" />

            {/* Floating card: Years Exp */}
            <motion.div
              className="absolute top-6 -right-4 sm:-right-6 glass-light rounded-2xl p-4 shadow-glass border border-[var(--border)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-2xl font-display font-bold gradient-text">{profile?.yearsExperience || '3+'}</div>
              <div className="text-xs text-[var(--text-muted)]">Years Exp.</div>
            </motion.div>

            {/* Floating card: Security First */}
            <motion.div
              className="absolute -bottom-4 -left-3 sm:-left-6 glass-light rounded-2xl p-3.5 shadow-glass border border-[var(--border)] flex items-center gap-2.5"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 text-accent-cyan flex items-center justify-center">
                <FiShield size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-[var(--text-primary)]">Security First</div>
                <div className="text-[10px] text-[var(--text-muted)]">VAPT &amp; OWASP Hardened</div>
              </div>
            </motion.div>
          </div>

          {/* Right — bio + highlights + info */}
          <div className="lg:col-span-7 space-y-6">
            <div data-reveal>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-primary)] mb-3">
                Hi, I'm{' '}
                <span className="gradient-text">{profile?.name || 'Hazem Gamal'}</span>
              </h3>
              <p className="text-[var(--text-secondary)] leading-relaxed text-base sm:text-lg">
                {bioContent}
              </p>
            </div>

            {/* Core Highlights */}
            <div data-reveal className="grid sm:grid-cols-2 gap-2.5 pt-2">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                  <FiCheckCircle className="text-brand-500 shrink-0 mt-0.5" size={15} />
                  <span className="font-medium text-[var(--text-primary)] text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>

            {/* Info grid */}
            <div className="grid sm:grid-cols-2 gap-3.5 pt-2" data-reveal>
              {infoItems.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="glass-light rounded-xl p-3.5 border border-[var(--border)] hover:border-brand-500/30 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors shrink-0">
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs text-[var(--text-muted)] font-medium">{label}</div>
                      <div className="text-sm text-[var(--text-primary)] font-medium truncate">{value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div data-reveal className="flex gap-4 flex-wrap pt-2">
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
