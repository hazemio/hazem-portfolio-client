import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiSend,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUser,
  FiMessageSquare,
  FiCheckCircle,
  FiCopy,
  FiCheck,
  FiClock,
  FiExternalLink,
} from 'react-icons/fi';
import { FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useScrollReveal, useApi } from '../../hooks';
import { messagesApi, profileApi } from '../../api';
import { Profile } from '../../types';

export default function ContactSection() {
  const sectionRef = useScrollReveal({ stagger: 0.12 });
  const { data: profile } = useApi<Profile>(() => profileApi.get());

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const email = profile?.email || 'hazemgmall45@gmail.com';
  const phone = profile?.phone || '+20 102 554 7663';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const location = profile?.location || 'Benisuef, Egypt';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    toast.success('Email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await messagesApi.send(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      toast.success("Message sent! I'll get back to you soon 🎉");
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brand-500/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-cyan/5 rounded-full filter blur-3xl" />
      </div>

      <div className="container-custom relative z-10" ref={sectionRef as any}>
        {/* Section Header */}
        <div className="mb-16 text-center" data-reveal>
          <span className="font-mono text-sm text-brand-500 flex items-center justify-center gap-2 mb-3">
            <span className="w-6 h-px bg-brand-500" />
            Get In Touch
            <span className="w-6 h-px bg-brand-500" />
          </span>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-[var(--text-primary)]">
            Let's Build Something <span className="gradient-text">Exceptional</span>
          </h2>
          <p className="text-[var(--text-secondary)] mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Have a project in mind, need a security consultation, or looking to discuss full-time roles? Let's connect.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Left Column: Direct Communication Channels */}
          <div className="lg:col-span-5 space-y-6" data-reveal>
            {/* Availability status badge */}
            <div className="glass-light rounded-2xl p-5 border border-[var(--border)]">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-emerald" />
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  Available for Hire &amp; Consulting
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Open to full-time engineering roles, freelance software development, and specialized VAPT cybersecurity assessments.
              </p>
            </div>

            {/* Direct Channel Cards */}
            <div className="space-y-3">
              {/* Email Card */}
              <div className="glass-light rounded-2xl p-4 border border-[var(--border)] hover:border-brand-500/40 transition-colors flex items-center justify-between gap-3 group">
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3.5 min-w-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <FiMail size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-[var(--text-muted)]">Direct Email</div>
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate hover:text-brand-400 transition-colors">
                      {email}
                    </div>
                  </div>
                </a>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-[var(--bg-overlay)] hover:bg-brand-500/20 text-[var(--text-muted)] hover:text-brand-300 transition-colors shrink-0"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copiedEmail ? <FiCheck size={16} className="text-accent-emerald" /> : <FiCopy size={16} />}
                </button>
              </div>

              {/* WhatsApp / Phone Card */}
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-light rounded-2xl p-4 border border-[var(--border)] hover:border-emerald-500/40 transition-colors flex items-center justify-between gap-3 group block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <FaWhatsapp size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-[var(--text-muted)]">Phone &amp; WhatsApp</div>
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-emerald-400 transition-colors">
                      {phone}
                    </div>
                  </div>
                </div>

                <div className="p-2 text-[var(--text-muted)] group-hover:text-emerald-400 transition-colors shrink-0">
                  <FiExternalLink size={16} />
                </div>
              </a>

              {/* LinkedIn Connection */}
              <a
                href="https://www.linkedin.com/in/%D8%A7hazemgamal/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-light rounded-2xl p-4 border border-[var(--border)] hover:border-sky-500/40 transition-colors flex items-center justify-between gap-3 group block"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <FaLinkedin size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono text-[var(--text-muted)]">Professional Network</div>
                    <div className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-sky-400 transition-colors">
                      Connect on LinkedIn
                    </div>
                  </div>
                </div>

                <div className="p-2 text-[var(--text-muted)] group-hover:text-sky-400 transition-colors shrink-0">
                  <FiExternalLink size={16} />
                </div>
              </a>

              {/* Location Card */}
              <div className="glass-light rounded-2xl p-4 border border-[var(--border)] flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-mono text-[var(--text-muted)]">Location</div>
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {location}
                    <span className="text-xs text-[var(--text-muted)] block sm:inline sm:ml-2">
                      (Open to Remote &amp; Relocation)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Reassurance */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] px-1">
              <FiClock size={14} className="text-brand-500 shrink-0" />
              <span>Prompt response guaranteed within 24 hours.</span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7" data-reveal>
            {sent ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-light rounded-3xl p-10 sm:p-12 border border-[var(--border)] text-center shadow-glass"
              >
                <div className="w-16 h-16 rounded-full bg-accent-emerald/15 text-accent-emerald flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-[var(--text-secondary)] text-sm sm:text-base mb-6 max-w-md mx-auto">
                  Thank you for reaching out. Your message has been routed to my primary inbox and I will respond promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="btn-outline"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass-light rounded-3xl p-7 sm:p-10 border border-[var(--border)] space-y-5 shadow-glass"
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <span className="flex items-center gap-1.5">
                        <FiUser size={13} /> Your Name *
                      </span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Sarah Connor"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
                      <span className="flex items-center gap-1.5">
                        <FiMail size={13} /> Email Address *
                      </span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Subject / Project Nature
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Full-Stack Role / Security Audit / Project Consultation"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[var(--text-secondary)] mb-2">
                    <span className="flex items-center gap-1.5">
                      <FiMessageSquare size={13} /> Message Details *
                    </span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Describe your requirements, timeline, or engineering goals..."
                    rows={5}
                    className="input-field resize-none"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="btn-primary w-full justify-center text-base py-3.5 shadow-brand disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Transmitting Message...</span>
                    </span>
                  ) : (
                    <>
                      <FiSend size={16} />
                      <span>Transmit Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
