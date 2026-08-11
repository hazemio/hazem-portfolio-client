import { useApi } from '../../hooks';
import { projectsApi } from '../../api';
import { Project } from '../../types';
import CrudTable from '../../components/admin/CrudTable';
import { FiStar, FiExternalLink, FiGithub, FiYoutube } from 'react-icons/fi';

// Normalize helper
const normalizeTech = (t: any): string[] => {
  if (!t) return [];
  if (Array.isArray(t)) return t;

  return t
    .split(',')
    .map((x: string) => x.trim())
    .filter(Boolean);
};

const FIELDS = [
  { name: 'title', label: 'Title', required: true, placeholder: 'My Awesome Project' },
  { name: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'Describe your project...' },
  { name: 'demoUrl', label: 'Live URL', type: 'url' as const, placeholder: 'https://myproject.com' },
  { name: 'youtubeUrl', label: 'YouTube URL (Optional)', type: 'url' as const, placeholder: 'https://www.youtube.com/watch?v=...' },
  { name: 'githubUrl', label: 'GitHub URL', type: 'url' as const, placeholder: 'https://github.com/...' },
  { name: 'technologies', label: 'Tags (comma-separated)', type: 'text' as const, placeholder: 'React, Node.js, Tailwind' },
  { name: 'featured', label: 'Featured', type: 'checkbox' as const, placeholder: 'Mark as featured' },
  { name: 'order', label: 'Order', type: 'number' as const, placeholder: '0' },
];

export default function AdminProjects() {
  const { data, loading, refetch } = useApi<Project[]>(() => projectsApi.getAll());
  const items = data || [];

  // CREATE
  const handleAdd = async (d: any) => {
    const payload = {
      ...d,
      youtubeUrl: d.youtubeUrl?.trim() || undefined,
      technologies: normalizeTech(d.technologies),
    };

    await projectsApi.create(payload);
  };

  // UPDATE
  const handleUpdate = async (id: string, d: any) => {
    const payload = {
      ...d,
      youtubeUrl: d.youtubeUrl ? d.youtubeUrl.trim() : '',
      technologies: normalizeTech(d.technologies),
    };

    await projectsApi.update(id, payload);
  };

  return (
    <CrudTable
      title="Projects"
      items={items}
      loading={loading}
      fields={FIELDS}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={(id) => projectsApi.delete(id).then(() => {})}
      onUploadImg={(id, file) => projectsApi.uploadImage(id, file).then(() => {})}
      refetch={refetch}
      renderRow={(p: Project) => (
        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--bg-overlay)] shrink-0">
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-500 font-bold">
                {p.title[0]}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--text-primary)] truncate">
                {p.title}
              </span>
              {p.featured && <FiStar size={12} className="text-accent-amber shrink-0" />}
            </div>

            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
              {p.demoUrl && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-500 flex items-center gap-1 hover:underline"
                >
                  <FiExternalLink size={10} />
                  Live
                </a>
              )}

              {p.youtubeUrl && (
                <a
                  href={p.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-500 flex items-center gap-1 hover:underline"
                >
                  <FiYoutube size={10} />
                  Video
                </a>
              )}

              {p.githubUrl && (
                <a
                  href={p.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--text-muted)] flex items-center gap-1 hover:underline"
                >
                  <FiGithub size={10} />
                  GitHub
                </a>
              )}

              {/* Technologies */}
              {p.technologies?.slice(0, 3).map((t: string) => (
                <span key={t} className="tag text-xs">
                  {t}
                </span>
              ))}

              {p.technologies?.length > 3 && (
                <span className="text-xs text-[var(--text-muted)]">
                  +{p.technologies.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}