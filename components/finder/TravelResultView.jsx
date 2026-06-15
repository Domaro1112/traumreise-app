'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, Sparkles, Share2, CheckCircle2,
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
    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color, fontFamily: 'var(--font-heading)', marginBottom: '3px' }}>
      {text}
    </div>
  );
}

function SectionTitle({ label, title, icon: Icon, iconColor = ACCENT, iconBg = '#EFF6FF', iconBorder = '#BFDBFE' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
      {Icon && (
        <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: iconBg, border: `1.5px solid ${iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={14} strokeWidth={2} color={iconColor} />
        </div>
      )}
      <div>
        {label && <SectionLabel text={label} color={iconColor} />}
        <h2 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{title}</h2>
      </div>
    </div>
  );
}

function TraitBar({ label, value }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>{label}</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: ACCENT }}>{value}%</span>
      </div>
      <div style={{ height: '5px', borderRadius: '3px', background: '#E2E8F0', overflow: 'hidden' }}>
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
  borderRadius: '18px',
  border: '1px solid #EAEFF5',
  boxShadow: '0 2px 16px rgba(15,23,42,0.06), 0 1px 4px rgba(15,23,42,0.04)',
  padding: '18px 20px',
};

export default function TravelResultView({ results, personality, interests, packingList, surprise, duration, onReset, onEmail }) {
  const [idx, setIdx]                     = useState(0);
  const [showShare, setShowShare]         = useState(false);
  const [openPackCategory, setOpenPackCategory] = useState(null);
  const [chatMessages, setChatMessages]   = useState([]);
  const [chatInput, setChatInput]         = useState('');
  const [chatLoading, setChatLoading]     = useState(false);
  const chatEndRef = useRef(null);

  const cur   = results[idx];
  const match = MATCHES[Math.min(idx, MATCHES.length - 1)];

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);
  useEffect(() => { setChatMessages([]); }, [idx]);

  function getDestImage(r, i) {
    const moodId   = interests[i % Math.max(interests.length, 1)];
    const heroMood = moodOptions.find(m => m.id === moodId) || moodOptions[0];
    const fallback = heroMood.imageUrl.replace('w=600', 'w=1400').replace('q=80', 'q=88');
    return getDestinationImage(r.destination, fallback, r.country, { interest: moodId, resultType: 'travel-finder' });
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg    = { role: 'user', content: chatInput.trim() };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const res  = await fetch('/api/ai/travel-chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ destination: cur.destination, country: cur.country, messages: newMessages }) });
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
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: 'clamp(12px,4vw,28px)', animation: 'fadeUp .4s cubic-bezier(0.16,1,0.3,1) both' }}>

      {/* ── Schema.org ─────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'TravelDestination', name: cur.destination, description: cur.tagline, containedInPlace: { '@type': 'Country', name: cur.country } }) }}
      />

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ROW 1 · TOP DASHBOARD — 3-column grid                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '12px', marginBottom: '12px', alignItems: 'start' }}>

        {/* Col 1 · Surprise */}
        {surprise && (
          <section aria-label="Überraschungsziel" style={{ ...card, background: 'linear-gradient(135deg,#FDF4FF 0%,#F0F9FF 100%)', border: '1.5px solid #E9D5FF' }}>
            <SectionTitle label="KI-Überraschung" title="Dein geheimes Traumziel" icon={Star} iconColor="#A855F7" iconBg="#F3E8FF" iconBorder="#E9D5FF" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '26px' }}>✨</span>
              <div>
                <div style={{ fontSize: '19px', fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>{surprise.destination}</div>
                <div style={{ fontSize: '11px', color: '#A78BFA', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                  <MapPin size={9} strokeWidth={2.5} />
                  {surprise.country}
                </div>
              </div>
            </div>
            <p style={{ margin: '0 0 10px', fontSize: '13px', fontStyle: 'italic', color: '#6B21A8', lineHeight: 1.6, fontWeight: 500 }}>
              „{surprise.tagline}"
            </p>
            {surprise.whySurprising && (
              <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.7)', border: '1px solid #DDD6FE', fontSize: '12px', color: '#4C1D95', lineHeight: 1.55 }}>
                <strong style={{ color: '#7C3AED' }}>Warum? </strong>{surprise.whySurprising}
              </div>
            )}
          </section>
        )}

        {/* Col 2 · Destination Details (updates when dest changes) */}
        {(cur.weather || cur.flightTime || cur.budgetPerDay || cur.highlights?.length > 0 || cur.tagline) && (
          <section aria-label="Reiseziel-Details" style={{ ...card, background: '#FFFCF5', border: '1.5px solid #FED7AA' }}>
            <SectionTitle label="Auf einen Blick" title={cur.destination} icon={Sun} iconColor="#D97706" iconBg="#FFF7ED" iconBorder="#FED7AA" />

            {/* 3 info tiles */}
            {(cur.weather || cur.flightTime || cur.budgetPerDay) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '7px', marginBottom: '12px' }}>
                {cur.weather && (
                  <div style={{ padding: '10px 8px', borderRadius: '12px', background: '#FFF7ED', border: '1px solid #FED7AA', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>☀️</div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Wetter</div>
                    <div style={{ fontSize: '11px', color: '#78350F', fontWeight: 600, lineHeight: 1.3 }}>{cur.weather}</div>
                  </div>
                )}
                {cur.flightTime && (
                  <div style={{ padding: '10px 8px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>✈️</div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Flugzeit</div>
                    <div style={{ fontSize: '11px', color: '#1E3A8A', fontWeight: 600, lineHeight: 1.3 }}>{cur.flightTime}</div>
                  </div>
                )}
                {cur.budgetPerDay && (
                  <div style={{ padding: '10px 8px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>💰</div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Budget/Tag</div>
                    <div style={{ fontSize: '11px', color: '#14532D', fontWeight: 600, lineHeight: 1.3 }}>{cur.budgetPerDay}</div>
                  </div>
                )}
              </div>
            )}

            {/* Highlights */}
            {cur.highlights?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '10px' }}>
                {cur.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#374155' }}>
                    <CheckCircle2 size={11} strokeWidth={2} color={ACCENT} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {h}
                  </div>
                ))}
              </div>
            )}

            {/* Tagline */}
            {cur.tagline && (
              <div style={{ background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <Sparkles size={12} strokeWidth={2} color={ACCENT} style={{ flexShrink: 0, marginTop: '2px' }} />
                <p itemProp="description" style={{ margin: 0, fontSize: '12px', color: '#1E40AF', fontStyle: 'italic', lineHeight: 1.6, fontWeight: 500 }}>„{cur.tagline}"</p>
              </div>
            )}
          </section>
        )}

        {/* Col 3 · Personality */}
        {personality && (
          <section aria-label="Dein Reiseprofil" style={{ ...card, background: 'linear-gradient(135deg,#EFF6FF 0%,#ECFEFF 100%)', border: '1.5px solid #BFDBFE' }}>
            <SectionTitle label="KI-Analyse" title="Dein Reiseprofil" icon={Sparkles} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {(personality.types || []).map((t, i) => (
                <span key={i} style={{ padding: '4px 11px', borderRadius: '20px', background: '#FFFFFF', border: '1.5px solid #BFDBFE', fontSize: '12px', color: '#0284C7', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{t}</span>
              ))}
            </div>
            {Array.isArray(personality.traits) && personality.traits.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: '12px' }}>
                {personality.traits.map((trait, i) => <TraitBar key={i} label={trait.label} value={trait.value} />)}
              </div>
            )}
            <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: '#1E40AF', lineHeight: 1.6, fontWeight: 500 }}>„{personality.summary}"</p>
          </section>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ROW 2 · TOP 3 DESTINATION IMAGE CARDS                                */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <section aria-label="Deine Top 3 Traumziele" style={{ ...card, marginBottom: '12px' }}>
        <SectionTitle label="KI-Empfehlungen" title="Deine Top 3 Traumziele" icon={MapPin} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '10px' }}>
          {results.map((r, i) => {
            const m      = MATCHES[Math.min(i, MATCHES.length - 1)];
            const active = i === idx;
            const imgUrl = getDestImage(r, i);
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  position: 'relative', height: '150px', borderRadius: '16px', overflow: 'hidden',
                  border: `2.5px solid ${active ? '#0EA5E9' : 'transparent'}`,
                  cursor: 'pointer', padding: 0, background: '#0F172A',
                  boxShadow: active
                    ? '0 0 0 4px rgba(14,165,233,0.2), 0 8px 28px rgba(0,0,0,0.18)'
                    : '0 4px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.22s ease', fontFamily: 'inherit',
                }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.04) 0%,rgba(0,0,0,0.28) 45%,rgba(0,0,0,0.82) 100%)' }} />
                {/* Rank badge */}
                <div style={{ position: 'absolute', top: '9px', left: '9px', width: '26px', height: '26px', borderRadius: '50%', background: active ? '#0EA5E9' : 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', border: active ? 'none' : '1px solid rgba(255,255,255,0.38)' }}>
                  {i + 1}
                </div>
                {/* Match badge */}
                <div style={{ position: 'absolute', top: '9px', right: '9px', padding: '3px 8px', borderRadius: '20px', background: m.color + 'dd', fontSize: '11px', fontWeight: 700, color: '#FFFFFF', fontFamily: 'var(--font-heading)', backdropFilter: 'blur(4px)' }}>
                  {m.pct}%
                </div>
                {/* Bottom text */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px', textAlign: 'left' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', lineHeight: 1.1, textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>{r.destination}</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.72)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
                    <MapPin size={8} strokeWidth={2.5} />
                    {r.country}
                    {r.flightTime && <span style={{ opacity: 0.75 }}>· {r.flightTime}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PER-DESTINATION SECTIONS (animated on destination change)            */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      <div key={idx} style={{ animation: 'fadeUp .3s cubic-bezier(0.16,1,0.3,1) both' }}>

        {/* Reiseplan */}
        {cur.itinerary?.length > 0 && (
          <section aria-label="Dein Reiseplan" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Dein Reiseplan" title={`${cur.destination} – Tag für Tag`} icon={Calendar} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '8px' }}>
              {cur.itinerary.map((day, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '12px', background: i === 0 ? 'linear-gradient(135deg,#EFF6FF,#ECFEFF)' : '#F8FAFF', border: `1px solid ${i === 0 ? '#BFDBFE' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: i === 0 ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: i === 0 ? '#FFFFFF' : ACCENT }}>{day.day}</span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>{day.title}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {(day.activities || []).map((act, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px', color: '#475569' }}>
                        <span style={{ color: ACCENT, fontWeight: 700, flexShrink: 0, lineHeight: 1.5 }}>→</span>
                        {act}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hotels */}
        {cur.hotels?.length > 0 && (
          <section aria-label="Empfohlene Hotels" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="KI-Empfehlungen" title="Empfohlene Hotels" icon={Building2} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: '8px', marginBottom: '10px' }}>
              {cur.hotels.map((hotel, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '12px', background: i === 0 ? 'linear-gradient(135deg,#EFF6FF,#ECFEFF)' : '#F8FAFF', border: `1.5px solid ${i === 0 ? '#BFDBFE' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '3px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>{hotel.name}</div>
                    {hotel.pricePerNight && (
                      <div style={{ padding: '2px 8px', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '11px', fontWeight: 700, color: '#15803D', whiteSpace: 'nowrap', flexShrink: 0 }}>{hotel.pricePerNight}</div>
                    )}
                  </div>
                  {hotel.category && <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '3px' }}>{hotel.category}</div>}
                  {hotel.why && <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic', lineHeight: 1.4 }}>{hotel.why}</div>}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a href={goUrl('trivago', cur.trivagoUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', background: 'linear-gradient(135deg,#d00e17,#ff4d57)', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <Building2 size={13} strokeWidth={2} /> Trivago
              </a>
              <a href={goUrl('booking', cur.bookingUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', background: 'linear-gradient(135deg,#003580,#0057b8)', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <Building2 size={13} strokeWidth={2} /> Booking.com
              </a>
            </div>
          </section>
        )}

        {/* Aktivitäten */}
        {cur.activities?.length > 0 && (
          <section aria-label="Empfohlene Aktivitäten" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Aktivitäten" title="Perfekt für dich ausgewählt" icon={Compass} iconColor="#EA580C" iconBg="#FFF7ED" iconBorder="#FED7AA" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '8px', marginBottom: '10px' }}>
              {cur.activities.map((act, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '12px', background: '#F8FAFF', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '1px' }}>{act.category}</div>
                    {act.price && <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748B' }}>{act.price}</div>}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '3px', fontFamily: 'var(--font-heading)', lineHeight: 1.3 }}>{act.name}</div>
                  {act.why && <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic', lineHeight: 1.4 }}>{act.why}</div>}
                </div>
              ))}
            </div>
            <a href={goUrl('getyourguide', cur.gygUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'linear-gradient(135deg,#FF5533,#FF8C00)', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
              <Compass size={13} strokeWidth={2} />
              Alle Aktivitäten in {cur.destination} – GetYourGuide
            </a>
          </section>
        )}

        {/* Kostenschätzung — kompakt horizontal */}
        {cur.costEstimate && (
          <section aria-label="Kostenschätzung" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Budget-Übersicht" title="Kostenschätzung für deine Reise" icon={Euro} iconColor="#15803D" iconBg="#F0FDF4" iconBorder="#BBF7D0" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: '8px', alignItems: 'stretch' }}>
              {[
                { label: 'Flug',        value: cur.costEstimate.flight,     icon: '✈️', note: 'p.P.' },
                { label: 'Unterkunft',  value: cur.costEstimate.hotel,      icon: '🏨', note: 'gesamt' },
                { label: 'Aktivitäten', value: cur.costEstimate.activities, icon: '🎯', note: 'gesamt' },
              ].filter(r => r.value && r.value !== '0€').map((row, i) => (
                <div key={i} style={{ padding: '14px 10px', borderRadius: '13px', background: '#F8FAFF', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', marginBottom: '5px' }}>{row.icon}</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{row.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{row.value}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>{row.note}</div>
                </div>
              ))}
              {cur.costEstimate.total && (
                <div style={{ padding: '14px 10px', borderRadius: '13px', background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '2px solid #BFDBFE', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', marginBottom: '5px' }}>💎</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Gesamt</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284C7', lineHeight: 1.2, fontFamily: 'var(--font-heading)' }}>{cur.costEstimate.total}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>pro Person</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>
              * Schätzwerte basieren auf durchschnittlichen Preisen. Tatsächliche Preise können abweichen.
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* BOTTOM 4-COLUMN GRID: Chat | Flüge | Mietwagen | CTAs            */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px', marginBottom: '12px', alignItems: 'start' }}>

          {/* Chat */}
          <section aria-label="KI-Reiseberater" style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            <SectionTitle label="KI-Reiseberater" title={`Frag mich zu ${cur.destination}`} icon={MessageCircle} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
              {['Beste Reisezeit?', 'Geheimtipps?', 'Sicherheit?', 'Lokales Essen?'].map(q => (
                <button key={q} onClick={() => setChatInput(q)} style={{ padding: '4px 9px', borderRadius: '20px', border: '1px solid #BFDBFE', background: '#F0F9FF', color: '#0284C7', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{q}</button>
              ))}
            </div>
            <div style={{ flex: 1, minHeight: '80px', maxHeight: '200px', overflowY: 'auto', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '18px 0', color: '#94A3B8', fontSize: '12px', lineHeight: 1.6 }}>
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>💬</div>
                  Fragen zu <strong style={{ color: '#475569' }}>{cur.destination}</strong>?
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '88%', padding: '8px 12px', borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px', background: msg.role === 'user' ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F8FAFF', border: msg.role === 'user' ? 'none' : '1px solid #E2E8F0', fontSize: '12px', color: msg.role === 'user' ? '#FFFFFF' : '#334155', lineHeight: 1.5 }}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display: 'flex' }}>
                  <div style={{ padding: '8px 14px', borderRadius: '12px 12px 12px 4px', background: '#F8FAFF', border: '1px solid #E2E8F0', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map(n => <div key={n} style={{ width: '5px', height: '5px', borderRadius: '50%', background: ACCENT, animation: `blink 1.2s ${n * 0.2}s step-end infinite` }} />)}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()} placeholder={`Stell mir deine Frage zu ${cur.destination}...`} style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#F8FAFF', fontSize: '12px', color: '#0F172A', outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={sendChat} disabled={!chatInput.trim() || chatLoading} style={{ padding: '9px 13px', borderRadius: '10px', border: 'none', background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F1F5F9', color: chatInput.trim() && !chatLoading ? '#FFFFFF' : '#94A3B8', cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={13} strokeWidth={2} />
              </button>
            </div>
          </section>

          {/* Flüge */}
          <section aria-label="Empfohlene Flüge" style={card}>
            <SectionTitle label="Flüge buchen" title="Empfohlene Flüge" icon={Plane} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', marginBottom: '10px' }}>
              <span style={{ fontSize: '22px' }}>✈️</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Direktflüge nach {cur.destination}</div>
                {cur.flightTime && <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{cur.flightTime} · via Skyscanner</div>}
              </div>
            </div>
            <a href={goUrl('skyscanner', cur.skyUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: 'linear-gradient(135deg,#0770e3,#00a0de)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
              <Plane size={13} strokeWidth={2} />
              Flüge nach {cur.destination} suchen
              <ArrowRight size={13} strokeWidth={2.5} style={{ marginLeft: 'auto' }} />
            </a>
          </section>

          {/* Mietwagen */}
          {cur.carRental && (
            <section aria-label="Mietwagen" style={card}>
              <SectionTitle label="Mobilität vor Ort" title="Mietwagen" icon={Car} iconColor="#7C3AED" iconBg="#F5F3FF" iconBorder="#DDD6FE" />
              <div style={{ padding: '12px', borderRadius: '12px', background: cur.carRental.recommended ? '#F0FDF4' : '#F8FAFF', border: `1.5px solid ${cur.carRental.recommended ? '#BBF7D0' : '#E2E8F0'}`, marginBottom: cur.carRental.recommended ? '10px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{cur.carRental.recommended ? '🚗' : 'ℹ️'}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>{cur.carRental.recommended ? 'Mietwagen empfohlen' : 'Kein Mietwagen nötig'}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{cur.carRental.reason}</div>
                  </div>
                </div>
              </div>
              {cur.carRental.recommended && (
                <a href={goUrl('check24', cur.check24Url)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: 'linear-gradient(135deg,#003399,#e30613)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                  <Car size={13} strokeWidth={2} /> Mietwagen – CHECK24
                </a>
              )}
            </section>
          )}

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href={goUrl('check24', cur.check24Url)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', background: 'linear-gradient(135deg,#003399,#e30613)', color: '#FFFFFF', borderRadius: '14px', textDecoration: 'none', fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 16px rgba(227,6,19,0.22)' }}>
              <Briefcase size={15} strokeWidth={2} />
              Pauschalreise nach {cur.destination} – CHECK24
              <ArrowRight size={13} strokeWidth={2.5} style={{ marginLeft: 'auto' }} />
            </a>

            <div style={{ ...card, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#DBEAFE', border: '1.5px solid #93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={16} strokeWidth={1.5} color="#0284C7" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Reiseplan per Mail erhalten</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Wöchentlich Deals & Inspiration</div>
              </div>
              <button onClick={onEmail} style={{ padding: '8px 13px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#FFFFFF', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 3px 10px rgba(14,165,233,0.3)' }}>
                Kostenlos →
              </button>
            </div>

            <button onClick={() => setShowShare(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Share2 size={13} strokeWidth={2} /> Traumreise teilen
            </button>

            <button onClick={onReset} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <RotateCcw size={11} strokeWidth={2} /> Neue Suche starten
            </button>
          </div>

        </div>
        {/* end bottom grid */}

      </div>
      {/* end per-destination */}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* PACKLISTE — global                                                   */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {packingList && (
        <section aria-label="KI-Packliste" style={{ ...card, marginBottom: '12px' }}>
          <SectionTitle label="KI-Packliste" title="Was du einpacken solltest" icon={Backpack} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: '6px' }}>
            {packCategories.map(cat => {
              const items = packingList[cat.key] || [];
              if (!items.length) return null;
              const isOpen = openPackCategory === cat.key;
              return (
                <div key={cat.key} style={{ borderRadius: '10px', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                  <button onClick={() => setOpenPackCategory(isOpen ? null : cat.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: isOpen ? '#EFF6FF' : '#F8FAFF', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    <span style={{ fontSize: '15px', flexShrink: 0 }}>{cat.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>{items.length}</span>
                    {isOpen ? <ChevronUp size={12} strokeWidth={2.5} color="#94A3B8" /> : <ChevronDown size={12} strokeWidth={2.5} color="#94A3B8" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '10px 12px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {items.map((item, i) => (
                          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 9px', borderRadius: '20px', background: '#F8FAFF', border: '1px solid #E2E8F0', fontSize: '11px', color: '#334155', fontWeight: 500 }}>
                            <CheckCircle2 size={9} strokeWidth={2.5} color={ACCENT} />
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

      <div style={{ fontSize: '11px', color: '#CBD5E1', textAlign: 'center', paddingBottom: '16px' }}>
        * Affiliate-Links – für dich entstehen keine Mehrkosten
      </div>

      {showShare && (
        <ShareModal destination={cur.destination} country={cur.country} tagline={cur.tagline} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}
