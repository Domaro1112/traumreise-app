import DestinationImportClient from '@/components/admin/destinations/DestinationImportClient';

export const metadata = {
  title: 'Reiseziel importieren | Reisemonkey Admin',
  robots: { index: false, follow: false },
};

export default function AdminImportPage() {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(18px, 2.5vw, 24px)',
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 6px',
          letterSpacing: '-0.02em',
        }}>
          Reiseziel per JSON importieren
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Füge hier ein von Claude erstelltes Reiseziel-JSON ein. Reisemonkey prüft die Daten und speichert sie anschließend im CMS.
        </p>
      </div>

      <DestinationImportClient />
    </div>
  );
}
