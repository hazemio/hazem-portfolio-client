import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { FiAward, FiBookOpen, FiMapPin, FiCalendar, FiCheckCircle } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { educationApi } from '../../api';
import { Education } from '../../types';

gsap.registerPlugin(ScrollTrigger);

function renderFormattedDescription(text?: string) {
  if (!text) return null;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const isBulletList = lines.length > 1 && lines.some((l) => /^[*•-]\s+|^\d+[\.\)]\s+/.test(l));

  if (isBulletList) {
    return (
      <ul className="space-y-2 mt-2">
        {lines.map((line, idx) => {
          const cleanLine = line.replace(/^[*•-]\s+|^\d+[\.\)]\s+/, '');
          return (
            <li key={idx} className="flex items-start gap-2 text-[var(--text-secondary)] text-sm leading-relaxed">
              <span className="text-accent-cyan mt-1 shrink-0">•</span>
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

export default function EducationSection() {
  const sectionRef = useScrollReveal();
  const lineRef = useRef<HTMLDivElement>(null);
  const { data: educationList, loading } = useApi<Education[]>(() => educationApi.getAll());

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
  }, [educationList]);

  // Hide gracefully if no data exists
  if (!loading && (!educationList || educationList.length === 0)) {
    return null;
  }

  return (
    <section id="education" className="section-padding relative overflow-hidden bg-[var(--bg-raised)]/30">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-accent-cyan/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10" ref={sectionRef as any}>
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-xs font-semibold text-accent-cyan uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-accent-cyan/50" />
            Academic & Training
            <span className="w-8 h-px bg-accent-cyan/50" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Education & <span className="gradient-text">Degrees</span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="skeleton h-40 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="relative max-w-3xl mx-auto">
            {/* Timeline Vertical Line */}
            <div
              ref={lineRef}
              className="absolute left-6 sm:left-8 top-0 bottom-0 w-px origin-top"
              style={{ background: 'linear-gradient(180deg, #06b6d4 0%, #3b82f6 60%, transparent 100%)' }}
            />

            <div className="space-y-8">
              {(educationList || []).map((edu, i) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                  className="relative pl-14 sm:pl-20"
                >
                  {/* Timeline Node Dot */}
                  <div className="absolute left-6 sm:left-8 top-7 -translate-x-1/2 rounded-full border-2 border-accent-cyan bg-[var(--bg-base)] p-1 z-10 shadow-sm">
                    <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan animate-pulse" />
                  </div>

                  {/* Clean Education Card */}
                  <div className="glass-light rounded-2xl p-5 sm:p-6 border border-[var(--border)] hover:border-accent-cyan/40 transition-all duration-300 group shadow-glass">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      {/* Logo Avatar + Degree / Institution */}
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--bg-overlay)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-inner group-hover:border-accent-cyan/40 transition-colors">
                          {edu.imageUrl ? (
                            <img src={edu.imageUrl} alt={edu.institution} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-cyan/20 to-brand-500/20 text-accent-cyan">
                              <FiBookOpen size={20} />
                            </div>
                          )}
                        </div>

                        <div>
                          <h3 className="font-display font-bold text-lg text-[var(--text-primary)] group-hover:text-accent-cyan transition-colors">
                            {edu.title}
                          </h3>
                          <div className="flex items-center gap-2 text-accent-cyan font-medium text-sm mt-0.5">
                            <span>{edu.institution}</span>
                            {edu.location && (
                              <>
                                <span className="text-[var(--text-muted)]">•</span>
                                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] font-normal">
                                  <FiMapPin size={11} />
                                  {edu.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date & Status */}
                      <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 shrink-0">
                        <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-overlay)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                          <FiCalendar size={12} className="text-accent-cyan" />
                          {edu.startDate} — {edu.current ? 'Present' : edu.endDate}
                        </span>

                        {edu.current && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/20 px-2.5 py-0.5 rounded-full">
                            <FiCheckCircle size={11} /> Studying
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Formatted Description */}
                    {edu.description && (
                      <div className="pt-2 border-t border-[var(--border)]/60">
                        {renderFormattedDescription(edu.description)}
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
