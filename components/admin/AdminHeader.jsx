'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Menu, Bell, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

export default function AdminHeader({ onMenuToggle, userEmail }) {
  const pathname = usePathname();
  const router   = useRouter();

  // Match exact or prefix (for sub-routes like /admin/reiseziele/[id])
  const title = PAGE_TITLES[pathname]
    ?? Object.entries(PAGE_TITLES).find(([path]) => path !== '/admin' && pathname.startsWith(path))?.[1]
    ?? 'Admin';

  const displayName = userEmail
    ? userEmail.split('@')[0]
    : 'Admin';

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

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

        {/* User badge with email + logout */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0',
          border: '1.5px solid #E2E8F0',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '5px 12px',
            background: '#F8FAFF',
            fontSize: '12px',
            fontWeight: 600,
            color: '#334155',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <div style={{
              width: '20px', height: '20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10px', fontWeight: 800, color: '#FFFFFF',
              flexShrink: 0,
            }}>
              {(displayName[0] ?? 'A').toUpperCase()}
            </div>
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Abmelden"
            aria-label="Abmelden"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '5px 10px',
              background: 'none',
              border: 'none',
              borderLeft: '1px solid #E2E8F0',
              cursor: 'pointer',
              color: '#94A3B8',
            }}
          >
            <LogOut size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </header>
  );
}
