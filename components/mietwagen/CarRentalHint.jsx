import { Car } from 'lucide-react';
import { isCarRentalEligible } from '@/lib/car-rental-config';

export default function CarRentalHint({ destinations }) {
  const eligible = destinations?.find(d => isCarRentalEligible(d.name));
  if (!eligible) return null;

  return (
    <div style={{
      marginTop: '40px',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)',
      borderRadius: '18px',
      border: '1.5px solid #BAE6FD',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '18px',
      flexWrap: 'wrap',
    }}>
      <div style={{
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 4px 12px rgba(14,165,233,0.28)',
      }}>
        <Car size={20} strokeWidth={2} color="#FFFFFF" />
      </div>

      <div style={{ flex: 1, minWidth: '200px' }}>
        <p style={{ margin: '0 0 3px', fontSize: '14px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>
          Mietwagen für {eligible.name}?
        </p>
        <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.55 }}>
          {eligible.name} lässt sich am besten mit einem eigenen Fahrzeug erkunden. Vergleiche jetzt die besten Angebote.
        </p>
      </div>

      <a
        href="/mietwagen"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '10px 18px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          color: '#FFFFFF',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 12px rgba(14,165,233,0.28)',
        }}
      >
        Mietwagen vergleichen →
      </a>
    </div>
  );
}
