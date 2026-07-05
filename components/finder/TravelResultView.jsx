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
import FerienparkSection from '@/components/finder/FerienparkSection';

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
  (result.highlights || []).slice(0, 3).forEach(h => {
    const clean = stripEmoji(h).replace(/^[^\wäöüÄÖÜ]+/, '').replace(/[.,!?;]$/, '').trim();
    if (clean.length > 3) reasons.push(clean);
  });
  const profileType = personality?.types?.[0] ? stripEmoji(personality.types[0]).trim() : null;
  if (profileType) reasons.push(`Passt perfekt zu deinem Reiseprofil: ${profileType}`);
  if (result.budgetPerDay) reasons.push(`Attraktives Budget: ab ${result.budgetPerDay}`);
  else reasons.push('Hervorragendes Preis-Leistungs-Verhältnis');
  if (reasons.length < 5) reasons.push(`${matchPct}% Übereinstimmung mit deinen Reisewünschen`);
  return reasons.filter(r => r.length > 3).slice(0, 5);
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

// Single shared style block — rendered once before both banner sections
function VisualBannerStyles() {
  return (
    <style>{`
      .ape-visual-banner {
        position: relative;
        flex: 1;
        min-height: clamp(360px,36vw,480px);
        border-radius: 14px;
        overflow: hidden;
      }
      .ape-profile-banner {
        border: 1.5px solid #BFDBFE;
        box-shadow: 0 4px 28px rgba(14,165,233,0.10);
      }
      .ape-analysis-banner {
        border: 1.5px solid #BBF7D0;
        box-shadow: 0 4px 28px rgba(16,185,129,0.10);
      }
      .ape-profile-overlay {
        position: relative;
        z-index: 1;
        max-width: 54%;
        padding: clamp(16px,3vw,24px);
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: center;
        min-height: clamp(360px,36vw,480px);
        box-sizing: border-box;
      }
      .ape-analysis-content {
        position: relative;
        z-index: 1;
        padding: clamp(14px,2.5vw,20px);
        padding-bottom: clamp(140px,17vw,185px);
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 92%;
      }
      @media (max-width: 580px) {
        .ape-visual-banner  { min-height: 370px; }
        .ape-profile-overlay { max-width: 100%; min-height: 370px; }
        .ape-analysis-content { padding-bottom: 120px; max-width: 100%; }
      }
    `}</style>
  );
}

