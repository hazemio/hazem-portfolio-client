import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiSave, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { profileApi } from '../../api';
import { useApi } from '../../hooks';
import { Profile } from '../../types';

export default function AdminProfile() {
  const { data: profile, loading, refetch } = useApi<Profile>(() => profileApi.get());
  const [form, setForm]       = useState<Partial<Profile>>({});
  const [saving, setSaving]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef               = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { id, imageUrl, imageId, createdAt, updatedAt, ...data } = form as any;
      await profileApi.update(data);
      toast.success('Profile updated!');
      refetch();
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await profileApi.uploadImage(file);
      toast.success('Profile image updated!');
      refetch();
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const fields = [
    { name: 'name',     label: 'Full Name',    type: 'text',  placeholder: 'Hazem Gamal' },
    { name: 'role',     label: 'Role / Title', type: 'text',  placeholder: 'Full Stack Developer' },
    { name: 'email',    label: 'Email',        type: 'email', placeholder: 'hazem@example.com' },
    { name: 'phone',    label: 'Phone',        type: 'text',  placeholder: '+20 100 000 0000' },
    { name: 'location', label: 'Location',     type: 'text',  placeholder: 'Cairo, Egypt' },
    { name: 'cvUrl',    label: 'CV URL',       type: 'url',   placeholder: 'https://...' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Profile</h1>
        <p className="text-[var(--text-secondary)] mt-1">Update your personal information and profile image</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Image card */}
        <div className="lg:col-span-1">
          <div className="glass-light rounded-2xl p-6 border border-[var(--border)] text-center">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brand-500/30 mx-auto bg-[var(--bg-overlay)]">
                {profile?.imageUrl ? (
                  <img src={profile.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-accent-violet">
                    <FiUser size={40} className="text-white/70" />
                  </div>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <svg className="animate-spin w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                </div>
              )}
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-0.5">{profile?.name || 'Hazem Gamal'}</h3>
            <p className="text-sm text-[var(--text-muted)] mb-5">{profile?.role || 'Developer'}</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-outline w-full justify-center text-sm py-2.5"
            >
              <FiUpload size={14} />
              {uploading ? 'Uploading...' : 'Change Image'}
            </button>
            <p className="text-xs text-[var(--text-muted)] mt-2">Max 5MB · JPG, PNG, WebP</p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <div className="glass-light rounded-2xl p-6 border border-[var(--border)]">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {fields.slice(0, 2).map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{f.label}</label>
                      <input
                        name={f.name}
                        type={f.type}
                        value={(form as any)[f.name] || ''}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className="input-field"
                      />
                    </div>
                  ))}
                </div>

                {fields.slice(2).map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">{f.label}</label>
                    <input
                      name={f.name}
                      type={f.type}
                      value={(form as any)[f.name] || ''}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className="input-field"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={form.bio || ''}
                    onChange={handleChange}
                    placeholder="Tell visitors about yourself..."
                    rows={4}
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary disabled:opacity-60"
                  >
                    <FiSave size={15} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
