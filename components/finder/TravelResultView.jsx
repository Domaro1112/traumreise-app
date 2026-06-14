'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, ArrowRight, Sparkles, Share2, CheckCircle2,
  MapPin, Mail, RotateCcw, Plane, Building2, Compass, Briefcase,
  Car, Calendar, Backpack, Star, Sun, ChevronDown, ChevronUp,
  Send, MessageCircle, Euro,
} from 'lucide-react';
import { moodOptions } from '@/data/finderOptions';
import { getDestinationImage } from '@/data/destinationImages';

const MATCHES = [
  { pct: 96, label: 'Perfektes Match',     color: '#10B981', bg: '#ECFDF5', border: '#6EE7B7' },
  { pct: 91, label: 'Sehr gutes Match',    color: '#0EA5E9', bg: '#EFF6FF', border: '#93C5FD' },
  { pct: 87, label: 'Geheimtipp für dich', color: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD' },
];

const ACCENT = '#0EA5E9';

function goUrl(provider, rawUrl) {
  if (!rawUrl) return '#';
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AFFILIATE_BUTTON_HREF]', { component: 'TravelResultView', provider });
  }
  return `/go/${provider}?url=${encodeURIComponent(rawUrl)}`;
}

function SectionLabel({ text, color = ACCENT }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color, fontFamily: 'var(--font-heading)', marginBottom: '4px' }}>
      {text}
    </div>
  );
}

