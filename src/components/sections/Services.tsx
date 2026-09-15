import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiLayers,
  FiArrowRight,
  FiCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { servicesApi } from '../../api';
import { Service } from '../../types';
import { DynamicIcon } from '../../utils/icons';

const SERVICE_STYLES = [
  { accentColor: 'text-sky-400', glowBg: 'bg-sky-500/10', borderColor: 'hover:border-sky-500/40' },
  { accentColor: 'text-indigo-400', glowBg: 'bg-indigo-500/10', borderColor: 'hover:border-indigo-500/40' },
  { accentColor: 'text-emerald-400', glowBg: 'bg-emerald-500/10', borderColor: 'hover:border-emerald-500/40' },
  { accentColor: 'text-amber-400', glowBg: 'bg-amber-500/10', borderColor: 'hover:border-amber-500/40' },
  { accentColor: 'text-rose-400', glowBg: 'bg-rose-500/10', borderColor: 'hover:border-rose-500/40' },
  { accentColor: 'text-red-400', glowBg: 'bg-red-500/10', borderColor: 'hover:border-red-500/40' },
  { accentColor: 'text-cyan-400', glowBg: 'bg-cyan-500/10', borderColor: 'hover:border-cyan-500/40' },
  { accentColor: 'text-purple-400', glowBg: 'bg-purple-500/10', borderColor: 'hover:border-purple-500/40' },
];

export default function ServicesSection() {
  const sectionRef = useScrollReveal({ stagger: 0.08 });
  const { data: dbServices, loading, error } = useApi<Service[]>(() => servicesApi.getAll());

  const services = useMemo(() => {
    if (!dbServices || !Array.isArray(dbServices)) return [];

    return dbServices
      .filter((s) => s.status === 'ACTIVE' && s.isVisible !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((s, idx) => {
        const style = SERVICE_STYLES[idx % SERVICE_STYLES.length];
        const num = String(idx + 1).padStart(2, '0');
        return {
          id: s.id,
          number: num,
          title: s.title,
          badge: s.badge || 'Engineering',
          description: s.description,
          iconName: s.icon || 'FiLayers',
          accentColor: style.accentColor,
          glowBg: style.glowBg,
          borderColor: style.borderColor,
          features: Array.isArray(s.features) ? s.features : [],
        };
      });
  }, [dbServices]);

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-brand-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-accent-cyan/5 rounded-full filter blur-3xl" />
      </div>

      <div className="container-custom relative z-10" ref={sectionRef as any}>
        {/* Section Header */}
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            What I Deliver
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            High-Impact <span className="gradient-text">Engineering Services</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            Specialized solutions spanning full-stack web engineering, resilient backend systems, and proactive cybersecurity.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="glass-light rounded-2xl p-6 border border-[var(--border)] flex flex-col justify-between h-72 animate-pulse"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5" />
                    <div className="w-6 h-3 bg-white/5 rounded" />
                  </div>
                  <div className="w-16 h-4 bg-white/5 rounded mb-3" />
                  <div className="w-3/4 h-5 bg-white/5 rounded mb-3" />
                  <div className="w-full h-3 bg-white/5 rounded mb-1.5" />
                  <div className="w-5/6 h-3 bg-white/5 rounded" />
                </div>
                <div className="pt-4 border-t border-[var(--border)]/60 space-y-2">
                  <div className="w-2/3 h-3 bg-white/5 rounded" />
                  <div className="w-1/2 h-3 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-light rounded-2xl p-8 border border-[var(--border)] text-center max-w-md mx-auto my-8">
            <FiAlertCircle size={36} className="text-accent-rose mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-1">
              Unable to Load Services
            </h3>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Please check your internet connection or try refreshing the page.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="glass-light rounded-2xl p-12 border border-[var(--border)] text-center max-w-lg mx-auto my-8">
            <FiLayers size={40} className="text-brand-500/40 mx-auto mb-4" />
            <h3 className="font-display font-semibold text-xl text-[var(--text-primary)] mb-2">
              No Services Published Yet
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Services will appear here once published from the admin dashboard.
            </p>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                data-reveal
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className={`glass-light rounded-2xl p-6 border border-[var(--border)] ${service.borderColor} transition-all duration-300 card-hover flex flex-col justify-between group`}
              >
                <div>
                  {/* Top Bar: Icon & Number Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl ${service.glowBg} flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-300`}
                    >
                      <DynamicIcon name={service.iconName} size={22} className={service.accentColor} />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[var(--text-muted)] tracking-wider">
                      {service.number}
                    </span>
                  </div>

                  {/* Title & Badge */}
                  <div className="mb-3">
                    <span className="inline-block text-[10px] font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded mb-2">
                      {service.badge}
                    </span>
                    <h3 className="font-display font-bold text-lg text-[var(--text-primary)] leading-snug group-hover:text-brand-400 transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
                    {service.description}
                  </p>
                </div>

                {/* Features list */}
                {service.features.length > 0 && (
                  <div className="pt-4 border-t border-[var(--border)]/60">
                    <ul className="space-y-2">
                      {service.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <FiCheck className="text-brand-500 shrink-0" size={13} />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Bottom Banner */}
        <div data-reveal className="mt-14 glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)]">
              Need a tailored engineering or security solution?
            </h4>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Available for full-time roles, contract engineering, and cybersecurity assessments.
            </p>
          </div>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary shrink-0 flex items-center gap-2 shadow-brand"
          >
            <span>Discuss Your Project</span>
            <FiArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

