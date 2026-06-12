import Link from 'next/link';
import { MapPin } from 'lucide-react';
import DestinationsListClient from '@/components/admin/destinations/DestinationsListClient';
import { listDestinationsAdmin } from '@/repositories/destinations-cms';

export const metadata = {
  title: 'Reiseziele verwalten | Reisemonkey Admin',
};

export default async function AdminReisezielePage() {
  let destinations = [];
  try {
    destinations = await listDestinationsAdmin();
  } catch {
    // Supabase not yet set up or table doesn't exist yet – show empty state
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <MapPin size={16} strokeWidth={2} color="#0EA5E9" />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0EA5E9' }}>
            CMS
          </span>
        </div>
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
          SEO-, AEO- und LLMO-optimierte Reisezielseiten erstellen und pflegen.
          Alle öffentlichen Reisezielseiten werden ausschließlich aus dem CMS geladen.
        </p>
      </div>

      <DestinationsListClient initialData={destinations} />
    </div>
  );
}
