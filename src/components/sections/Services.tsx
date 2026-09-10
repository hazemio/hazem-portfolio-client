import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiLayers,
  FiServer,
  FiDatabase,
  FiLock,
  FiSearch,
  FiShield,
  FiCloud,
  FiCompass,
  FiArrowRight,
  FiCheck,
} from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { servicesApi } from '../../api';
import { Service } from '../../types';
import { DynamicIcon } from '../../utils/icons';

interface ServiceItem {
  id: string;
  number: string;
  title: string;
  badge: string;
  description: string;
  iconName?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  glowBg: string;
  borderColor: string;
  features: string[];
}

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

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'full-stack',
    number: '01',
    title: 'Full-Stack Web Development',
    badge: 'Core Focus',
    description:
      'End-to-end web applications designed with modern React/Next.js frontends and robust Node.js backends for optimal speed and UX.',
    icon: FiLayers,
    iconName: 'FiLayers',
    accentColor: 'text-sky-400',
    glowBg: 'bg-sky-500/10',
    borderColor: 'hover:border-sky-500/40',
    features: ['Modern React & Next.js', 'Responsive Tailwind UI', 'Component Architecture'],
  },
  {
    id: 'backend-api',
    number: '02',
    title: 'Backend API Development',
    badge: 'High Performance',
    description:
      'Modular RESTful services engineered with Express.js and NestJS, adhering to clean architecture, data validation, and resilience.',
    icon: FiServer,
    accentColor: 'text-indigo-400',
    glowBg: 'bg-indigo-500/10',
    borderColor: 'hover:border-indigo-500/40',
    features: ['RESTful API Design', 'Express.js & NestJS', 'Input Validation & Error Handling'],
  },
  {
    id: 'database-design',
    number: '03',
    title: 'Database Design & Optimization',
    badge: 'Reliability',
    description:
      'Data modeling, migration schemas, and query optimization using PostgreSQL, MongoDB, and Prisma ORM for seamless scaling.',
    icon: FiDatabase,
    accentColor: 'text-emerald-400',
    glowBg: 'bg-emerald-500/10',
    borderColor: 'hover:border-emerald-500/40',
    features: ['Relational & NoSQL Models', 'Prisma ORM Integrations', 'Query Performance Tuning'],
  },
  {
    id: 'auth-security',
    number: '04',
    title: 'Authentication & Security Architecture',
    badge: 'Defense-in-Depth',
    description:
      'Implementation of hardened identity workflows with JWT, OAuth, session management, and granular Role-Based Access Control (RBAC).',
    icon: FiLock,
    accentColor: 'text-amber-400',
    glowBg: 'bg-amber-500/10',
    borderColor: 'hover:border-amber-500/40',
    features: ['JWT & Refresh Token Flow', 'Role-Based Access (RBAC)', 'Password & Secret Hashing'],
  },
  {
    id: 'security-assessment',
    number: '05',
    title: 'Website Security Assessment',
    badge: 'Vulnerability Audit',
    description:
      'In-depth review of web application endpoints, headers, and codebases to identify misconfigurations and eliminate attack surfaces.',
    icon: FiSearch,
    accentColor: 'text-rose-400',
    glowBg: 'bg-rose-500/10',
    borderColor: 'hover:border-rose-500/40',
    features: ['OWASP Top 10 Mitigation', 'Security Header Analysis', 'Access Control Validation'],
  },
  {
    id: 'penetration-testing',
    number: '06',
    title: 'Penetration Testing (VAPT)',
    badge: 'Offensive Security',
    description:
      'Structured Vulnerability Assessment and Penetration Testing simulating real-world adversary tactics to uncover system flaws.',
    icon: FiShield,
    accentColor: 'text-red-400',
    glowBg: 'bg-red-500/10',
    borderColor: 'hover:border-red-500/40',
    features: ['Burp Suite & Nmap Audits', 'Simulated Threat Vectors', 'Remediation Roadmaps'],
  },
  {
    id: 'devops-deployment',
    number: '07',
    title: 'Deployment & DevOps CI/CD',
    badge: 'Production Ready',
    description:
      'Setting up automated build pipelines, containerized Docker microservices, and reliable deployments across Vercel, Render, and VPS.',
    icon: FiCloud,
    accentColor: 'text-cyan-400',
    glowBg: 'bg-cyan-500/10',
    borderColor: 'hover:border-cyan-500/40',
    features: ['Docker Containerization', 'CI/CD Automation', 'Cloud Hosting Configuration'],
  },
  {
    id: 'tech-consulting',
    number: '08',
    title: 'Technical Architecture Consulting',
    badge: 'Strategic Advisory',
    description:
      'Expert guidance on software stacks, scalable system blueprints, code refactoring, and security best practices for emerging platforms.',
    icon: FiCompass,
    accentColor: 'text-purple-400',
    glowBg: 'bg-purple-500/10',
    borderColor: 'hover:border-purple-500/40',
    features: ['Stack Selection & Feasibility', 'Code Quality & Maintainability', 'Security Integration Guidance'],
  },
];

export default function ServicesSection() {
  const sectionRef = useScrollReveal({ stagger: 0.08 });
  const { data: dbServices } = useApi<Service[]>(() => servicesApi.getAll());

  const services = useMemo(() => {
    if (!dbServices || dbServices.length === 0) {
      return DEFAULT_SERVICES;
    }

    return dbServices
      .filter((s) => s.status === 'ACTIVE')
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => {
            const IconComponent = service.icon;

            return (
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
                      {service.iconName ? (
                        <DynamicIcon name={service.iconName} size={22} className={service.accentColor} />
                      ) : IconComponent ? (
                        <IconComponent size={22} className={service.accentColor} />
                      ) : (
                        <FiLayers size={22} className={service.accentColor} />
                      )}
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
              </motion.div>
            );
          })}
        </div>

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
