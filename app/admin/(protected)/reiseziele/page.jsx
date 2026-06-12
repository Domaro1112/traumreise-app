import { MapPin } from 'lucide-react';
import AdminSectionPlaceholder from '@/components/admin/AdminSectionPlaceholder';

export const metadata = {
  title: 'Reiseziele verwalten | Reisemonkey Admin',
};

export default function AdminReisezielePage() {
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
          Reiseziele verwalten
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          SEO-, AEO- und LLMO-optimierte Reisezielseiten pflegen und veröffentlichen.
        </p>
      </div>

      <AdminSectionPlaceholder
        icon={MapPin}
        title="Reiseziele verwalten"
        description="Hier werden später SEO-, AEO- und LLMO-optimierte Reisezielseiten gepflegt. Du kannst neue Reiseziele erstellen, Entwürfe bearbeiten und veröffentlichte Seiten verwalten."
        features={[
          'Neues Reiseziel erstellen',
          'Entwürfe bearbeiten',
          'Veröffentlichte Reiseziele',
          'Platzhalter-Tabelle',
          'SEO-Felder & Metadaten',
          'LLMO / AEO Felder',
          'Hero-Bild hochladen',
          'FAQ-Editor',
        ]}
      />
    </div>
  );
}
