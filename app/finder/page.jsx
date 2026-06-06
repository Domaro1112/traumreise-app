"use client";
import { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// ── Data constants (logic unchanged) ─────────────────────────────────────────
const INTERESTS = [
  { id: "beach",     label: "🏖️ Strand & Meer",     desc: "Sonne, Sand, Wellen" },
  { id: "mountains", label: "⛰️ Berge & Natur",      desc: "Wandern, Frische Luft" },
  { id: "city",      label: "🏙️ Städtetrip",         desc: "Kultur, Essen, Nightlife" },
  { id: "adventure", label: "🪂 Abenteuer",           desc: "Extrem, Action, Thrill" },
  { id: "culture",   label: "🏛️ Kultur & Geschichte", desc: "Museen, Sehenswürdigkeiten" },
  { id: "food",      label: "🍜 Kulinarik",           desc: "Genuss, lokale Küche" },
  { id: "wellness",  label: "🧘 Wellness & Spa",      desc: "Entspannung, Erholung" },
  { id: "roadtrip",  label: "🚗 Roadtrip",            desc: "Freiheit auf der Straße" },
];
const BUDGETS = [
  { id: "low",  label: "💸 Budget",  desc: "bis 500€ p.P." },
  { id: "mid",  label: "✈️ Mittel",  desc: "500–1500€ p.P." },
  { id: "high", label: "💎 Premium", desc: "1500€+ p.P." },
];
const DURATIONS = [
  { id: "weekend",  label: "🗓️ Wochenende", desc: "2–4 Tage" },
  { id: "week",     label: "📅 1 Woche",    desc: "5–8 Tage" },
  { id: "twoweeks", label: "🌍 2 Wochen",   desc: "9–16 Tage" },
  { id: "long",     label: "🧳 Längere Reise", desc: "17+ Tage" },
];
const SEASONS = [
  { id: "spring", label: "🌸 Frühling" },
  { id: "summer", label: "☀️ Sommer" },
  { id: "autumn", label: "🍂 Herbst" },
  { id: "winter", label: "❄️ Winter" },
];
const VIBES = [
  { id: "relax",     emoji: "🌴", label: "Entspannung", color: "#00C9A7" },
  { id: "adventure", emoji: "🏔️", label: "Abenteuer",   color: "#FF6B35" },
  { id: "city",      emoji: "🌆", label: "Städtetrip",  color: "#A78BFA" },
  { id: "culture",   emoji: "🏛️", label: "Kultur",      color: "#F59E0B" },
  { id: "food",      emoji: "🍜", label: "Kulinarik",   color: "#F472B6" },
  { id: "nature",    emoji: "🌿", label: "Natur",       color: "#22C55E" },
  { id: "wellness",  emoji: "🧘", label: "Wellness",    color: "#06B6D4" },
  { id: "party",     emoji: "🎉", label: "Nightlife",   color: "#FB923C" },
];
const SCENE_EMOJIS = {
  relax:    ["🌅","🏖️","🌊","☕","🥥","🌸"],
  adventure:["⛰️","🧗","🌄","🏕️","🦅","⚡"],
  city:     ["🌃","🚇","🎭","🍷","🏙️","✨"],
  culture:  ["🏛️","🎨","📜","🕌","🌍","🔮"],
  food:     ["🍜","🥘","🫕","🍷","👨‍🍳","🌶️"],
  nature:   ["🌿","🦋","🌲","🌺","🦜","💧"],
  wellness: ["🧘","♨️","🌙","🫧","🌸","🕯️"],
  party:    ["🎉","🎵","🌙","🍹","💃","🔥"],
};
const LOADING_MSGS = [
  "KI analysiert deine Persönlichkeit…",
  "Dein alternatives Leben wird berechnet…",
  "Wir schreiben deine Geschichte…",
  "Fast fertig — dein Reise-Ich erwacht…",
];
const EXAMPLES = [
  "Ich liebe es morgens früh aufzustehen wenn noch niemand am Strand ist…",
  "Städte, in denen man sich verlaufen kann und es gut ist…",
  "Ich will Essen probieren, das ich zuhause nie finden würde…",
];

// ── Chip (light design) ───────────────────────────────────────────────────────
function Chip({ label, desc, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: desc ? "12px 16px" : "10px 18px",
      borderRadius: "12px",
      border: `2px solid ${selected ? "#0EA5E9" : "#E2E8F0"}`,
      background: selected ? "#EFF6FF" : "#FFFFFF",
      color: selected ? "#0284C7" : "#475569",
      cursor: "pointer", transition: "all .2s", textAlign: "left",
      fontSize: "14px", fontWeight: selected ? 600 : 500, lineHeight: 1.3,
      boxShadow: selected ? "0 0 0 3px rgba(14,165,233,0.12)" : "0 1px 4px rgba(15,23,42,0.06)",
      fontFamily: "inherit",
    }}>
      <div>{label}</div>
      {desc && <div style={{ fontSize: "11px", opacity: .7, marginTop: "2px" }}>{desc}</div>}
    </button>
  );
}

