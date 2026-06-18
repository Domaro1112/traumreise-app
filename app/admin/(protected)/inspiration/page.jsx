import Link from 'next/link';
import { Compass } from 'lucide-react';
import InspirationListClient from '@/components/admin/Inspiration/InspirationListClient';
import { listAllInspirationItems } from '@/repositories/inspiration-items';

export const metadata = {
  title: 'Inspirationen | ApeAround Admin',
};

export const dynamic = 'force-dynamic';

export default async function AdminInspirationPage() {
  let items = [];
  try {
    items = await listAllInspirationItems();
  } catch {
    // Table not yet migrated — show empty state
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Compass size={16} strokeWidth={2} color="#0EA5E9" />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0EA5E9' }}>
            CMS
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
            }}>
              Reiseinspirationen
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
              Inspirationskarten für /inspiration verwalten. Jede Karte verlinkt über Affiliate-Tracking.
            </p>
          </div>
          <Link
            href="/admin/inspiration/neu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 8px rgba(14,165,233,0.30)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Neue Inspiration
          </Link>
        </div>
      </div>

      <InspirationListClient initialData={items} />
    </div>
  );
}
