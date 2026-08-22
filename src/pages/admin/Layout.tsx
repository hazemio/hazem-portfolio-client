import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiUser, FiCode, FiAward, FiLink, FiMessageSquare,
  FiBriefcase, FiBookOpen, FiStar, FiLogOut, FiSun, FiMoon, FiMenu, FiX,
  FiExternalLink,
} from 'react-icons/fi';
import { useAuthStore, useThemeStore } from '../../store';
import { useApi } from '../../hooks';
import { messagesApi } from '../../api';

const ADMIN_BASE = '/tech/mode1/dash/hg/admin';

const NAV = [
  { to: ADMIN_BASE,                  label: 'Dashboard',    icon: FiGrid },
  { to: `${ADMIN_BASE}/profile`,      label: 'Profile',      icon: FiUser },
  { to: `${ADMIN_BASE}/projects`,     label: 'Projects',     icon: FiCode },
  { to: `${ADMIN_BASE}/certificates`, label: 'Certificates', icon: FiAward },
  { to: `${ADMIN_BASE}/social-links`, label: 'Social Links', icon: FiLink },
  { to: `${ADMIN_BASE}/skills`,       label: 'Skills',       icon: FiStar },
  { to: `${ADMIN_BASE}/experience`,   label: 'Experience',   icon: FiBriefcase },
  { to: `${ADMIN_BASE}/education`,    label: 'Education',    icon: FiBookOpen },
  { to: `${ADMIN_BASE}/messages`,     label: 'Messages',     icon: FiMessageSquare },
];

export default function AdminLayout() {
  const { logout, admin }  = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate  = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: unreadCount } = useApi<number>(() =>
    messagesApi.unreadCount().then((r) => ({ data: r.data }))
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate('/tech/mode1/dash/hg/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-violet flex items-center justify-center shadow-brand">
            <span className="font-display font-bold text-sm text-white">HG</span>
          </div>
          <div>
            <div className="font-display font-bold text-[var(--text-primary)] text-sm">Admin Panel</div>
            <div className="text-xs text-[var(--text-muted)] truncate max-w-[120px]">{admin?.email}</div>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === ADMIN_BASE}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `admin-sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} />
            <span className="flex-1">{label}</span>
            {label === 'Messages' && unreadCount > 0 && (
              <span className="text-xs bg-brand-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-[var(--border)] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-sidebar-item"
        >
          <FiExternalLink size={17} />
          <span>View Portfolio</span>
        </a>
        <button onClick={toggleTheme} className="admin-sidebar-item w-full">
          {theme === 'dark' ? <FiSun size={17} /> : <FiMoon size={17} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button onClick={handleLogout} className="admin-sidebar-item w-full text-accent-rose hover:bg-accent-rose/10 hover:text-accent-rose">
          <FiLogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[var(--bg-raised)] border-r border-[var(--border)] fixed top-0 left-0 h-screen z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 w-64 h-screen bg-[var(--bg-raised)] border-r border-[var(--border)] z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[var(--bg-raised)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-overlay)] transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu size={20} />
          </button>
          <div className="flex-1" />
          <div className="text-sm text-[var(--text-muted)]">
            Welcome, <span className="text-[var(--text-primary)] font-medium">{admin?.email?.split('@')[0]}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