// ── TypewriterText (logic unchanged) ─────────────────────────────────────────
function TypewriterText({ text, speed = 22, onDone }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const idx = useRef(0);
  useEffect(() => {
    setShown(""); setDone(false); idx.current = 0;
    const iv = setInterval(() => {
      idx.current++;
      setShown(text.slice(0, idx.current));
      if (idx.current >= text.length) { clearInterval(iv); setDone(true); onDone && onDone(); }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return <span>{shown}{!done && <span style={{ animation: "blink 1s step-end infinite" }}>|</span>}</span>;
}

// ── FloatingEmoji (logic unchanged) ──────────────────────────────────────────
function FloatingEmoji({ emojis }) {
  const items = Array.from({ length: 10 }, (_, i) => ({
    emoji: emojis[i % emojis.length],
    left: 5 + Math.random() * 90,
    delay: Math.random() * 4,
    dur: 4 + Math.random() * 4,
    size: 14 + Math.random() * 20,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {items.map((it, i) => (
        <div key={i} style={{ position: "absolute", bottom: "-40px", left: it.left + "%", fontSize: it.size, opacity: 0, animation: `floatUp ${it.dur}s ease-in ${it.delay}s infinite` }}>
          {it.emoji}
        </div>
      ))}
    </div>
  );
}

// ── AffiliateCard (light design, links/logic unchanged) ───────────────────────
function AffiliateCard({ destination, country, imageEmoji, tagline, highlights, bookingUrl, trivagoUrl, skyUrl, gygUrl, check24Url }) {
  const btns = [
    { href: trivagoUrl,  bg: "linear-gradient(90deg,#d00e17,#ff4d57)",  label: "🏨 Hotels auf Trivago" },
    { href: bookingUrl,  bg: "linear-gradient(90deg,#003580,#0057b8)",  label: "🛏️ Hotel auf Booking.com" },
    { href: skyUrl,      bg: "linear-gradient(90deg,#0770e3,#00a0de)",  label: "✈️ Flüge auf Skyscanner" },
    { href: gygUrl,      bg: "linear-gradient(90deg,#FF5533,#FF8C00)",  label: "🎭 Aktivitäten GetYourGuide" },
    { href: check24Url,  bg: "linear-gradient(90deg,#003399,#e30613)",  label: "✅ Pauschalreise CHECK24" },
  ];
  return (
    <div
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 16px rgba(15,23,42,0.06)", transition: "transform .3s, box-shadow .3s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(14,165,233,0.16)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(15,23,42,0.06)"; }}
    >
      <div style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)", padding: "28px 24px 20px", textAlign: "center", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: "52px", marginBottom: "8px" }}>{imageEmoji}</div>
        <div style={{ fontSize: "22px", fontFamily: "var(--font-heading)", fontWeight: 700, color: "#0F172A" }}>{destination}</div>
        <div style={{ fontSize: "13px", color: "#0EA5E9", marginTop: "4px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>{country}</div>
        <div style={{ fontSize: "14px", color: "#64748B", marginTop: "8px", fontStyle: "italic" }}>{tagline}</div>
      </div>
      <div style={{ padding: "16px 24px" }}>
        {highlights.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ color: "#0EA5E9", fontSize: "14px", fontWeight: 700 }}>✓</span>
            <span style={{ color: "#475569", fontSize: "13px" }}>{h}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {btns.map(b => (
          <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
            style={{ display: "block", textAlign: "center", padding: "11px", background: b.bg, color: "#fff", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
            onMouseEnter={e => e.currentTarget.style.opacity = ".85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {b.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── EmailPopup (light design, logic unchanged) ────────────────────────────────
function EmailPopup({ destination = "", onClose }) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const valid = email.includes("@") && email.includes(".") && agreed;

  const modalCard = {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "24px",
    boxShadow: "0 24px 80px rgba(15,23,42,0.20)",
    maxWidth: "420px",
    width: "100%",
  };

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...modalCard, padding: "40px 32px", textAlign: "center" }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>📬</div>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>Fast geschafft!</h3>
        <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
          Wir haben dir eine <strong style={{ color: "#0EA5E9" }}>Bestätigungsmail</strong> geschickt.<br />Klick auf den Link — dann bist du dabei!
        </p>
        <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#0EA5E9,#06B6D4)", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 16px rgba(14,165,233,0.35)" }}>
          Alles klar 👍
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...modalCard, padding: "36px 32px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: "#94A3B8", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>✈️</div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>Reise-Inspiration ins Postfach</h3>
          <p style={{ color: "#64748B", fontSize: "14px", lineHeight: 1.6 }}>
            {destination ? `Erhalte deinen ${destination}-Reiseplan + wöchentlich die besten Deals.` : "Wöchentlich die besten Deals & Inspiration."}
          </p>
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de"
          style={{ width: "100%", boxSizing: "border-box", background: "#F8FAFF", border: `2px solid ${email.includes("@") ? "#0EA5E9" : "#E2E8F0"}`, borderRadius: "12px", padding: "13px 16px", color: "#0F172A", fontSize: "15px", outline: "none", marginBottom: "14px", fontFamily: "inherit", transition: "border-color .2s" }} />
        <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "20px" }}>
          <div onClick={() => setAgreed(a => !a)} style={{ width: "20px", height: "20px", minWidth: "20px", borderRadius: "5px", border: `2px solid ${agreed ? "#0EA5E9" : "#CBD5E1"}`, background: agreed ? "#EFF6FF" : "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", cursor: "pointer" }}>
            {agreed && <span style={{ color: "#0EA5E9", fontSize: "13px", fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.6 }}>
            Ich bin einverstanden, Reise-Inspiration & Angebote per Mail zu erhalten. Abmeldung jederzeit möglich.
          </span>
        </label>
        <button onClick={() => valid && setDone(true)} disabled={!valid}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: valid ? "linear-gradient(135deg,#0EA5E9,#06B6D4)" : "#F1F5F9", color: valid ? "#fff" : "#94A3B8", fontWeight: 700, fontSize: "15px", cursor: valid ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: valid ? "0 4px 16px rgba(14,165,233,0.35)" : "none" }}>
          📬 Kostenlos anmelden
        </button>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "12px" }}>
          {["🔒 Kein Spam", "✅ DSGVO-konform", "📤 Abmelden"].map(t => (
            <span key={t} style={{ fontSize: "11px", color: "#94A3B8" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Home screen (light design, logic unchanged) ───────────────────────────────
function Home({ onSelect }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeUp .55s ease both" }}>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", borderRadius: "20px", background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#0284C7", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
          ✈️ Dein persönlicher Reise-Kompass
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(26px,5vw,44px)", fontWeight: 800, margin: "0 0 14px", lineHeight: 1.1, color: "#0F172A", letterSpacing: "-0.02em" }}>
          Finde deine persönliche{" "}
          <span style={{ background: "linear-gradient(135deg,#0EA5E9,#06B6D4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Traumreise
          </span>
        </h1>
        <p style={{ color: "#64748B", fontSize: "16px", fontWeight: 400, lineHeight: 1.7, maxWidth: "500px", margin: "0 auto" }}>
          Beantworte ein paar kurze Fragen und erhalte Reiseziele, die wirklich zu dir passen.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", maxWidth: "580px", margin: "0 auto" }}>
        {[
          { id: "classic", emoji: "🗺️", title: "Reiseziel-Finder", desc: "Schritt für Schritt zum perfekten Reiseziel — mit Interessen, Budget & Affiliate-Links", color: "#0EA5E9", badge: null },
          { id: "zukunft", emoji: "🔮", title: "Dein Reise-Zukunfts-Ich", desc: "Sieh wie dein Leben aussieht wenn du diesen Trip machst — emotional & viral", color: "#A78BFA", badge: "✨ NEU" },
        ].map(m => (
          <button key={m.id} onClick={() => onSelect(m.id)}
            style={{ padding: "28px 22px", borderRadius: "20px", textAlign: "left", border: "2px solid #E2E8F0", background: "#FFFFFF", cursor: "pointer", transition: "all .25s", position: "relative", fontFamily: "inherit", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
            onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${m.color}`; e.currentTarget.style.boxShadow = `0 8px 32px ${m.color}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
            onMouseLeave={e => { e.currentTarget.style.border = "2px solid #E2E8F0"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            {m.badge && <div style={{ position: "absolute", top: 12, right: 12, fontSize: "10px", background: `${m.color}18`, border: `1px solid ${m.color}44`, color: m.color, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{m.badge}</div>}
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: `${m.color}15`, border: `1.5px solid ${m.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "16px" }}>{m.emoji}</div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>{m.title}</div>
            <div style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6 }}>{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Classic (light design, ALL logic unchanged) ───────────────────────────────
function Classic({ onBack }) {
  const [step, setStep] = useState(0);
  const [freeText, setFreeText] = useState("");
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [season, setSeason] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [departure, setDeparture] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [error, setError] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  const toggle = id => setInterests(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const canGo = () => {
    if (step === 0) return freeText.trim().length >= 20;
    if (step === 1) return interests.length > 0;
    if (step === 2) return budget && duration && season;
    return true;
  };
  const reset = () => { setStep(0); setFreeText(""); setInterests([]); setBudget(""); setDuration(""); setSeason(""); setAdults(2); setChildren(0); setCheckin(""); setCheckout(""); setDeparture(""); setResults(null); setPersonality(null); setError(""); };

  const getDefaultDates = () => {
    const now = new Date();
    const year = now.getFullYear();
    const nights = { weekend: 3, week: 7, twoweeks: 14, long: 21 }[duration] || 7;
    const seasonStart = {
      spring: new Date(year, 3, 15),
      summer: new Date(year, 6, 10),
      autumn: new Date(year, 9, 10),
      winter: new Date(year, 11, 20),
    }[season] || new Date(now.getTime() + 30 * 86400000);
    if (seasonStart < now) seasonStart.setFullYear(year + 1);
    const end = new Date(seasonStart.getTime() + nights * 86400000);
    const fmt = d => d.toISOString().split("T")[0];
    return { ci: fmt(seasonStart), co: fmt(end) };
  };

  const buildAffiliateUrls = (d) => {
    const { ci: defaultCi, co: defaultCo } = getDefaultDates();
    const ci = checkin || defaultCi;
    const co = checkout || defaultCo;
    const trivagoUrl = `https://www.trivago.de/?sQuery=${encodeURIComponent(d.skySearch)}&aDateRange%5Barr%5D=${ci}&aDateRange%5Bdep%5D=${co}&adults=${adults}&children=${children}&iRoomType=7`;
    const BOOKING_ORDER = { low: "price", mid: "popularity", high: "class_asc" };
    const bookingUrl = `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(d.skySearch)}&checkin=${ci}&checkout=${co}&group_adults=${adults}&group_children=${children}&no_rooms=1&order=${BOOKING_ORDER[budget] || "popularity"}&lang=de`;
    const dateStr = ci.replace(/-/g, "").slice(2);
    const skySlug = d.skySearch.toLowerCase().replace(/\s+/g, "-");
    const skyClass = budget === "high" ? "business" : "economy";
    const skyUrl = departure
      ? `https://www.skyscanner.de/transport/fluge/${departure}/${d.iata || skySlug}/${dateStr}/?adults=${adults}&children=${children}&cabinclass=${skyClass}`
      : `https://www.skyscanner.de/fluge-nach/${skySlug}/?adults=${adults}&children=${children}&cabinclass=${skyClass}`;
    const gygUrl = `https://www.getyourguide.de/s/?q=${encodeURIComponent(d.destination)}&date_from=${ci}&date_to=${co}`;
    const check24Url = `https://www.check24.de/urlaub/ergebnisse/?reiseziel=${encodeURIComponent(d.destination)}&abreise=${ci}&rueckreise=${co}&erwachsene=${adults}&kinder=${children}`;
    return { trivagoUrl, bookingUrl, skyUrl, gygUrl, check24Url };
  };

  const fetch_ = async () => {
    setLoading(true); setError("");
    try {
      const iL = interests.map(id => INTERESTS.find(i => i.id === id)?.label).join(", ");
      const prompt = `Du bist ein einfuehlsamer Reise-Experte. Schlage genau 3 Reiseziele vor:\nPERSOENLICHE BESCHREIBUNG: "${freeText}"\nInteressen: ${iL} | Budget: ${BUDGETS.find(b => b.id === budget)?.label} | Dauer: ${DURATIONS.find(d => d.id === duration)?.label} | Reisezeit: ${SEASONS.find(s => s.id === season)?.label} | Reisende: ${adults} Erwachsene${children > 0 ? `, ${children} Kinder` : ""}\nAntworte NUR als JSON ohne Markdown:\n{"personality":{"types":["Emoji Text","Emoji Text","Emoji Text"],"summary":"Poetischer Satz"},"destinations":[{"destination":"Stadtname","country":"Land","imageEmoji":"Emoji","tagline":"kurzer Satz max 10 Woerter","highlights":["1","2","3"],"skySearch":"Stadtname englisch","iata":"IATA-Code des naechsten Flughafens zB LIS MUC BCN"}]}`;
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      const parsed = JSON.parse(data.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim());
      setPersonality(parsed.personality);
      setResults(parsed.destinations.map(d => ({ ...d, ...buildAffiliateUrls(d) })));
      setStep(4);
    } catch { setError("Fehler. Bitte nochmal versuchen."); }
    setLoading(false);
  };

  return (
    <>
      {/* Progress bar */}
      {step < 4 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "36px" }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ height: "4px", width: "48px", borderRadius: "2px", background: i <= step ? "#0EA5E9" : "#E2E8F0", transition: "background .4s" }} />
          ))}
        </div>
      )}

      {/* Step 0 — Freitext */}
      {step === 0 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", marginBottom: "6px", fontWeight: 700, color: "#0F172A" }}>Erzähl uns von dir ✍️</h2>
          <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "20px", lineHeight: 1.7 }}>Was macht deinen Traumurlaub aus? Schreib einfach drauf los.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setFreeText(ex)} className="finder-example-pill">
                💡 {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <textarea value={freeText} onChange={e => setFreeText(e.target.value)} rows={5}
              placeholder="Ich träume von einem Ort, wo morgens die Gassen noch leer sind…"
              style={{ width: "100%", boxSizing: "border-box", background: "#F8FAFF", border: `2px solid ${freeText.length >= 20 ? "#0EA5E9" : "#E2E8F0"}`, borderRadius: "14px", padding: "16px 18px 36px", color: "#0F172A", fontSize: "15px", lineHeight: 1.75, fontFamily: "inherit", fontWeight: 400, resize: "none", outline: "none", transition: "border-color .2s, box-shadow .2s", boxShadow: freeText.length >= 20 ? "0 0 0 3px rgba(14,165,233,0.12)" : "none" }} />
            <div style={{ position: "absolute", bottom: "12px", right: "14px", fontSize: "12px", color: freeText.length >= 20 ? "#0EA5E9" : "#94A3B8", fontWeight: 500 }}>
              {freeText.length}{freeText.length < 20 ? ` (noch ${20 - freeText.length})` : " ✓"}
            </div>
          </div>
          {freeText.length >= 20 && (
            <div style={{ marginTop: "12px", padding: "12px 16px", background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span>✨</span>
              <span style={{ fontSize: "13px", color: "#0284C7", fontStyle: "italic" }}>Die KI erkennt deinen Reisetyp.</span>
            </div>
          )}
        </div>
      )}

      {/* Step 1 — Interessen */}
      {step === 1 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", marginBottom: "6px", fontWeight: 700, color: "#0F172A" }}>Was liebst du an Reisen?</h2>
          <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "20px" }}>Mehrfachauswahl möglich</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" }}>
            {INTERESTS.map(i => <Chip key={i.id} label={i.label} desc={i.desc} selected={interests.includes(i.id)} onClick={() => toggle(i.id)} />)}
          </div>
        </div>
      )}

      {/* Step 2 — Rahmenbedingungen */}
      {step === 2 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", marginBottom: "22px", fontWeight: 700, color: "#0F172A" }}>Rahmenbedingungen</h2>
          {[
            { label: "Budget", items: BUDGETS, val: budget, set: setBudget },
            { label: "Reisedauer", items: DURATIONS, val: duration, set: setDuration },
            { label: "Reisezeit", items: SEASONS, val: season, set: setSeason },
          ].map(({ label, items, val, set }) => (
            <div key={label} style={{ marginBottom: "24px" }}>
              <div className="finder-step-label">{label}</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {items.map(it => <Chip key={it.id} label={it.label} desc={it.desc} selected={val === it.id} onClick={() => set(it.id)} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step 3 — Reisende */}
      {step === 3 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", marginBottom: "6px", fontWeight: 700, color: "#0F172A" }}>Wer reist mit?</h2>
          <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "24px" }}>Anzahl der Reisenden festlegen</p>
          {[
            { label: "👤 Erwachsene", sub: "18+ Jahre",      val: adults,   set: setAdults,   min: 1 },
            { label: "🧒 Kinder",     sub: "unter 18 Jahre", val: children, set: setChildren, min: 0 },
          ].map(({ label, sub, val, set, min }) => (
            <div key={label} className="finder-traveler-row">
              <div>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "#0F172A" }}>{label}</div>
                <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: "2px" }}>{sub}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button onClick={() => set(v => Math.max(min, v - 1))} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit", boxShadow: "0 1px 4px rgba(15,23,42,0.08)" }}>−</button>
                <span style={{ fontSize: "22px", fontWeight: 700, minWidth: "28px", textAlign: "center", color: "#0F172A" }}>{val}</span>
                <button onClick={() => set(v => v + 1)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid #0EA5E9", background: "#EFF6FF", color: "#0284C7", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
              </div>
            </div>
          ))}

          {/* Reisedaten */}
          <div style={{ marginTop: "16px" }}>
            <div className="finder-step-label">
              🗓️ Reisedaten{" "}
              <span style={{ color: "#94A3B8", fontSize: "11px", textTransform: "none", fontWeight: 400, letterSpacing: 0 }}>(optional)</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[{ label: "Anreise", val: checkin, set: setCheckin }, { label: "Abreise", val: checkout, set: setCheckout }].map(({ label, val, set }) => (
                <div key={label}>
                  <div style={{ fontSize: "12px", color: "#64748B", marginBottom: "6px", fontWeight: 500 }}>{label}</div>
                  <input type="date" value={val} min={new Date().toISOString().split("T")[0]} onChange={e => set(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", background: "#F8FAFF", border: `2px solid ${val ? "#0EA5E9" : "#E2E8F0"}`, borderRadius: "10px", padding: "10px 14px", color: val ? "#0F172A" : "#94A3B8", fontSize: "14px", outline: "none", fontFamily: "inherit", transition: "border-color .2s" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Abflughafen */}
          <div style={{ marginTop: "22px" }}>
            <div className="finder-step-label">✈️ Dein Abflughafen</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(110px,1fr))", gap: "8px" }}>
              {[
                { code: "FRA", label: "🏙️ Frankfurt" }, { code: "MUC", label: "🥨 München" },
                { code: "BER", label: "🐻 Berlin" },    { code: "DUS", label: "🌊 Düsseldorf" },
                { code: "HAM", label: "⚓ Hamburg" },   { code: "STR", label: "🏰 Stuttgart" },
                { code: "CGN", label: "⛪ Köln" },      { code: "VIE", label: "🎻 Wien" },
                { code: "ZRH", label: "🏔️ Zürich" },
              ].map(ap => (
                <button key={ap.code} onClick={() => setDeparture(d => d === ap.code ? "" : ap.code)}
                  style={{ padding: "10px 6px", borderRadius: "10px", border: `2px solid ${departure === ap.code ? "#0EA5E9" : "#E2E8F0"}`, background: departure === ap.code ? "#EFF6FF" : "#FFFFFF", color: departure === ap.code ? "#0284C7" : "#475569", cursor: "pointer", fontSize: "12px", fontWeight: departure === ap.code ? 700 : 500, transition: "all .2s", textAlign: "center", lineHeight: 1.5, fontFamily: "inherit", boxShadow: departure === ap.code ? "0 0 0 3px rgba(14,165,233,0.12)" : "0 1px 3px rgba(15,23,42,0.06)" }}>
                  {ap.label}<br /><span style={{ fontSize: "11px", opacity: .65 }}>{ap.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Ergebnisse */}
      {step === 4 && results && (
        <div style={{ animation: "fadeIn .5s ease" }}>
          {personality && (
            <div style={{ marginBottom: "32px", background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)", border: "1px solid #BFDBFE", borderRadius: "20px", padding: "26px 28px" }}>
              <div style={{ fontSize: "11px", color: "#0284C7", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px", fontWeight: 700, fontFamily: "var(--font-heading)" }}>Du bist der Typ für</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                {personality.types.map((t, i) => (
                  <span key={i} style={{ padding: "6px 14px", borderRadius: "20px", background: "#FFFFFF", border: "1px solid #BFDBFE", fontSize: "13px", color: "#0284C7", fontWeight: 600 }}>{t}</span>
                ))}
              </div>
              <div style={{ fontSize: "17px", fontStyle: "italic", color: "#334155", lineHeight: 1.5 }}>„{personality.summary}"</div>
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", color: "#0284C7", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px", fontWeight: 700, fontFamily: "var(--font-heading)" }}>Deine Empfehlungen</div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 700, margin: 0, color: "#0F172A" }}>3 perfekte Reiseziele ✨</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "18px", marginBottom: "24px" }}>
            {results.map((d, i) => <AffiliateCard key={i} {...d} />)}
          </div>

          <div style={{ background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)", border: "1px solid #BAE6FD", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A", marginBottom: "4px" }}>📬 Reiseplan per Mail erhalten</div>
              <div style={{ fontSize: "13px", color: "#64748B" }}>Wöchentlich Deals & Inspiration</div>
            </div>
            <button onClick={() => setShowEmail(true)} style={{ padding: "11px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#0EA5E9,#06B6D4)", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(14,165,233,0.35)", whiteSpace: "nowrap" }}>Kostenlos →</button>
          </div>

          <div style={{ textAlign: "center", fontSize: "11px", color: "#94A3B8", marginBottom: "16px" }}>
            * Affiliate-Links — für dich entstehen keine Mehrkosten 🙏
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={reset}
              style={{ padding: "11px 26px", borderRadius: "10px", border: "2px solid #E2E8F0", background: "#FFFFFF", color: "#475569", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", boxShadow: "0 1px 4px rgba(15,23,42,0.06)", transition: "all .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0EA5E9"; e.currentTarget.style.color = "#0EA5E9"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569"; }}>
              ↩ Neue Suche
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: "48px", height: "48px", border: "3px solid #BAE6FD", borderTopColor: "#0EA5E9", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 18px" }} />
          <div style={{ color: "#64748B", fontSize: "15px", fontWeight: 500 }}>Deine Traumreise wird vorbereitet…</div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ color: "#DC2626", textAlign: "center", padding: "16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "12px", fontSize: "14px" }}>{error}</div>
      )}

      {showEmail && <EmailPopup destination={results?.[0]?.destination || ""} onClose={() => setShowEmail(false)} />}

      {/* Navigation */}
      {step < 4 && !loading && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
          <button onClick={() => step === 0 ? onBack() : setStep(s => s - 1)}
            style={{ padding: "13px 24px", borderRadius: "12px", border: "2px solid #E2E8F0", background: "#FFFFFF", color: "#475569", cursor: "pointer", fontSize: "15px", fontWeight: 500, fontFamily: "inherit" }}>
            ← Zurück
          </button>
          <button onClick={() => step < 3 ? setStep(s => s + 1) : fetch_()} disabled={!canGo()}
            style={{ padding: "13px 32px", borderRadius: "12px", border: "none", fontSize: "15px", fontWeight: 700, background: canGo() ? "linear-gradient(135deg,#0EA5E9,#06B6D4)" : "#F1F5F9", color: canGo() ? "#fff" : "#94A3B8", cursor: canGo() ? "pointer" : "not-allowed", boxShadow: canGo() ? "0 4px 20px rgba(14,165,233,0.35)" : "none", fontFamily: "inherit" }}>
            {step === 3 ? "✨ Reiseziele finden" : "Weiter →"}
          </button>
        </div>
      )}
    </>
  );
}

// ── Zukunft (light design, ALL logic unchanged) ───────────────────────────────
function Zukunft({ onBack }) {
  const [vibes, setVibes] = useState([]);
  const [text, setText] = useState("");
  const [zStep, setZStep] = useState(0);
  const [results, setResults] = useState([]);
  const [idx, setIdx] = useState(0);
  const [textDone, setTextDone] = useState(false);
  const [showBtns, setShowBtns] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [err, setErr] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (zStep !== 1) return;
    const iv = setInterval(() => setMsgIdx(m => (m + 1) % LOADING_MSGS.length), 1800);
    return () => clearInterval(iv);
  }, [zStep]);

  const toggle = id => setVibes(p => p.includes(id) ? p.filter(v => v !== id) : [...p, id]);
  const reset = () => { setZStep(0); setVibes([]); setText(""); setResults([]); setIdx(0); setTextDone(false); setShowBtns(false); };
  const next = () => { const n = (idx + 1) % results.length; setIdx(n); setTextDone(false); setShowBtns(false); };

  const fetch_ = async () => {
    setZStep(1); setErr(""); setTextDone(false); setShowBtns(false); setIdx(0);
    try {
      const vL = vibes.map(id => VIBES.find(v => v.id === id)?.label).join(", ");
      const prompt = `Du bist ein poetischer Reise-Storyteller. Erstelle 3 verschiedene Reise-Ich Szenarien.\nBESCHREIBUNG: "${text || "keine"}"\nVIBES: ${vL}\nNUR JSON-Array:\n[{"destination":"Stadt","country":"Land","emoji":"Emoji","vibe":"${vibes[0] || "relax"}","identity_title":"Titel","teaser":"1 Satz","story":"3-4 Saetze du-Form Gegenwart emotional","moment":"1 magischer Moment","bookingCity":"englisch","skyCity":"englisch"}]`;
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      const parsed = JSON.parse(data.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim());
      setResults(parsed.map(d => ({
        ...d,
        trivagoUrl: `https://www.trivago.de/?sQuery=${encodeURIComponent(d.bookingCity)}&iRoomType=7`,
        bookingUrl: `https://www.booking.com/searchresults.de.html?ss=${encodeURIComponent(d.bookingCity)}&lang=de`,
        skyUrl: `https://www.skyscanner.de/fluge-nach/${d.skyCity.toLowerCase().replace(/\s+/g, "-")}/`,
        gygUrl: `https://www.getyourguide.de/s/?q=${encodeURIComponent(d.bookingCity)}`,
        check24Url: `https://www.check24.de/urlaub/ergebnisse/?reiseziel=${encodeURIComponent(d.bookingCity)}`,
      })));
      setZStep(2);
    } catch { setErr("Fehler. Bitte nochmal versuchen."); setZStep(0); }
  };

  const cur = results[idx];
  const color = cur ? (VIBES.find(v => v.id === cur.vibe)?.color || "#0EA5E9") : "#0EA5E9";
  const emojis = cur ? (SCENE_EMOJIS[cur.vibe] || SCENE_EMOJIS.relax) : [];

  return (
    <>
      {/* Step 0 — Vibe-Auswahl */}
      {zStep === 0 && (
        <div style={{ animation: "fadeUp .55s ease .15s both" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(20px,4vw,26px)", fontWeight: 700, marginBottom: "8px", color: "#0F172A" }}>
              Wie sieht dein Leben aus,<br />wenn du fährst?
            </h2>
            <p style={{ color: "#64748B", fontSize: "14px", fontWeight: 400 }}>Keine Hotellisten. Nur du — und dein alternatives Leben.</p>
          </div>

          <div style={{ fontSize: "12px", color: "#64748B", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px", fontWeight: 700, fontFamily: "var(--font-heading)", textAlign: "center" }}>
            Welches Gefühl rufst du?
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "24px" }}>
            {VIBES.map(v => {
              const sel = vibes.includes(v.id);
              return (
                <button key={v.id} onClick={() => toggle(v.id)}
                  style={{ padding: "14px 8px", borderRadius: "16px", border: `2px solid ${sel ? v.color : "#E2E8F0"}`, background: sel ? `${v.color}15` : "#FFFFFF", cursor: "pointer", transition: "all .25s", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", boxShadow: sel ? `0 4px 16px ${v.color}44` : "0 1px 4px rgba(15,23,42,0.06)", fontFamily: "inherit" }}>
                  <span style={{ fontSize: "26px" }}>{v.emoji}</span>
                  <span style={{ fontSize: "11px", color: sel ? v.color : "#64748B", fontWeight: sel ? 700 : 500 }}>{v.label}</span>
                </button>
              );
            })}
          </div>

          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            placeholder="Ich brauche Abstand… oder ich will endlich wieder richtig leben…"
            style={{ width: "100%", boxSizing: "border-box", background: "#F8FAFF", border: "2px solid #E2E8F0", borderRadius: "14px", padding: "14px 18px", color: "#0F172A", fontSize: "14px", lineHeight: 1.7, fontFamily: "inherit", fontWeight: 400, resize: "none", outline: "none", marginBottom: "24px", transition: "border-color .2s" }}
            onFocus={e => e.target.style.borderColor = "#A78BFA"} onBlur={e => e.target.style.borderColor = "#E2E8F0"} />

          {err && <div style={{ color: "#DC2626", textAlign: "center", marginBottom: 16, fontSize: "14px" }}>{err}</div>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={onBack} style={{ padding: "13px 24px", borderRadius: "12px", border: "2px solid #E2E8F0", background: "#FFFFFF", color: "#475569", cursor: "pointer", fontSize: "15px", fontWeight: 500, fontFamily: "inherit" }}>← Zurück</button>
            <button onClick={fetch_} disabled={vibes.length === 0}
              style={{ padding: "16px 40px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: 700, background: vibes.length > 0 ? "linear-gradient(135deg,#A78BFA,#7C3AED)" : "#F1F5F9", color: vibes.length > 0 ? "#fff" : "#94A3B8", cursor: vibes.length > 0 ? "pointer" : "not-allowed", boxShadow: vibes.length > 0 ? "0 6px 28px rgba(167,139,250,.4)" : "none", fontFamily: "inherit" }}>
              🔮 Zeig mir mein Reise-Ich
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — Loading */}
      {zStep === 1 && (
        <div style={{ textAlign: "center", padding: "90px 0", animation: "fadeIn .4s ease" }}>
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 28px" }}>
            <div style={{ width: 80, height: 80, border: "3px solid #EDE9FE", borderTopColor: "#A78BFA", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🔮</div>
          </div>
          <div style={{ fontSize: 15, color: "#64748B", fontStyle: "italic", fontWeight: 500 }}>{LOADING_MSGS[msgIdx]}</div>
        </div>
      )}

      {/* Step 2 — Story */}
      {zStep === 2 && cur && (
        <div style={{ animation: "fadeIn .5s ease" }}>
          <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", backgroundColor: "#FFFFFF", background: `linear-gradient(160deg, ${color}14, ${color}07, transparent)`, border: `2px solid ${color}40`, padding: "36px 28px 28px", marginBottom: "24px", boxShadow: `0 8px 32px ${color}22, 0 2px 8px rgba(15,23,42,0.06)` }}>
            <FloatingEmoji emojis={emojis} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "11px", color, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                Dein Reise-Ich · #{idx + 1} von {results.length}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <span style={{ fontSize: "48px" }}>{cur.emoji}</span>
                <div>
                  <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(20px,4vw,30px)", fontWeight: 700, margin: 0, color: "#0F172A" }}>{cur.destination}</h2>
                  <div style={{ fontSize: "13px", color, letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px", fontWeight: 600 }}>{cur.country}</div>
                </div>
              </div>
              <div style={{ fontSize: "16px", fontStyle: "italic", color: "#475569", lineHeight: 1.5, marginBottom: "18px", borderLeft: `3px solid ${color}`, paddingLeft: "14px" }}>
                „{cur.identity_title}"
              </div>
              <div style={{ fontSize: "16px", lineHeight: 1.85, color: "#1E293B", marginBottom: "20px", minHeight: "90px" }}>
                <TypewriterText text={cur.story} speed={18} onDone={() => { setTextDone(true); setTimeout(() => setShowBtns(true), 400); }} />
              </div>
              {textDone && (
                <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: "14px", padding: "14px 18px", fontSize: "15px", color, fontStyle: "italic", fontWeight: 600, animation: "fadeUp .5s ease" }}>
                  ✨ {cur.moment}
                </div>
              )}
            </div>
          </div>

          {showBtns && (
            <div style={{ animation: "fadeUp .5s ease" }}>
              <div style={{ textAlign: "center", fontSize: "11px", color: "#94A3B8", marginBottom: "14px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                Erlebe dieses Leben jetzt
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                {[
                  { href: cur.trivagoUrl, bg: "linear-gradient(90deg,#d00e17,#ff4d57)", label: "🏨 Hotels Trivago" },
                  { href: cur.bookingUrl, bg: "linear-gradient(90deg,#003580,#0057b8)", label: "🛏️ Booking.com" },
                  { href: cur.skyUrl,     bg: "linear-gradient(90deg,#0770e3,#00a0de)", label: "✈️ Flug finden" },
                  { href: cur.gygUrl,     bg: "linear-gradient(90deg,#FF5533,#FF8C00)", label: "🎭 Erlebnisse" },
                  { href: cur.check24Url, bg: "linear-gradient(90deg,#003399,#e30613)", label: "✅ CHECK24" },
                ].map(btn => (
                  <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", textAlign: "center", padding: "13px 6px", background: btn.bg, color: "#fff", borderRadius: "12px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    {btn.label}
                  </a>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <button onClick={next} style={{ padding: "13px", borderRadius: "12px", border: `2px solid ${color}44`, background: `${color}10`, color, fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>
                  😈 Alternatives Leben
                </button>
                <button onClick={() => setShowShare(true)} style={{ padding: "13px", borderRadius: "12px", border: "2px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>
                  📲 Teilen
                </button>
              </div>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <button onClick={reset} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "13px", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>
                  ↩ Neu starten
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Share modal */}
      {showShare && cur && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: `2px solid ${color}44`, borderRadius: "24px", boxShadow: "0 24px 80px rgba(15,23,42,0.20)", padding: "40px 32px", maxWidth: "380px", width: "100%", textAlign: "center", position: "relative" }}>
            <button onClick={() => setShowShare(false)} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: "#94A3B8", fontSize: 24, cursor: "pointer" }}>×</button>
            <div style={{ fontSize: 52, marginBottom: 10 }}>{VIBES.find(v => v.id === cur.vibe)?.emoji || "✈️"}</div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{cur.destination}</div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>„{cur.teaser}"</div>
            <button
              onClick={() => { const t = `✈️ Mein Reise-Ich: ${cur.destination}\n„${cur.teaser}"\n\nFinde dein Reise-Ich → traumreise.ai`; if (navigator.share) navigator.share({ text: t }); else navigator.clipboard?.writeText(t); }}
              style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${color},${color}bb)`, color: "#000", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
              📲 Teile dein Reise-Ich
            </button>
          </div>
        </div>
      )}

      {showEmail && <EmailPopup destination={cur?.destination || ""} onClose={() => setShowEmail(false)} />}
    </>
  );
}

// ── FinderPage wrapper (light, with Header + Footer) ──────────────────────────
export default function FinderPage() {
  const [page, setPage] = useState("home");

  return (
    <>
      <Header />
      <main
        style={{
          paddingTop: "68px",
          minHeight: "100vh",
          background: "linear-gradient(160deg, #F0F9FF 0%, #ECFEFF 35%, #F8FAFF 100%)",
          overflowX: "hidden",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px clamp(16px,4vw,40px) 80px" }}>
          {/* White card wrapper */}
          <div style={{ background: "#FFFFFF", borderRadius: "28px", border: "1px solid #E2E8F0", boxShadow: "0 8px 48px rgba(15,23,42,0.08)", padding: "clamp(28px,5vw,48px)" }}>
            {page === "home"    && <Home onSelect={setPage} />}
            {page === "classic" && <Classic onBack={() => setPage("home")} />}
            {page === "zukunft" && <Zukunft onBack={() => setPage("home")} />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
