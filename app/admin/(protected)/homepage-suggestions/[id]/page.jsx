import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Sparkles } from 'lucide-react';
import SuggestionFormClient from '@/components/admin/HomepageSuggestions/SuggestionFormClient';
import { getSuggestion } from '@/repositories/homepage-suggestions';

export const metadata = {
  title: 'Karte bearbeiten | ApeAround Admin',
};

export default async function AdminEditSuggestionPage({ params }) {
  const { id } = await params;

  let suggestion;
  try {
    suggestion = await getSuggestion(id);
  } catch {
    notFound();
  }

  if (!suggestion) notFound();

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <Link
          href="/admin/homepage-suggestions"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B', textDecoration: 'none', marginBottom: '12px' }}
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Zurück zur Übersicht
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={16} strokeWidth={2} color="#0EA5E9" />
          <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0EA5E9' }}>
            Bearbeiten
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
          {suggestion.title}
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Reisekarte bearbeiten. Änderungen werden sofort auf der Startseite sichtbar.
        </p>
      </div>

      <SuggestionFormClient initial={suggestion} />
    </div>
  );
}