function SectionTitle({ label, title, icon: Icon, iconColor = ACCENT, iconBg = '#EFF6FF', iconBorder = '#BFDBFE' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      {Icon && (
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: iconBg, border: `1.5px solid ${iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} strokeWidth={2} color={iconColor} />
        </div>
      )}
      <div>
        {label && <SectionLabel text={label} color={iconColor} />}
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{title}</h2>
      </div>
    </div>
  );
}

function TraitBar({ label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color: ACCENT }}>{value}%</span>
      </div>
      <div style={{ height: '6px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, borderRadius: '3px', background: 'linear-gradient(90deg,#0EA5E9,#06B6D4)' }} />
      </div>
    </div>
  );
}

function ShareModal({ destination, country, tagline, onClose }) {
  const share = () => {
    const t = `Meine Traumreise: ${destination}, ${country}\n„${tagline}"\n\nFinde deine Traumreise → apearound.de`;
    if (navigator.share) navigator.share({ text: t });
    else navigator.clipboard?.writeText(t);
    onClose();
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.72)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 24px 80px rgba(15,23,42,0.22)', border: '1.5px solid #BFDBFE', padding: '40px 32px', maxWidth: '380px', width: '100%', textAlign: 'center', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#94A3B8', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{destination}</div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>{country}</div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 22, fontStyle: 'italic' }}>„{tagline}"</div>
        <button onClick={share} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Share2 size={16} strokeWidth={2} />
          Traumreise teilen
        </button>
      </div>
    </div>
  );
}

const card = {
  background: '#FFFFFF',
  borderRadius: '20px',
  border: '1px solid #F1F5F9',
  boxShadow: '0 4px 20px rgba(15,23,42,0.05)',
  padding: 'clamp(18px,4vw,28px)',
  marginBottom: '14px',
};

export default function TravelResultView({ results, personality, interests, packingList, surprise, duration, onReset, onEmail }) {
  const [idx, setIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [openPackCategory, setOpenPackCategory] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const total = results.length;
  const cur = results[idx];
  const match = MATCHES[Math.min(idx, MATCHES.length - 1)];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Reset chat when destination changes
  useEffect(() => { setChatMessages([]); }, [idx]);

  const moodId = interests[idx % Math.max(interests.length, 1)];
  const heroMood = moodOptions.find(m => m.id === moodId) || moodOptions[0];
  const moodFallback = heroMood.imageUrl.replace('w=600', 'w=1400').replace('q=80', 'q=88');
  const heroUrl = getDestinationImage(cur.destination, moodFallback, cur.country, {
    interest: moodId,
    resultType: 'travel-finder',
  });

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = { role: 'user', content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/ai/travel-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: cur.destination, country: cur.country, messages: newMessages }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Entschuldigung, ich konnte keine Antwort generieren.' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuche es erneut.' }]);
    }
    setChatLoading(false);
  };

  const packCategories = [
    { key: 'documents', label: 'Dokumente',  icon: '📄' },
    { key: 'clothes',   label: 'Kleidung',   icon: '👕' },
    { key: 'tech',      label: 'Technik',    icon: '📱' },
    { key: 'health',    label: 'Gesundheit', icon: '💊' },
    { key: 'misc',      label: 'Sonstiges',  icon: '🎒' },
  ];

  return (
    <div style={{ animation: 'fadeUp .4s cubic-bezier(0.16, 1, 0.3, 1) both' }}>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1 · Persönliches Reiseprofil                                  */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {personality && (
        <section
          aria-label="Dein Reiseprofil"
          style={{ ...card, background: 'linear-gradient(135deg,#EFF6FF 0%,#ECFEFF 100%)', border: '1.5px solid #BFDBFE' }}
        >
          <SectionTitle label="KI-Analyse" title="Dein Reiseprofil" icon={Sparkles} />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {(personality.types || []).map((t, i) => (
              <span key={i} style={{ padding: '6px 14px', borderRadius: '20px', background: '#FFFFFF', border: '1.5px solid #BFDBFE', fontSize: '13px', color: '#0284C7', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                {t}
              </span>
            ))}
          </div>

          {Array.isArray(personality.traits) && personality.traits.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', marginBottom: '16px' }}>
              {personality.traits.map((trait, i) => (
                <TraitBar key={i} label={trait.label} value={trait.value} />
              ))}
            </div>
          )}

          <p style={{ margin: 0, fontSize: 'clamp(14px,2vw,16px)', fontStyle: 'italic', color: '#1E40AF', lineHeight: 1.65, fontWeight: 500 }}>
            „{personality.summary}"
          </p>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2 · Top 3 Traumziele                                          */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section aria-label="Deine Top 3 Traumziele" style={card}>
        <SectionTitle label="KI-Empfehlungen" title="Deine Top 3 Traumziele" icon={MapPin} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {results.map((r, i) => {
            const m = MATCHES[Math.min(i, MATCHES.length - 1)];
            const active = i === idx;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px', border: `2px solid ${active ? '#93C5FD' : '#F1F5F9'}`, background: active ? '#EFF6FF' : '#FAFAFA', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%', transition: 'all 0.2s' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: active ? m.bg : '#F1F5F9', border: `1.5px solid ${active ? m.border : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '18px' }}>{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>{r.destination}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                    <MapPin size={10} strokeWidth={2.5} />
                    {r.country}
                    {r.flightTime && <span style={{ color: '#94A3B8' }}>· {r.flightTime}</span>}
                  </div>
                </div>
                <div style={{ padding: '4px 11px', borderRadius: '20px', background: m.bg, border: `1px solid ${m.border}`, fontSize: '12px', fontWeight: 700, color: m.color, whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {m.pct}%
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* PER-DESTINATION SECTIONS (animated on destination change)             */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <div key={idx} style={{ animation: 'fadeUp .35s cubic-bezier(0.16, 1, 0.3, 1) both' }}>

        {/* Destination hero */}
        <div
          itemScope
          itemType="https://schema.org/TravelDestination"
          style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: 'clamp(200px,34vw,360px)', marginBottom: '14px', boxShadow: '0 16px 60px rgba(14,165,233,0.16)' }}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'TravelDestination', name: cur.destination, description: cur.tagline, containedInPlace: { '@type': 'Country', name: cur.country } }) }}
          />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${heroUrl})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.06) 0%,rgba(0,0,0,0.55) 70%,rgba(0,0,0,0.82) 100%)' }} />
          <div style={{ position: 'absolute', top: '16px', right: '16px', padding: '5px 13px', borderRadius: '20px', background: match.color + 'dd', backdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-heading)' }}>
            {match.pct}% {match.label}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(14px,3vw,26px)' }}>
            <h2 itemProp="name" style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px,6vw,50px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', lineHeight: 1.0, textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              {cur.destination}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              <MapPin size={11} strokeWidth={2.5} />
              <span itemProp="containedInPlace">{cur.country}</span>
            </div>
          </div>
        </div>

        {/* ── SECTION 3 · Detailansicht ──────────────────────────────────────── */}
        {(cur.weather || cur.flightTime || cur.budgetPerDay || (cur.highlights && cur.highlights.length > 0)) && (
          <section aria-label="Reiseziel-Details" style={card}>
            <SectionTitle label="Auf einen Blick" title={`${cur.destination} im Detail`} icon={Sun} iconColor="#D97706" iconBg="#FFF7ED" iconBorder="#FED7AA" />

            {/* Info tiles */}
            {(cur.weather || cur.flightTime || cur.budgetPerDay) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '14px' }}>
                {cur.weather && (
                  <div style={{ padding: '14px', borderRadius: '14px', background: '#FFF7ED', border: '1px solid #FED7AA', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>☀️</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Wetter</div>
                    <div style={{ fontSize: '12px', color: '#78350F', fontWeight: 500, lineHeight: 1.4 }}>{cur.weather}</div>
                  </div>
                )}
                {cur.flightTime && (
                  <div style={{ padding: '14px', borderRadius: '14px', background: '#EFF6FF', border: '1px solid #BFDBFE', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>✈️</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Flugzeit</div>
                    <div style={{ fontSize: '12px', color: '#1E3A8A', fontWeight: 500, lineHeight: 1.4 }}>{cur.flightTime}</div>
                  </div>
                )}
                {cur.budgetPerDay && (
                  <div style={{ padding: '14px', borderRadius: '14px', background: '#F0FDF4', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', marginBottom: '6px' }}>💰</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Budget/Tag</div>
                    <div style={{ fontSize: '12px', color: '#14532D', fontWeight: 500, lineHeight: 1.4 }}>{cur.budgetPerDay}</div>
                  </div>
                )}
              </div>
            )}

            {/* Highlights */}
            {cur.highlights?.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                {cur.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 12px', borderRadius: '10px', background: '#F8FAFF', border: '1px solid #E2E8F0' }}>
                    <CheckCircle2 size={13} strokeWidth={2} color={ACCENT} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4, fontWeight: 500 }}>{h}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tagline */}
            <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '1.5px solid #BFDBFE', borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Sparkles size={15} strokeWidth={2} color={ACCENT} style={{ flexShrink: 0, marginTop: '2px' }} />
              <p itemProp="description" style={{ margin: 0, fontSize: '14px', color: '#1E40AF', fontStyle: 'italic', lineHeight: 1.65, fontWeight: 500 }}>
                „{cur.tagline}"
              </p>
            </div>
          </section>
        )}

        {/* ── SECTION 4 · Persönlicher Reiseplan ────────────────────────────── */}
        {cur.itinerary?.length > 0 && (
          <section aria-label="Dein Reiseplan" style={card}>
            <SectionTitle label="Dein Reiseplan" title={`${cur.destination} – Tag für Tag`} icon={Calendar} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {cur.itinerary.map((day, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '36px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: i === 0 ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#EFF6FF', border: `1.5px solid ${i === 0 ? 'transparent' : '#BFDBFE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: i === 0 ? '#FFFFFF' : ACCENT, fontFamily: 'var(--font-heading)' }}>{day.day}</span>
                    </div>
                    {i < cur.itinerary.length - 1 && <div style={{ width: '2px', flex: 1, background: '#E2E8F0', minHeight: '12px', margin: '4px 0' }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: i < cur.itinerary.length - 1 ? '14px' : '0' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', fontFamily: 'var(--font-heading)', paddingTop: '7px' }}>
                      {day.title}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {(day.activities || []).map((act, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#475569' }}>
                          <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0 }}>→</span>
                          {act}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SECTION 5 · Empfohlene Hotels ─────────────────────────────────── */}
        {cur.hotels?.length > 0 && (
          <section aria-label="Empfohlene Hotels" style={card}>
            <SectionTitle label="KI-Empfehlungen" title="Empfohlene Hotels" icon={Building2} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {cur.hotels.map((hotel, i) => (
                <div key={i} style={{ padding: '14px 16px', borderRadius: '14px', background: i === 0 ? 'linear-gradient(135deg,#EFF6FF,#ECFEFF)' : '#F8FAFF', border: `1.5px solid ${i === 0 ? '#BFDBFE' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '4px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>{hotel.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{hotel.category}</div>
                    </div>
                    {hotel.pricePerNight && (
                      <div style={{ padding: '3px 9px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '12px', fontWeight: 700, color: '#15803D', whiteSpace: 'nowrap', flexShrink: 0 }}>
                        {hotel.pricePerNight}
                      </div>
                    )}
                  </div>
                  {hotel.why && <div style={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic', lineHeight: 1.4 }}>{hotel.why}</div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a href={goUrl('trivago', cur.trivagoUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 14px', background: 'linear-gradient(135deg,#d00e17,#ff4d57)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <Building2 size={14} strokeWidth={2} />
                Trivago
              </a>
              <a href={goUrl('booking', cur.bookingUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 14px', background: 'linear-gradient(135deg,#003580,#0057b8)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <Building2 size={14} strokeWidth={2} />
                Booking.com
              </a>
            </div>
          </section>
        )}

        {/* ── SECTION 6 · Empfohlene Flüge ──────────────────────────────────── */}
        <section aria-label="Empfohlene Flüge" style={card}>
          <SectionTitle label="Flüge buchen" title="Empfohlene Flüge" icon={Plane} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', marginBottom: '12px' }}>
            <span style={{ fontSize: '22px' }}>✈️</span>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Direktflüge nach {cur.destination}</div>
              {cur.flightTime && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{cur.flightTime} · Günstigste Optionen via Skyscanner</div>}
            </div>
          </div>
          <a href={goUrl('skyscanner', cur.skyUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 18px', background: 'linear-gradient(135deg,#0770e3,#00a0de)', color: '#FFFFFF', borderRadius: '14px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
            <Plane size={15} strokeWidth={2} />
            Flüge nach {cur.destination} suchen
            <ArrowRight size={14} strokeWidth={2.5} style={{ marginLeft: 'auto' }} />
          </a>
        </section>

        {/* ── SECTION 7 · Empfohlene Mietwagen ──────────────────────────────── */}
        {cur.carRental && (
          <section aria-label="Mietwagen" style={card}>
            <SectionTitle label="Mobilität vor Ort" title="Mietwagen" icon={Car} iconColor="#7C3AED" iconBg="#F5F3FF" iconBorder="#DDD6FE" />
            <div style={{ padding: '14px 16px', borderRadius: '14px', background: cur.carRental.recommended ? '#F0FDF4' : '#F8FAFF', border: `1.5px solid ${cur.carRental.recommended ? '#BBF7D0' : '#E2E8F0'}`, marginBottom: cur.carRental.recommended ? '12px' : '0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{cur.carRental.recommended ? '🚗' : 'ℹ️'}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                    {cur.carRental.recommended ? 'Mietwagen empfohlen' : 'Kein Mietwagen nötig'}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>{cur.carRental.reason}</div>
                </div>
              </div>
            </div>
            {cur.carRental.recommended && (
              <a href={goUrl('check24', cur.check24Url)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'linear-gradient(135deg,#003399,#e30613)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <Car size={14} strokeWidth={2} />
                Mietwagen vergleichen – CHECK24
              </a>
            )}
          </section>
        )}

        {/* ── SECTION 8 · Empfohlene Aktivitäten ────────────────────────────── */}
        {cur.activities?.length > 0 && (
          <section aria-label="Empfohlene Aktivitäten" style={card}>
            <SectionTitle label="Aktivitäten" title="Perfekt für dich ausgewählt" icon={Compass} iconColor="#EA580C" iconBg="#FFF7ED" iconBorder="#FED7AA" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              {cur.activities.map((act, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '14px', background: '#F8FAFF', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '1px' }}>{act.category}</div>
                    {act.price && <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>{act.price}</div>}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', fontFamily: 'var(--font-heading)', lineHeight: 1.3 }}>{act.name}</div>
                  {act.why && <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic', lineHeight: 1.4 }}>{act.why}</div>}
                </div>
              ))}
            </div>
            <a href={goUrl('getyourguide', cur.gygUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'linear-gradient(135deg,#FF5533,#FF8C00)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
              <Compass size={14} strokeWidth={2} />
              Alle Aktivitäten in {cur.destination} – GetYourGuide
            </a>
          </section>
        )}

        {/* ── SECTION 10 · Kostenschätzung ───────────────────────────────────── */}
        {cur.costEstimate && (
          <section aria-label="Kostenschätzung" style={card}>
            <SectionTitle label="Budget-Übersicht" title="Kostenschätzung für deine Reise" icon={Euro} iconColor="#15803D" iconBg="#F0FDF4" iconBorder="#BBF7D0" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Flug',        value: cur.costEstimate.flight,     icon: '✈️' },
                { label: 'Unterkunft',  value: cur.costEstimate.hotel,      icon: '🏨' },
                { label: 'Mietwagen',   value: cur.costEstimate.carRental,  icon: '🚗' },
                { label: 'Aktivitäten', value: cur.costEstimate.activities, icon: '🎯' },
              ].filter(r => r.value && r.value !== '0€').map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '10px', background: '#F8FAFF', border: '1px solid #F1F5F9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>{row.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{row.value}</span>
                </div>
              ))}
              {cur.costEstimate.total && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '2px solid #BFDBFE', marginTop: '4px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>Gesamt (geschätzt)</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0284C7', fontFamily: 'var(--font-heading)' }}>{cur.costEstimate.total}</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '10px', fontSize: '11px', color: '#94A3B8', lineHeight: 1.5 }}>
              * Schätzwerte basieren auf durchschnittlichen Preisen. Tatsächliche Preise können abweichen.
            </div>
          </section>
        )}

      </div>
      {/* End per-destination sections */}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 9 · KI-Packliste (global)                                    */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {packingList && (
        <section aria-label="KI-Packliste" style={card}>
          <SectionTitle label="KI-Packliste" title="Was du einpacken solltest" icon={Backpack} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {packCategories.map(cat => {
              const items = packingList[cat.key] || [];
              if (!items.length) return null;
              const isOpen = openPackCategory === cat.key;
              return (
                <div key={cat.key} style={{ borderRadius: '12px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenPackCategory(isOpen ? null : cat.key)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: isOpen ? '#EFF6FF' : '#F8FAFF', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s' }}
                  >
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{cat.icon}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: '11px', color: '#94A3B8', marginRight: '6px' }}>{items.length} Items</span>
                    {isOpen ? <ChevronUp size={14} strokeWidth={2.5} color="#94A3B8" /> : <ChevronDown size={14} strokeWidth={2.5} color="#94A3B8" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '12px 14px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                        {items.map((item, i) => (
                          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 11px', borderRadius: '20px', background: '#F8FAFF', border: '1px solid #E2E8F0', fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                            <CheckCircle2 size={10} strokeWidth={2.5} color={ACCENT} />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 11 · Überraschungsziel (global)                               */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      {surprise && (
        <section aria-label="Überraschungsziel" style={{ ...card, background: 'linear-gradient(135deg,#FDF4FF 0%,#F0F9FF 100%)', border: '1.5px solid #E9D5FF' }}>
          <SectionTitle label="KI-Überraschung" title="Dein geheimes Traumziel" icon={Star} iconColor="#A855F7" iconBg="#F3E8FF" iconBorder="#E9D5FF" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <span style={{ fontSize: '28px' }}>✨</span>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-heading)' }}>{surprise.destination}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <MapPin size={10} strokeWidth={2.5} />
                {surprise.country}
              </div>
            </div>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: '14px', fontStyle: 'italic', color: '#6B21A8', lineHeight: 1.65, fontWeight: 500 }}>
            „{surprise.tagline}"
          </p>
          {surprise.whySurprising && (
            <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.7)', border: '1px solid #DDD6FE', fontSize: '13px', color: '#4C1D95', lineHeight: 1.55 }}>
              <strong style={{ color: '#7C3AED' }}>Warum überraschend? </strong>{surprise.whySurprising}
            </div>
          )}
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────── */}
      {/* SECTION 12 · KI-Reiseberater Chat                                     */}
      {/* ─────────────────────────────────────────────────────────────────────── */}
      <section aria-label="KI-Reiseberater" style={card}>
        <SectionTitle label="KI-Reiseberater" title={`Frag mich zu ${cur.destination}`} icon={MessageCircle} />

        {/* Messages */}
        <div style={{ minHeight: '110px', maxHeight: '260px', overflowY: 'auto', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '2px' }}>
          {chatMessages.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#94A3B8', fontSize: '13px', lineHeight: 1.6 }}>
              <div style={{ fontSize: '26px', marginBottom: '8px' }}>💬</div>
              Stell mir deine Fragen zu <strong style={{ color: '#475569' }}>{cur.destination}</strong>!
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '86%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: msg.role === 'user' ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F8FAFF', border: msg.role === 'user' ? 'none' : '1px solid #E2E8F0', fontSize: '13px', color: msg.role === 'user' ? '#FFFFFF' : '#334155', lineHeight: 1.55, fontWeight: msg.role === 'user' ? 600 : 400 }}>
                {msg.content}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '10px 16px', borderRadius: '14px 14px 14px 4px', background: '#F8FAFF', border: '1px solid #E2E8F0', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map(n => (
                  <div key={n} style={{ width: '6px', height: '6px', borderRadius: '50%', background: ACCENT, animation: `blink 1.2s ${n * 0.2}s step-end infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick questions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {['Beste Reisezeit?', 'Geheimtipps?', 'Sicherheit?', 'Lokales Essen?'].map(q => (
            <button key={q} onClick={() => setChatInput(q)} style={{ padding: '5px 11px', borderRadius: '20px', border: '1px solid #BFDBFE', background: '#F0F9FF', color: '#0284C7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
            placeholder={`Frage zu ${cur.destination}…`}
            style={{ flex: 1, padding: '11px 14px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#F8FAFF', fontSize: '14px', color: '#0F172A', outline: 'none', fontFamily: 'inherit' }}
          />
          <button
            onClick={sendChat}
            disabled={!chatInput.trim() || chatLoading}
            style={{ padding: '11px 16px', borderRadius: '12px', border: 'none', background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F1F5F9', color: chatInput.trim() && !chatLoading ? '#FFFFFF' : '#94A3B8', cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s' }}
          >
            <Send size={15} strokeWidth={2} />
          </button>
        </div>
      </section>

      {/* ── Pauschalreise ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '14px' }}>
        <a href={goUrl('check24', cur.check24Url)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: 'linear-gradient(135deg,#003399,#e30613)', color: '#FFFFFF', borderRadius: '14px', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
          <Briefcase size={16} strokeWidth={2} />
          Pauschalreise nach {cur.destination} – CHECK24
          <ArrowRight size={14} strokeWidth={2.5} style={{ marginLeft: 'auto' }} />
        </a>
      </div>

      {/* ── Email opt-in ───────────────────────────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg,#F8FAFF 0%,#EFF6FF 100%)', border: '1px solid #E2E8F0', borderRadius: '20px', padding: '18px 20px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: '#DBEAFE', border: '1.5px solid #93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Mail size={18} strokeWidth={1.5} color="#0284C7" />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '2px' }}>Reiseplan per Mail erhalten</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Wöchentlich Deals & Inspiration</div>
          </div>
        </div>
        <button onClick={onEmail} style={{ padding: '11px 20px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#FFFFFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 14px rgba(14,165,233,0.32)', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Kostenlos →
        </button>
      </div>

      {/* ── Share & Reset ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <button onClick={() => setShowShare(true)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Share2 size={14} strokeWidth={2} />
          Traumreise teilen
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <button onClick={onReset} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit', padding: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RotateCcw size={12} strokeWidth={2} />
          Neue Suche starten
        </button>
      </div>

      <div style={{ fontSize: '11px', color: '#CBD5E1', textAlign: 'center' }}>
        * Affiliate-Links – für dich entstehen keine Mehrkosten
      </div>

      {showShare && (
        <ShareModal
          destination={cur.destination}
          country={cur.country}
          tagline={cur.tagline}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
