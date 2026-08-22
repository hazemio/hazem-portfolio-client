import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../../store';

const NAV_LINKS = [
  { label: 'Home',         href: '#hero' },
  { label: 'About',        href: '#about' },
  { label: 'Skills',       href: '#skills' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Experience',   href: '#experience' },
  { label: 'Contact',      href: '#contact' },
];

export default function Navbar() {
  const navRef   = useRef<HTMLElement>(null);
  const { theme, toggleTheme } = useThemeStore();
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);
  const [active,   setActive]   = useState('#hero');
  const location = useLocation();

  // GSAP entrance animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: 'power3.out' }
    );
  }, []);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Sync theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleNav = (href: string) => {
    setActive(href);
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Don't show on admin pages
  if (location.pathname.startsWith('/tech/mode1/dash/hg/admin')) return null;

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 navbar-scrolled shadow-glass' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Brand logo */}
        <a
          href="#hero"
          className="font-display font-bold text-xl tracking-tight text-[var(--text-primary)] flex items-center gap-1 group"
        >
          <span className="gradient-text">&lt;HG</span>
          <span className="text-brand-500 group-hover:translate-x-0.5 transition-transform inline-block">/&gt;</span>
        </a>

        {/* Desktop Nav links */}
        <nav className="hidden md:flex items-center gap-1 glass-light rounded-full px-4 py-1.5 border border-[var(--border)]">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNav(link.href);
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                active === link.href
                  ? 'text-brand-500 bg-brand-500/10 dark:bg-brand-500/20 font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right tools */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full glass-light hover:bg-[var(--bg-overlay)] text-[var(--text-primary)] transition-colors border border-[var(--border)]"
          >
            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-full glass-light text-[var(--text-primary)] border border-[var(--border)]"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-light border-b border-[var(--border)] overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav(link.href);
                  }}
                  className="px-4 py-2.5 rounded-xl text-base font-medium text-[var(--text-secondary)] hover:text-brand-500 hover:bg-brand-500/10 transition-all"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
