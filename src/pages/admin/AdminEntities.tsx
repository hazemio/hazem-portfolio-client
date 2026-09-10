import toast from 'react-hot-toast';
import { useApi } from '../../hooks';
import { socialLinksApi, skillsApi, servicesApi, experienceApi, educationApi } from '../../api';
import { SocialLink, Skill, Service, Experience, Education } from '../../types';
import CrudTable from '../../components/admin/CrudTable';
import { DynamicIcon } from '../../utils/icons';
import { FiBriefcase, FiBookOpen } from 'react-icons/fi';

// ── Social Links ────────────────────────────────────────────
const SOCIAL_FIELDS = [
  { name: 'platform', label: 'Platform', required: true,  placeholder: 'GitHub' },
  { name: 'url',      label: 'URL',      required: true,  type: 'url' as const, placeholder: 'https://github.com/...' },
  { name: 'icon', label: 'Icon Name (React Icons)', required: true, placeholder: 'FaGithub' },
  { name: 'order',    label: 'Order', type: 'number' as const, placeholder: '0' },
];

export function AdminSocialLinks() {
  const { data, loading, refetch } = useApi<SocialLink[]>(() => socialLinksApi.getAll());
  return (
    <CrudTable
      title="Social Links"
      items={data || []}
      loading={loading}
      fields={SOCIAL_FIELDS}
      onAdd={(d) => socialLinksApi.create(d).then(() => {})}
      onUpdate={(id, d) => socialLinksApi.update(id, d).then(() => {})}
      onDelete={(id) => socialLinksApi.delete(id).then(() => {})}
      refetch={refetch}
      renderRow={(s: SocialLink) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-500">
            <DynamicIcon name={s.icon} size={16} />
          </div>
          <div>
            <div className="font-medium text-[var(--text-primary)] text-sm">{s.platform}</div>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-muted)] hover:text-brand-500 truncate max-w-xs block">{s.url}</a>
          </div>
        </div>
      )}
    />
  );
}

// ── Skills ──────────────────────────────────────────────────
const SKILL_FIELDS = [
  { name: 'name',     label: 'Skill Name',   required: true,  placeholder: 'React' },
  { name: 'category', label: 'Category',     required: true,  type: 'select' as const, options: ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'Cybersecurity'] },
  { name: 'icon',     label: 'Icon Name (e.g. SiReact, FiShield, FaDocker)', placeholder: 'SiReact' },
  { name: 'order',    label: 'Display Order', type: 'number' as const, placeholder: '0' },
  { name: 'isActive', label: 'Status',        type: 'checkbox' as const, placeholder: 'Active on portfolio' },
];

