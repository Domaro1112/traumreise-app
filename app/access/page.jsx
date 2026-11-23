'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';

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
      className="access-wrap"
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0C1A3A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px',
        overflow: 'hidden',
        fontFamily: 'var(--font-inter, "Inter", system-ui, sans-serif)',
      }}
    >
      {/* Am Desktop sitzt die Karte links, damit der Affe im Bild sichtbar bleibt */}
      <style>{`
        .access-wrap { justify-content: center; }
        @media (min-width: 1024px) {
          .access-wrap { align-items: flex-start !important; padding-left: 9vw !important; }
        }
      `}</style>

      {/* Hintergrundbild */}
      <Image
        src="/images/reiseziele/hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: '70% center', zIndex: 0 }}
      />
      {/* Abdunklung, damit die Karte gut lesbar bleibt */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'linear-gradient(115deg, rgba(12,26,58,0.82) 0%, rgba(11,61,107,0.55) 45%, rgba(14,165,233,0.10) 100%)',
        }}
      />

      {/* Card */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderRadius: '24px',
          boxShadow: '0 24px 80px rgba(2,6,23,0.45), 0 1px 0 rgba(255,255,255,0.8) inset',
          border: '1px solid rgba(255,255,255,0.6)',
          overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '28px 32px 20px',
            textAlign: 'center',
            borderBottom: '1px solid #F1F5F9',
          }}
        >
          <Image
            src="/images/logo/apearound-logo.png"
            alt="ApeAround.de – Deine Reise beginnt mit einer Idee"
            width={1600}
            height={534}
            priority
            sizes="320px"
            style={{ width: '100%', maxWidth: '320px', height: 'auto', display: 'block', margin: '0 auto' }}
          />
          <p
            style={{
              marginTop: '10px',
              fontSize: '12px',
              color: '#94A3B8',
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
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
