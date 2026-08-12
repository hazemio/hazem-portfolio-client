import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiSave, FiUser, FiVideo, FiTrash2, FiPlay, FiLink } from 'react-icons/fi';
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
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoSource, setVideoSource] = useState<'CLOUDINARY_UPLOAD' | 'CLOUDINARY_URL' | 'YOUTUBE'>('CLOUDINARY_UPLOAD');
  const [cloudinaryUrlInput, setCloudinaryUrlInput] = useState('');
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);
  const heroFileRef = useRef<HTMLInputElement>(null);
  const videoFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm(profile);
      if (profile.footballVideoType) {
        setVideoSource(profile.footballVideoType);
      }
      if (profile.footballVideoUrl && profile.footballVideoType === 'CLOUDINARY_URL') {
        setCloudinaryUrlInput(profile.footballVideoUrl);
      }
      if (profile.footballYoutubeUrl) {
        setYoutubeUrlInput(profile.footballYoutubeUrl);
      }
    }
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

  const handleFootballVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVideo(true);
    try {
      const res = await profileApi.uploadFootballVideo(file);
      const updatedProfile = res.data;
      if (updatedProfile) {
        setForm((prev) => ({ ...prev, ...updatedProfile }));
      }
      toast.success('Football Heroes video uploaded to Cloudinary!');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleSaveCloudinaryUrl = async () => {
    if (!cloudinaryUrlInput.trim()) {
      toast.error('Please enter a valid Cloudinary video URL');
      return;
    }
    setSaving(true);
    try {
      const res = await profileApi.update({
        footballVideoType: 'CLOUDINARY_URL',
        footballVideoUrl: cloudinaryUrlInput.trim(),
        footballYoutubeUrl: null,
      });
      if (res.data) {
        setForm((prev) => ({ ...prev, ...res.data }));
      }
      toast.success('Cloudinary video URL saved!');
      refetch();
    } catch {
      toast.error('Failed to save Cloudinary video URL');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveYoutubeUrl = async () => {
    if (!youtubeUrlInput.trim()) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    setSaving(true);
    try {
      const res = await profileApi.update({
        footballVideoType: 'YOUTUBE',
        footballYoutubeUrl: youtubeUrlInput.trim(),
      });
      if (res.data) {
        setForm((prev) => ({ ...prev, ...res.data }));
      }
      toast.success('YouTube video URL saved!');
      refetch();
    } catch {
      toast.error('Failed to save YouTube URL');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFootballVideo = async () => {
    if (!confirm('Are you sure you want to remove the Football Heroes video?')) return;
    try {
      const res = await profileApi.deleteFootballVideo();
      if (res.data) {
        setForm((prev) => ({ ...prev, ...res.data }));
        setCloudinaryUrlInput('');
        setYoutubeUrlInput('');
      }
      toast.success('Football Heroes video removed');
      refetch();
    } catch {
      toast.error('Failed to remove video');
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
          Manage your personal information, hero statistics, profile images, and Football Heroes video.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Images & Video Card Column */}
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

        {/* Form Column & Football Heroes Video Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Football Heroes Video Card */}
          <div className="glass-light rounded-2xl p-6 border border-brand-500/30 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <FiVideo className="text-brand-500 text-xl" />
              <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">
                Football Heroes Video (أبطال الكرة)
              </h3>
            </div>

            {/* Video Source Selector — 3 Options */}
            <div className="mb-5">
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                Video Source
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[var(--text-primary)]">
                  <input
                    type="radio"
                    name="videoSource"
                    value="CLOUDINARY_UPLOAD"
                    checked={videoSource === 'CLOUDINARY_UPLOAD'}
                    onChange={() => setVideoSource('CLOUDINARY_UPLOAD')}
                    className="accent-brand-500"
                  />
                  Upload Video
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[var(--text-primary)]">
                  <input
                    type="radio"
                    name="videoSource"
                    value="CLOUDINARY_URL"
                    checked={videoSource === 'CLOUDINARY_URL'}
                    onChange={() => setVideoSource('CLOUDINARY_URL')}
                    className="accent-brand-500"
                  />
                  Cloudinary URL
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[var(--text-primary)]">
                  <input
                    type="radio"
                    name="videoSource"
                    value="YOUTUBE"
                    checked={videoSource === 'YOUTUBE'}
                    onChange={() => setVideoSource('YOUTUBE')}
                    className="accent-brand-500"
                  />
                  YouTube URL
                </label>
              </div>
            </div>

            {/* Source A: Upload Video (Cloudinary Upload) */}
            {videoSource === 'CLOUDINARY_UPLOAD' && (
              <div className="space-y-4">
                <input
                  ref={videoFileRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/mkv"
                  className="hidden"
                  onChange={handleFootballVideoUpload}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => videoFileRef.current?.click()}
                    disabled={uploadingVideo}
                    className="btn-primary text-xs py-2 px-4"
                  >
                    <FiUpload size={14} />
                    <span>{uploadingVideo ? 'Uploading Video...' : 'Upload Football Video'}</span>
                  </button>

                  {(form.footballVideoUrl || form.footballYoutubeUrl) && (
                    <button
                      onClick={handleDeleteFootballVideo}
                      className="btn-ghost text-red-500 hover:text-red-600 text-xs py-2 px-3 flex items-center gap-1.5"
                    >
                      <FiTrash2 size={13} /> Remove Video
                    </button>
                  )}
                </div>
                <p className="text-xs text-[var(--text-muted)]">
                  Supports MP4, WebM, MOV, MKV (Max 50MB)
                </p>

                {form.footballVideoType === 'CLOUDINARY_UPLOAD' && form.footballVideoUrl && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-emerald-500 mb-1 flex items-center gap-1">
                      <FiPlay size={12} /> Cloudinary Video Active (Uploaded)
                    </p>
                    <video
                      src={form.footballVideoUrl}
                      controls
                      className="w-full max-h-48 rounded-xl border border-[var(--border)] bg-black/60 object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Source B: Direct Cloudinary Video URL */}
            {videoSource === 'CLOUDINARY_URL' && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  Direct Cloudinary Video URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={cloudinaryUrlInput}
                    onChange={(e) => setCloudinaryUrlInput(e.target.value)}
                    placeholder="https://res.cloudinary.com/.../video/upload/..."
                    className="input-field text-sm flex-1"
                  />
                  <button
                    onClick={handleSaveCloudinaryUrl}
                    disabled={saving}
                    className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                  >
                    <FiLink size={14} />
                    <span>Save Cloudinary URL</span>
                  </button>
                </div>

                {(form.footballVideoUrl || form.footballYoutubeUrl) && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleDeleteFootballVideo}
                      className="btn-ghost text-red-500 hover:text-red-600 text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <FiTrash2 size={13} /> Remove Video
                    </button>
                  </div>
                )}

                {form.footballVideoType === 'CLOUDINARY_URL' && form.footballVideoUrl && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-emerald-500 mb-1 flex items-center gap-1">
                      <FiPlay size={12} /> Direct Cloudinary Video Active
                    </p>
                    <video
                      src={form.footballVideoUrl}
                      controls
                      className="w-full max-h-48 rounded-xl border border-[var(--border)] bg-black/60 object-cover"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Source C: YouTube URL */}
            {videoSource === 'YOUTUBE' && (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-[var(--text-secondary)]">
                  YouTube Video URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    value={youtubeUrlInput}
                    onChange={(e) => setYoutubeUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                    className="input-field text-sm flex-1"
                  />
                  <button
                    onClick={handleSaveYoutubeUrl}
                    disabled={saving}
                    className="btn-primary text-xs py-2 px-4 whitespace-nowrap"
                  >
                    <FiSave size={14} />
                    <span>Save YouTube URL</span>
                  </button>
                </div>

                {(form.footballVideoUrl || form.footballYoutubeUrl) && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleDeleteFootballVideo}
                      className="btn-ghost text-red-500 hover:text-red-600 text-xs py-1.5 px-3 flex items-center gap-1.5"
                    >
                      <FiTrash2 size={13} /> Remove Video
                    </button>
                  </div>
                )}

                {form.footballVideoType === 'YOUTUBE' && form.footballYoutubeUrl && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-emerald-500 mb-1 flex items-center gap-1">
                      <FiPlay size={12} /> YouTube Video Active
                    </p>
                    <p className="text-xs font-mono text-[var(--text-muted)] truncate">
                      {form.footballYoutubeUrl}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Text Fields Card */}
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
