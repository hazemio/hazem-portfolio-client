import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface Field {
  name: string;
  label: string;
  type?: 'text' | 'url' | 'number' | 'textarea' | 'checkbox' | 'select';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface CrudTableProps {
  title: string;
  items: any[];
  loading: boolean;
  fields: Field[];
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: string, data: any) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUploadImg?: (id: string, file: File) => Promise<void>;
  renderRow: (item: any) => React.ReactNode;
  refetch: () => void;
}

export default function CrudTable({
  title, items, loading, fields,
  onAdd, onUpdate, onDelete, onUploadImg,
  renderRow, refetch,
}: CrudTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // لضمان أن الـ Portal يعمل فقط في جانب العميل (Client-side)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const openAdd = () => {
    setEditing(null);
    const defaults: any = {};
    fields.forEach((f) => { defaults[f.name] = f.type === 'checkbox' ? false : f.type === 'number' ? 0 : ''; });
    setForm(defaults);
    setModalOpen(true);
  };

  const openEdit = (item: any) => {
    setEditing(item);
    const vals: any = {};
    fields.forEach((f) => { vals[f.name] = item[f.name] ?? (f.type === 'checkbox' ? false : ''); });
    setForm(vals);
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((p: any) => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: any = { ...form };
      fields.forEach((f) => { if (f.type === 'number' && payload[f.name] !== undefined) payload[f.name] = Number(payload[f.name]); });
      if (editing) {
        await onUpdate(editing.id, payload);
        toast.success('Updated successfully');
      } else {
        await onAdd(payload);
        toast.success('Added successfully');
      }
      setModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setDeleting(id);
    try {
      await onDelete(id);
      toast.success('Deleted');
      refetch();
    } catch { toast.error('Delete failed'); }
    finally { setDeleting(null); }
  };

  const handleImageUpload = async (id: string, file: File) => {
    if (!onUploadImg) return;
    setUploading(true);
    try {
      await onUploadImg(id, file);
      toast.success('Image uploaded');
      refetch();
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">{title}</h1>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={openAdd}
          className="btn-primary"
        >
          <FiPlus size={16} />
          <span>Add New</span>
        </motion.button>
      </div>

      {/* Table Container */}
      <div className="glass-light rounded-2xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-[var(--text-muted)]">
            <FiPlus size={32} className="mx-auto mb-3 opacity-30" />
            <p>No items yet. Click "Add New" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-[var(--bg-overlay)] transition-colors group">
                    <td className="px-6 py-4">{renderRow(item)}</td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onUploadImg && (
                          <label className="cursor-pointer p-2 rounded-lg text-[var(--text-muted)] hover:text-accent-cyan hover:bg-accent-cyan/10 transition-colors">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleImageUpload(item.id, f);
                              }}
                            />
                            {uploading ? <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> : <FiUpload size={15} />}
                          </label>
                        )}
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-[var(--text-muted)] hover:text-brand-500 hover:bg-brand-500/10 transition-colors">
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deleting === item.id}
                          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-accent-rose hover:bg-accent-rose/10 transition-colors disabled:opacity-50"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal using Portal to escape stacking context */}
      {mounted && createPortal(
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md"
                onClick={() => setModalOpen(false)}
              />

              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                className="relative w-full max-w-lg bg-[var(--bg-base)] dark:bg-[var(--bg-raised)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden z-[10000]"
              >
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
                  <h2 className="font-display font-semibold text-lg text-[var(--text-primary)]">
                    {editing ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`}
                  </h2>
                  <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-overlay)] transition-colors">
                    <FiX size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                  {fields.map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                        {f.label}{f.required && <span className="text-accent-rose ml-0.5">*</span>}
                      </label>
                      {f.type === 'textarea' ? (
                        <textarea
                          name={f.name}
                          value={form[f.name] || ''}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          rows={3}
                          required={f.required}
                          className="input-field resize-none"
                        />
                      ) : f.type === 'checkbox' ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name={f.name}
                            checked={!!form[f.name]}
                            onChange={handleChange}
                            className="w-4 h-4 accent-brand"
                          />
                          <span className="text-sm text-[var(--text-secondary)]">{f.placeholder || 'Yes'}</span>
                        </label>
                      ) : f.type === 'select' ? (
                        <select name={f.name} value={form[f.name] || ''} onChange={handleChange} className="input-field">
                          <option value="">Select...</option>
                          {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={f.type || 'text'}
                          name={f.name}
                          value={form[f.name] ?? ''}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          required={f.required}
                          className="input-field"
                        />
                      )}
                    </div>
                  ))}

                  <div className="flex gap-3 pt-4 sticky bottom-0 bg-inherit pb-2">
                    <button type="button" onClick={() => setModalOpen(false)} className="btn-ghost flex-1 justify-center">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                      {saving ? (
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      ) : (
                        <FiCheck size={15} />
                      )}
                      <span>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}