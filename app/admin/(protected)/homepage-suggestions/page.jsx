import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import SuggestionsListClient from '@/components/admin/HomepageSuggestions/SuggestionsListClient';
import { listAllSuggestions } from '@/repositories/homepage-suggestions';

export const metadata = {
  title: 'Startseiten-Vorschläge | ApeAround Admin',
};

export default async function AdminHomepageSuggestionsPage() {
  let suggestions = [];
  try {
    suggestions = await listAllSuggestions();
  } catch {
    // Table not yet migrated — show empty state
  }

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} strokeWidth={2} color="#0EA5E9" />
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
              Startseiten-Vorschläge
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
              Reisekarten auf der Startseite verwalten. Jede Karte verlinkt über Affiliate-Tracking.
            </p>
          </div>
          <Link
            href="/admin/homepage-suggestions/neu"
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
            Neue Karte
          </Link>
        </div>
      </div>

      <SuggestionsListClient initialData={suggestions} />
    </div>
  );
}
