import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';
import { DynamicIcon } from '../../utils/icons';
import { useApi } from '../../hooks';
import { socialLinksApi } from '../../api';
import { SocialLink } from '../../types';

export default function SocialSidebar() {
  const ref = useRef<HTMLDivElement>(null);
  const { data: socials } = useApi<SocialLink[]>(() => socialLinksApi.getAll());
  const location = useLocation();

  useEffect(() => {
    if (!ref.current || !socials?.length) return;
    gsap.fromTo(
      ref.current.querySelectorAll('a'),
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, delay: 1.5, ease: 'power3.out' }
    );
  }, [socials]);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <div
      ref={ref}
      className="fixed left-6 bottom-0 z-40 hidden lg:flex flex-col items-center gap-4"
    >
      {socials?.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          title={s.platform}
          className="tooltip-trigger group p-2.5 rounded-full glass border border-[var(--border)] text-[var(--text-muted)] hover:text-brand-500 hover:border-brand-500/30 hover:shadow-brand transition-all duration-300 hover:-translate-y-1"
        >
          <DynamicIcon name={s.icon} size={15} />
          <span className="tooltip-content left-full bottom-auto top-1/2 -translate-y-1/2 ml-3 translate-x-2">
            {s.platform}
          </span>
        </a>
      ))}
      {/* Vertical line */}
      <div className="w-px h-20 bg-gradient-to-b from-brand-500/50 to-transparent mt-2" />
    </div>
  );
}
