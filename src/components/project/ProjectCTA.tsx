import React from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiMessageSquare } from 'react-icons/fi';

export const ProjectCTA: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-12"
    >
      <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-brand-900/60 via-brand-950/80 to-accent-violet/40 border border-brand-500/30 text-white text-center shadow-brand-lg">
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20 mb-6 backdrop-blur-md">
            <FiMessageSquare className="w-6 h-6 text-brand-300" />
          </div>

          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
            Interested in Working Together?
          </h2>

          <p className="text-brand-100 text-base sm:text-lg leading-relaxed mb-8">
            Have a project in mind or want to collaborate on something amazing? Let's turn your vision into reality.
          </p>

          <a
            href="/#contact"
            className="btn-primary inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base shadow-brand hover:scale-105 transition-all"
          >
            <FiMail className="w-5 h-5" />
            <span>Get in Touch</span>
          </a>
        </div>
      </div>
    </motion.section>
  );
};
