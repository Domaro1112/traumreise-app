import {
  MapPin, FileText, Users, TrendingUp, Zap, Edit3,
  ArrowRight, CheckCircle, Clock,
} from 'lucide-react';
import Link from 'next/link';
import AdminStatCard from '@/components/admin/AdminStatCard';
import { SEO_DESTINATIONS } from '@/data/destinations-seo';

export const metadata = {
  title: 'Dashboard | Reisemonkey Admin',
};

const fullCount   = SEO_DESTINATIONS.filter(d => !d.isPlaceholder).length;
const totalDests  = SEO_DESTINATIONS.length;
const draftCount  = totalDests - fullCount;

const STAT_CARDS = [
  {
    title:    'Reiseziele',
    value:    String(totalDests),
    subtitle: `${fullCount} vollständig · ${draftCount} Entwürfe`,
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
    value:    String(draftCount),
    subtitle: 'Reiseziele mit Platzhalter-Content',
    icon:     Edit3,
    color:    '#E2001A',
    bgColor:  '#FEF2F2',
  },
];

const QUICK_LINKS = [
  { label: 'Reiseziel bearbeiten', href: '/admin/reiseziele', icon: MapPin,     color: '#0EA5E9' },
  { label: 'Blogartikel verwalten', href: '/admin/blog',      icon: FileText,   color: '#7C3AED' },
  { label: 'SEO prüfen',           href: '/admin/seo-llmo',   icon: CheckCircle,color: '#059669' },
  { label: 'Einstellungen',        href: '/admin/einstellungen', icon: Clock,   color: '#D97706' },
];

export default function AdminDashboard() {
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
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E2E8F0',
        padding: '22px 24px',
        marginBottom: '28px',
      }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '15px', fontWeight: 700, color: '#0F172A',
          margin: '0 0 16px', letterSpacing: '-0.01em',
        }}>
          Schnellzugriff
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {QUICK_LINKS.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  background: '#F8FAFF',
                  color: '#334155',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#BAE6FD'; e.currentTarget.style.background = '#EFF6FF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFF'; }}
              >
                <Icon size={14} strokeWidth={2} color={link.color} />
                {link.label}
                <ArrowRight size={12} strokeWidth={2.5} color="#94A3B8" />
              </Link>
            );
          })}
        </div>
      </div>

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

        {/* Simple table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                {['Reiseziel', 'Land', 'Typ', 'Status'].map(col => (
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
              {SEO_DESTINATIONS.slice(0, 8).map((dest, i) => (
                <tr
                  key={dest.slug}
                  style={{ borderBottom: i < 7 ? '1px solid #F8FAFF' : 'none' }}
                >
                  <td style={{ padding: '9px 12px', fontWeight: 600, color: '#0F172A' }}>
                    {dest.name}
                  </td>
                  <td style={{ padding: '9px 12px', color: '#64748B' }}>
                    {dest.country}
                  </td>
                  <td style={{ padding: '9px 12px', color: '#64748B' }}>
                    {dest.travelType.slice(0, 2).join(', ')}
                  </td>
                  <td style={{ padding: '9px 12px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '4px',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      fontSize: '11px', fontWeight: 700,
                      background: dest.isPlaceholder ? '#FEF2F2' : '#ECFDF5',
                      color:      dest.isPlaceholder ? '#DC2626'  : '#059669',
                    }}>
                      {dest.isPlaceholder ? 'Entwurf' : 'Vollständig'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {SEO_DESTINATIONS.length > 8 && (
            <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', margin: '12px 0 0', padding: '10px 0', borderTop: '1px solid #F1F5F9' }}>
              +{SEO_DESTINATIONS.length - 8} weitere Reiseziele →{' '}
              <Link href="/admin/reiseziele" style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>
                Alle anzeigen
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
