import { motion } from 'framer-motion';
import { FiAward, FiExternalLink, FiCalendar, FiShield, FiCheckCircle } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { certificatesApi } from '../../api';
import { Certificate } from '../../types';

interface DisplayCredential {
  id: string;
  title: string;
  issuer: string;
  date: string;
  category?: string;
  imageUrl?: string;
  credentialUrl?: string;
}

const KEY_CREDENTIALS: DisplayCredential[] = [
  {
    id: 'depi-vapt',
    title: 'Vulnerability Assessment & Penetration Testing (VAPT)',
    issuer: 'DEPI - Digital Egypt Pioneers Initiative',
    date: '2024',
    category: 'VAPT & Defensive Security',
    credentialUrl: 'https://depi.gov.eg/',
  },
  {
    id: 'iti-cybersecurity',
    title: 'Cybersecurity Specialist Intensive Program',
    issuer: 'Information Technology Institute (ITI)',
    date: '2024',
    category: 'Offensive & Defensive Security',
    credentialUrl: 'https://iti.gov.eg/',
  },
  {
    id: 'huawei-hccda',
    title: 'HCCDA - Huawei Cloud Certified Developer Associate',
    issuer: 'Huawei Technologies',
    date: '2024',
    category: 'Cloud & System Architecture',
    credentialUrl: 'https://e.huawei.com/',
  },
  {
    id: 'cisco-netacad',
    title: 'CCNA: Introduction to Networks & Cybersecurity Essentials',
    issuer: 'Cisco Networking Academy',
    date: '2023 - 2024',
    category: 'Networking & Infrastructure',
    credentialUrl: 'https://www.netacad.com/',
  },
];

export default function CertificatesSection() {
  const sectionRef = useScrollReveal();
  const { data: dbCertificates, loading } = useApi<Certificate[]>(() => certificatesApi.getAll());

  // Merge DB certificates with default key credentials, avoiding duplicates
  const allCertificates: DisplayCredential[] = (() => {
    if (!dbCertificates || dbCertificates.length === 0) {
      return KEY_CREDENTIALS;
    }

    const keyTitles = new Set(KEY_CREDENTIALS.map((c) => c.title.toLowerCase()));
    const dbMapped: DisplayCredential[] = dbCertificates.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      category: 'Verified Credential',
      imageUrl: c.imageUrl,
      credentialUrl: c.credentialUrl,
    }));

    // Add any key credentials that aren't already represented in DB
    const missingKeys = KEY_CREDENTIALS.filter(
      (k) => !dbCertificates.some((d) => d.title.toLowerCase().includes(k.id) || d.title.toLowerCase().includes(k.title.toLowerCase().slice(0, 15)))
    );

    return [...dbMapped, ...missingKeys];
  })();

  return (
    <section id="certificates" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-violet/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom" ref={sectionRef as any}>
        {/* Section Header */}
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            Verified Credentials
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Certificates &amp; <span className="gradient-text">Specializations</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Professional certifications and accredited cybersecurity and engineering training.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-56 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCertificates.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-light rounded-2xl overflow-hidden border border-[var(--border)] hover:border-brand-500/40 card-hover group flex flex-col justify-between h-full"
              >
                <div>
                  {cert.imageUrl && (
                    <div className="h-36 overflow-hidden bg-[var(--bg-overlay)] border-b border-[var(--border)]/60">
                      <img
                        src={cert.imageUrl}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    {/* Top row: Icon & category badge */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 shrink-0">
                        {cert.title.toLowerCase().includes('security') || cert.title.toLowerCase().includes('vapt') ? (
                          <FiShield size={18} />
                        ) : (
                          <FiAward size={18} />
                        )}
                      </div>

                      {cert.category && (
                        <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 rounded border border-brand-500/20 truncate max-w-[150px]">
                          {cert.category}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-[var(--text-primary)] text-sm sm:text-base leading-snug mb-2 group-hover:text-brand-400 transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-xs font-medium line-clamp-2">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                {/* Footer with Date & Verification Link */}
                <div className="px-5 sm:px-6 py-3.5 border-t border-[var(--border)]/60 bg-[var(--bg-overlay)]/30 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)] font-mono text-[11px]">
                    <FiCalendar size={12} className="text-brand-500" />
                    {cert.date}
                  </span>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 hover:underline"
                    >
                      <span>Verify</span>
                      <FiExternalLink size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
