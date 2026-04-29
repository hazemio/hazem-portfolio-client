import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal, useApi } from '../../hooks';
import { skillsApi } from '../../api';
import { Skill } from '../../types';
import { DynamicIcon } from '../../utils/icons';

gsap.registerPlugin(ScrollTrigger);

function SkillBar({ skill }: { skill: Skill }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!barRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: skill.level / 100,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: barRef.current, start: 'top 90%', once: true },
        }
      );
    });
    return () => ctx.revert();
  }, [skill.level]);

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {skill.iconName && <DynamicIcon name={skill.iconName} size={16} className="text-brand-500" />}
          <span className="text-sm font-medium text-[var(--text-primary)]">{skill.name}</span>
        </div>
        <span className="text-xs font-mono text-brand-500">{skill.level}%</span>
      </div>
      <div className="h-1.5 w-full bg-[var(--bg-overlay)] rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full origin-left"
          style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const sectionRef = useScrollReveal({ stagger: 0.1 });
  const { data: skills, loading } = useApi<Skill[]>(() => skillsApi.getAll());

  const grouped = (skills || []).reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  const categoryColors: Record<string, string> = {
    Frontend: 'from-brand-500 to-accent-violet',
    Backend:  'from-accent-cyan to-accent-emerald',
    DevOps:   'from-accent-amber to-accent-rose',
    Database: 'from-accent-emerald to-accent-cyan',
    Design:   'from-accent-rose to-accent-violet',
  };

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full filter blur-3xl" />
      </div>

      <div className="container-custom" ref={sectionRef as any}>
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            Technical Skills
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            My <span className="gradient-text">Tech Stack</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
            A curated selection of technologies I work with to build modern, scalable applications.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(grouped).map(([category, catSkills]) => (
              <div
                key={category}
                data-reveal
                className="glass-light rounded-2xl p-6 border border-[var(--border)] card-hover"
              >
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${categoryColors[category] || 'from-brand-500 to-accent-violet'}`} />
                  <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">{category}</h3>
                  <span className="ml-auto text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-overlay)] px-2 py-0.5 rounded-full">
                    {catSkills.length}
                  </span>
                </div>

                <div className="space-y-5">
                  {catSkills.map((s) => (
                    <SkillBar key={s.id} skill={s} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
