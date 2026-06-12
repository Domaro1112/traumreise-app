'use client';

import { useRouter } from 'next/navigation';
import { ShieldX, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminAccessDenied({ email }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0C1A3A 0%, #0B3D6B 50%, #0EA5E9 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.30)',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #7F1D1D 0%, #DC2626 100%)',
          padding: '28px 32px 24px',
        }}>
          <ShieldX size={32} strokeWidth={1.5} color="rgba(255,255,255,0.85)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.60)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            Zugriff verweigert
          </p>
        </div>

        <div style={{ padding: '32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            fontSize: '20px', fontWeight: 700, color: '#0F172A',
            margin: '0 0 12px', letterSpacing: '-0.01em',
          }}>
            Kein Administrator-Zugang
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: '0 0 8px' }}>
            Dein Account ist eingeloggt als:
          </p>
          <code style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '8px',
            background: '#F1F5F9',
            fontSize: '13px',
            color: '#334155',
            fontWeight: 600,
            marginBottom: '24px',
          }}>
            {email}
          </code>
          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.65, marginBottom: '28px' }}>
            Dieser Account hat keine Admin-Berechtigung. Bitte wende dich an den Systemadministrator, um{' '}
            <code style={{ fontSize: '12px' }}>user_metadata.role = &quot;admin&quot;</code> zu setzen.
          </p>

          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '12px',
              borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              color: '#FFFFFF',
              fontSize: '14px', fontWeight: 700,
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(14,165,233,0.30)',
            }}
          >
            <LogOut size={15} strokeWidth={2} />
            Ausloggen und zurück zum Login
          </button>
        </div>
      </div>
    </div>
  );
}
