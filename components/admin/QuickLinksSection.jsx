'use client';

import Link from 'next/link';
import { MapPin, FileText, CheckCircle, Clock, ArrowRight } from 'lucide-react';

const QUICK_LINKS = [
  { label: 'Reiseziel bearbeiten',  href: '/admin/reiseziele',    icon: MapPin,      color: '#0EA5E9' },
  { label: 'Blogartikel verwalten', href: '/admin/blog',          icon: FileText,    color: '#7C3AED' },
  { label: 'SEO prüfen',           href: '/admin/seo-llmo',      icon: CheckCircle, color: '#059669' },
  { label: 'Einstellungen',        href: '/admin/einstellungen',  icon: Clock,       color: '#D97706' },
];

export default function QuickLinksSection() {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '1.5px solid #E2E8F0',
      padding: '22px 24px',
      marginBottom: '28px',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '15px',
        fontWeight: 700,
        color: '#0F172A',
        margin: '0 0 16px',
        letterSpacing: '-0.01em',
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
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#BAE6FD';
                e.currentTarget.style.background   = '#EFF6FF';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.background   = '#F8FAFF';
              }}
            >
              <Icon size={14} strokeWidth={2} color={link.color} />
              {link.label}
              <ArrowRight size={12} strokeWidth={2.5} color="#94A3B8" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
