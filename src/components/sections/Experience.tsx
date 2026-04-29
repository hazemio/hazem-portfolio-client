import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiCalendar } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { experienceApi } from '../../api';
import { Experience } from '../../types';

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSection() {
  const sectionRef  = useScrollReveal();
  const lineRef     = useRef<HTMLDivElement>(null);
  const { data: experiences, loading } = useApi<Experience[]>(() => experienceApi.getAll());

  useEffect(() => {
    if (!lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: { trigger: lineRef.current, start: 'top 80%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [experiences]);

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent-amber/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom" ref={sectionRef as any}>
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            My Journey
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Work <span className="gradient-text">Experience</span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div
              ref={lineRef}
              className="absolute left-8 top-0 bottom-0 w-px origin-top"
              style={{ background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 60%, transparent 100%)' }}
            />

            <div className="space-y-8">
              {(experiences || []).map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                  className="relative pl-20"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-5 top-6 w-6 h-6 -translate-x-1/2 rounded-full border-2 border-brand-500 bg-[var(--bg-base)] flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  </div>

                  <div className="glass-light rounded-2xl p-6 border border-[var(--border)] hover:border-brand-500/30 transition-colors group">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-brand-500 transition-colors">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-brand-500 font-medium text-sm mt-0.5">
                          <FiBriefcase size={13} />
                          {exp.company}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                          <FiCalendar size={11} />
                          {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                        </span>
                        {exp.current && (
                          <span className="text-xs font-semibold text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full">
                            Current
                          </span>
                        )}
                        {exp.location && (
                          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                            <FiMapPin size={11} />
                            {exp.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
