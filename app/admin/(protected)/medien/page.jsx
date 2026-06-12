import { Image } from 'lucide-react';
import AdminSectionPlaceholder from '@/components/admin/AdminSectionPlaceholder';

export const metadata = {
  title: 'Medienverwaltung | Reisemonkey Admin',
};

export default function AdminMedienPage() {
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
          Medienverwaltung
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Bilder, Hero-Fotos und Mediendateien hochladen und verwalten.
        </p>
      </div>

      <AdminSectionPlaceholder
        icon={Image}
        title="Medienverwaltung"
        description="Hier werden später alle Mediendateien verwaltet. Du kannst Bilder für Reiseziele, Blogartikel und Hero-Bereiche hochladen, organisieren und optimieren."
        features={[
          'Bilder hochladen',
          'Medienbibliothek',
          'Hero-Bilder verwalten',
          'Bildoptimierung',
          'Alt-Texte pflegen',
          'Ordner & Tags',
          'Supabase Storage',
          'CDN-Integration',
        ]}
      />
    </div>
  );
}
