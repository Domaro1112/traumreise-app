import MediaLibraryClient from '@/components/admin/media/MediaLibraryClient';

export const metadata = {
  title: 'Medienverwaltung |ApeAround Admin',
  robots: { index: false, follow: false },
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
          Bilder für Reiseziele anzeigen und verwalten. Hochladen per Reiseziel-Editor (Tab Medien).
        </p>
      </div>

      <MediaLibraryClient />
    </div>
  );
}