function ProfileBannerCard({ profileCards, summary }) {
  const [imgError, setImgError] = useState(false);
  const bgStyle = imgError
    ? { background: 'linear-gradient(135deg,#EFF6FF 0%,#DBEAFE 100%)' }
    : { background: "linear-gradient(90deg,rgba(255,255,255,0.96) 0%,rgba(255,255,255,0.84) 38%,rgba(255,255,255,0.20) 62%,rgba(255,255,255,0.02) 100%),url('/images/travel-profile-monkey.png') right center / cover no-repeat" };
  return (
    <div className="ape-visual-banner ape-profile-banner" style={bgStyle}>
      {!imgError && (
        <img src="/images/travel-profile-monkey.png" alt="" aria-hidden="true"
          onError={() => setImgError(true)}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
        />
      )}
      <div className="ape-profile-overlay">
        {profileCards.map(({ Icon, iconColor, iconBg, iconBorder, title }, j) => (
          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 13px', borderRadius: '11px', background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(191,219,254,0.8)', boxShadow: '0 1px 8px rgba(14,165,233,0.07)' }}>
            <div style={{ width: '30px', height: '30px', minWidth: '30px', borderRadius: '9px', background: iconBg, border: `1px solid ${iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={13} strokeWidth={1.75} color={iconColor} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.3 }}>{title}</span>
          </div>
        ))}
        {summary && (
          <div style={{ display: 'flex', gap: '9px', marginTop: '2px', padding: '11px 13px', borderRadius: '10px', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', border: '1px solid rgba(191,219,254,0.7)' }}>
            <div style={{ width: '3px', minWidth: '3px', borderRadius: '2px', background: 'linear-gradient(to bottom,#0EA5E9,#06B6D4)', alignSelf: 'stretch' }} />
            <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: '#1E40AF', lineHeight: 1.65, fontWeight: 500 }}>„{summary}"</p>
          </div>
        )}
        {imgError && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <Compass size={22} strokeWidth={1.25} color="#93C5FD" />
            <MapPin  size={22} strokeWidth={1.25} color="#BFDBFE" />
            <Heart   size={22} strokeWidth={1.25} color="#DBEAFE" />
          </div>
        )}
      </div>
    </div>
  );
}

function AnalysisBannerCard({ reasons }) {
  const [imgError, setImgError] = useState(false);
  const bgStyle = imgError
    ? { background: 'linear-gradient(180deg,#F0FDF4 0%,#DCFCE7 55%,#BBF7D0 100%)' }
    : { background: "linear-gradient(180deg,rgba(255,255,255,0.97) 0%,rgba(255,255,255,0.92) 44%,rgba(255,255,255,0.42) 68%,rgba(255,255,255,0.06) 100%),url('/images/apearound-analysis-bags.png') center bottom / cover no-repeat" };
  return (
    <div className="ape-visual-banner ape-analysis-banner" style={bgStyle}>
      {!imgError && (
        <img src="/images/apearound-analysis-bags.png" alt="" aria-hidden="true"
          onError={() => setImgError(true)}
          style={{ position: 'absolute', width: 0, height: 0, opacity: 0, pointerEvents: 'none' }}
        />
      )}
      <div className="ape-analysis-content">
        {reasons.map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 13px', borderRadius: '12px', background: 'rgba(255,255,255,0.86)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,197,94,0.22)', boxShadow: '0 2px 10px rgba(15,23,42,0.07)' }}>
            <CheckCircle2 size={14} strokeWidth={2.5} color="#16A34A" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '12px', color: '#166534', fontWeight: 500, lineHeight: 1.55 }}>{r}</span>
          </div>
        ))}
      </div>
      {imgError && (
        <div style={{ position: 'absolute', bottom: '18px', right: '18px', display: 'flex', gap: '10px', opacity: 0.22 }}>
          <Briefcase size={38} strokeWidth={1.25} color="#16A34A" />
          <Plane    size={28} strokeWidth={1.25} color="#16A34A" />
          <MapPin   size={24} strokeWidth={1.25} color="#16A34A" />
        </div>
      )}
    </div>
  );
}

const HOTEL_IMAGE_MAP = {
  city:      '/images/hotels/city-hotel.png',
  boutique:  '/images/hotels/boutique-hotel.png',
  wellness:  '/images/hotels/wellness-hotel.png',
  family:    '/images/hotels/family-hotel.png',
  beach:     '/images/hotels/beach-resort.png',
  mountain:  '/images/hotels/mountain-hotel.png',
  budget:    '/images/hotels/budget-hotel.png',
  romantic:  '/images/hotels/romantic-hotel.png',
};

function getHotelImage(hotel = {}, destination = '', personality = {}) {
  try {
    // Direct type lookup takes priority (used by generic fallback hotels)
    if (hotel?.type && HOTEL_IMAGE_MAP[hotel.type]) return HOTEL_IMAGE_MAP[hotel.type];
    const personalityTypes = Array.isArray(personality?.types) ? personality.types : [];
    const text = [
      hotel?.name, hotel?.description, hotel?.type, hotel?.category,
      typeof destination === 'string' ? destination : destination?.name,
      personality?.summary,
      ...personalityTypes,
    ].filter(Boolean).join(' ').toLowerCase();
    if (/wellness|spa|therme|entspannung|relax/.test(text))           return HOTEL_IMAGE_MAP.wellness;
    if (/familie|kinder|family/.test(text))                           return HOTEL_IMAGE_MAP.family;
    if (/strand|beach|meer|resort|küste/.test(text))                  return HOTEL_IMAGE_MAP.beach;
    if (/berg|alpen|mountain|h.tte|chalet/.test(text))                return HOTEL_IMAGE_MAP.mountain;
    if (/budget|günstig|preiswert|preis.leistung/.test(text))         return HOTEL_IMAGE_MAP.budget;
    if (/romantik|romantic|paar|zweisamkeit|verliebt/.test(text))     return HOTEL_IMAGE_MAP.romantic;
    if (/boutique|charmant|historisch|design|flair/.test(text))       return HOTEL_IMAGE_MAP.boutique;
  } catch {
    // Fallback on any unexpected error
  }
  return HOTEL_IMAGE_MAP.city;
}

function isRealHotelRecommendation(hotel) {
  const name = String(hotel?.name || '').trim();
  if (!name || hotel?.isGeneric) return false;
  const genericRx = [
    /^stadthotel in /i, /^boutique-hotel in /i, /^wellnesshotel in /i,
    /^romantikhotel in /i, /^alpenhotel in /i, /^strandresort in /i,
    /^familienhotel in /i, /^budgethotel in /i, /^günstiges hotel in /i,
  ];
  return !genericRx.some(rx => rx.test(name));
}

function buildHotelSearchQuery(hotel, cur) {
  const dest = cur?.destination || cur?.name || '';
  if (!hotel || hotel?.mode === 'destinationSearch') {
    return ['Hotels', dest].filter(Boolean).join(' ');
  }
  const name = String(hotel?.searchQuery || hotel?.name || '').trim();
  return [name, dest].filter(Boolean).join(' ');
}

function buildHotelProviderTargetUrl(providerKey, searchQuery) {
  const encoded = encodeURIComponent(searchQuery);
  switch (providerKey) {
    case 'booking':      return `https://www.booking.com/searchresults.de.html?ss=${encoded}&lang=de&selected_currency=EUR`;
    case 'trivago':      return `https://www.trivago.de/`;
    case 'check24':      return `https://hotel.check24.de/`;
    case 'expedia':      return `https://www.expedia.de/Hotel-Search?destination=${encoded}`;
    case 'holidaycheck': return `https://www.holidaycheck.de/hotel-search?countryId=0&terms=${encoded}`;
    default:             return `https://www.google.com/search?q=${encoded}+Hotel`;
  }
}

function HotelProviderModal({ hotel, cur, onClose }) {
  const isSpecific  = hotel?.mode !== 'destinationSearch';
  const destName    = cur?.destination || 'deinem Reiseziel';
  const searchQuery = buildHotelSearchQuery(hotel, cur);
  return (
    <div
      role="dialog" aria-modal="true" aria-label="Hotelangebote vergleichen"
      style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(15,23,42,0.52)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
      onClick={onClose}
    >
      <div
        style={{ background: '#FFFFFF', borderRadius: '20px 20px 0 0', padding: 'clamp(18px,4vw,28px)', width: '100%', maxWidth: '560px', boxShadow: '0 -8px 40px rgba(15,23,42,0.18)', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2, marginBottom: '5px' }}>Hotelangebote vergleichen</div>
            <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>
              {isSpecific
                ? `Angebote für „${hotel.name}" in ${destName} direkt beim Anbieter öffnen`
                : `Passende Hotels in ${destName} bei unseren Partnern finden`}
            </div>
          </div>
          <button onClick={onClose} aria-label="Schließen"
            style={{ all: 'unset', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px', color: '#475569', fontWeight: 700 }}
          >✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {HOTEL_PROVIDERS.map(({ key, name, sub, logo, Icon, accent, bg, border }) => {
            const targetUrl = buildHotelProviderTargetUrl(key, searchQuery);
            return (
              <a key={key} href={goUrl(key, targetUrl)} target="_blank" rel="noopener noreferrer" onClick={onClose}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 16px', borderRadius: '13px', background: bg, border: `1.5px solid ${border}`, textDecoration: 'none', boxShadow: '0 1px 5px rgba(15,23,42,0.04)' }}
              >
                <div style={{ width: '44px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ProviderLogo logo={logo} name={name} FallbackIcon={Icon} accent={accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{name}</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{sub}</div>
                </div>
                <ArrowRight size={13} strokeWidth={2} color={accent} style={{ flexShrink: 0 }} />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function HotelCardHeader({ src, isTopPick, price }) {
  const [imgErr, setImgErr] = useState(false);
  const handleError = () => {
    if (process.env.NODE_ENV === 'development') console.warn('[HotelCardHeader] image failed to load:', src);
    setImgErr(true);
  };
  return (
    <div style={{ height: 'clamp(150px,16vw,185px)', position: 'relative', overflow: 'hidden', borderRadius: '16px 16px 0 0', flexShrink: 0, background: imgErr ? 'linear-gradient(135deg,#0F172A 0%,#1E3A5F 100%)' : '#F1F5F9' }}>
      {!imgErr ? (
        <img
          src={src}
          alt=""
          loading="eager"
          onError={handleError}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Hotel size={24} strokeWidth={1.5} color="rgba(255,255,255,0.88)" />
          </div>
        </div>
      )}
      {/* Gradient overlay — only rendered when image loaded, keeps badges readable */}
      {!imgErr && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(15,23,42,0.22) 0%,rgba(15,23,42,0.04) 45%,rgba(15,23,42,0.30) 100%)', pointerEvents: 'none' }} />}
      {isTopPick && (
        <div style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: '8px', background: 'linear-gradient(135deg,#F59E0B,#EF4444)', fontSize: '10px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.4px', zIndex: 1 }}>Top Pick</div>
      )}
      {price && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '5px 11px', borderRadius: '8px', background: 'rgba(15,23,42,0.62)', backdropFilter: 'blur(8px)', fontSize: '13px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.2px', zIndex: 1 }}>{price}</div>
      )}
    </div>
  );
}

function ProviderLogo({ logo, name, FallbackIcon, accent }) {
  const [logoErr, setLogoErr] = useState(false);
  if (!logo || logoErr) {
    return (
      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <FallbackIcon size={16} strokeWidth={1.75} color={accent} />
      </div>
    );
  }
  return (
    <img
      src={logo}
      alt={`${name} Logo`}
      loading="lazy"
      onError={() => setLogoErr(true)}
      style={{ maxHeight: '28px', maxWidth: '110px', width: 'auto', objectFit: 'contain', display: 'block' }}
    />
  );
}

// All providers are in ALLOWED_BASE_DOMAINS — routed through /go/[provider] for affiliate tracking
const HOTEL_PROVIDERS = [
  { key: 'booking',      name: 'Booking.com',  sub: 'Hotels ansehen',       logo: '/images/providers/booking.png',      Icon: Hotel,     accent: '#003580', bg: '#EFF6FF', border: '#BFDBFE',
    getUrl: r => r.bookingUrl      || `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent((r.destination||'')+', '+(r.country||''))}&lang=de&selected_currency=EUR` },
  { key: 'trivago',      name: 'Trivago',       sub: 'Preise vergleichen',   logo: '/images/providers/trivago.png',      Icon: Gem,       accent: '#c0100f', bg: '#FFF1F2', border: '#FECDD3',
    getUrl: r => r.trivagoUrl      || `https://www.trivago.de/` },
  { key: 'check24',      name: 'CHECK24',       sub: 'Angebote vergleichen', logo: '/images/providers/check24.png',      Icon: Briefcase, accent: '#003399', bg: '#EEF2FF', border: '#C7D2FE',
    getUrl: r => r.check24Url      || `https://hotel.check24.de/` },
  { key: 'expedia',      name: 'Expedia',       sub: 'Deals entdecken',      logo: '/images/providers/expedia.png',      Icon: Plane,     accent: '#C9920A', bg: '#FFFBEB', border: '#FDE68A',
    getUrl: r => r.expediaUrl      || `https://www.expedia.de/Hotel-Search?destination=${encodeURIComponent((r.destination||'')+', '+(r.country||''))}` },
  { key: 'holidaycheck', name: 'HolidayCheck',  sub: 'Bewertungen lesen',    logo: '/images/providers/holidaycheck.png', Icon: Award,     accent: '#D95E00', bg: '#FFF7ED', border: '#FED7AA',
    getUrl: r => r.holidaycheckUrl || `https://www.holidaycheck.de/hotel-search?countryId=0&terms=${encodeURIComponent(r.destination||'')}` },
];

export default function TravelResultView({ results, personality, interests, packingList, surprise, duration, budget, phase2Loading, onReset, onEmail, renderAfterHero = null, showHotelSection = true }) {
  const [idx, setIdx]                           = useState(0);
  const [showShare, setShowShare]               = useState(false);
  const [openPackCategory, setOpenPackCategory] = useState(null);
  const [chatMessages, setChatMessages]         = useState([]);
  const [chatInput, setChatInput]               = useState('');
  const [chatLoading, setChatLoading]           = useState(false);
  const [selectedHotel, setSelectedHotel]       = useState(null);
  const chatEndRef = useRef(null);

  const cur        = results[idx];
  const match      = MATCHES[Math.min(idx, MATCHES.length - 1)];
  const realHotels = Array.isArray(cur?.hotels) ? cur.hotels.filter(isRealHotelRecommendation) : [];

  useEffect(() => {
    if (chatMessages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages]);
  useEffect(() => { setChatMessages([]); setSelectedHotel(null); }, [idx]);

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

      {renderAfterHero}

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
        <VisualBannerStyles />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', marginBottom: '12px', alignItems: 'stretch' }}>

          {personality && (
            <section aria-label="Warum diese Reise passt" style={{ ...card, display: 'flex', flexDirection: 'column' }}>
              <SectionTitle label="Dein Reiseprofil" title="Warum diese Reise perfekt zu dir passt" icon={Compass} />
              <ProfileBannerCard
                profileCards={profileCards}
                summary={personality.summary ? stripEmoji(personality.summary) : ''}
              />
            </section>
          )}

          <section aria-label="Warum Platz 1" style={{ ...card, display: 'flex', flexDirection: 'column' }}>
            <SectionTitle
              label="ApeAround-Analyse"
              title={idx === 0 ? `Warum ${cur.destination} auf Platz 1 ist` : `Was ${cur.destination} überzeugt`}
              icon={Award} iconColor="#16A34A" iconBg="#F0FDF4" iconBorder="#86EFAC"
            />
            <AnalysisBannerCard reasons={buildWhyWon(cur, personality, match.pct)} />
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
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>TAGESBUDGET</div>
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
        {showHotelSection && !realHotels.length && phase2Loading && (
          <div style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="ApeAround-Empfehlungen" title="Empfohlene Hotels" icon={Hotel} />
            <InlineSkeleton message="Hotelvorschläge werden geladen…" />
          </div>
        )}
        {showHotelSection && (!phase2Loading || realHotels.length > 0) && (
          <section aria-label="Empfohlene Hotels" style={{ ...card, marginBottom: '12px' }}>
            <SectionTitle label="ApeAround-Empfehlungen" title="Empfohlene Hotels" icon={Hotel} />

            {realHotels.length > 0 ? (
              <>
                {/* Real hotel cards — clickable, open provider picker */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,340px))', justifyContent: 'center', gap: 'clamp(10px,2vw,16px)', marginBottom: '16px' }}>
                  {realHotels.map((hotel, i) => (
                    <button
                      key={`${hotel?.name}-${i}`}
                      onClick={() => setSelectedHotel(hotel)}
                      aria-label={`Anbieter für ${hotel?.name} auswählen`}
                      style={{ all: 'unset', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0', boxShadow: '0 3px 18px rgba(15,23,42,0.08)', background: '#FFFFFF', display: 'flex', flexDirection: 'column', cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box' }}
                    >
                      <HotelCardHeader
                        src={getHotelImage(hotel, cur.destination, personality)}
                        isTopPick={i === 0}
                        price={hotel?.pricePerNight}
                      />
                      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'var(--font-heading)', marginBottom: '4px', lineHeight: 1.25 }}>{hotel?.name}</div>
                        {hotel?.category && (
                          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500, marginBottom: '8px' }}>{hotel.category}</div>
                        )}
                        {hotel?.why && (
                          <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, flex: 1 }}>{hotel.why}</div>
                        )}
                        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <ArrowRight size={10} strokeWidth={2.5} color="#0EA5E9" />
                          <span style={{ fontSize: '10px', color: '#0EA5E9', fontWeight: 600, lineHeight: 1 }}>Anbieter vergleichen</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div style={{ marginBottom: '16px', textAlign: 'center', fontSize: '10px', color: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <Info size={10} strokeWidth={2} color="#CBD5E1" />
                  Symbolbilder im ApeAround-Stil — keine echten Hotelfotos
                </div>
              </>
            ) : (
              <>
                {/* No real hotels: seriöser Suchbereich */}
                <div style={{ marginBottom: '14px', padding: '14px 16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Hotels für {cur?.destination || 'dein Reiseziel'} finden</div>
                  <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.55 }}>Wir zeigen dir passende Hotelangebote bei unseren Partnern. Die konkrete Auswahl öffnet sich direkt beim Anbieter.</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <button
                    onClick={() => setSelectedHotel({ mode: 'destinationSearch' })}
                    aria-label={`Passende Hotels in ${cur?.destination || 'deinem Reiseziel'} suchen`}
                    style={{ all: 'unset', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '14px', background: 'linear-gradient(135deg,#EFF6FF,#F0F9FF)', border: '1.5px solid #BFDBFE', cursor: 'pointer', boxSizing: 'border-box' }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Hotel size={18} strokeWidth={1.5} color="#1D4ED8" />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E40AF' }}>Passende Hotels in {cur?.destination || 'deinem Reiseziel'} suchen</div>
                      <div style={{ fontSize: '11px', color: '#3B82F6', marginTop: '2px' }}>Anbieter vergleichen →</div>
                    </div>
                  </button>
                </div>
              </>
            )}

            {/* CTA + provider grid */}
            <div style={{ marginBottom: '14px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>Hotels & Preise vergleichen</div>
              <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.55 }}>Vergleiche passende Angebote bei unseren Hotelpartnern und finde den besten Deal für deine Reise.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: '8px', marginBottom: '10px' }}>
              {HOTEL_PROVIDERS.map(({ key, name, sub, logo, Icon, accent, bg, border, getUrl }) => {
                const url = getUrl(cur);
                return (
                  <a key={key} href={goUrl(key, url)} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '14px 10px 11px', borderRadius: '13px', background: bg, border: `1.5px solid ${border}`, textDecoration: 'none', boxShadow: '0 1px 6px rgba(15,23,42,0.05)' }}
                  >
                    <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ProviderLogo logo={logo} name={name} FallbackIcon={Icon} accent={accent} />
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#0F172A', textAlign: 'center', lineHeight: 1.2 }}>{name}</div>
                    <div style={{ fontSize: '10px', color: '#64748B', textAlign: 'center', lineHeight: 1.3 }}>{sub}</div>
                  </a>
                );
              })}
            </div>
            <div style={{ fontSize: '10px', color: '#CBD5E1', textAlign: 'center', lineHeight: 1.5 }}>
              Einige Links können Affiliate-Links sein — für dich bleibt der Preis gleich.
            </div>

            {/* Hotel provider modal */}
            {selectedHotel && <HotelProviderModal hotel={selectedHotel} cur={cur} onClose={() => setSelectedHotel(null)} />}
          </section>
        )}

        {/* ── FERIENPARKS & FAMILIENUNTERKÜNFTE ──────────────────────────── */}
        <FerienparkSection interests={interests} destination={cur} budget={budget} holidayParkUrls={cur.holidayParkUrls} />

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
        {cur.costEstimate && (() => {
          const BUDGET_META = {
            low:  { display: 'bis 500 €',     max: 500  },
            mid:  { display: '500–1.500 €',   max: 1500 },
            high: { display: '1.500–4.000 €', max: 4000 },
          };
          const budgetMeta = BUDGET_META[budget] ?? null;

          // Parses the MAXIMUM EUR value from an AI string like "380–670 € p.P." → 670
          const parseMaxEur = (str) => {
            if (!str) return null;
            const nums = (str.match(/\d+/g) ?? []).map(Number).filter(n => n > 10);
            return nums.length ? Math.max(...nums) : null;
          };

          // Determine budget status: prefer explicit AI field, fall back to numeric comparison
          const aiStatus     = cur.costEstimate.budgetStatus; // "passt"|"knapp"|"ueber"|"nur_sparreise"
          const totalMax     = parseMaxEur(cur.costEstimate.total);
          const budgetLimit  = budgetMeta?.max ?? null;
          const numericRatio = (budgetLimit && totalMax) ? totalMax / budgetLimit : null;
          const derivedStatus = numericRatio === null ? 'passt'
            : numericRatio <= 1.0  ? 'passt'
            : numericRatio <= 1.20 ? 'knapp'
            : numericRatio <= 1.60 ? 'ueber'
            : 'nur_sparreise';

          const effectiveStatus = (aiStatus && ['passt','knapp','ueber','nur_sparreise'].includes(aiStatus))
            ? aiStatus
            : derivedStatus;

          // Visual config per status
          const STATUS_CFG = {
            passt:         { badgeLabel: 'Passt zu deinem Budget',        badgeBg: '#F0FDF4', badgeColor: '#15803D', badgeBorder: '#BBF7D0', totalBg: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', totalBorder: '2px solid #BFDBFE', totalColor: '#0284C7', gemBg: 'linear-gradient(135deg,#0EA5E9,#06B6D4)', totalLabel: 'Gesamt', showWarning: false, disclaimer: '* Schätzwerte basieren auf durchschnittlichen Marktpreisen. Tatsächliche Preise können abweichen.' },
            knapp:         { badgeLabel: 'Knapp im Budget',               badgeBg: '#FFFBEB', badgeColor: '#92400E', badgeBorder: '#FDE68A', totalBg: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', totalBorder: '2px solid #FDE68A', totalColor: '#B45309', gemBg: 'linear-gradient(135deg,#F59E0B,#FBBF24)', totalLabel: 'Gesamt*', showWarning: true,  disclaimer: '* Schätzwerte – knapp im Budget. Mit Frühbucher-Rabatt oder Nebensaison oft erreichbar.' },
            ueber:         { badgeLabel: 'Über deinem Budget',            badgeBg: '#FEF2F2', badgeColor: '#991B1B', badgeBorder: '#FECACA', totalBg: 'linear-gradient(135deg,#FEF2F2,#FEE2E2)', totalBorder: '2px solid #FECACA', totalColor: '#991B1B', gemBg: 'linear-gradient(135deg,#EF4444,#F87171)', totalLabel: 'Gesamt*', showWarning: true,  disclaimer: '* Schätzwerte basieren auf realistischen Marktpreisen – dieses Ziel liegt über deinem Budget.' },
            nur_sparreise: { badgeLabel: 'Nur als Sparreise realistisch', badgeBg: '#EFF6FF', badgeColor: '#1D4ED8', badgeBorder: '#BFDBFE', totalBg: 'linear-gradient(135deg,#EFF6FF,#ECFEFF)', totalBorder: '2px solid #BFDBFE', totalColor: '#1D4ED8', gemBg: 'linear-gradient(135deg,#3B82F6,#0EA5E9)', totalLabel: 'Gesamt*', showWarning: true,  disclaimer: '* Dieses Ziel ist mit dem gewählten Budget nur als sehr günstige Reise in der Nebensaison realistisch.' },
          };
          const cfg = STATUS_CFG[effectiveStatus];

          const WARNING_MSG = {
            knapp:         'Dieses Ziel liegt knapp über deinem gewählten Budget. Mit Frühbucherpreis, Nebensaison oder günstiger Unterkunft ist es oft erreichbar.',
            ueber:         'Dieses Ziel liegt voraussichtlich über deinem gewählten Budget. Die Kostenschätzung basiert auf realistischen Marktpreisen – wir erfinden keine Lockpreise.',
            nur_sparreise: 'Dieses Ziel ist mit deinem Budget nur als günstige Kurzreise in der Nebensaison realistisch. Für mehr Komfort empfehlen wir ein höheres Budget.',
          };

          // Normalize AI output: strip inconsistent "gesamt" / "p.P." labels, füge einheitliches "p.P." hinzu
          const cleanValue = (str) => {
            if (!str) return str;
            return str.replace(/\s*(gesamt|p\.P\.|pro Person)\s*/gi, '').trim() + ' p.P.';
          };

          return (
            <section aria-label="Kostenschätzung" style={{ ...card, marginBottom: '12px' }}>
              <SectionTitle label="Budget-Übersicht" title="Kostenschätzung für deine Reise" icon={Euro} iconColor="#15803D" iconBg="#F0FDF4" iconBorder="#BBF7D0" />

              {/* Two-row header: selected budget + status badge */}
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                {budgetMeta && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 11px', borderRadius: '20px', background: '#F1F5F9', border: '1px solid #E2E8F0', fontSize: '12px', color: '#475569', fontWeight: 600 }}>
                    <Wallet size={12} strokeWidth={2.5} />
                    Gewähltes Budget: {budgetMeta.display} p.P.
                  </div>
                )}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 11px', borderRadius: '20px', background: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}`, fontSize: '12px', color: cfg.badgeColor, fontWeight: 700 }}>
                  {cfg.badgeLabel}
                </div>
              </div>

              {/* Warning message for non-"passt" statuses */}
              {cfg.showWarning && WARNING_MSG[effectiveStatus] && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 12px', borderRadius: '10px', marginBottom: '12px', background: effectiveStatus === 'ueber' ? 'rgba(239,68,68,0.07)' : effectiveStatus === 'knapp' ? 'rgba(245,158,11,0.08)' : 'rgba(59,130,246,0.08)', border: `1px solid ${effectiveStatus === 'ueber' ? 'rgba(239,68,68,0.25)' : effectiveStatus === 'knapp' ? 'rgba(245,158,11,0.30)' : 'rgba(59,130,246,0.25)'}`, fontSize: '12px', color: effectiveStatus === 'ueber' ? '#991B1B' : effectiveStatus === 'knapp' ? '#92400E' : '#1D4ED8', lineHeight: 1.5 }}>
                  <Info size={14} strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
                  <span>{WARNING_MSG[effectiveStatus]}</span>
                </div>
              )}

              {/* Cost cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: '8px', alignItems: 'stretch' }}>
                {[
                  { label: 'Flug',        value: cur.costEstimate.flight,     Icon: Plane,     iconBg: '#DBEAFE', iconColor: '#1D4ED8' },
                  { label: 'Unterkunft',  value: cur.costEstimate.hotel,      Icon: Hotel,     iconBg: '#F3E8FF', iconColor: '#7C3AED' },
                  { label: 'Aktivitäten', value: cur.costEstimate.activities, Icon: MapPinned, iconBg: '#FEE2E2', iconColor: '#DC2626' },
                ].filter(r => r.value && !['0€','0€ p.P.','0 € p.P.','0 €'].includes(r.value.trim())).map((row, i) => (
                  <div key={i} style={{ padding: '14px 10px', borderRadius: '13px', background: '#F8FAFF', border: '1px solid #F1F5F9', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: row.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <row.Icon size={15} strokeWidth={1.75} color={row.iconColor} />
                      </div>
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{row.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>{cleanValue(row.value)}</div>
                    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>pro Person</div>
                  </div>
                ))}
                {cur.costEstimate.total && (
                  <div style={{ padding: '14px 10px', borderRadius: '13px', textAlign: 'center', background: cfg.totalBg, border: cfg.totalBorder }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: cfg.gemBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Gem size={15} strokeWidth={1.75} color="#FFFFFF" />
                      </div>
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 700, color: cfg.totalColor, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{cfg.totalLabel}</div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: cfg.totalColor, lineHeight: 1.2, fontFamily: 'var(--font-heading)' }}>{cleanValue(cur.costEstimate.total)}</div>
                    <div style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}>pro Person</div>
                  </div>
                )}
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#94A3B8' }}>{cfg.disclaimer}</div>
            </section>
          );
        })()}

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
