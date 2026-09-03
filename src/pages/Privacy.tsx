import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiCheckCircle, FiMail, FiShare2, FiServer, FiGlobe, FiDatabase, FiUserCheck, FiFileText } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';
import { useApi } from '../hooks';
import { profileApi } from '../api';
import { Profile } from '../types';
import LinesBackground from './cnavabg/LinesBackground';

export default function PrivacyPage() {
  const { data: profile } = useApi<Profile>(() => profileApi.get());
  const contactEmail = profile?.email || 'YOUR_EMAIL@example.com';

  useEffect(() => {
    document.title = 'Privacy Policy | Hazem Gamal';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen pt-28 pb-16 overflow-hidden">
      <LinesBackground />

      {/* Subtle ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom relative z-10 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs font-semibold text-brand-500 uppercase tracking-widest flex items-center justify-center gap-2 mb-3">
            <span className="w-8 h-px bg-brand-500/50" />
            Legal & Data Compliance
            <span className="w-8 h-px bg-brand-500/50" />
          </span>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)] mb-3">
            Privacy <span className="gradient-text">Policy</span>
          </h1>
          <p className="font-mono text-xs text-[var(--text-muted)] bg-[var(--bg-overlay)] px-3 py-1 rounded-full border border-[var(--border)] inline-block">
            Last Updated: September 3, 2026
          </p>
        </motion.div>

        {/* Introduction Banner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-light rounded-2xl p-6 sm:p-8 border border-brand-500/30 mb-10 shadow-glass bg-gradient-to-br from-brand-500/5 to-transparent relative overflow-hidden"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 shrink-0">
              <FiShield size={24} />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
                Overview & Commitment
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                This Privacy Policy explains how this website collects, uses, stores, and protects information when you use our services, including features that allow you to connect your LinkedIn account.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-violet/10 text-accent-violet">
                <FiDatabase size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                1. Information We Collect
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              We collect information provided directly by users when interacting with our contact features, as well as information obtained through authorized third-party authentication providers.
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">
              LinkedIn OAuth Data (where applicable):
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-5 mb-4">
              <li>LinkedIn profile information</li>
              <li>Member Name</li>
              <li>Profile identifier (Member URN)</li>
              <li>Email address (when explicit permission is granted)</li>
              <li>OAuth access tokens required to perform authorized LinkedIn actions</li>
              <li>Information necessary to publish content to LinkedIn when the user explicitly authorizes this functionality</li>
            </ul>
            <p className="text-xs text-brand-500 font-mono bg-brand-500/10 p-3 rounded-xl border border-brand-500/20">
              Note: This website only requests information strictly necessary for the specific functionality being used.
            </p>
          </section>

          {/* Section 2 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-emerald/10 text-accent-emerald">
                <FiCheckCircle size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                2. How We Use Information
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Collected information may be used for the following legitimate purposes:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-5 mb-6">
              <li>Authenticating users securely</li>
              <li>Connecting a user's LinkedIn account</li>
              <li>Providing LinkedIn integration functionality and displaying activity</li>
              <li>Publishing content to LinkedIn when explicitly authorized by the user</li>
              <li>Maintaining, operating, and improving the website</li>
              <li>Preventing abuse, fraudulent activity, and unauthorized access</li>
              <li>Providing technical support and responding to inquiries</li>
            </ul>
            <div className="p-4 rounded-xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald font-semibold text-sm flex items-center gap-2">
              <FiShield size={18} className="shrink-0" />
              <span>We do not sell, rent, or trade users' personal information.</span>
            </div>
          </section>

          {/* Section 3 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-sky-500/30 shadow-glass bg-sky-500/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
                <FaLinkedin size={20} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                3. LinkedIn Integration
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Our website offers optional integration features with LinkedIn. The following rules govern our LinkedIn integration:
            </p>
            <ul className="space-y-2.5 text-sm text-[var(--text-secondary)] list-disc pl-5">
              <li>Users may choose to connect their LinkedIn account at their discretion.</li>
              <li>LinkedIn authentication is handled securely through LinkedIn's official OAuth authorization system.</li>
              <li>The website accesses LinkedIn information only after the user grants explicit permission.</li>
              <li>The website <strong>never requests or stores the user's LinkedIn password</strong>.</li>
              <li>Users can revoke the application's access at any time through their LinkedIn account settings.</li>
              <li>LinkedIn data is used exclusively for the functionality authorized by the user.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-rose/10 text-accent-rose">
                <FiLock size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                4. Data Storage and Security
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed space-y-3">
              We employ reasonable technical and organizational security measures to protect your information:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-5 mt-3 mb-4">
              <li>Access tokens and sensitive credentials are processed and stored securely on the server side.</li>
              <li>Sensitive credentials and API secrets are <strong>never exposed to frontend JavaScript</strong>.</li>
              <li>Production communications are encrypted using standard HTTPS / TLS protocols.</li>
              <li>Database connections utilize secure connection pooling and security practices.</li>
            </ul>
            <p className="text-xs text-[var(--text-muted)] italic">
              Please note that while we follow industry best practices, no digital transmission or electronic storage method can guarantee absolute security.
            </p>
          </section>

          {/* Section 5 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-amber/10 text-accent-amber">
                <FiFileText size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                5. Data Retention
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Information is retained only for as long as reasonably necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce agreements.
            </p>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              For LinkedIn OAuth credentials and tokens, they are removed when the user explicitly disconnects the LinkedIn integration or when they are no longer required for feature operations.
            </p>
          </section>

          {/* Section 6 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-cyan/10 text-accent-cyan">
                <FiShare2 size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                6. Third-Party Services
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              We may utilize trusted third-party infrastructure providers to deliver our portfolio and integration features:
            </p>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-[var(--text-primary)] shrink-0">• LinkedIn:</span>
                <span>For OAuth authentication and publishing authorized professional activity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-[var(--text-primary)] shrink-0">• Vercel:</span>
                <span>For global web application hosting and edge content delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-[var(--text-primary)] shrink-0">• Cloudinary:</span>
                <span>For secure media asset hosting (images and media previews).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-[var(--text-primary)] shrink-0">• PostgreSQL / Supabase:</span>
                <span>For secure server database storage.</span>
              </li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-500">
                <FiServer size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                7. Cookies and Local Storage
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              This website uses minimal essential cookies and browser local storage for functional capabilities:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-5">
              <li>Authentication and session security tokens (HTTP-only cookies).</li>
              <li>User theme preferences (Dark / Light mode selection stored locally).</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-emerald/10 text-accent-emerald">
                <FiUserCheck size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                8. User Rights
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              Depending on your jurisdiction, you may have rights regarding your personal information, including:
            </p>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)] list-disc pl-5">
              <li>Requesting access to data stored about you</li>
              <li>Requesting correction of inaccurate data</li>
              <li>Requesting deletion of your personal data</li>
              <li>Disconnecting third-party integrations</li>
              <li>Revoking LinkedIn authorization via account settings</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-violet/10 text-accent-violet">
                <FiGlobe size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                9. Children's Privacy
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Our service is not intentionally directed toward children under the applicable minimum age. We do not knowingly collect personal information from children.
            </p>
          </section>

          {/* Section 10 */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-[var(--border)] shadow-glass">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-accent-amber/10 text-accent-amber">
                <FiFileText size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                10. Changes to This Privacy Policy
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We may update this Privacy Policy periodically. When significant changes occur, we will update the "Last Updated" date at the top of this document.
            </p>
          </section>

          {/* Section 11: Contact */}
          <section className="glass-light rounded-2xl p-6 sm:p-8 border border-brand-500/30 shadow-glass bg-gradient-to-br from-brand-500/5 to-accent-violet/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-500">
                <FiMail size={18} />
              </div>
              <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">
                11. Contact Us
              </h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at:
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-overlay)] border border-[var(--border)] text-brand-500 font-mono text-sm font-semibold">
              <FiMail size={16} />
              <span>{contactEmail}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
