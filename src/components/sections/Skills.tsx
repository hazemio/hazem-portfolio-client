import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiServer,
  FiDatabase,
  FiCloud,
  FiShield,
  FiTerminal,
  FiLock,
  FiWifi,
  FiKey,
  FiActivity,
  FiCheck,
} from 'react-icons/fi';
import {
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiFramer,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiJsonwebtokens,
  SiSocketdotio,
  SiPostgresql,
  SiPrisma,
  SiMongodb,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiRender,
  SiPortswigger,
  SiMetasploit,
  SiLinux,
  SiWireshark,
} from 'react-icons/si';
import { useScrollReveal, useApi } from '../../hooks';
import { skillsApi } from '../../api';
import { Skill } from '../../types';
import { DynamicIcon } from '../../utils/icons';

interface SkillItem {
  name: string;
  icon?: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  iconName?: string;
  color?: string;
}

interface CategoryDefinition {
  id: string;
  name: string;
  categoryKey: string;
  description: string;
  badge?: string;
  glowBg: string;
  borderColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  skills: SkillItem[];
}

const SKILL_COLORS: Record<string, string> = {
  react: '#61DAFB',
  'next.js': '#FFFFFF',
  javascript: '#F7DF1E',
  typescript: '#3178C6',
  html5: '#E34F26',
  css: '#1572B6',
  'tailwind css': '#06B6D4',
  'framer motion': '#F55F77',
  'node.js': '#339933',
  'express.js': '#E5E7EB',
  'express js': '#E5E7EB',
  nestjs: '#E0234E',
  'rest apis': '#818CF8',
  jwt: '#FB015B',
  'socket.io': '#F3F4F6',
  postgresql: '#4169E1',
  prisma: '#38BDF8',
  mongodb: '#47A248',
  git: '#F05032',
  github: '#FFFFFF',
  docker: '#2496ED',
  vercel: '#FFFFFF',
  render: '#46E3B7',
  'penetration testing': '#F43F5E',
  'vulnerability assessment': '#FB7185',
  'owasp top 10': '#FDA4AF',
  'burp suite': '#FF6633',
  nmap: '#38BDF8',
  metasploit: '#2A9FD6',
  linux: '#FCC624',
  networking: '#34D399',
  wireshark: '#1679A7',
};

const BASE_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'frontend',
    name: 'Frontend Engineering',
    categoryKey: 'Frontend',
    description: 'Modern, reactive user interfaces and interactive client experiences.',
    glowBg: 'bg-sky-500/10',
    borderColor: 'hover:border-sky-500/40',
    icon: SiReact,
    skills: [
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', icon: SiCss, color: '#1572B6' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Framer Motion', icon: SiFramer, color: '#F55F77' },
    ],
  },
  {
    id: 'backend',
    name: 'Backend Architecture & APIs',
    categoryKey: 'Backend',
    description: 'Robust server-side logic, high-throughput RESTful services, and authentication.',
    glowBg: 'bg-brand-500/10',
    borderColor: 'hover:border-brand-500/40',
    icon: FiServer,
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
      { name: 'Express.js', icon: SiExpress, color: '#E5E7EB' },
      { name: 'NestJS', icon: SiNestjs, color: '#E0234E' },
      { name: 'REST APIs', icon: FiServer, color: '#818CF8' },
      { name: 'JWT', icon: SiJsonwebtokens, color: '#FB015B' },
      { name: 'Authentication', icon: FiKey, color: '#FBBF24' },
      { name: 'Socket.io', icon: SiSocketdotio, color: '#F3F4F6' },
    ],
  },
  {
    id: 'database',
    name: 'Database & Storage',
    categoryKey: 'Database',
    description: 'Relational data models, indexing, and scalable ORM integration.',
    glowBg: 'bg-emerald-500/10',
    borderColor: 'hover:border-emerald-500/40',
    icon: FiDatabase,
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
      { name: 'Prisma', icon: SiPrisma, color: '#38BDF8' },
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    ],
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps',
    categoryKey: 'DevOps',
    description: 'Version control, automated pipelines, and cloud platform deployments.',
    glowBg: 'bg-amber-500/10',
    borderColor: 'hover:border-amber-500/40',
    icon: FiCloud,
    skills: [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub', icon: SiGithub, color: '#FFFFFF' },
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Vercel', icon: SiVercel, color: '#FFFFFF' },
      { name: 'Render', icon: SiRender, color: '#46E3B7' },
    ],
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & VAPT',
    categoryKey: 'Cybersecurity',
    description: 'Penetration testing, vulnerability discovery, threat mitigation, and OWASP defense.',
    badge: 'Specialized Track',
    glowBg: 'bg-rose-500/10',
    borderColor: 'hover:border-rose-500/40',
    icon: FiShield,
    skills: [
      { name: 'Penetration Testing', icon: FiShield, color: '#F43F5E' },
      { name: 'Vulnerability Assessment', icon: FiActivity, color: '#FB7185' },
      { name: 'OWASP Top 10', icon: FiLock, color: '#FDA4AF' },
      { name: 'Burp Suite', icon: SiPortswigger, color: '#FF6633' },
      { name: 'Nmap', icon: FiTerminal, color: '#38BDF8' },
      { name: 'Metasploit', icon: SiMetasploit, color: '#2A9FD6' },
      { name: 'Linux', icon: SiLinux, color: '#FCC624' },
      { name: 'Networking', icon: FiWifi, color: '#34D399' },
      { name: 'Wireshark', icon: SiWireshark, color: '#1679A7' },
    ],
  },
];

