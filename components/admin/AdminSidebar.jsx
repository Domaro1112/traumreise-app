'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, MapPin, FileText, Image as ImageIcon,
  Users, TrendingUp, Search, Settings, LogOut, X, ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard',    href: '/admin',               icon: LayoutDashboard, exact: true },
  { label: 'Reiseziele',   href: '/admin/reiseziele',    icon: MapPin          },
  { label: 'Reiseblog',    href: '/admin/blog',          icon: FileText        },
  { label: 'Medien',       href: '/admin/medien',        icon: ImageIcon       },
  { label: 'Leads',        href: '/admin/leads',         icon: Users           },
  { label: 'Affiliate',    href: '/admin/affiliate',     icon: TrendingUp      },
  { label: 'SEO & LLMO',   href: '/admin/seo-llmo',      icon: Search          },
  { label: 'Einstellungen',href: '/admin/einstellungen', icon: Settings        },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router   = useRouter();

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className="admin-sidebar-overlay"
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 39,
          display: 'none',
        }}
      />

      {/* Sidebar */}
      <aside
        className={`admin-sidebar${isOpen ? ' admin-sidebar-open' : ''}`}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '240px',
          height: '100vh',
          background: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 40,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowY: 'auto',
        }}
      >
        {/* Logo row */}
        <div style={{
          padding: '18px 18px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <Image
              src="/images/logo/reisemonkey-logo.png"
              alt="Reisemonkey Admin"
              width={1536}
              height={1024}
              style={{ height: '26px', width: 'auto', objectFit: 'contain' }}
            />
            <span style={{
              fontSize: '11px', fontWeight: 700, color: '#475569',
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Admin
            </span>
          </Link>
          {/* Mobile close */}
          <button
            onClick={onClose}
            className="admin-sidebar-close"
            aria-label="Sidebar schließen"
            style={{
              display: 'none', background: 'none', border: 'none',
              cursor: 'pointer', color: '#64748B', padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px' }}>
          {NAV_ITEMS.map(item => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 11px',
                  borderRadius: '10px',
                  marginBottom: '1px',
                  textDecoration: 'none',
                  background: active ? 'rgba(14,165,233,0.12)' : 'transparent',
                  borderLeft: active ? '3px solid #0EA5E9' : '3px solid transparent',
                  color: active ? '#E0F2FE' : '#64748B',
                  transition: 'all 0.12s ease',
                  fontSize: '14px',
                  fontWeight: active ? 600 : 400,
                  fontFamily: 'var(--font-body)',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#CBD5E1';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#64748B';
                  }
                }}
              >
                <Icon size={16} strokeWidth={active ? 2.5 : 2} style={{ flexShrink: 0 }} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '10px 8px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Link
            href="/"
            target="_blank"
            rel="noopener"
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 11px', borderRadius: '10px',
              textDecoration: 'none', color: '#475569',
              fontSize: '13px', marginBottom: '4px',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.background = 'transparent'; }}
          >
            <ExternalLink size={13} strokeWidth={2} />
            Zur Website
          </Link>

          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '9px 11px', borderRadius: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748B', fontSize: '14px', fontFamily: 'inherit',
              transition: 'all 0.12s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FCA5A5';
              e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#64748B';
              e.currentTarget.style.background = 'none';
            }}
          >
            <LogOut size={15} strokeWidth={2} />
            Abmelden
          </button>
        </div>
      </aside>
    </>
  );
}
