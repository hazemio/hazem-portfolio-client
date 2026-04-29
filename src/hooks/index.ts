import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ── useScrollReveal ────────────────────────────────────────
export function useScrollReveal(options?: { y?: number; delay?: number; stagger?: number }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll('[data-reveal]');
    const from = targets.length ? targets : [el];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        from,
        { y: options?.y ?? 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.9,
          delay: options?.delay ?? 0,
          stagger: options?.stagger ?? 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// ── useMagneticButton ──────────────────────────────────────
export function useMagneticButton(strength = 0.4) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    };
    const handleLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return ref;
}

// ── useApi ─────────────────────────────────────────────────
export function useApi<T>(fetcher: () => Promise<{ data: T }>, deps: any[] = []) {
  const [data, setData]     = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcher();
      setData(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

// ── useTextSplit ───────────────────────────────────────────
export function useTextSplit() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const text = el.textContent || '';
    el.innerHTML = text
      .split('')
      .map((c) => `<span class="char" style="display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`)
      .join('');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.char'),
        { y: '110%', opacity: 0, rotateZ: 5 },
        {
          y: '0%', opacity: 1, rotateZ: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return ref;
}

// ── useParallax ────────────────────────────────────────────
export function useParallax(speed = 0.5) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -100 * speed,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }, el);

    return () => ctx.revert();
  }, [speed]);

  return ref;
}
