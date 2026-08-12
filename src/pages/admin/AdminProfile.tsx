import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiSave, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { profileApi } from '../../api';
import { useApi } from '../../hooks';
import { Profile } from '../../types';

export default function AdminProfile() {
  const { data: profile, loading, refetch } = useApi<Profile>(() => profileApi.get());
  const [form, setForm] = useState<Partial<Profile>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { id, imageUrl, imageId, heroImageUrl, heroImageId, projectsCount, createdAt, updatedAt, ...data } = form as any;
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
    setUploadingAbout(true);
    try {
      const res = await profileApi.uploadImage(file);
      const updatedProfile = res.data;
      if (updatedProfile) {
        setForm((prev) => ({ ...prev, ...updatedProfile }));
      }
      toast.success('About section profile image updated!');
      refetch();
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingAbout(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingHero(true);
    try {
      const res = await profileApi.uploadHeroImage(file);
      const updatedProfile = res.data;
      if (updatedProfile) {
        setForm((prev) => ({ ...prev, ...updatedProfile }));
      }
      toast.success('Hero section profile image updated!');
      refetch();
    } catch {
      toast.error('Failed to upload hero image');
    } finally {
      setUploadingHero(false);
    }
  };

  const textFields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Hazem Gamal' },
    { name: 'role', label: 'Role / Title', type: 'text', placeholder: 'Full Stack Developer' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'hazem@example.com' },
    { name: 'phone', label: 'Phone', type: 'text', placeholder: '+20 100 000 0000' },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'Cairo, Egypt' },
    { name: 'cvUrl', label: 'CV URL', type: 'url', placeholder: 'https://...' },
  ];

  const statFields = [
    { name: 'yearsExperience', label: 'Years Experience', type: 'text', placeholder: '3+' },
    { name: 'completedProjectsLabel', label: 'Completed Projects Label (Fallback)', type: 'text', placeholder: '50+' },
    { name: 'clientSatisfaction', label: 'Client Satisfaction', type: 'text', placeholder: '100%' },
    { name: 'happyClients', label: 'Happy Clients', type: 'text', placeholder: '20+' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Profile</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your personal information, hero statistics, and profile images.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Images Card (About Image & Hero Image) */}
        <div className="lg:col-span-1 space-y-6">
          {/* About Image */}
          <div className="glass-light rounded-2xl p-6 border border-[var(--border)] text-center">
            <h4 className="font-mono text-xs text-brand-500 font-semibold uppercase tracking-wider mb-3">
              About Section Image
            </h4>
            <div className="relative inline-block mb-3">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-brand-500/30 mx-auto bg-[var(--bg-overlay)]">
                {profile?.imageUrl ? (
                  <img src={profile.imageUrl} alt="About Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-accent-violet">
                    <FiUser size={36} className="text-white/70" />
                  </div>
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploadingAbout}
              className="btn-outline w-full justify-center text-xs py-2"
            >
              <FiUpload size={13} />
              {uploadingAbout ? 'Uploading...' : 'Change About Image'}
            </button>
          </div>

          {/* Hero Image */}
          <div className="glass-light rounded-2xl p-6 border border-[var(--border)] text-center">
            <h4 className="font-mono text-xs text-accent-cyan font-semibold uppercase tracking-wider mb-3">
              Hero Section Image (Optional)
            </h4>
            <div className="relative inline-block mb-3">
              <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-accent-cyan/30 mx-auto bg-[var(--bg-overlay)]">
                {profile?.heroImageUrl || profile?.imageUrl ? (
                  <img
                    src={profile?.heroImageUrl || profile?.imageUrl}
                    alt="Hero Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-cyan to-brand-500">
                    <FiUser size={36} className="text-white/70" />
                  </div>
                )}
              </div>
            </div>
            <input ref={heroFileRef} type="file" accept="image/*" className="hidden" onChange={handleHeroImageUpload} />
            <button
              onClick={() => heroFileRef.current?.click()}
              disabled={uploadingHero}
              className="btn-outline w-full justify-center text-xs py-2 hover:border-accent-cyan/50"
            >
              <FiUpload size={13} />
              {uploadingHero ? 'Uploading...' : 'Change Hero Image'}
            </button>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              Falls back to About Image if empty
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-2">
          <div className="glass-light rounded-2xl p-6 border border-[var(--border)]">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton h-12 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-5">
                {/* Personal Info Grid */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {textFields.slice(0, 2).map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                        {f.label}
                      </label>
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

                {textFields.slice(2).map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {f.label}
                    </label>
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

                {/* Hero Statistics Section */}
                <div className="pt-4 border-t border-[var(--border)]">
                  <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-4">
                    Hero Section Statistics
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {statFields.map((f) => (
                      <div key={f.name}>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                          {f.label}
                        </label>
                        <input
                          name={f.name}
                          type={f.type}
                          value={(form as any)[f.name] || ''}
                          onChange={handleChange}
                          placeholder={f.placeholder}
                          className="input-field text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio */}
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
