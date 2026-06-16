'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, Sparkles, Share2, CheckCircle2,
  MapPin, Mail, RotateCcw, Plane, Compass, Briefcase,
  Car, CalendarDays, Backpack, Sun, ChevronDown, ChevronUp,
  Send, MessageCircle, Euro, Wallet, Gem, Hotel, MapPinned,
  Info, FileText, Shirt, Smartphone, Heart, Package, Award,
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
  if (!rawUrl) return undefined;
  if (process.env.NODE_ENV !== 'production') {
    console.log('[AFFILIATE_BUTTON_HREF]', { component: 'TravelResultView', provider });
  }
  return `/go/${provider}?url=${encodeURIComponent(rawUrl)}`;
}

// Strips emoji and extra whitespace from a string
const stripEmoji = str => str.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim();

// Split at first German connector with whitespace on both sides — everything before is a complete noun phrase
const CHIP_CONNECTOR_RX = /\s+(?:und|oder|mit|sowie|für|durch|über|unter|neben|zwischen|aber|sondern|an|in|auf|von|zu|nach|bei|am|im|zum|zur)\s+/i;

function chipify(text) {
  const clean = stripEmoji(text.replace(/^[^\wäöüÄÖÜ]+/, ''));
  const idx = clean.search(CHIP_CONNECTOR_RX);
  const phrase = (idx > 2 ? clean.slice(0, idx) : clean).trim();
  return phrase.split(/\s+/).slice(0, 4).join(' ').replace(/[.,!?:;–—]$/, '');
}

function getMatchReasons(result, personality, interests) {
  const seen = new Set();
  const out = [];
  for (const h of (result.highlights || []).slice(0, 3)) {
    const short = chipify(h);
    if (short.length >= 3 && !seen.has(short)) { seen.add(short); out.push(short); }
    if (out.length === 3) break;
  }
  for (const t of (personality?.types || []).slice(0, 1)) {
    if (!seen.has(t)) { seen.add(t); out.push(t); }
  }
  return out.slice(0, 4);
}

function buildWhyWon(result, personality, matchPct) {
  const reasons = [];
  (result.highlights || []).slice(0, 3).forEach(h => reasons.push(h));
  if (personality?.types?.[0]) reasons.push(`Passt perfekt zum Reiseprofil: ${personality.types[0]}`);
  if (result.budgetPerDay) reasons.push(`Attraktives Budget: ab ${result.budgetPerDay}`);
  else reasons.push('Hervorragendes Preis-Leistungs-Verhältnis');
  if (reasons.length < 5) reasons.push(`${matchPct}% Übereinstimmung mit deinen Reisewünschen`);
  return reasons.slice(0, 5);
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
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#94A3B8', fontSize: 24, cursor: 'pointer', lineHeight: 1 }}>×</button>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>{destination}</div>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>{country}</div>
        <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, marginBottom: 22, fontStyle: 'italic' }}>„{tagline}"</div>
        <button type="button" onClick={share} style={{ width: '100%', padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Share2 size={16} strokeWidth={2} /> Traumreise teilen
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

function InlineSkeleton({ message }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '12px', background: '#F8FAFF', border: '1px dashed #BAE6FD', color: '#64748B', fontSize: '13px', fontWeight: 500 }}>
      <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #BFDBFE', borderTopColor: '#0EA5E9', animation: 'spin 0.9s linear infinite', flexShrink: 0 }} />
      {message}
    </div>
  );
}