export default function SkillsSection() {
  const sectionRef = useScrollReveal({ stagger: 0.1 });
  const { data: dbSkills } = useApi<Skill[]>(() => skillsApi.getAll());

  // Dynamically assemble categories based on database skills, falling back cleanly to defaults
  const categories: CategoryDefinition[] = useMemo(() => {
    if (!dbSkills || dbSkills.length === 0) {
      return BASE_CATEGORIES;
    }

    const updated = BASE_CATEGORIES.map((cat) => {
      const dbMatches = dbSkills
        .filter((s) => {
          const catLower = s.category?.toLowerCase() || '';
          if (cat.categoryKey === 'DevOps') {
            return catLower === 'devops' || catLower === 'cloud';
          }
          return catLower === cat.categoryKey.toLowerCase();
        })
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      if (dbMatches.length > 0) {
        return {
          ...cat,
          skills: dbMatches.map((s) => ({
            name: s.name,
            iconName: s.icon || s.iconName,
            color: SKILL_COLORS[s.name.toLowerCase()] || '#A78BFA',
          })),
        };
      }
      return cat;
    });

    // Check if there are any other categories created by admin in DB
    const standardKeys = new Set(['frontend', 'backend', 'database', 'devops', 'cloud', 'cybersecurity']);
    const customCategoriesMap = new Map<string, Skill[]>();

    dbSkills.forEach((s) => {
      const catKey = s.category?.trim();
      if (catKey && !standardKeys.has(catKey.toLowerCase())) {
        if (!customCategoriesMap.has(catKey)) {
          customCategoriesMap.set(catKey, []);
        }
        customCategoriesMap.get(catKey)!.push(s);
      }
    });

    customCategoriesMap.forEach((skills, catName) => {
      updated.push({
        id: catName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: catName,
        categoryKey: catName,
        description: `${catName} capabilities and tools.`,
        glowBg: 'bg-purple-500/10',
        borderColor: 'hover:border-purple-500/40',
        icon: FiTerminal,
        skills: skills
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((s) => ({
            name: s.name,
            iconName: s.icon || s.iconName,
            color: SKILL_COLORS[s.name.toLowerCase()] || '#A78BFA',
          })),
      });
    });

    return updated;
  }, [dbSkills]);

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full filter blur-3xl" />
      </div>

      <div className="container-custom" ref={sectionRef as any}>
        {/* Section Header */}
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            Technical Expertise
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Core <span className="gradient-text">Skills &amp; Technologies</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto text-base sm:text-lg">
            A comprehensive, battle-tested stack combining full-stack engineering with cybersecurity rigor.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const HeaderIcon = cat.icon;
            const isCyber = cat.id === 'cybersecurity';

            return (
              <motion.div
                key={cat.id}
                data-reveal
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`glass-light rounded-2xl p-6 sm:p-7 border border-[var(--border)] ${cat.borderColor} transition-all duration-300 card-hover flex flex-col justify-between group ${
                  isCyber ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${cat.glowBg} flex items-center justify-center border border-white/5`}>
                        <HeaderIcon size={22} className="text-[var(--text-primary)]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">
                            {cat.name}
                          </h3>
                          {cat.badge && (
                            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">
                              {cat.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-medium text-[var(--text-muted)] bg-[var(--bg-overlay)] px-2.5 py-1 rounded-full border border-[var(--border)] shrink-0">
                      {cat.skills.length} skills
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-[var(--border)] mb-5 opacity-60" />

                  {/* Skills Pills / Badges */}
                  <div className="flex flex-wrap gap-2.5">
                    {cat.skills.map((skill) => {
                      const IconComponent = skill.icon;

                      return (
                        <div
                          key={skill.name}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] hover:border-brand-500/40 hover:bg-brand-500/5 transition-all duration-200 group/pill cursor-default"
                        >
                          {IconComponent ? (
                            <IconComponent
                              size={16}
                              style={{ color: skill.color || 'var(--text-secondary)' }}
                              className="shrink-0 transition-transform duration-200 group-hover/pill:scale-110"
                            />
                          ) : skill.iconName ? (
                            <DynamicIcon
                              name={skill.iconName}
                              size={16}
                              className="shrink-0 text-brand-400"
                            />
                          ) : (
                            <FiCheck size={14} className="text-brand-500 shrink-0" />
                          )}
                          <span className="text-xs sm:text-sm font-medium text-[var(--text-primary)] whitespace-nowrap">
                            {skill.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
