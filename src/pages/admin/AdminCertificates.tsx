import { useApi } from '../../hooks';
import { certificatesApi } from '../../api';
import { Certificate } from '../../types';
import CrudTable from '../../components/admin/CrudTable';
import { FiAward } from 'react-icons/fi';
import { label } from 'framer-motion/client';

const FIELDS = [
  { name: 'title',         label: 'Title',          required: true,  placeholder: 'AWS Certified Developer' },
  { name: 'issuer',        label: 'Issuer',         required: true,  placeholder: 'Amazon Web Services' },
  { name: 'date',          label: 'Date',           required: true,  placeholder: '2024-01' },
  { name: 'credentialUrl', label: 'Credential URL', type: 'url' as const, placeholder: 'https://...' },
  { name: 'order',         label: 'Order',          type: 'number' as const, placeholder: '0' },
];

export default function AdminCertificates() {
  const { data, loading, refetch } = useApi<Certificate[]>(() => certificatesApi.getAll());

  return (
    <CrudTable
      title="Certificates"
      items={data || []}
      loading={loading}
      fields={FIELDS}
      onAdd={(d) => certificatesApi.create(d).then(() => {})}
      onUpdate={(id, d) => certificatesApi.update(id, d).then(() => {})}
      onDelete={(id) => certificatesApi.delete(id).then(() => {})}
      onUploadImg={(id, file) => certificatesApi.uploadImage(id, file).then(() => {})}
      refetch={refetch}
      renderRow={(c: Certificate) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-brand-500/10 flex items-center justify-center shrink-0">
            {c.imageUrl
              ? <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover" />
              : <FiAward size={20} className="text-brand-500" />}
          </div>
          <div>
            <div className="font-medium text-[var(--text-primary)] text-sm">{c.title}</div>
            <div className="text-xs text-[var(--text-muted)]">{c.issuer} · {c.date}</div>
          </div>
        </div>
      )}
    />
  );
}
