import {
  MapPin, FileText, Users, TrendingUp, Zap, Edit3,
} from 'lucide-react';
import Link from 'next/link';
import AdminStatCard from '@/components/admin/AdminStatCard';
import QuickLinksSection from '@/components/admin/QuickLinksSection';
import { listDestinationsAdmin } from '@/repositories/destinations-cms';

export const metadata = {
  title: 'Dashboard | Reisemonkey Admin',
};

const STATUS_BADGE = {
  published: { bg: '#ECFDF5', color: '#059669', label: 'Veröffentlicht' },
  draft:     { bg: '#FEF9EC', color: '#D97706', label: 'Entwurf'        },
  archived:  { bg: '#F1F5F9', color: '#64748B', label: 'Archiviert'     },
};

export default async function AdminDashboard() {
  let destinations = [];
  try {
    destinations = await listDestinationsAdmin();
  } catch { /* Supabase not yet available */ }

  const totalDests     = destinations.length;
  const publishedCount = destinations.filter(d => d.status === 'published').length;
  const draftCount     = destinations.filter(d => d.status === 'draft').length;

  const STAT_CARDS = [
    {
      title:    'Reiseziele',
      value:    String(totalDests || '–'),
      subtitle: `${publishedCount} veröffentlicht · ${draftCount} Entwürfe`,
      icon:     MapPin,
      color:    '#0EA5E9',
      bgColor:  '#EFF6FF',
    },
    {
      title:    'Blogartikel',
      value:    '20',
      subtitle: 'Alle veröffentlicht',
      icon:     FileText,
      color:    '#7C3AED',
      bgColor:  '#F5F3FF',
    },
    {
      title:    'Leads',
      value:    '–',
      subtitle: 'Datenanbindung folgt',
      icon:     Users,
      color:    '#059669',
      bgColor:  '#ECFDF5',
    },
    {
      title:    'Affiliate-Klicks',
      value:    '–',
      subtitle: 'Datenanbindung folgt',
      icon:     TrendingUp,
      color:    '#D97706',
      bgColor:  '#FFFBEB',
    },
    {
      title:    'Funnel-Nutzungen',
      value:    '–',
      subtitle: 'Datenanbindung folgt',
      icon:     Zap,
      color:    '#0891B2',
      bgColor:  '#ECFEFF',
    },
    {
      title:    'Offene Entwürfe',
      value:    String(draftCount || '–'),
      subtitle: 'Im CMS bearbeitbar',
      icon:     Edit3,
      color:    '#E2001A',
      bgColor:  '#FEF2F2',
    },
  ];

  const preview = destinations.slice(0, 8);

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: 'clamp(20px, 2.5vw, 26px)',
          fontWeight: 800,
          color: '#0F172A',
          margin: '0 0 6px',
          letterSpacing: '-0.02em',
        }}>
          Willkommen im Admin-Bereich
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Hier verwaltest du Inhalte, SEO-Daten, Leads und Affiliate-Statistiken von Reisemonkey.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '36px',
      }}>
        {STAT_CARDS.map(card => (
          <AdminStatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Quick actions */}
      <QuickLinksSection />

      {/* Reiseziele status overview */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        padding: '22px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '15px', fontWeight: 700, color: '#0F172A',
            margin: 0, letterSpacing: '-0.01em',
          }}>
            Reiseziele – Übersicht
          </h3>
          <Link href="/admin/reiseziele" style={{ fontSize: '13px', color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>
            Alle verwalten →
          </Link>
        </div>

        {preview.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Reiseziel', 'Land', 'Status'].map(col => (
                    <th key={col} style={{
                      padding: '8px 12px 10px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#94A3B8',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((dest, i) => {
                  const badge = STATUS_BADGE[dest.status] ?? STATUS_BADGE.draft;
                  return (
                    <tr key={dest.id} style={{ borderBottom: i < preview.length - 1 ? '1px solid #F8FAFF' : 'none' }}>
                      <td style={{ padding: '9px 12px', fontWeight: 600, color: '#0F172A' }}>
                        <Link href={`/admin/reiseziele/${dest.id}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                          {dest.name}
                        </Link>
                      </td>
                      <td style={{ padding: '9px 12px', color: '#64748B' }}>{dest.country || '–'}</td>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '3px 9px', borderRadius: '6px',
                          fontSize: '11px', fontWeight: 700,
                          background: badge.bg, color: badge.color,
                        }}>
                          {badge.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {destinations.length > 8 && (
              <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: '12px 0 0', padding: '10px 0', borderTop: '1px solid #F1F5F9' }}>
                +{destinations.length - 8} weitere Reiseziele →{' '}
                <Link href="/admin/reiseziele" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>
                  Alle anzeigen
                </Link>
              </p>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '14px', color: '#94A3B8', textAlign: 'center', padding: '24px 0', margin: 0 }}>
            Noch keine Reiseziele angelegt.{' '}
            <Link href="/admin/reiseziele/import" style={{ color: '#0EA5E9', fontWeight: 600, textDecoration: 'none' }}>
              Jetzt importieren →
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
