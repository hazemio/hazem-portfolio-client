import { motion } from 'framer-motion';
import { FiCode, FiAward, FiMessageSquare, FiLink, FiStar, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks';
import { projectsApi, certificatesApi, messagesApi, socialLinksApi, skillsApi, experienceApi } from '../../api';

function StatCard({ label, value, icon: Icon, to, color, loading }: any) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={to}
        className="block glass-light rounded-2xl p-6 border border-[var(--border)] hover:border-brand-500/30 transition-colors group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
          <FiArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
        </div>
        <div className="font-display font-bold text-3xl text-[var(--text-primary)] mb-1">
          {loading ? <span className="skeleton inline-block w-8 h-8 rounded" /> : value ?? 0}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">{label}</div>
      </Link>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { data: projects,     loading: l1 } = useApi(() => projectsApi.getAll());
  const { data: certs,        loading: l2 } = useApi(() => certificatesApi.getAll());
  const { data: messages,     loading: l3 } = useApi(() => messagesApi.getAll());
  const { data: socials,      loading: l4 } = useApi(() => socialLinksApi.getAll());
  const { data: skills,       loading: l5 } = useApi(() => skillsApi.getAll());
  const { data: experiences,  loading: l6 } = useApi(() => experienceApi.getAll());

  const unread = (messages as any[])?.filter((m) => !m.read).length || 0;

  const stats = [
    { label: 'Projects',     value: (projects as any[])?.length,    icon: FiCode,          to: '/admin/projects',      color: 'bg-brand-500',         loading: l1 },
    { label: 'Certificates', value: (certs as any[])?.length,       icon: FiAward,         to: '/admin/certificates',  color: 'bg-accent-violet',     loading: l2 },
    { label: 'Messages',     value: `${unread} new`,                icon: FiMessageSquare, to: '/admin/messages',      color: 'bg-accent-rose',       loading: l3 },
    { label: 'Social Links', value: (socials as any[])?.length,     icon: FiLink,          to: '/admin/social-links',  color: 'bg-accent-cyan',       loading: l4 },
    { label: 'Skills',       value: (skills as any[])?.length,      icon: FiStar,          to: '/admin/skills',        color: 'bg-accent-amber',      loading: l5 },
    { label: 'Experience',   value: (experiences as any[])?.length, icon: FiBriefcase,     to: '/admin/experience',    color: 'bg-accent-emerald',    loading: l6 },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">Overview of your portfolio content</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Recent messages */}
      <div className="glass-light rounded-2xl border border-[var(--border)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-display font-semibold text-[var(--text-primary)]">Recent Messages</h2>
          <Link to="/admin/messages" className="text-sm text-brand-500 hover:underline flex items-center gap-1">
            View all <FiArrowRight size={13} />
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {l3 ? (
            [...Array(3)].map((_, i) => <div key={i} className="skeleton h-16 mx-6 my-3 rounded-xl" />)
          ) : (messages as any[])?.slice(0, 5).map((msg: any) => (
            <div key={msg.id} className="px-6 py-4 flex items-start gap-4 hover:bg-[var(--bg-overlay)] transition-colors">
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-[var(--text-muted)]' : 'bg-brand-500'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`text-sm font-medium ${msg.read ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                    {msg.name}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">{msg.message}</p>
              </div>
            </div>
          ))}
          {!l3 && !(messages as any[])?.length && (
            <div className="px-6 py-10 text-center text-[var(--text-muted)] text-sm">No messages yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
