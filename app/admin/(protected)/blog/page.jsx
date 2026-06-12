import { FileText } from 'lucide-react';
import AdminSectionPlaceholder from '@/components/admin/AdminSectionPlaceholder';

export const metadata = {
  title: 'Blog verwalten | Reisemonkey Admin',
};

export default function AdminBlogPage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 6px',
          letterSpacing: '-0.02em',
        }}>
          Reiseblog verwalten
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Blogartikel, Ratgeber und Reiseinspirationen erstellen und pflegen.
        </p>
      </div>

      <AdminSectionPlaceholder
        icon={FileText}
        title="Reiseblog verwalten"
        description="Hier werden später Blogartikel, Ratgeber und Reiseinspirationen gepflegt. Du kannst neue Artikel erstellen, bestehende bearbeiten und Veröffentlichungsdaten planen."
        features={[
          'Neuen Artikel erstellen',
          'Entwürfe verwalten',
          'Veröffentlichte Artikel',
          'Kategorien & Tags',
          'SEO-Metadaten',
          'Beitragsbilder',
          'Vorschau & Publish',
          'Artikel archivieren',
        ]}
      />
    </div>
  );
}
