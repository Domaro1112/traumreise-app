'use client';

import { useState } from 'react';
import { MapPin, Calendar, Car, ChevronDown, Shield, CheckCircle, Tag } from 'lucide-react';
import { buildCheck24CarRentalUrl } from '@/lib/car-rental-config';

const HERO_IMAGE = '/images/mietwagen/mietwagen-hero.jpg';

const DRIVER_AGE_OPTIONS = [
  { value: '25', label: '25+ Jahre (Standard)' },
  { value: '21', label: '21–24 Jahre' },
  { value: '18', label: '18–20 Jahre' },
  { value: '65', label: '65+ Jahre' },
];

const TRUST_BADGES = [
  { Icon: CheckCircle, text: 'Über 500 Anbieter weltweit' },
  { Icon: Tag,         text: 'Kostenloser Vergleich' },
  { Icon: Shield,      text: 'Keine Buchungsgebühren' },
  { Icon: Car,         text: 'Powered by CHECK24' },
];

const inputBase = {
  width: '100%',
  padding: '13px 16px 13px 44px',
  border: '1.5px solid #E2E8F0',
  borderRadius: '12px',
  fontSize: '15px',
  color: '#0F172A',
  background: '#F8FAFC',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease, background 0.15s ease',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 700,
  color: '#64748B',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '7px',
};

function onFocusInput(e)  { e.target.style.borderColor = '#0EA5E9'; e.target.style.background = '#FFFFFF'; }
function onBlurInput(e)   { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F8FAFC'; }

export default function CarRentalHero() {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate,     setPickupDate]     = useState('');
  const [returnDate,     setReturnDate]     = useState('');
  const [driverAge,      setDriverAge]      = useState('25');

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = buildCheck24CarRentalUrl({
      pickupLocation: pickupLocation.trim() || undefined,
      pickupDate:     pickupDate  || undefined,
      returnDate:     returnDate  || undefined,
      driverAge:      driverAge   || undefined,
    });
    const win = window.open(url, '_blank');
    if (win) { try { win.opener = null; } catch (_) {} }
  };

  return (
    <section style={{
      backgroundImage: `linear-gradient(rgba(15,23,42,0.78), rgba(15,23,42,0.55)), url(${HERO_IMAGE})`,
      backgroundSize:     'cover',
      backgroundPosition: 'center center',
      backgroundRepeat:   'no-repeat',
      minHeight:          'clamp(560px, 50vw, 720px)',
      paddingTop:    'clamp(48px, 7vw, 88px)',
      paddingBottom: 'clamp(48px, 7vw, 80px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div aria-hidden="true" style={{ position: 'absolute', top: '-80px', right: '-120px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(14,165,233,0.10)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '-100px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(249,115,22,0.08)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(16px, 4vw, 40px)', position: 'relative', zIndex: 1 }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(14,165,233,0.18)', border: '1px solid rgba(14,165,233,0.35)', borderRadius: '20px', padding: '5px 14px', marginBottom: '20px' }}>
          <Car size={13} strokeWidth={2} color="#38BDF8" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.5px' }}>Mietwagen-Vergleich</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(28px, 4.5vw, 54px)',
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          margin: '0 0 16px',
          maxWidth: '760px',
        }}>
          Mietwagen vergleichen –{' '}
          <span style={{ color: '#38BDF8' }}>günstige Angebote</span>{' '}
          für deinen Urlaub
        </h1>

        <p style={{ fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(255,255,255,0.75)', margin: '0 0 36px', maxWidth: '540px', lineHeight: 1.65 }}>
          Mietwagen-Angebote für deinen Urlaub suchen und vergleichen. Gib deinen Abholort und Zeitraum an und sieh dir passende Fahrzeuge bei CHECK24 an.
        </p>

        {/* Search card */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            padding: 'clamp(20px, 3vw, 32px)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.28)',
            maxWidth: '900px',
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
          }}>
            {/* Abholort */}
            <div>
              <label style={labelStyle}>Abholort</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} strokeWidth={2} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="text"
                  placeholder="z.B. Mallorca, Miami…"
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  style={inputBase}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </div>
            </div>

            {/* Abholdatum */}
            <div>
              <label style={labelStyle}>Abholdatum</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} strokeWidth={2} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={e => setPickupDate(e.target.value)}
                  style={inputBase}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </div>
            </div>

            {/* Rückgabedatum */}
            <div>
              <label style={labelStyle}>Rückgabedatum</label>
              <div style={{ position: 'relative' }}>
                <Calendar size={16} strokeWidth={2} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                <input
                  type="date"
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  style={inputBase}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </div>
            </div>

            {/* Fahreralter */}
            <div>
              <label style={labelStyle}>Fahreralter</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={driverAge}
                  onChange={e => setDriverAge(e.target.value)}
                  style={{ ...inputBase, paddingLeft: '16px', appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                >
                  {DRIVER_AGE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown size={14} strokeWidth={2} color="#94A3B8" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px 32px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #F97316 0%, #FBBF24 100%)',
              color: '#FFFFFF',
              fontSize: '17px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 24px rgba(249,115,22,0.40)',
              letterSpacing: '-0.01em',
              transition: 'filter 0.15s ease, transform 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            <Car size={20} strokeWidth={2} />
            Jetzt Mietwagen finden
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', marginTop: '12px', marginBottom: 0 }}>
            Weiterleitung zu CHECK24 Mietwagen · Für dich kostenlos
          </p>
        </form>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '28px' }}>
          {TRUST_BADGES.map(({ Icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <Icon size={14} strokeWidth={2} color="rgba(255,255,255,0.70)" />
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.80)', fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
