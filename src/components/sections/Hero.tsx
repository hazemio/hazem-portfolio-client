import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { FiArrowDown, FiMail, FiDownload } from 'react-icons/fi';
import { useApi, useMagneticButton } from '../../hooks';
import { profileApi } from '../../api';
import { Profile } from '../../types';

export default function HeroSection() {
  const containerRef  = useRef<HTMLElement>(null);
  const imageRef      = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLSpanElement>(null);
  const headingRef    = useRef<HTMLHeadingElement>(null);
  const roleRef       = useRef<HTMLParagraphElement>(null);
  const bioRef        = useRef<HTMLParagraphElement>(null);
  const buttonsRef    = useRef<HTMLDivElement>(null);
  const scrollRef     = useRef<HTMLDivElement>(null);
  const blob1Ref      = useRef<HTMLDivElement>(null);
  const blob2Ref      = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useMagneticButton(0.3) as React.RefObject<HTMLButtonElement>;

  const { data: profile, loading } = useApi<Profile>(() => profileApi.get());

  // GSAP master timeline
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Blobs
    tl.fromTo([blob1Ref.current, blob2Ref.current],
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power3.out' }
    );

    // Tagline
    if (taglineRef.current) {
      tl.fromTo(taglineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.8'
      );
    }

    // Heading letters
    if (headingRef.current) {
      const chars = headingRef.current.querySelectorAll('.char');
      tl.fromTo(chars,
        { y: '110%', opacity: 0, rotateZ: 6 },
        { y: '0%', opacity: 1, rotateZ: 0, duration: 0.7, stagger: 0.025, ease: 'power3.out' },
        '-=0.4'
      );
    }

    // Role + bio
    tl.fromTo([roleRef.current, bioRef.current],
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out' },
      '-=0.3'
    );

    // Buttons
    tl.fromTo(buttonsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );

    // Image
    tl.fromTo(imageRef.current,
      { scale: 0.7, opacity: 0, rotate: -5 },
      { scale: 1, opacity: 1, rotate: 0, duration: 1, ease: 'elastic.out(1, 0.6)' },
      '-=1.2'
    );

    // Scroll indicator
    tl.fromTo(scrollRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    );

    // Continuous floating for image
    gsap.to(imageRef.current, {
      y: -15,
      duration: 3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    });

    return () => { tl.kill(); };
  }, [profile]);

  // Split heading text into chars
  const splitText = (text: string) =>
    text.split('').map((c, i) => (
      <span key={i} className="char inline-block overflow-hidden" style={{ display: 'inline-block' }}>
        <span className="char inline-block">{c === ' ' ? '\u00A0' : c}</span>
      </span>
    ));

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={blob1Ref as any}
          className="blob absolute -top-32 -left-32 w-[600px] h-[600px] bg-brand-500/10 dark:bg-brand-500/5 filter blur-3xl"
        />
        <div
          ref={blob2Ref as any}
          className="blob absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-accent-cyan/10 dark:bg-accent-cyan/5 filter blur-3xl"
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-custom relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text content */}
          <div>
            <span
              ref={taglineRef}
              className="font-mono text-sm text-brand-500 dark:text-brand-400 mb-4 flex items-center gap-2"
            >
              <span className="w-8 h-px bg-brand-500" />
Access Granted: Welcome to My Digital System            </span>

            <h1
              ref={headingRef}
              className="font-display font-bold text-5xl sm:text-6xl xl:text-7xl leading-[1.05] mb-6 overflow-hidden"
            >
              {profile?.name
                ? splitText(profile.name)
                : splitText('Hazem Gamal')}
            </h1>

            <p
              ref={roleRef}
              className="text-xl sm:text-2xl font-medium mb-5 gradient-text font-display"
            >
              {loading ? (
                <span className="skeleton inline-block w-64 h-7 rounded" />
              ) : (
                profile?.role || 'Full Stack Developer'
              )}
            </p>

            <p
              ref={bioRef}
              className="text-[var(--text-secondary)] text-base sm:text-lg leading-relaxed max-w-lg mb-10"
            >
              {loading ? (
                <>
                  <span className="skeleton inline-block w-full h-4 rounded mb-2" />
                  <span className="skeleton inline-block w-5/6 h-4 rounded" />
                </>
              ) : (
                profile?.bio || 'Crafting beautiful, performant web experiences with modern technologies. Passionate about clean code and stunning UI.'
              )}
            </p>

            <div ref={buttonsRef} className="flex flex-wrap items-center gap-4">
              <button
                ref={primaryBtnRef}
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary magnetic-btn"
              >
                <FiMail size={16} />
                <span>Get In Touch</span>
              </button>

              {profile?.cvUrl && (
                <a
                  href={profile.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  <FiDownload size={16} />
                  Download CV
                </a>
              )}

              <button
                onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-ghost"
              >
                View Projects
              </button>
            </div>

            {/* Stats row */}
            <div className="mt-14 flex items-center gap-10">
              {[
                { value: `---`,   label: 'Years Experience' },
                { value: `---`,  label: 'Projects Done' },
                { value: `---`, label: 'Client Satisfaction' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display font-bold text-2xl sm:text-3xl gradient-text">{stat.value}</div>
                  <div className="text-[var(--text-muted)] text-xs sm:text-sm mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Profile image */}
          <div className="flex justify-center lg:justify-end" ref={imageRef}>
            <div className="relative">
              {/* Outer ring */}
              <div className="absolute -inset-4 rounded-full border border-brand-500/20 animate-spin-slow" />
              <div className="absolute -inset-8 rounded-full border border-brand-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />

              {/* Glow */}
              <div className="absolute inset-0 rounded-full bg-brand-500/20 filter blur-2xl scale-110 animate-pulse-slow" />

              {/* Image container */}
              <motion.div
                className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-brand-500/30 shadow-brand-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {loading ? (
                  <div className="skeleton w-full h-full" />
                ) : profile?.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center">
                    <span className="font-display font-bold text-6xl text-white/90">
                      {(profile?.name || 'HG').split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 glass-light rounded-2xl px-4 py-3 shadow-glass border border-[var(--border)]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, type: 'spring' }}
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-emerald" />
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">Open to Work</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="text-xs text-[var(--text-muted)] font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <FiArrowDown size={16} className="text-[var(--text-muted)]" />
        </motion.div>
      </div>
    </section>
  );
}
