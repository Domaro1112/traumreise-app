import { TrendingUp } from 'lucide-react';
import AdminSectionPlaceholder from '@/components/admin/AdminSectionPlaceholder';

export const metadata = {
  title: 'Affiliate & Statistiken | Reisemonkey Admin',
};

export default function AdminAffiliatePage() {
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
          Affiliate & Statistiken
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Affiliate-Klicks, Partnerprogramme und Conversion-Daten auswerten.
        </p>
      </div>

      <AdminSectionPlaceholder
        icon={TrendingUp}
        title="Affiliate & Statistiken"
        description="Hier werden später Affiliate-Klicks, Partnerprogramme und Conversion-Daten ausgewertet. Die Tracking-Daten werden über die bestehende API-Route erfasst und in Supabase gespeichert."
        features={[
          'Klick-Tracking',
          'Partnerprogramme',
          'Conversion-Analyse',
          'Umsatz-Übersicht',
          'Provider-Vergleich',
          'Zeitraum-Filter',
          'Top-Reiseziele',
          'Export-Funktion',
        ]}
      />
    </div>
  );
}