function NextStepCard({ result, onEmail }) {
  const s = JSON.stringify(result).toLowerCase();
  const isBeach  = /strand|beach|meer|sea|island|küste|insel/.test(s);
  const needsCar = result.carRental?.recommended;
  let step, reason, StepIcon, iconBg, iconColor, cta1, cta2;
  if (isBeach) {
    step = `Unterkunft in ${result.destination} sichern`;
    reason = 'Gute Strandunterkünfte sind schnell ausgebucht – besonders in der Hochsaison lohnt frühes Buchen.';
    StepIcon = Hotel; iconBg = '#F3E8FF'; iconColor = '#7C3AED';
    cta1 = { label: 'Hotels prüfen', href: result.trivagoUrl || result.bookingUrl, provider: 'trivago' };
    cta2 = { label: 'Flüge vergleichen', href: result.skyUrl, provider: 'skyscanner' };
  } else if (needsCar) {
    step = `Flug + Mietwagen für ${result.destination} kombinieren`;
    reason = 'Ein Kombipaket ist oft günstiger als einzeln buchen – und gibt maximale Freiheit vor Ort.';
    StepIcon = Car; iconBg = '#FEE2E2'; iconColor = '#DC2626';
    cta1 = { label: 'Mietwagen + Flug – CHECK24', href: result.check24Url, provider: 'check24' };
    cta2 = { label: 'Nur Flüge', href: result.skyUrl, provider: 'skyscanner' };
  } else {
    step = `Flüge nach ${result.destination} vergleichen`;
    reason = 'Gute Preise entstehen oft Wochen vor dem Abflug – ein früher Vergleich zahlt sich aus.';
    StepIcon = Plane; iconBg = '#DBEAFE'; iconColor = '#1D4ED8';
    cta1 = { label: 'Flüge suchen – Skyscanner', href: result.skyUrl, provider: 'skyscanner' };
    cta2 = { label: 'Hotels prüfen', href: result.bookingUrl, provider: 'booking' };
  }
  return (
    <section aria-label="Nächster Schritt" style={{ marginBottom: '12px', borderRadius: '18px', padding: '20px 22px', background: 'linear-gradient(135deg,#0F172A 0%,#1E293B 100%)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(14,165,233,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ArrowRight size={13} strokeWidth={2.5} color="#38BDF8" />
          </div>
          <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#38BDF8', fontFamily: 'var(--font-heading)' }}>Dein sinnvollster nächster Schritt</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', borderRadius: '13px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', marginBottom: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <StepIcon size={17} strokeWidth={1.75} color={iconColor} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#F8FAFC', marginBottom: '4px', fontFamily: 'var(--font-heading)', lineHeight: 1.35 }}>{step}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.6 }}>{reason}</div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <a href={goUrl(cta1.provider, cta1.href)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px 12px', borderRadius: '11px', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#FFFFFF', textDecoration: 'none', fontSize: '12px', fontWeight: 700, textAlign: 'center' }}>
            <StepIcon size={12} strokeWidth={2} />{cta1.label}
          </a>
          <a href={goUrl(cta2.provider, cta2.href)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px 12px', borderRadius: '11px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#E2E8F0', textDecoration: 'none', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
            {cta2.label}
          </a>
        </div>
      </div>
    </section>
  );
}

function getProfileCardData(typeStr) {
  const lower = typeStr.toLowerCase();
  if (/romantik|paar|zweisamkeit|liebe|herz|couple|romance/.test(lower))
    return { Icon: Heart,      iconColor: '#E11D48', iconBg: '#FFF1F2', iconBorder: '#FECDD3' };
  if (/genuss|kulinar|essen|café|kaffee|wein|speise|food|gourmet/.test(lower))
    return { Icon: Euro,       iconColor: '#D97706', iconBg: '#FFFBEB', iconBorder: '#FDE68A' };
  if (/kultur|museum|architektur|geschichte|kunst|heritage|historic/.test(lower))
    return { Icon: MapPinned,  iconColor: '#7C3AED', iconBg: '#F5F3FF', iconBorder: '#DDD6FE' };
  if (/abenteuer|aktiv|outdoor|sport|wandern|trekking|adventure/.test(lower))
    return { Icon: Compass,    iconColor: '#EA580C', iconBg: '#FFF7ED', iconBorder: '#FED7AA' };
  if (/wellness|spa|erholung|entspann|ruhe|yoga|relax/.test(lower))
    return { Icon: Sparkles,   iconColor: '#0EA5E9', iconBg: '#EFF6FF', iconBorder: '#BFDBFE' };
  if (/natur|berg|strand|meer|wald|see|landschaft|nature/.test(lower))
    return { Icon: Sun,        iconColor: '#16A34A', iconBg: '#F0FDF4', iconBorder: '#BBF7D0' };
  if (/city|stadt|urban|metro|nightlife|städte/.test(lower))
    return { Icon: MapPinned,  iconColor: '#0284C7', iconBg: '#EFF6FF', iconBorder: '#BFDBFE' };
  if (/budget|preis|günstig|sparen/.test(lower))
    return { Icon: Wallet,     iconColor: '#15803D', iconBg: '#F0FDF4', iconBorder: '#BBF7D0' };
  return   { Icon: Award,      iconColor: '#0EA5E9', iconBg: '#EFF6FF', iconBorder: '#BFDBFE' };
}

function MonkeyVisual() {
  const [imgError, setImgError] = useState(false);
  return (
    <div style={{ flex: '0 0 clamp(140px,26%,196px)', borderRadius: '18px', overflow: 'hidden', background: 'linear-gradient(160deg,#EFF6FF 0%,#DBEAFE 60%,#ECFEFF 100%)', border: '1.5px solid #BFDBFE', boxShadow: '0 4px 24px rgba(14,165,233,0.14)', alignSelf: 'stretch', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {!imgError ? (
        <img
          src="/images/travel-profile-monkey.png"
          alt="ApeAround Reisemonkey"
          onError={() => setImgError(true)}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', display: 'block', position: 'absolute', inset: 0 }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px', color: '#93C5FD' }}>
          <Compass size={38} strokeWidth={1.25} color="#93C5FD" />
          <MapPin  size={26} strokeWidth={1.25} color="#BFDBFE" />
          <Heart   size={20} strokeWidth={1.25} color="#DBEAFE" />
          <Sparkles size={16} strokeWidth={1.25} color="#EFF6FF" />
        </div>
      )}
    </div>
  );
}

const HOTEL_GRADIENTS = [
  'linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)',
  'linear-gradient(135deg,#1E1B4B 0%,#3730A3 100%)',
  'linear-gradient(135deg,#064E3B 0%,#065F46 100%)',
];

export default function TravelResultView({ results, personality, interests, packingList, surprise, duration, budget, phase2Loading, onReset, onEmail }) {
  const [idx, setIdx]                           = useState(0);
  const [showShare, setShowShare]               = useState(false);
  const [openPackCategory, setOpenPackCategory] = useState(null);
  const [chatMessages, setChatMessages]         = useState([]);
  const [chatInput, setChatInput]               = useState('');
  const [chatLoading, setChatLoading]           = useState(false);
  const chatEndRef = useRef(null);

  const cur   = results[idx];
  const match = MATCHES[Math.min(idx, MATCHES.length - 1)];

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages]);
  useEffect(() => { setChatMessages([]); }, [idx]);

  function getDestImage(r, i) {
    const moodId   = interests[i % Math.max(interests.length, 1)];
    const heroMood = moodOptions.find(m => m.id === moodId) || moodOptions[0];
    const fallback = heroMood.imageUrl.replace('w=600', 'w=1400').replace('q=80', 'q=88');
    return getDestinationImage(r.destination, fallback, r.country, { interest: moodId, resultType: 'travel-finder' });
  }

  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg     = { role: 'user', content: chatInput.trim() };
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
    { key: 'documents', label: 'Dokumente',  Icon: FileText,   color: '#0284C7' },
    { key: 'clothes',   label: 'Kleidung',   Icon: Shirt,      color: '#7C3AED' },
    { key: 'tech',      label: 'Technik',    Icon: Smartphone, color: '#0EA5E9' },
    { key: 'health',    label: 'Gesundheit', Icon: Heart,      color: '#E11D48' },
    { key: 'misc',      label: 'Sonstiges',  Icon: Package,    color: '#EA580C' },
  ];

  const moodLabels = (interests || []).map(id => moodOptions.find(m => m.id === id)?.label).filter(Boolean);

  const profileCards = [
    ...(personality?.types || []).map(t => stripEmoji(t).trim()).filter(t => t.length > 2),
    ...moodLabels.filter(l => !(personality?.types || []).some(t => stripEmoji(t).toLowerCase().includes(l.toLowerCase()))),
  ].slice(0, 4).map(title => ({ title, ...getProfileCardData(title) }));

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: 'clamp(12px,4vw,28px)', animation: 'fadeUp .4s cubic-bezier(0.16,1,0.3,1) both' }}>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'TravelDestination', name: cur.destination, description: cur.tagline, containedInPlace: { '@type': 'Country', name: cur.country } }) }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section
        aria-label={`${cur.destination} – Empfehlung`}
        style={{ position: 'relative', height: 'clamp(280px,42vw,460px)', borderRadius: '24px', overflow: 'hidden', marginBottom: '14px' }}
      >
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getDestImage(cur, idx)})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 0.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,rgba(0,0,0,0.06) 0%,rgba(0,0,0,0.35) 35%,rgba(0,0,0,0.84) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'clamp(18px,4vw,36px)' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 13px', borderRadius: '20px', background: match.color + 'dd', fontSize: '12px', fontWeight: 700, color: '#fff', backdropFilter: 'blur(6px)' }}>
              <Award size={11} strokeWidth={2.5} /> {match.pct}% Übereinstimmung
            </span>
          </div>
          <h1 style={{ margin: '0 0 5px', fontSize: 'clamp(26px,5vw,52px)', fontWeight: 900, color: '#FFFFFF', fontFamily: 'var(--font-heading)', lineHeight: 1.05, textShadow: '0 2px 24px rgba(0,0,0,0.6)' }}>
            {cur.destination}
          </h1>
          <div style={{ fontSize: 'clamp(12px,1.8vw,15px)', color: 'rgba(255,255,255,0.78)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} strokeWidth={2.5} />{cur.country}</span>
            {cur.flightTime && <span style={{ opacity: 0.7 }}>· {cur.flightTime} Flug</span>}
            {cur.weather && <span style={{ opacity: 0.7 }}>· {cur.weather}</span>}
          </div>
          {cur.tagline && (
            <p style={{ margin: '0 0 18px', fontSize: 'clamp(13px,1.8vw,16px)', color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, fontWeight: 500, maxWidth: '580px', fontStyle: 'italic', textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              „{cur.tagline}"
            </p>
          )}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href={goUrl('skyscanner', cur.skyUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '12px', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 16px rgba(14,165,233,0.4)' }}>
              <Plane size={13} strokeWidth={2} /> Flüge finden
            </a>
            <a href={goUrl('booking', cur.bookingUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '11px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, backdropFilter: 'blur(8px)' }}>
              <Hotel size={13} strokeWidth={2} /> Hotels ansehen
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          TOP 3 DESTINATION CARDS
      ════════════════════════════════════════════════════════════════════════ */}
      <section aria-label="Deine Top 3 Traumziele" style={{ ...card, marginBottom: '14px' }}>
        <SectionTitle label="ApeAround-Empfehlungen" title="Deine Top 3 Traumziele" icon={MapPin} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px' }}>
          {results.map((r, i) => {
            const m      = MATCHES[Math.min(i, MATCHES.length - 1)];
            const active = i === idx;
            return (
              <button
                type="button"
                key={i}
                onClick={() => setIdx(i)}
                style={{ position: 'relative', height: '210px', borderRadius: '16px', overflow: 'hidden', border: `2.5px solid ${active ? '#0EA5E9' : 'transparent'}`, cursor: 'pointer', padding: 0, background: '#0F172A', boxShadow: active ? '0 0 0 4px rgba(14,165,233,0.2),0 8px 32px rgba(0,0,0,0.2)' : '0 4px 16px rgba(0,0,0,0.1)', transition: 'all 0.22s ease', fontFamily: 'inherit' }}
              >
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${getDestImage(r, i)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.02) 0%,rgba(0,0,0,0.22) 40%,rgba(0,0,0,0.85) 100%)' }} />
                <div style={{ position: 'absolute', top: '10px', left: '10px', width: '28px', height: '28px', borderRadius: '50%', background: active ? '#0EA5E9' : 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', border: active ? 'none' : '1px solid rgba(255,255,255,0.38)' }}>
                  {i + 1}
                </div>
                <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 9px', borderRadius: '20px', background: m.color + 'dd', fontSize: '11px', fontWeight: 700, color: '#FFFFFF', backdropFilter: 'blur(4px)' }}>
                  {m.pct}%
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px 14px', textAlign: 'left' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', lineHeight: 1.1, textShadow: '0 1px 6px rgba(0,0,0,0.5)', marginBottom: '3px' }}>{r.destination}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.72)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: r.tagline ? '5px' : 0 }}>
                    <MapPin size={8} strokeWidth={2.5} />{r.country}
                    {r.flightTime && <span style={{ opacity: 0.75 }}>· {r.flightTime}</span>}
                  </div>
                  {r.tagline && (
                    <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.58)', lineHeight: 1.4, fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {r.tagline}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Warum es zu dir passt – premium list cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '10px', marginTop: '14px' }}>
          {results.map((r, i) => {
            const highlights = (r.highlights || [])
              .slice(0, 3)
              .map(h => stripEmoji(h).replace(/^[^\wäöüÄÖÜ]+/, '').replace(/[.,!?;]$/, '').trim())
              .filter(h => h.length > 3);
            if (!highlights.length) return null;
            const m = MATCHES[Math.min(i, MATCHES.length - 1)];
            return (
              <div key={i} style={{ background: m.bg, border: `1.5px solid ${m.border}`, borderRadius: '14px', padding: '14px 16px', boxShadow: `0 2px 12px ${m.color}18` }}>
                <div style={{ fontSize: '9px', fontWeight: 700, color: m.color, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle2 size={9} strokeWidth={2.5} color={m.color} /> Warum {r.destination} zu dir passt
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {highlights.map((h, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ width: '5px', height: '5px', minWidth: '5px', borderRadius: '50%', background: m.color, marginTop: '7px', flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: '#1E293B', lineHeight: 1.6, fontWeight: 500 }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PER-DESTINATION ANIMATED CONTENT
      ════════════════════════════════════════════════════════════════════════ */}
      <div key={idx} style={{ animation: 'fadeUp .3s cubic-bezier(0.16,1,0.3,1) both' }}>

        {/* ── WHY PERFECT + WHY WON ──────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>

          {personality && (
            <section aria-label="Warum diese Reise passt" style={{ ...card }}>
              <SectionTitle label="Dein Reiseprofil" title="Warum diese Reise perfekt zu dir passt" icon={Compass} />
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* LEFT – profile mini-cards + quote */}
                <div style={{ flex: '1 1 220px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {profileCards.map(({ Icon, iconColor, iconBg, iconBorder, title }, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 14px', borderRadius: '12px', background: '#F8FAFF', border: '1.5px solid #BFDBFE', boxShadow: '0 1px 6px rgba(14,165,233,0.06)' }}>
                      <div style={{ width: '34px', height: '34px', minWidth: '34px', borderRadius: '10px', background: iconBg, border: `1px solid ${iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={15} strokeWidth={1.75} color={iconColor} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.35 }}>{title}</span>
                    </div>
                  ))}
                  {personality.summary && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '4px', padding: '12px 14px', borderRadius: '10px', background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '1px solid #BFDBFE' }}>
                      <div style={{ width: '3px', minWidth: '3px', borderRadius: '2px', background: 'linear-gradient(to bottom,#0EA5E9,#06B6D4)', alignSelf: 'stretch' }} />
                      <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: '#1E40AF', lineHeight: 1.7, fontWeight: 500 }}>
                        „{stripEmoji(personality.summary)}"
                      </p>
                    </div>
                  )}
                </div>
                {/* RIGHT – monkey image */}
                <MonkeyVisual />
              </div>
            </section>
          )}

          <section aria-label="Warum Platz 1" style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            <SectionTitle
              label="ApeAround-Analyse"
              title={idx === 0 ? `Warum ${cur.destination} auf Platz 1 ist` : `Was ${cur.destination} überzeugt`}
              icon={Award} iconColor="#16A34A" iconBg="#F0FDF4" iconBorder="#86EFAC"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {buildWhyWon(cur, personality, match.pct).map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', padding: '9px 11px', borderRadius: '10px', background: '#F0FDF4', border: '1px solid #DCFCE7' }}>
                  <CheckCircle2 size={13} strokeWidth={2.5} color="#16A34A" style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span style={{ fontSize: '12px', color: '#166534', fontWeight: 500, lineHeight: 1.5 }}>{r}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── DETAILS STRIP ───────────────────────────────────────────────── */}
        {(cur.weather || cur.flightTime || cur.budgetPerDay || cur.highlights?.length > 0) && (
          <section aria-label="Reiseziel-Details" style={{ ...card, marginBottom: '12px' }}>
            {(cur.weather || cur.flightTime || cur.budgetPerDay) && (
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${[cur.weather, cur.flightTime, cur.budgetPerDay].filter(Boolean).length},1fr)`, gap: '10px', marginBottom: cur.highlights?.length > 0 ? '12px' : 0 }}>
                {cur.weather && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sun size={16} strokeWidth={2} color="#D97706" /></div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Wetter</div>
                      <div style={{ fontSize: '13px', color: '#78350F', fontWeight: 600 }}>{cur.weather}</div>
                    </div>
                  </div>
                )}
                {cur.flightTime && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Plane size={16} strokeWidth={2} color="#1D4ED8" /></div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Flugzeit</div>
                      <div style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: 600 }}>{cur.flightTime}</div>
                    </div>
                  </div>
                )}
                {cur.budgetPerDay && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Wallet size={16} strokeWidth={2} color="#15803D" /></div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>Budget/Tag</div>
                      <div style={{ fontSize: '13px', color: '#14532D', fontWeight: 600 }}>{cur.budgetPerDay}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {cur.highlights?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {cur.highlights.map((h, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', fontSize: '12px', color: '#374155' }}>
                    <CheckCircle2 size={11} strokeWidth={2} color={ACCENT} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {h}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── HOTELS ─────────────────────────────────────────────────────── */}
        {!cur.hotels?.length && phase2Loading && (
          <div style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="ApeAround-Empfehlungen" title="Empfohlene Hotels" icon={Hotel} />
            <InlineSkeleton message="Hotelvorschläge werden geladen…" />
          </div>
        )}
        {cur.hotels?.length > 0 && (
          <section aria-label="Empfohlene Hotels" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="ApeAround-Empfehlungen" title="Empfohlene Hotels" icon={Hotel} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '12px', marginBottom: '12px' }}>
              {cur.hotels.map((hotel, i) => (
                <div key={i} style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 2px 12px rgba(15,23,42,0.07)' }}>
                  <div style={{ height: '110px', background: HOTEL_GRADIENTS[i % HOTEL_GRADIENTS.length], position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Hotel size={22} strokeWidth={1.5} color="rgba(255,255,255,0.88)" />
                    </div>
                    {hotel.pricePerNight && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '8px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', fontSize: '12px', fontWeight: 700, color: '#FFFFFF' }}>{hotel.pricePerNight}</div>
                    )}
                    {i === 0 && <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 9px', borderRadius: '8px', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', fontSize: '10px', fontWeight: 700, color: '#FFFFFF' }}>Top Pick</div>}
                  </div>
                  <div style={{ padding: '13px 15px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)', marginBottom: '3px', lineHeight: 1.3 }}>{hotel.name}</div>
                    {hotel.category && <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '6px' }}>{hotel.category}</div>}
                    {hotel.why && <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, fontStyle: 'italic' }}>{hotel.why}</div>}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <a href={goUrl('trivago', cur.trivagoUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', background: 'linear-gradient(135deg,#d00e17,#ff4d57)', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <Hotel size={13} strokeWidth={2} /> Trivago
              </a>
              <a href={goUrl('booking', cur.bookingUrl)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '10px', background: 'linear-gradient(135deg,#003580,#0057b8)', color: '#FFFFFF', borderRadius: '10px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
                <Hotel size={13} strokeWidth={2} /> Booking.com
              </a>
            </div>
          </section>
        )}

        {/* ── REISEPLAN (TIMELINE) ────────────────────────────────────────── */}
        {!cur.itinerary?.length && phase2Loading && (
          <div style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Dein Reiseplan" title="Reiseplan wird erstellt…" icon={CalendarDays} />
            <InlineSkeleton message="Reiseplan wird erstellt… Einen kurzen Augenblick noch." />
          </div>
        )}
        {cur.itinerary?.length > 0 && (
          <section aria-label="Dein Reiseplan" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Dein Reiseplan" title={`${cur.destination} – Tag für Tag`} icon={CalendarDays} />
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
              <div style={{ position: 'absolute', left: '11px', top: '12px', bottom: '12px', width: '2px', background: 'linear-gradient(to bottom,#0EA5E9 0%,#E2E8F0 100%)', borderRadius: '1px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {cur.itinerary.map((day, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-23px', top: '2px', width: '18px', height: '18px', borderRadius: '50%', background: i === 0 ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#FFFFFF', border: `2px solid ${i === 0 ? '#0EA5E9' : '#BFDBFE'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                      {i === 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF' }} />}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '7px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.8px', flexShrink: 0 }}>Tag {day.day}</span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)' }}>{day.title}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      {(day.activities || []).map((act, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#CBD5E1', flexShrink: 0, marginTop: '7px' }} />
                          {act}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── AKTIVITÄTEN ─────────────────────────────────────────────────── */}
        {!cur.activities?.length && phase2Loading && (
          <div style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Aktivitäten" title="Perfekt für dich ausgewählt" icon={MapPinned} iconColor="#EA580C" iconBg="#FFF7ED" iconBorder="#FED7AA" />
            <InlineSkeleton message="Aktivitäten werden geladen…" />
          </div>
        )}
        {cur.activities?.length > 0 && (
          <section aria-label="Empfohlene Aktivitäten" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Aktivitäten" title="Perfekt für dich ausgewählt" icon={MapPinned} iconColor="#EA580C" iconBg="#FFF7ED" iconBorder="#FED7AA" />
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
              <MapPinned size={13} strokeWidth={2} /> Alle Aktivitäten in {cur.destination} – GetYourGuide
            </a>
          </section>
        )}

        {/* ── GEHEIMTIPP ──────────────────────────────────────────────────── */}
        {(cur.highlights?.length > 0 || (cur.activities?.length > 0 && !phase2Loading)) && (
          <section aria-label="ApeAround-Geheimtipp" style={{ ...card, marginBottom: '12px', background: 'linear-gradient(135deg,#FFFBEB 0%,#FFF7ED 100%)', border: '1.5px solid #FDE68A' }}>
            <SectionTitle label="ApeAround-Geheimtipp" title={`Unser Tipp für ${cur.destination}`} icon={Sparkles} iconColor="#D97706" iconBg="#FEF3C7" iconBorder="#FDE68A" />
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'linear-gradient(135deg,#F59E0B,#FBBF24)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={18} strokeWidth={1.5} color="#FFFFFF" />
              </div>
              <div style={{ flex: 1 }}>
                {cur.activities?.[1] && !phase2Loading ? (
                  <>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>{cur.activities[1].name}</div>
                    {cur.activities[1].why && <div style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.6 }}>{cur.activities[1].why}</div>}
                    {cur.activities[1].price && <div style={{ marginTop: '6px', display: 'inline-flex', padding: '2px 9px', borderRadius: '20px', background: '#FEF3C7', border: '1px solid #FDE68A', fontSize: '11px', color: '#92400E', fontWeight: 600 }}>{cur.activities[1].price}</div>}
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '4px', fontFamily: 'var(--font-heading)' }}>{cur.highlights?.[1] || cur.highlights?.[0] || cur.destination}</div>
                    <div style={{ fontSize: '12px', color: '#78350F', lineHeight: 1.6 }}>
                      {cur.highlights?.[2] || `${cur.destination} hat weit mehr zu bieten als die typischen Touristenpfade. Frag unseren KI-Reiseberater für persönliche Insidertipps.`}
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── KOSTENSCHÄTZUNG ─────────────────────────────────────────────── */}
        {cur.costEstimate && (
          <section aria-label="Kostenschätzung" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="Budget-Übersicht" title="Kostenschätzung für deine Reise" icon={Euro} iconColor="#15803D" iconBg="#F0FDF4" iconBorder="#BBF7D0" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: '8px', alignItems: 'stretch' }}>
              {[
                { label: 'Flug',        value: cur.costEstimate.flight,     Icon: Plane,     iconBg: '#DBEAFE', iconColor: '#1D4ED8', note: 'p.P.' },
                { label: 'Unterkunft',  value: cur.costEstimate.hotel,      Icon: Hotel,     iconBg: '#F3E8FF', iconColor: '#7C3AED', note: 'gesamt' },
                { label: 'Aktivitäten', value: cur.costEstimate.activities, Icon: MapPinned, iconBg: '#FEE2E2', iconColor: '#DC2626', note: 'gesamt' },
              ].filter(r => r.value && r.value !== '0€').map((row, i) => (
                <div key={i} style={{ padding: '14px 10px', borderRadius: '13px', background: '#F8FAFF', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: row.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <row.Icon size={15} strokeWidth={1.75} color={row.iconColor} />
                    </div>
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{row.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{row.value}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>{row.note}</div>
                </div>
              ))}
              {cur.costEstimate.total && (
                <div style={{ padding: '14px 10px', borderRadius: '13px', background: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', border: '2px solid #BFDBFE', textAlign: 'center' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Gem size={15} strokeWidth={1.75} color="#FFFFFF" />
                    </div>
                  </div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Gesamt</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0284C7', lineHeight: 1.2, fontFamily: 'var(--font-heading)' }}>{cur.costEstimate.total}</div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>pro Person</div>
                </div>
              )}
            </div>
            <div style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>* Schätzwerte basieren auf durchschnittlichen Preisen. Tatsächliche Preise können abweichen.</div>
          </section>
        )}

        <NextStepCard result={cur} onEmail={onEmail} />

        {/* ── BOTTOM GRID ─────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>

          {/* Chat */}
          <section aria-label="KI-Reiseberater" style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            <SectionTitle label="KI-Reiseberater" title={`Frag mich zu ${cur.destination}`} icon={MessageCircle} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
              {['Beste Reisezeit?', 'Geheimtipps?', 'Sicherheit?', 'Lokales Essen?'].map(q => (
                <button type="button" key={q} onClick={() => setChatInput(q)} style={{ padding: '4px 9px', borderRadius: '20px', border: '1px solid #BFDBFE', background: '#F0F9FF', color: '#0284C7', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{q}</button>
              ))}
            </div>
            <div style={{ flex: 1, minHeight: '80px', maxHeight: '200px', overflowY: 'auto', marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '18px 0', color: '#94A3B8', fontSize: '12px', lineHeight: 1.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageCircle size={16} strokeWidth={1.5} color={ACCENT} />
                    </div>
                  </div>
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
              <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()} placeholder={`Frag mich zu ${cur.destination}...`} style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#F8FAFF', fontSize: '12px', color: '#0F172A', outline: 'none', fontFamily: 'inherit' }} />
              <button type="button" onClick={sendChat} disabled={!chatInput.trim() || chatLoading} style={{ padding: '9px 13px', borderRadius: '10px', border: 'none', background: chatInput.trim() && !chatLoading ? 'linear-gradient(135deg,#0EA5E9,#06B6D4)' : '#F1F5F9', color: chatInput.trim() && !chatLoading ? '#FFFFFF' : '#94A3B8', cursor: chatInput.trim() && !chatLoading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Send size={13} strokeWidth={2} />
              </button>
            </div>
          </section>

          {/* Flüge */}
          <section aria-label="Empfohlene Flüge" style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            <SectionTitle label="Flüge buchen" title="Empfohlene Flüge" icon={Plane} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '12px', background: '#EFF6FF', border: '1.5px solid #BFDBFE', marginBottom: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg,#0770e3,#00a0de)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Plane size={16} strokeWidth={1.75} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>Direktflüge nach {cur.destination}</div>
                {cur.flightTime && <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{cur.flightTime} · via Skyscanner</div>}
              </div>
            </div>
            <a href={goUrl('skyscanner', cur.skyUrl)} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: 'linear-gradient(135deg,#0770e3,#00a0de)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
              <Plane size={13} strokeWidth={2} /> Flüge nach {cur.destination} suchen
              <ArrowRight size={13} strokeWidth={2.5} style={{ marginLeft: 'auto' }} />
            </a>
          </section>

          {/* Mietwagen */}
          {cur.carRental && (
            <section aria-label="Mietwagen" style={{ ...card, display: 'flex', flexDirection: 'column' }}>
              <SectionTitle label="Mobilität vor Ort" title="Mietwagen" icon={Car} iconColor="#7C3AED" iconBg="#F5F3FF" iconBorder="#DDD6FE" />
              <div style={{ padding: '12px', borderRadius: '12px', background: cur.carRental.recommended ? '#F0FDF4' : '#F8FAFF', border: `1.5px solid ${cur.carRental.recommended ? '#BBF7D0' : '#E2E8F0'}`, marginBottom: cur.carRental.recommended ? '10px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: cur.carRental.recommended ? '#DCFCE7' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    {cur.carRental.recommended ? <Car size={14} strokeWidth={2} color="#15803D" /> : <Info size={14} strokeWidth={2} color="#64748B" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '3px' }}>{cur.carRental.recommended ? 'Mietwagen empfohlen' : 'Kein Mietwagen nötig'}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{cur.carRental.reason}</div>
                  </div>
                </div>
              </div>
              {cur.carRental.recommended && (
                <a href={goUrl('check24', cur.check24Url)} target="_blank" rel="noopener noreferrer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 14px', background: 'linear-gradient(135deg,#003399,#e30613)', color: '#FFFFFF', borderRadius: '12px', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
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
              <button type="button" onClick={onEmail} style={{ padding: '8px 13px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', color: '#FFFFFF', fontWeight: 700, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, boxShadow: '0 3px 10px rgba(14,165,233,0.3)' }}>
                Kostenlos →
              </button>
            </div>
            <button type="button" onClick={() => setShowShare(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontWeight: 700, fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <Share2 size={13} strokeWidth={2} /> Traumreise teilen
            </button>
            <button type="button" onClick={onReset} style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
              <RotateCcw size={11} strokeWidth={2} /> Neue Suche starten
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          ÜBERRASCHUNGSZIEL (global)
      ════════════════════════════════════════════════════════════════════════ */}
      {surprise && (
        <section aria-label="Überraschungsziel" style={{ ...card, marginBottom: '12px', background: 'linear-gradient(135deg,#FDF4FF 0%,#F0F9FF 100%)', border: '1.5px solid #E9D5FF', display: 'flex', flexDirection: 'column' }}>
          <SectionTitle label="ApeAround-Überraschung" title="Dein geheimes Traumziel" icon={Sparkles} iconColor="#A855F7" iconBg="#F3E8FF" iconBorder="#E9D5FF" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '13px', background: 'linear-gradient(135deg,#A855F7,#7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={18} strokeWidth={1.5} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#7C3AED', fontFamily: 'var(--font-heading)', lineHeight: 1.1 }}>{surprise.destination}</div>
              <div style={{ fontSize: '11px', color: '#A78BFA', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                <MapPin size={9} strokeWidth={2.5} />{surprise.country}
              </div>
            </div>
          </div>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontStyle: 'italic', color: '#6B21A8', lineHeight: 1.6, fontWeight: 500 }}>„{surprise.tagline}"</p>
          {surprise.whySurprising && (
            <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.7)', border: '1px solid #DDD6FE', fontSize: '12px', color: '#4C1D95', lineHeight: 1.55 }}>
              <strong style={{ color: '#7C3AED' }}>Warum überraschend? </strong>{surprise.whySurprising}
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          PACKLISTE (global)
      ════════════════════════════════════════════════════════════════════════ */}
      {!packingList && phase2Loading && (
        <div style={{ ...card, marginBottom: '12px' }}>
          <SectionTitle label="KI-Packliste" title="Was du einpacken solltest" icon={Backpack} />
          <InlineSkeleton message="Packliste wird vorbereitet…" />
        </div>
      )}
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
                  <button type="button" onClick={() => setOpenPackCategory(isOpen ? null : cat.key)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: isOpen ? '#EFF6FF' : '#F8FAFF', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: isOpen ? cat.color + '20' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <cat.Icon size={11} strokeWidth={2} color={isOpen ? cat.color : '#64748B'} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', flex: 1 }}>{cat.label}</span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>{items.length}</span>
                    {isOpen ? <ChevronUp size={12} strokeWidth={2.5} color="#94A3B8" /> : <ChevronDown size={12} strokeWidth={2.5} color="#94A3B8" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '10px 12px', background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {items.map((item, i) => (
                          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 9px', borderRadius: '20px', background: '#F8FAFF', border: '1px solid #E2E8F0', fontSize: '11px', color: '#334155', fontWeight: 500 }}>
                            <CheckCircle2 size={9} strokeWidth={2.5} color={ACCENT} />{item}
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
