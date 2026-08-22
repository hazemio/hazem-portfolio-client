import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { experienceApi } from '../../api';
import { Experience } from '../../types';

gsap.registerPlugin(ScrollTrigger);

function renderFormattedDescription(text?: string) {
  if (!text) return null;

  // Split lines to handle markdown bullets or structured items cleanly
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Check if text is formatted with bullet markers (*, -, •, or digits)
  const isBulletList = lines.length > 1 && lines.some((l) => /^[*•-]\s+|^\d+[\.\)]\s+/.test(l));

  if (isBulletList) {
    return (
      <ul className="space-y-2 mt-2">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[*•-]\s+|^\d+[\.\)]\s+/, '');
          return (
            <li key={idx} className="flex items-start gap-2 text-[var(--text-secondary)] text-sm leading-relaxed">
              <span className="text-brand-500 mt-1 shrink-0">•</span>
              <span>{cleanLine}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="space-y-2 text-[var(--text-secondary)] text-sm leading-relaxed">
      {lines.map((paragraph, idx) => (
        <p key={idx}>{paragraph}</p>
      ))}
    </div>
  );
}

export default function ExperienceSection() {
  const sectionRef = useScrollReveal();
  const lineRef = useRef<HTMLDivElement>(null);
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

  if (!loading && (!experiences || experiences.length === 0)) {
    return null;
  }

  return (
    <section id="experience" className="section-padding relative overflow-hidden">
      {/* Subtle ambient light */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-accent-amber/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom" ref={sectionRef as any}>
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-xs font-semibold text-brand-500 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-brand-500/50" />
            Career & Expertise
            <span className="w-8 h-px bg-brand-500/50" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Work <span className="gradient-text">Experience</span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-44 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline Vertical Line */}
            <div
              ref={lineRef}
              className="absolute left-6 sm:left-8 top-0 bottom-0 w-px origin-top"
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
                  className="relative pl-14 sm:pl-20"
                >
                  {/* Timeline Node Dot */}
                  <div className="absolute left-6 sm:left-8 top-7 -translate-x-1/2 rounded-full border-2 border-brand-500 bg-[var(--bg-base)] p-1 z-10 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                  </div>

                  {/* Clean Experience Card */}
                  <div className="glass-light rounded-2xl p-5 sm:p-6 border border-[var(--border)] hover:border-brand-500/30 transition-all duration-300 group shadow-glass">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      {/* Logo Avatar + Title */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--bg-overlay)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-inner group-hover:border-brand-500/30 transition-colors">
                          {exp.imageUrl ? (
                            <img src={exp.imageUrl} alt={exp.company} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500/20 to-accent-violet/20 text-brand-500">
                              <FiBriefcase size={20} />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-brand-500 transition-colors">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-2 text-brand-500 font-medium text-sm mt-0.5">
                            <span>{exp.company}</span>
                            {exp.location && (
                              <>
                                <span className="text-[var(--text-muted)]">•</span>
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-normal">
                                  <FiMapPin size={11} />
                                  {exp.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date & Status */}
                      <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
                        <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-overlay)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <FiCalendar size={12} className="text-brand-500" />
                          {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                        </span>

                        {exp.current && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-emerald bg-accent-emerald/10 border border-accent-emerald/20 px-2.5 py-0.5 rounded-full">
                            <FiCheckCircle size={11} /> Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Formatted Description */}
                    <div className="pt-2 border-t border-[var(--border)]/60">
                      {renderFormattedDescription(exp.description)}
                    </div>

                    {/* Optional Technology Tags */}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[var(--border)]/40">
                        {exp.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-xs font-mono text-brand-500 bg-brand-500/10 px-2.5 py-0.5 rounded-md border border-brand-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
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
