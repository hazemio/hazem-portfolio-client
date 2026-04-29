import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiMail, FiX, FiEye } from 'react-icons/fi';
import { FiInbox } from "react-icons/fi";
import toast from 'react-hot-toast';
import { useApi } from '../../hooks';
import { messagesApi } from '../../api';
import { Message } from '../../types';

export default function AdminMessages() {
  const { data, loading, refetch } = useApi<Message[]>(() => messagesApi.getAll());
  const [selected, setSelected] = useState<Message | null>(null);
  const messages = data || [];
  const unread = messages.filter((m) => !m.read).length;

  const handleRead = async (msg: Message) => {
    setSelected(msg);
    if (!msg.read) {
      try { await messagesApi.markRead(msg.id); refetch(); } catch {}
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    try {
      await messagesApi.delete(id);
      if (selected?.id === id) setSelected(null);
      toast.success('Message deleted');
      refetch();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Messages</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            {messages.length} total · <span className="text-brand-500 font-medium">{unread} unread</span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Message list */}
        <div className="lg:col-span-2">
          <div className="glass-light rounded-2xl border border-[var(--border)] overflow-hidden">
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
              </div>
            ) : messages.length === 0 ? (
              <div className="py-16 text-center text-[var(--text-muted)]">
                <FiMail size={32} className="mx-auto mb-3 opacity-30" />
                <p>No messages yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    onClick={() => handleRead(msg)}
                    className={`px-4 py-3.5 cursor-pointer transition-colors hover:bg-[var(--bg-overlay)] ${selected?.id === msg.id ? 'bg-brand-500/5 border-l-2 border-brand-500' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-transparent border border-[var(--border)]' : 'bg-brand-500'}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className={`text-sm ${msg.read ? 'font-normal text-[var(--text-secondary)]' : 'font-semibold text-[var(--text-primary)]'}`}>
                            {msg.name}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] shrink-0">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {msg.subject && <div className="text-xs text-[var(--text-muted)] truncate">{msg.subject}</div>}
                        <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="glass-light rounded-2xl border border-[var(--border)] overflow-hidden"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-2 text-[var(--text-muted)]">
                    <FiInbox size={16} />
                    <span className="text-sm">Message</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-accent-rose hover:bg-accent-rose/10 transition-colors"
                    >
                      <FiTrash2 size={15} />
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-overlay)] transition-colors"
                    >
                      <FiX size={15} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="font-display font-semibold text-xl text-[var(--text-primary)] mb-1">
                    {selected.subject || 'No subject'}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] mb-6">
                    <span>From: <span className="text-[var(--text-primary)]">{selected.name}</span></span>
                    <a href={`mailto:${selected.email}`} className="text-brand-500 hover:underline">{selected.email}</a>
                    <span>{new Date(selected.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap bg-[var(--bg-overlay)] rounded-xl p-4 text-sm">
                    {selected.message}
                  </div>
                  <div className="mt-6">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${selected.subject || ''}`}
                      className="btn-primary text-sm py-2.5"
                    >
                      <FiMail size={14} />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-light rounded-2xl border border-[var(--border)] h-64 flex items-center justify-center"
              >
                <div className="text-center text-[var(--text-muted)]">
                  <FiEye size={32} className="mx-auto mb-3 opacity-30" />
                  <p>Select a message to view</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
