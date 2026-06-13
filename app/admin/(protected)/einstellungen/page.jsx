import { Settings } from 'lucide-react';
import AdminSectionPlaceholder from '@/components/admin/AdminSectionPlaceholder';

export const metadata = {
  title: 'Einstellungen |ApeAround Admin',
};

export default function AdminEinstellungenPage() {
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
          Einstellungen
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Admin-Zugang, Site-Einstellungen und Konfigurationen verwalten.
        </p>
      </div>

      <AdminSectionPlaceholder
        icon={Settings}
        title="Einstellungen"
        description="Hier werden später Admin-Zugänge, Site-Konfigurationen und globale Einstellungen verwaltet. Die Authentifizierung wird im nächsten Schritt auf Supabase Auth umgestellt."
        features={[
          'Admin-Zugang verwalten',
          'Supabase Auth (geplant)',
          'Site-Konfiguration',
          'API-Keys verwalten',
          'Benachrichtigungen',
          'Maintenance-Modus',
          'Backup & Export',
          'Audit-Log',
        ]}
      />
    </div>
  );
}
