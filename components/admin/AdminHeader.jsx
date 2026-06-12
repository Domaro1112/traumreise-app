'use client';

import { usePathname } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';

const PAGE_TITLES = {
  '/admin':              'Dashboard',
  '/admin/reiseziele':   'Reiseziele verwalten',
  '/admin/blog':         'Reiseblog verwalten',
  '/admin/medien':       'Medien verwalten',
  '/admin/leads':        'Leads & Reisewecker',
  '/admin/affiliate':    'Affiliate & Anbieter',
  '/admin/seo-llmo':     'SEO, AEO & LLMO',
  '/admin/einstellungen':'Einstellungen',
};

export default function AdminHeader({ onMenuToggle }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? 'Admin';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      height: '60px',
      background: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      gap: '16px',
      boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Hamburger – shown on mobile only via CSS */}
        <button
          onClick={onMenuToggle}
          aria-label="Menü öffnen"
          className="admin-header-menu-btn"
          style={{
            display: 'none',
            background: 'none',
            border: '1.5px solid #E2E8F0',
            borderRadius: '8px',
            cursor: 'pointer',
            padding: '6px 8px',
            color: '#64748B',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu size={18} strokeWidth={2} />
        </button>

        <h1 style={{
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
          fontSize: '17px',
          fontWeight: 700,
          color: '#0F172A',
          letterSpacing: '-0.01em',
          margin: 0,
        }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Notification bell (placeholder) */}
        <button
          aria-label="Benachrichtigungen"
          style={{
            background: 'none', border: '1.5px solid #E2E8F0',
            borderRadius: '8px', cursor: 'pointer',
            padding: '6px 8px', color: '#94A3B8',
            display: 'flex', alignItems: 'center',
          }}
        >
          <Bell size={16} strokeWidth={2} />
        </button>

        {/* Admin badge */}
        <div style={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          borderRadius: '8px',
          padding: '5px 12px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '0.03em',
        }}>
          Admin
        </div>
      </div>
    </header>
  );
}
