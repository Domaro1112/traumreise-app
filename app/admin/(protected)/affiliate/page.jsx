import { DollarSign } from 'lucide-react';
import AffiliateAdminClient from '@/components/admin/affiliate/AffiliateAdminClient';

export const metadata = {
  title: 'Monetarisierung | ApeAround Admin',
};

export default function AdminAffiliatePage() {
  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <DollarSign size={17} strokeWidth={2.5} color="#FFFFFF" />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            fontWeight: 800,
            color: '#0F172A',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Monetarisierung
          </h2>
        </div>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Affiliate-IDs zentral verwalten · Klick-Statistiken auswerten · Links automatisch generieren
        </p>
      </div>

      <AffiliateAdminClient />
    </div>
  );
}
