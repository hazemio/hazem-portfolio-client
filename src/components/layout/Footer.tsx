import { useLocation, Link } from 'react-router-dom';
import { DynamicIcon } from '../../utils/icons';
import { useApi } from '../../hooks';
import { socialLinksApi } from '../../api';
import { SocialLink } from '../../types';

export default function Footer() {
  const location = useLocation();
  const { data: socials } = useApi<SocialLink[]>(() => socialLinksApi.getAll());

  if (location.pathname.startsWith('/tech/mode1/dash/hg/admin')) return null;

  return (
    <footer className="border-t border-[var(--border)] py-10 mt-20">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-display font-bold text-xl gradient-text">
          HG<span className="text-brand-500">.</span>
        </div>

        {/* Social links */}
        {socials && socials.length > 0 && (
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                title={s.platform}
                className="tooltip-trigger p-2.5 rounded-full glass border border-[var(--border)] text-[var(--text-secondary)] hover:text-brand-500 hover:border-brand-500/40 transition-all duration-200 hover:scale-110 hover:shadow-brand"
              >
                <DynamicIcon name={s.icon} size={16} />
                <span className="tooltip-content">{s.platform}</span>
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-[var(--text-muted)]">
          <p>
            Built with Dragon Design by Hazem Gamal © {new Date().getFullYear()}
          </p>
          <span className="hidden sm:inline text-[var(--border)]">•</span>
          <Link to="/privacy" className="hover:text-brand-500 transition-colors font-medium underline underline-offset-4">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