export function AdminSkills() {
  const { data, loading, refetch } = useApi<Skill[]>(() => skillsApi.getAll(true));

  const toggleActive = async (s: Skill, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const nextActive = s.isActive === false ? true : false;
      await skillsApi.update(s.id, { isActive: nextActive });
      toast.success(`Skill "${s.name}" is now ${nextActive ? 'Active' : 'Disabled'}`);
      refetch();
    } catch {
      toast.error('Failed to update skill status');
    }
  };

  return (
    <CrudTable
      title="Skills"
      items={data || []}
      loading={loading}
      fields={SKILL_FIELDS}
      onAdd={(d) => skillsApi.create({ ...d, isActive: d.isActive ?? true }).then(() => {})}
      onUpdate={(id, d) => skillsApi.update(id, d).then(() => {})}
      onDelete={(id) => skillsApi.delete(id).then(() => {})}
      refetch={refetch}
      renderRow={(s: Skill) => {
        const active = s.isActive !== false;
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--bg-overlay)] flex items-center justify-center text-brand-400 border border-[var(--border)] shrink-0">
              {s.icon ? <DynamicIcon name={s.icon} size={16} /> : <span className="text-xs font-bold">{s.name[0]}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-[var(--text-primary)] text-sm">{s.name}</span>
                <span className="tag text-xs">{s.category}</span>
                <span className="text-xs font-mono text-[var(--text-muted)]">Order: {s.order ?? 0}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => toggleActive(s, e)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                active
                  ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 hover:bg-accent-emerald/25'
                  : 'bg-white/5 text-[var(--text-muted)] border border-[var(--border)] hover:bg-white/10'
              }`}
              title="Click to toggle status"
            >
              {active ? 'Active' : 'Disabled'}
            </button>
          </div>
        );
      }}
    />
  );
}

// ── Services ────────────────────────────────────────────────
const SERVICE_FIELDS = [
  { name: 'title',        label: 'Service Title',          required: true, placeholder: 'Full-Stack Web Development' },
  { name: 'description',  label: 'Service Description',    required: true, type: 'textarea' as const, placeholder: 'End-to-end web applications...' },
  { name: 'badge',        label: 'Badge Tag (optional)',   placeholder: 'Core Focus / High Performance' },
  { name: 'icon',         label: 'Icon Name (e.g. FiLayers, FiServer, FiShield)', placeholder: 'FiLayers' },
  { name: 'featuresText', label: 'Key Features (comma-separated)', type: 'textarea' as const, placeholder: 'Modern React & Next.js, Responsive Tailwind UI, Clean Architecture' },
  { name: 'order',        label: 'Display Order',          type: 'number' as const, placeholder: '0' },
  { name: 'status',       label: 'Status',                 required: true, type: 'select' as const, options: ['ACTIVE', 'INACTIVE'] },
];

export function AdminServices() {
  const { data, loading, refetch } = useApi<Service[]>(() => servicesApi.getAll(true));

  const formatPayload = (d: any) => {
    let features: string[] = [];
    if (d.featuresText && typeof d.featuresText === 'string') {
      features = d.featuresText.split(',').map((f: string) => f.trim()).filter(Boolean);
    } else if (Array.isArray(d.features)) {
      features = d.features;
    }
    return {
      title: d.title,
      description: d.description,
      badge: d.badge || null,
      icon: d.icon || null,
      features,
      order: d.order !== undefined ? Number(d.order) : 0,
      status: d.status || 'ACTIVE',
    };
  };

  const toggleStatus = async (s: Service, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const nextStatus = s.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await servicesApi.update(s.id, { status: nextStatus });
      toast.success(`Service "${s.title}" is now ${nextStatus}`);
      refetch();
    } catch {
      toast.error('Failed to update service status');
    }
  };

  return (
    <CrudTable
      title="Services"
      items={(data || []).map((s) => ({
        ...s,
        featuresText: Array.isArray(s.features) ? s.features.join(', ') : '',
      }))}
      loading={loading}
      fields={SERVICE_FIELDS}
      onAdd={(d) => servicesApi.create(formatPayload(d)).then(() => {})}
      onUpdate={(id, d) => servicesApi.update(id, formatPayload(d)).then(() => {})}
      onDelete={(id) => servicesApi.delete(id).then(() => {})}
      refetch={refetch}
      renderRow={(s: Service) => {
        const isActive = s.status === 'ACTIVE';
        return (
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 border border-brand-500/20 shrink-0">
              {s.icon ? <DynamicIcon name={s.icon} size={18} /> : <span className="text-xs font-bold">{s.title[0]}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-[var(--text-primary)] text-sm">{s.title}</span>
                {s.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {s.badge}
                  </span>
                )}
                <span className="text-xs font-mono text-[var(--text-muted)]">Order: {s.order ?? 0}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">{s.description}</p>
              {Array.isArray(s.features) && s.features.length > 0 && (
                <div className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1.5 flex-wrap">
                  {s.features.slice(0, 3).map((f) => (
                    <span key={f} className="tag text-[10px] py-0 px-1.5">
                      {f}
                    </span>
                  ))}
                  {s.features.length > 3 && (
                    <span className="text-[10px] text-[var(--text-muted)]">+{s.features.length - 3}</span>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={(e) => toggleStatus(s, e)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/30 hover:bg-accent-emerald/25'
                  : 'bg-white/5 text-[var(--text-muted)] border border-[var(--border)] hover:bg-white/10'
              }`}
              title="Click to toggle status"
            >
              {isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        );
      }}
    />
  );
}

