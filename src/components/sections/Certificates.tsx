import { motion } from 'framer-motion';
import { FiAward, FiExternalLink, FiCalendar } from 'react-icons/fi';
import { useScrollReveal, useApi } from '../../hooks';
import { certificatesApi } from '../../api';
import { Certificate } from '../../types';

export default function CertificatesSection() {
  const sectionRef = useScrollReveal();
  const { data: certificates, loading } = useApi<Certificate[]>(() => certificatesApi.getAll());

  return (
    <section id="certificates" className="section-padding relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-violet/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="container-custom" ref={sectionRef as any}>
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            Credentials
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Certificates & <span className="gradient-text">Achievements</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : (certificates || []).length === 0 ? (
          <p className="text-center text-[var(--text-muted)] py-20">No certificates yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(certificates || []).map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-light rounded-2xl overflow-hidden border border-[var(--border)] hover:border-brand-500/40 card-hover group"
              >
                {cert.imageUrl && (
                  <div className="h-40 overflow-hidden bg-[var(--bg-overlay)]">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/10 text-brand-500 mt-0.5 shrink-0">
                      <FiAward size={16} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-snug mb-1 line-clamp-2">
                        {cert.title}
                      </h3>
                      <p className="text-brand-500 text-xs font-medium mb-2">{cert.issuer}</p>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                          <FiCalendar size={11} />
                          {cert.date}
                        </span>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-brand-500 hover:underline"
                          >
                            <FiExternalLink size={11} />
                            Verify
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
