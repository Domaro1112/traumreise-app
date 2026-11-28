import Link from 'next/link';

const TABS = [
  { key: 'kampagnen',  label: 'Kampagnen',        href: '/admin/newsletter/kampagnen' },
  { key: 'willkommen', label: 'Willkommensmail',  href: '/admin/newsletter/willkommen' },
  { key: 'abonnenten', label: 'Abonnenten',       href: '/admin/newsletter' },
];

export default function NewsletterTabs({ active }) {
  return (
    <nav style={{ display: 'flex', gap: '6px', borderBottom: '1.5px solid #E2E8F0', marginBottom: '24px', overflowX: 'auto' }}>
      {TABS.map(t => {
        const on = t.key === active;
        return (
          <Link key={t.key} href={t.href}
            style={{
              padding: '10px 16px', fontSize: '14px', fontWeight: on ? 700 : 600, whiteSpace: 'nowrap',
              color: on ? '#0284C7' : '#64748B', textDecoration: 'none',
              borderBottom: `2.5px solid ${on ? '#0EA5E9' : 'transparent'}`, marginBottom: '-1.5px',
            }}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