// ── Experience ──────────────────────────────────────────────
const EXP_FIELDS = [
  { name: 'title',       label: 'Job Title',   required: true,  placeholder: 'Senior Developer' },
  { name: 'company',     label: 'Company',     required: true,  placeholder: 'Tech Corp' },
  { name: 'location',    label: 'Location',    placeholder: 'Cairo, Egypt' },
  { name: 'startDate',   label: 'Start Date',  required: true,  placeholder: '2022-01' },
  { name: 'endDate',     label: 'End Date',    placeholder: '2024-01' },
  { name: 'current',     label: 'Current Job', type: 'checkbox' as const, placeholder: 'I currently work here' },
  { name: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Key achievements or responsibilities...' },
  { name: 'order',       label: 'Order',       type: 'number' as const, placeholder: '0' },
];

export function AdminExperience() {
  const { data, loading, refetch } = useApi<Experience[]>(() => experienceApi.getAll());
  return (
    <CrudTable
      title="Experience"
      items={data || []}
      loading={loading}
      fields={EXP_FIELDS}
      onAdd={(d) => experienceApi.create(d).then(() => {})}
      onUpdate={(id, d) => experienceApi.update(id, d).then(() => {})}
      onDelete={(id) => experienceApi.delete(id).then(() => {})}
      onUploadImg={(id, file) => experienceApi.uploadImage(id, file).then(() => {})}
      refetch={refetch}
      renderRow={(e: Experience) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-accent-emerald/10 flex items-center justify-center text-accent-emerald shrink-0 border border-[var(--border)]">
            {e.imageUrl ? (
              <img src={e.imageUrl} alt={e.company} className="w-full h-full object-cover" />
            ) : (
              <FiBriefcase size={16} />
            )}
          </div>
          <div>
            <div className="font-medium text-[var(--text-primary)] text-sm">{e.title}</div>
            <div className="text-xs text-[var(--text-muted)]">
              {e.company} · {e.startDate} — {e.current ? 'Present' : e.endDate}
              {e.current && <span className="ml-1.5 text-accent-emerald font-medium">Current</span>}
            </div>
          </div>
        </div>
      )}
    />
  );
}

// ── Education ───────────────────────────────────────────────
const EDU_FIELDS = [
  { name: 'title',       label: 'Degree / Program Title', required: true,  placeholder: 'B.Sc. Computer Science' },
  { name: 'institution', label: 'Institution / University', required: true, placeholder: 'Cairo University' },
  { name: 'location',    label: 'Location',                placeholder: 'Cairo, Egypt' },
  { name: 'startDate',   label: 'Start Date',             required: true,  placeholder: '2019' },
  { name: 'endDate',     label: 'End Date',               placeholder: '2023' },
  { name: 'current',     label: 'Currently Studying',      type: 'checkbox' as const, placeholder: 'Currently enrolled' },
  { name: 'description', label: 'Description / Notes',     type: 'textarea' as const, placeholder: 'Major, achievements, or honors...' },
  { name: 'order',       label: 'Order',                  type: 'number' as const, placeholder: '0' },
];

export function AdminEducation() {
  const { data, loading, refetch } = useApi<Education[]>(() => educationApi.getAll());
  return (
    <CrudTable
      title="Education"
      items={data || []}
      loading={loading}
      fields={EDU_FIELDS}
      onAdd={(d) => educationApi.create(d).then(() => {})}
      onUpdate={(id, d) => educationApi.update(id, d).then(() => {})}
      onDelete={(id) => educationApi.delete(id).then(() => {})}
      onUploadImg={(id, file) => educationApi.uploadImage(id, file).then(() => {})}
      refetch={refetch}
      renderRow={(e: Education) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-accent-cyan/10 flex items-center justify-center text-accent-cyan shrink-0 border border-[var(--border)]">
            {e.imageUrl ? (
              <img src={e.imageUrl} alt={e.institution} className="w-full h-full object-cover" />
            ) : (
              <FiBookOpen size={16} />
            )}
          </div>
          <div>
            <div className="font-medium text-[var(--text-primary)] text-sm">{e.title}</div>
            <div className="text-xs text-[var(--text-muted)]">
              {e.institution} · {e.startDate} — {e.current ? 'Present' : e.endDate}
              {e.current && <span className="ml-1.5 text-accent-cyan font-medium">Studying</span>}
            </div>
          </div>
        </div>
      )}
    />
  );
}
