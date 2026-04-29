import { useApi } from '../../hooks';
import { socialLinksApi, skillsApi, experienceApi } from '../../api';
import { SocialLink, Skill, Experience } from '../../types';
import CrudTable from '../../components/admin/CrudTable';
import { DynamicIcon } from '../../utils/icons';
import { FiBriefcase } from 'react-icons/fi';

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
  { name: 'category', label: 'Category',     required: true,  type: 'select' as const, options: ['Frontend', 'Backend', 'DevOps', 'Database', 'Design', 'Other'] },
  { name: 'level',    label: 'Level (0-100)', required: true, type: 'number' as const, placeholder: '85' },
  { name: 'icon', label: 'Icon Name',    placeholder: 'FaReact' },
  { name: 'order',    label: 'Order',        type: 'number' as const, placeholder: '0' },
];

export function AdminSkills() {
  const { data, loading, refetch } = useApi<Skill[]>(() => skillsApi.getAll());
  return (
    <CrudTable
      title="Skills"
      items={data || []}
      loading={loading}
      fields={SKILL_FIELDS}
      onAdd={(d) => skillsApi.create(d).then(() => {})}
      onUpdate={(id, d) => skillsApi.update(id, d).then(() => {})}
      onDelete={(id) => skillsApi.delete(id).then(() => {})}
      refetch={refetch}
      renderRow={(s: Skill) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--bg-overlay)] flex items-center justify-center text-brand-500">
            {s.icon ? <DynamicIcon name={s.icon} size={16} /> : <span className="text-xs font-bold">{s.name[0]}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[var(--text-primary)] text-sm">{s.name}</span>
              <span className="tag text-xs">{s.category}</span>
            </div>
            <div className="w-32 h-1 bg-[var(--bg-overlay)] rounded-full mt-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-violet" style={{ width: `${s.level}%` }} />
            </div>
          </div>
          <span className="text-xs font-mono text-brand-500">{s.level}%</span>
        </div>
      )}
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
  { name: 'description', label: 'Description', type: 'textarea' as const, required: true, placeholder: 'What did you do here?' },
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
      refetch={refetch}
      renderRow={(e: Experience) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent-emerald/10 flex items-center justify-center text-accent-emerald">
            <FiBriefcase size={15} />
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
