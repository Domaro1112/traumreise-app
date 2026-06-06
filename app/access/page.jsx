'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export default function AccessPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Falsches Passwort. Bitte erneut versuchen.');
        setPassword('');
      }
    } catch {
      setError('Verbindungsfehler. Bitte Seite neu laden.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #F0F9FF 0%, #E0F2FE 40%, #F8FAFF 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-inter, "Inter", system-ui, sans-serif)',
      }}
    >
      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 8px 48px rgba(15,23,42,0.10), 0 1px 0 rgba(255,255,255,0.8) inset',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
        }}
      >
        {/* Header stripe */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0C1A3A 0%, #0B3D6B 50%, #0EA5E9 100%)',
            padding: '32px 32px 28px',
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.30)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Compass size={24} strokeWidth={2} color="#FFFFFF" />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-poppins, "Poppins", system-ui, sans-serif)',
                fontSize: '22px',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '-0.02em',
              }}
            >
              Traumreise
            </span>
          </div>

          <p
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.65)',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            Entwicklungsumgebung geschützt
          </p>
        </div>

        {/* Form body */}
        <div style={{ padding: '32px' }}>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <Lock size={22} strokeWidth={2} color="#0EA5E9" />
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-poppins, "Poppins", system-ui, sans-serif)',
                fontSize: '20px',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '6px',
                letterSpacing: '-0.01em',
              }}
            >
              Zugang erforderlich
            </h1>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
              Bitte gib das Entwicklungspasswort ein.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Password input */}
            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#374151',
                  marginBottom: '8px',
                  fontFamily: 'var(--font-poppins, "Poppins", system-ui, sans-serif)',
                }}
              >
                Passwort
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entwicklungspasswort eingeben"
                  required
                  autoFocus
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 16px',
                    borderRadius: '12px',
                    border: error ? '2px solid #EF4444' : '1.5px solid #E2E8F0',
                    fontSize: '15px',
                    color: '#0F172A',
                    background: '#FAFAFA',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s',
                    fontFamily: 'var(--font-inter, "Inter", system-ui, sans-serif)',
                  }}
                  onFocus={(e) => {
                    if (!error) e.target.style.borderColor = '#0EA5E9';
                    e.target.style.background = '#FFFFFF';
                  }}
                  onBlur={(e) => {
                    if (!error) e.target.style.borderColor = '#E2E8F0';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  marginBottom: '16px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  fontSize: '13px',
                  color: '#DC2626',
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !password}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: loading || !password
                  ? '#CBD5E1'
                  : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'var(--font-poppins, "Poppins", system-ui, sans-serif)',
                border: 'none',
                cursor: loading || !password ? 'not-allowed' : 'pointer',
                boxShadow: loading || !password ? 'none' : '0 4px 16px rgba(14,165,233,0.35)',
                transition: 'background 0.15s, box-shadow 0.15s',
                letterSpacing: '0.01em',
              }}
            >
              {loading ? 'Überprüfe...' : 'Zugang gewähren'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 32px 24px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={13} strokeWidth={2} color="#94A3B8" />
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>
            Passwort-geschützte Entwicklungsumgebung
          </span>
        </div>
      </div>
    </div>
  );
}
