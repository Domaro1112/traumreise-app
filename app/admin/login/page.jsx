'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// metadata is inherited from app/admin/layout.jsx (noindex).

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPassword,setShowPassword]= useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email:    email.trim(),
        password,
      });

      if (authError) {
        setError(mapAuthError(authError.message));
        setPassword('');
        return;
      }

      // Check admin role before entering the admin area
      const role = data.user?.user_metadata?.role;
      if (role !== 'admin') {
        // Sign out immediately — authenticated but not admin
        await supabase.auth.signOut();
        setError('Kein Admin-Zugang. Dein Account hat keine Administrator-Berechtigung.');
        setPassword('');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Verbindungsfehler. Bitte Seite neu laden.');
    } finally {
      setLoading(false);
    }
  }

  function mapAuthError(msg) {
    if (msg.includes('Invalid login credentials')) return 'E-Mail oder Passwort falsch.';
    if (msg.includes('Email not confirmed'))       return 'E-Mail-Adresse noch nicht bestätigt.';
    if (msg.includes('Too many requests'))         return 'Zu viele Versuche. Bitte kurz warten.';
    return msg;
  }

  const canSubmit = email.trim() && password && !loading;

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
        maxWidth: '420px',
        background: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.30)',
        overflow: 'hidden',
      }}>

        {/* Header stripe */}
        <div style={{
          background: 'linear-gradient(135deg, #0C1A3A 0%, #0B3D6B 50%, #0EA5E9 100%)',
          padding: '28px 32px 24px',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
            <Image
              src="/images/logo/reisemonkey-logo.png"
              alt="Reisemonkey"
              width={1536}
              height={1024}
              style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
            Admin-Bereich
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '14px',
              background: '#EFF6FF',
              border: '1px solid #BAE6FD',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <Lock size={20} strokeWidth={2} color="#0EA5E9" />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: '20px', fontWeight: 700, color: '#0F172A',
              margin: '0 0 6px', letterSpacing: '-0.01em',
            }}>
              Admin Login
            </h1>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5, margin: 0 }}>
              Nur für autorisierte Administratoren.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* E-Mail */}
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="admin-email"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}
              >
                E-Mail-Adresse
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={14}
                  strokeWidth={2}
                  color="#94A3B8"
                  style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
                />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoFocus
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 36px',
                    borderRadius: '12px',
                    border: error ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
                    fontSize: '14px',
                    color: '#0F172A',
                    background: '#FAFAFA',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { if (!error) e.target.style.borderColor = '#0EA5E9'; e.target.style.background = '#FFFFFF'; }}
                  onBlur={e  => { if (!error) e.target.style.borderColor = '#E2E8F0'; }}
                />
              </div>
            </div>

            {/* Passwort */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="admin-password"
                style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '7px' }}
              >
                Passwort
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Passwort eingeben"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '11px 44px 11px 14px',
                    borderRadius: '12px',
                    border: error ? '1.5px solid #EF4444' : '1.5px solid #E2E8F0',
                    fontSize: '14px',
                    color: '#0F172A',
                    background: '#FAFAFA',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                  onFocus={e => { if (!error) e.target.style.borderColor = '#0EA5E9'; e.target.style.background = '#FFFFFF'; }}
                  onBlur={e  => { if (!error) e.target.style.borderColor = '#E2E8F0'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
                    color: '#94A3B8', display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginBottom: '16px', padding: '10px 14px',
                borderRadius: '10px', background: '#FEF2F2',
                border: '1px solid #FECACA',
                display: 'flex', alignItems: 'flex-start', gap: '8px',
              }}>
                <AlertCircle size={14} strokeWidth={2} color="#DC2626" style={{ marginTop: '1px', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '13px',
                borderRadius: '12px', border: 'none',
                background: !canSubmit
                  ? '#CBD5E1'
                  : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                fontSize: '15px', fontWeight: 700,
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                cursor: !canSubmit ? 'not-allowed' : 'pointer',
                boxShadow: !canSubmit ? 'none' : '0 4px 16px rgba(14,165,233,0.35)',
                letterSpacing: '0.01em',
                transition: 'all 0.15s',
              }}
            >
              {loading ? 'Anmeldung läuft…' : 'Anmelden'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 32px 22px',
          borderTop: '1px solid #F1F5F9',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <ShieldCheck size={13} strokeWidth={2} color="#94A3B8" />
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            Geschützter Admin-Bereich · Reisemonkey
          </span>
        </div>
      </div>
    </div>
  );
}
