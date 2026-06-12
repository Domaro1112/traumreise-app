import { Users } from 'lucide-react';
import AdminSectionPlaceholder from '@/components/admin/AdminSectionPlaceholder';

export const metadata = {
  title: 'Leads & Anfragen | Reisemonkey Admin',
};

export default function AdminLeadsPage() {
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
          Leads & Anfragen
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Funnel-Eingaben, Nutzeranfragen und Newsletter-Anmeldungen einsehen.
        </p>
      </div>

      <AdminSectionPlaceholder
        icon={Users}
        title="Leads & Anfragen"
        description="Hier werden später Funnel-Eingaben, Nutzeranfragen und Newsletter-Anmeldungen verwaltet. Die Anbindung erfolgt über Supabase — Daten werden ausschließlich serverseitig abgerufen."
        features={[
          'Funnel-Eingaben',
          'Newsletter-Anmeldungen',
          'Reisewunsch-Anfragen',
          'Lead-Segmentierung',
          'Export als CSV',
          'Supabase-Anbindung',
          'Datenschutz-konform',
          'DSGVO-Export',
        ]}
      />
    </div>
  );
}
