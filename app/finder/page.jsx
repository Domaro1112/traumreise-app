"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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
  { id: "culture",   emoji: "🏛️", label: "Kultur",      color: "#FBBF24" },
  { id: "food",      emoji: "🍜", label: "Kulinarik",   color: "#F472B6" },
  { id: "nature",    emoji: "🌿", label: "Natur",       color: "#4ADE80" },
  { id: "wellness",  emoji: "🧘", label: "Wellness",    color: "#67E8F9" },
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
const STARS = Array.from({ length: 50 }, () => ({
  w: Math.random() * 2 + 1,
  top: Math.random() * 100,
  left: Math.random() * 100,
  op: Math.random() * 0.5 + 0.1,
  dur: Math.random() * 3 + 2,
  delay: Math.random() * 4,
}));

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600&q=80",
  "https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1600&q=80",
];

function Chip({ label, desc, selected, color = "#FFD700", onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: desc ? "12px 16px" : "10px 18px",
      borderRadius: "12px",
      border: `1.5px solid ${selected ? color : "rgba(255,255,255,.12)"}`,
      background: selected ? `${color}18` : "rgba(255,255,255,.03)",
      color: selected ? color : "rgba(255,255,255,.7)",
      cursor: "pointer", transition: "all .2s", textAlign: "left",
      fontSize: "14px", fontWeight: selected ? 600 : 400, lineHeight: 1.3,
      boxShadow: selected ? `0 0 14px ${color}33` : "none",
      fontFamily: "inherit",
    }}>
      <div>{label}</div>
      {desc && <div style={{ fontSize: "11px", opacity: .6, marginTop: "2px" }}>{desc}</div>}
    </button>
  );
}

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

function AffiliateCard({ destination, country, imageEmoji, tagline, highlights, bookingUrl, trivagoUrl, skyUrl, gygUrl, check24Url }) {
  const btns = [
    { href: trivagoUrl,  bg: "linear-gradient(90deg,#d00e17,#ff4d57)",  label: "🏨 Hotels auf Trivago" },
    { href: bookingUrl,  bg: "linear-gradient(90deg,#003580,#0057b8)",  label: "🛏️ Hotel auf Booking.com" },
    { href: skyUrl,      bg: "linear-gradient(90deg,#0770e3,#00a0de)",  label: "✈️ Flüge auf Skyscanner" },
    { href: gygUrl,      bg: "linear-gradient(90deg,#FF5533,#FF8C00)",  label: "🎭 Aktivitäten GetYourGuide" },
    { href: check24Url,  bg: "linear-gradient(90deg,#003399,#e30613)",  label: "✅ Pauschalreise CHECK24" },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,215,100,.15)", borderRadius: "20px", overflow: "hidden", transition: "transform .3s,box-shadow .3s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(255,180,50,.15)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
      <div style={{ background: "linear-gradient(135deg,rgba(255,180,50,.2),rgba(255,100,80,.15))", padding: "28px 24px 20px", textAlign: "center", borderBottom: "1px solid rgba(255,215,100,.1)" }}>
        <div style={{ fontSize: "52px", marginBottom: "8px" }}>{imageEmoji}</div>
        <div style={{ fontSize: "22px", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "#fff" }}>{destination}</div>
        <div style={{ fontSize: "13px", color: "#FFD700", marginTop: "4px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>{country}</div>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,.65)", marginTop: "8px", fontStyle: "italic" }}>{tagline}</div>
      </div>
      <div style={{ padding: "16px 24px" }}>
        {highlights.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
            <span style={{ color: "#FFD700", fontSize: "14px" }}>✦</span>
            <span style={{ color: "rgba(255,255,255,.75)", fontSize: "13px" }}>{h}</span>
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

function EmailPopup({ destination = "", onClose }) {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const valid = email.includes("@") && email.includes(".") && agreed;

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "linear-gradient(160deg,#0d1220,#07070f)", border: "1px solid rgba(255,215,0,.2)", borderRadius: "24px", padding: "40px 32px", maxWidth: "420px", width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "52px", marginBottom: "16px" }}>📬</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Fast geschafft!</h3>
        <p style={{ color: "rgba(255,255,255,.55)", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
          Wir haben dir eine <strong style={{ color: "#FFD700" }}>Bestätigungsmail</strong> geschickt.<br />Klick auf den Link — dann bist du dabei!
        </p>
        <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: "10px", border: "none", background: "linear-gradient(90deg,#FFD700,#FF8C00)", color: "#0a0a14", fontWeight: 700, fontSize: "15px", cursor: "pointer" }}>
          Alles klar 👍
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.8)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "linear-gradient(160deg,#0d1220,#07070f)", border: "1px solid rgba(255,215,0,.2)", borderRadius: "24px", padding: "36px 32px", maxWidth: "420px", width: "100%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: 22, cursor: "pointer" }}>×</button>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>✈️</div>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Reise-Inspiration ins Postfach</h3>
          <p style={{ color: "rgba(255,255,255,.5)", fontSize: "14px", lineHeight: 1.6 }}>
            {destination ? `Erhalte deinen ${destination}-Reiseplan + wöchentlich die besten Deals.` : "Wöchentlich die besten Deals & Inspiration."}
          </p>
        </div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.de"
          style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.06)", border: `1.5px solid ${email.includes("@") ? "rgba(255,215,0,.4)" : "rgba(255,255,255,.12)"}`, borderRadius: "12px", padding: "13px 16px", color: "#fff", fontSize: "15px", outline: "none", marginBottom: "14px", fontFamily: "inherit" }} />
        <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "20px" }}>
          <div onClick={() => setAgreed(a => !a)} style={{ width: "20px", height: "20px", minWidth: "20px", borderRadius: "5px", border: `1.5px solid ${agreed ? "#FFD700" : "rgba(255,255,255,.2)"}`, background: agreed ? "rgba(255,215,0,.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px", cursor: "pointer" }}>
            {agreed && <span style={{ color: "#FFD700", fontSize: "13px", fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,.4)", lineHeight: 1.6 }}>
            Ich bin einverstanden, Reise-Inspiration & Angebote per Mail zu erhalten. Abmeldung jederzeit möglich.
          </span>
        </label>
        <button onClick={() => valid && setDone(true)} disabled={!valid}
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: valid ? "linear-gradient(90deg,#FFD700,#FF8C00)" : "rgba(255,255,255,.08)", color: valid ? "#0a0a14" : "rgba(255,255,255,.2)", fontWeight: 700, fontSize: "15px", cursor: valid ? "pointer" : "not-allowed", fontFamily: "inherit" }}>
          📬 Kostenlos anmelden
        </button>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "12px" }}>
          {["🔒 Kein Spam", "✅ DSGVO-konform", "📤 Abmelden"].map(t => (
            <span key={t} style={{ fontSize: "11px", color: "rgba(255,255,255,.25)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Home({ onSelect }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeUp .55s ease both" }}>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "13px", letterSpacing: "4px", color: "#FFD700", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>✦ Dein Reise-Kompass ✦</div>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: 700, margin: "0 0 12px", lineHeight: 1.15, background: "linear-gradient(135deg,#fff 20%,#FFD700 70%,#FF8C00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Wo zieht es dich hin?
        </h1>
        <p style={{ color: "rgba(255,255,255,.45)", fontSize: "15px", fontWeight: 300 }}>Wähle deinen Weg zur Inspiration</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", maxWidth: "560px", margin: "0 auto" }}>
        {[
          { id: "classic", emoji: "🗺️", title: "Reiseziel-Finder", desc: "Schritt für Schritt zum perfekten Reiseziel — mit Interessen, Budget & Affiliate-Links", color: "#FFD700", badge: null },
          { id: "zukunft", emoji: "🔮", title: "Dein Reise-Zukunfts-Ich", desc: "Sieh wie dein Leben aussieht wenn du diesen Trip machst — emotional & viral", color: "#A78BFA", badge: "✨ NEU" },
        ].map(m => (
          <button key={m.id} onClick={() => onSelect(m.id)}
            style={{ padding: "24px 20px", borderRadius: "20px", textAlign: "left", border: `1.5px solid ${m.color}33`, background: "rgba(255,255,255,.03)", cursor: "pointer", transition: "all .25s", position: "relative", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.border = `1.5px solid ${m.color}`; e.currentTarget.style.background = `${m.color}14`; e.currentTarget.style.boxShadow = `0 0 28px ${m.color}33`; }}
            onMouseLeave={e => { e.currentTarget.style.border = `1.5px solid ${m.color}33`; e.currentTarget.style.background = "rgba(255,255,255,.03)"; e.currentTarget.style.boxShadow = "none"; }}>
            {m.badge && <div style={{ position: "absolute", top: 12, right: 12, fontSize: "10px", background: `${m.color}22`, color: m.color, padding: "2px 8px", borderRadius: 20, fontWeight: 700 }}>{m.badge}</div>}
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>{m.emoji}</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{m.title}</div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,.45)", lineHeight: 1.6 }}>{m.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

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
      {step < 4 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "36px" }}>
          {[0, 1, 2, 3].map(i => <div key={i} style={{ height: "4px", width: "48px", borderRadius: "2px", background: i <= step ? "#FFD700" : "rgba(255,255,255,.1)", transition: "background .4s" }} />)}
        </div>
      )}

      {step === 0 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "24px", marginBottom: "8px", fontWeight: 700 }}>Erzähl uns von dir ✍️</h2>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: "14px", marginBottom: "20px", lineHeight: 1.7 }}>Was macht deinen Traumurlaub aus? Schreib einfach drauf los.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} onClick={() => setFreeText(ex)} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", border: "1px solid rgba(255,215,0,.2)", background: "rgba(255,215,0,.05)", color: "rgba(255,255,255,.5)", cursor: "pointer", fontFamily: "inherit" }}
                onMouseEnter={e => e.currentTarget.style.color = "#FFD700"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,.5)"}>
                💡 {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
              </button>
            ))}
          </div>
          <div style={{ position: "relative" }}>
            <textarea value={freeText} onChange={e => setFreeText(e.target.value)} rows={5} placeholder="Ich träume von einem Ort, wo morgens die Gassen noch leer sind…"
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.04)", border: `1.5px solid ${freeText.length >= 20 ? "rgba(255,215,0,.45)" : "rgba(255,255,255,.1)"}`, borderRadius: "14px", padding: "16px 18px 36px", color: "#fff", fontSize: "15px", lineHeight: 1.75, fontFamily: "inherit", fontWeight: 300, resize: "none", outline: "none" }} />
            <div style={{ position: "absolute", bottom: "12px", right: "14px", fontSize: "12px", color: freeText.length >= 20 ? "rgba(255,215,0,.6)" : "rgba(255,255,255,.2)" }}>{freeText.length}{freeText.length < 20 ? ` (noch ${20 - freeText.length})` : " ✓"}</div>
          </div>
          {freeText.length >= 20 && <div style={{ marginTop: "12px", padding: "12px 16px", background: "rgba(255,215,0,.06)", border: "1px solid rgba(255,215,0,.2)", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px" }}><span>✨</span><span style={{ fontSize: "13px", color: "rgba(255,255,255,.6)", fontStyle: "italic" }}>Die KI erkennt deinen Reisetyp.</span></div>}
        </div>
      )}

      {step === 1 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "24px", marginBottom: "8px", fontWeight: 700 }}>Was liebst du an Reisen?</h2>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: "14px", marginBottom: "20px" }}>Mehrfachauswahl möglich</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "12px" }}>
            {INTERESTS.map(i => <Chip key={i.id} label={i.label} desc={i.desc} selected={interests.includes(i.id)} onClick={() => toggle(i.id)} />)}
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "24px", marginBottom: "24px", fontWeight: 700 }}>Rahmenbedingungen</h2>
          {[{ label: "Budget", items: BUDGETS, val: budget, set: setBudget }, { label: "Reisedauer", items: DURATIONS, val: duration, set: setDuration }, { label: "Reisezeit", items: SEASONS, val: season, set: setSeason }].map(({ label, items, val, set }) => (
            <div key={label} style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", color: "#FFD700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>{label}</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {items.map(it => <Chip key={it.id} label={it.label} desc={it.desc} selected={val === it.id} onClick={() => set(it.id)} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {step === 3 && (
        <div style={{ animation: "fadeUp .55s ease both" }}>
          <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "24px", marginBottom: "8px", fontWeight: 700 }}>Wer reist mit?</h2>
          <p style={{ color: "rgba(255,255,255,.45)", fontSize: "14px", marginBottom: "24px" }}>Anzahl der Reisenden festlegen</p>
          {[{ label: "👤 Erwachsene", sub: "18+ Jahre", val: adults, set: setAdults, min: 1 }, { label: "🧒 Kinder", sub: "unter 18 Jahre", val: children, set: setChildren, min: 0 }].map(({ label, sub, val, set, min }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "16px", padding: "20px 24px", marginBottom: "14px" }}>
              <div><div style={{ fontSize: "16px", fontWeight: 600 }}>{label}</div><div style={{ fontSize: "12px", color: "rgba(255,255,255,.4)", marginTop: "2px" }}>{sub}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <button onClick={() => set(v => Math.max(min, v - 1))} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1.5px solid rgba(255,215,0,.4)", background: "transparent", color: "#FFD700", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
                <span style={{ fontSize: "22px", fontWeight: 700, minWidth: "28px", textAlign: "center" }}>{val}</span>
                <button onClick={() => set(v => v + 1)} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1.5px solid rgba(255,215,0,.4)", background: "rgba(255,215,0,.1)", color: "#FFD700", fontSize: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
              </div>
            </div>
          ))}
          <div style={{ marginTop: "16px" }}>
            <div style={{ fontSize: "13px", color: "#FFD700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>🗓️ Reisedaten <span style={{ color: "rgba(255,255,255,.3)", fontSize: "11px", textTransform: "none", fontWeight: 400, letterSpacing: 0 }}>(optional)</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[{ label: "Anreise", val: checkin, set: setCheckin }, { label: "Abreise", val: checkout, set: setCheckout }].map(({ label, val, set }) => (
                <div key={label}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,.4)", marginBottom: "6px" }}>{label}</div>
                  <input type="date" value={val} min={new Date().toISOString().split("T")[0]} onChange={e => set(e.target.value)}
                    style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.05)", border: `1.5px solid ${val ? "rgba(255,215,0,.4)" : "rgba(255,255,255,.1)"}`, borderRadius: "10px", padding: "10px 14px", color: val ? "#fff" : "rgba(255,255,255,.3)", fontSize: "14px", outline: "none", colorScheme: "dark", fontFamily: "inherit" }} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "22px" }}>
            <div style={{ fontSize: "13px", color: "#FFD700", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>✈️ Dein Abflughafen</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: "8px" }}>
              {[{ code: "FRA", label: "🏙️ Frankfurt" },{ code: "MUC", label: "🥨 München" },{ code: "BER", label: "🐻 Berlin" },{ code: "DUS", label: "🌊 Düsseldorf" },{ code: "HAM", label: "⚓ Hamburg" },{ code: "STR", label: "🏰 Stuttgart" },{ code: "CGN", label: "⛪ Köln" },{ code: "VIE", label: "🎻 Wien" },{ code: "ZRH", label: "🏔️ Zürich" }].map(ap => (
                <button key={ap.code} onClick={() => setDeparture(d => d === ap.code ? "" : ap.code)}
                  style={{ padding: "10px 6px", borderRadius: "10px", border: `1.5px solid ${departure === ap.code ? "#FFD700" : "rgba(255,255,255,.1)"}`, background: departure === ap.code ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.03)", color: departure === ap.code ? "#FFD700" : "rgba(255,255,255,.6)", cursor: "pointer", fontSize: "12px", fontWeight: departure === ap.code ? 700 : 400, transition: "all .2s", textAlign: "center", lineHeight: 1.5, fontFamily: "inherit" }}>
                  {ap.label}<br /><span style={{ fontSize: "11px", opacity: .65 }}>{ap.code}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && results && (
        <div style={{ animation: "fadeIn .5s ease" }}>
          {personality && (
            <div style={{ marginBottom: "32px", background: "linear-gradient(135deg,rgba(255,215,0,.08),rgba(255,100,80,.06))", border: "1px solid rgba(255,215,0,.25)", borderRadius: "20px", padding: "26px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ fontSize: "12px", color: "#FFD700", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "12px", fontWeight: 600 }}>Du bist der Typ für</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
                {personality.types.map((t, i) => <span key={i} style={{ padding: "6px 14px", borderRadius: "20px", background: "rgba(255,215,0,.1)", border: "1px solid rgba(255,215,0,.25)", fontSize: "13px", color: "#fff", fontWeight: 500 }}>{t}</span>)}
              </div>
              <div style={{ fontSize: "17px", fontFamily: "'Playfair Display',serif", fontStyle: "italic", color: "rgba(255,255,255,.85)", lineHeight: 1.5 }}>„{personality.summary}"</div>
            </div>
          )}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "13px", color: "#FFD700", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>Deine Empfehlungen</div>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "26px", fontWeight: 700, margin: 0 }}>3 perfekte Reiseziele ✨</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "18px", marginBottom: "24px" }}>
            {results.map((d, i) => <AffiliateCard key={i} {...d} />)}
          </div>
          <div style={{ background: "linear-gradient(135deg,rgba(255,215,0,.08),rgba(167,139,250,.06))", border: "1px solid rgba(255,215,0,.2)", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div><div style={{ fontSize: "15px", fontWeight: 600, color: "#fff", marginBottom: "4px" }}>📬 Reiseplan per Mail erhalten</div><div style={{ fontSize: "13px", color: "rgba(255,255,255,.45)" }}>Wöchentlich Deals & Inspiration</div></div>
            <button onClick={() => setShowEmail(true)} style={{ padding: "11px 22px", borderRadius: "10px", border: "none", background: "linear-gradient(90deg,#FFD700,#FF8C00)", color: "#0a0a14", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>Kostenlos →</button>
          </div>
          <div style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,.2)", marginBottom: "16px" }}>* Affiliate-Links — für dich entstehen keine Mehrkosten 🙏</div>
          <div style={{ textAlign: "center" }}>
            <button onClick={reset} style={{ padding: "11px 26px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,.18)", background: "transparent", color: "rgba(255,255,255,.55)", cursor: "pointer", fontSize: "14px", fontFamily: "inherit" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FFD700"; e.currentTarget.style.color = "#FFD700"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,.18)"; e.currentTarget.style.color = "rgba(255,255,255,.55)"; }}>
              ↩ Neue Suche
            </button>
          </div>
        </div>
      )}

      {loading && <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ width: "48px", height: "48px", border: "3px solid rgba(255,215,0,.2)", borderTopColor: "#FFD700", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 18px" }} /><div style={{ color: "rgba(255,255,255,.55)", fontSize: "15px" }}>KI sucht deine perfekte Reise…</div></div>}
      {error && <div style={{ color: "#FF6B6B", textAlign: "center", padding: "16px", background: "rgba(255,100,100,.08)", borderRadius: "12px" }}>{error}</div>}
      {showEmail && <EmailPopup destination={results?.[0]?.destination || ""} onClose={() => setShowEmail(false)} />}

      {step < 4 && !loading && (
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px" }}>
          <button onClick={() => step === 0 ? onBack() : setStep(s => s - 1)} style={{ padding: "13px 24px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,.14)", background: "transparent", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: "15px", fontWeight: 500, fontFamily: "inherit" }}>
            ← Zurück
          </button>
          <button onClick={() => step < 3 ? setStep(s => s + 1) : fetch_()} disabled={!canGo()}
            style={{ padding: "13px 32px", borderRadius: "10px", border: "none", fontSize: "15px", fontWeight: 700, background: canGo() ? "linear-gradient(90deg,#FFD700,#FF8C00)" : "rgba(255,255,255,.08)", color: canGo() ? "#0a0a14" : "rgba(255,255,255,.2)", cursor: canGo() ? "pointer" : "not-allowed", boxShadow: canGo() ? "0 4px 20px rgba(255,180,0,.3)" : "none", fontFamily: "inherit" }}>
            {step === 3 ? "✨ Reiseziele finden" : "Weiter →"}
          </button>
        </div>
      )}
    </>
  );
}

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
  const color = cur ? (VIBES.find(v => v.id === cur.vibe)?.color || "#FFD700") : "#FFD700";
  const emojis = cur ? (SCENE_EMOJIS[cur.vibe] || SCENE_EMOJIS.relax) : [];

  return (
    <>
      {zStep === 0 && (
        <div style={{ animation: "fadeUp .55s ease .15s both" }}>
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <h2 style={{ fontFamily: "'Playfair Display'", fontSize: "clamp(22px,4vw,30px)", fontWeight: 700, marginBottom: "8px" }}>Wie sieht dein Leben aus,<br />wenn du fährst?</h2>
            <p style={{ color: "rgba(255,255,255,.4)", fontSize: "14px", fontWeight: 300 }}>Keine Hotellisten. Nur du — und dein alternatives Leben.</p>
          </div>
          <div style={{ fontSize: "13px", color: "#A78BFA", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600, textAlign: "center" }}>Welches Gefühl rufst du?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "24px" }}>
            {VIBES.map(v => {
              const sel = vibes.includes(v.id);
              return (
                <button key={v.id} onClick={() => toggle(v.id)} style={{ padding: "14px 8px", borderRadius: "16px", border: `1.5px solid ${sel ? v.color : "rgba(255,255,255,.1)"}`, background: sel ? `${v.color}18` : "rgba(255,255,255,.03)", cursor: "pointer", transition: "all .25s", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", boxShadow: sel ? `0 0 18px ${v.color}44` : "none", fontFamily: "inherit" }}>
                  <span style={{ fontSize: "26px" }}>{v.emoji}</span>
                  <span style={{ fontSize: "11px", color: sel ? v.color : "rgba(255,255,255,.5)", fontWeight: sel ? 600 : 400 }}>{v.label}</span>
                </button>
              );
            })}
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Ich brauche Abstand… oder ich will endlich wieder richtig leben…"
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.04)", border: "1.5px solid rgba(255,255,255,.08)", borderRadius: "14px", padding: "14px 18px", color: "#fff", fontSize: "14px", lineHeight: 1.7, fontFamily: "inherit", fontWeight: 300, resize: "none", outline: "none", marginBottom: "24px" }}
            onFocus={e => e.target.style.borderColor = "rgba(167,139,250,.4)"} onBlur={e => e.target.style.borderColor = "rgba(255,255,255,.08)"} />
          {err && <div style={{ color: "#FF6B6B", textAlign: "center", marginBottom: 16 }}>{err}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={onBack} style={{ padding: "13px 24px", borderRadius: "10px", border: "1.5px solid rgba(255,255,255,.14)", background: "transparent", color: "rgba(255,255,255,.5)", cursor: "pointer", fontSize: "15px", fontWeight: 500, fontFamily: "inherit" }}>← Zurück</button>
            <button onClick={fetch_} disabled={vibes.length === 0}
              style={{ padding: "16px 40px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: 700, background: vibes.length > 0 ? "linear-gradient(90deg,#A78BFA,#7C3AED)" : "rgba(255,255,255,.08)", color: vibes.length > 0 ? "#fff" : "rgba(255,255,255,.2)", cursor: vibes.length > 0 ? "pointer" : "not-allowed", boxShadow: vibes.length > 0 ? "0 6px 28px rgba(167,139,250,.4)" : "none", fontFamily: "inherit" }}>
              🔮 Zeig mir mein Reise-Ich
            </button>
          </div>
        </div>
      )}

      {zStep === 1 && (
        <div style={{ textAlign: "center", padding: "90px 0", animation: "fadeIn .4s ease" }}>
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 28px" }}>
            <div style={{ width: 80, height: 80, border: "3px solid rgba(167,139,250,.2)", borderTopColor: "#A78BFA", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🔮</div>
          </div>
          <div style={{ fontSize: 15, color: "rgba(255,255,255,.55)", fontStyle: "italic" }}>{LOADING_MSGS[msgIdx]}</div>
        </div>
      )}

      {zStep === 2 && cur && (
        <div style={{ animation: "fadeIn .5s ease" }}>
          <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", background: `linear-gradient(160deg,${color}18,${color}06,rgba(0,0,0,.3))`, border: `1.5px solid ${color}33`, padding: "36px 28px 28px", marginBottom: "24px", boxShadow: `0 0 60px ${color}18` }}>
            <FloatingEmoji emojis={emojis} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "11px", color, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 600 }}>Dein Reise-Ich · #{idx + 1} von {results.length}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <span style={{ fontSize: "48px" }}>{cur.emoji}</span>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,4vw,32px)", fontWeight: 700, margin: 0, color: "#fff" }}>{cur.destination}</h2>
                  <div style={{ fontSize: "13px", color, letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{cur.country}</div>
                </div>
              </div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "16px", fontStyle: "italic", color: "rgba(255,255,255,.65)", lineHeight: 1.5, marginBottom: "18px", borderLeft: `3px solid ${color}`, paddingLeft: "14px" }}>„{cur.identity_title}"</div>
              <div style={{ fontSize: "16px", lineHeight: 1.85, color: "rgba(255,255,255,.85)", marginBottom: "20px", minHeight: "90px" }}>
                <TypewriterText text={cur.story} speed={18} onDone={() => { setTextDone(true); setTimeout(() => setShowBtns(true), 400); }} />
              </div>
              {textDone && <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: "14px", padding: "14px 18px", fontSize: "15px", color, fontStyle: "italic", fontWeight: 600, animation: "fadeUp .5s ease" }}>✨ {cur.moment}</div>}
            </div>
          </div>

          {showBtns && (
            <div style={{ animation: "fadeUp .5s ease" }}>
              <div style={{ textAlign: "center", fontSize: "12px", color: "rgba(255,255,255,.35)", marginBottom: "14px", letterSpacing: "1px" }}>ERLEBE DIESES LEBEN JETZT</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                {[
                  { href: cur.trivagoUrl, bg: "linear-gradient(90deg,#d00e17,#ff4d57)", label: "🏨 Hotels Trivago" },
                  { href: cur.bookingUrl, bg: "linear-gradient(90deg,#003580,#0057b8)", label: "🛏️ Booking.com" },
                  { href: cur.skyUrl, bg: "linear-gradient(90deg,#0770e3,#00a0de)", label: "✈️ Flug finden" },
                  { href: cur.gygUrl, bg: "linear-gradient(90deg,#FF5533,#FF8C00)", label: "🎭 Erlebnisse" },
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
                <button onClick={next} style={{ padding: "13px", borderRadius: "12px", border: `1.5px solid ${color}44`, background: `${color}10`, color, fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>😈 Alternatives Leben</button>
                <button onClick={() => setShowShare(true)} style={{ padding: "13px", borderRadius: "12px", border: "1.5px solid rgba(255,255,255,.15)", background: "rgba(255,255,255,.05)", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit" }}>📲 Teilen</button>
              </div>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <button onClick={reset} style={{ background: "none", border: "none", color: "rgba(255,255,255,.3)", fontSize: "13px", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>↩ Neu starten</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showShare && cur && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "linear-gradient(135deg,#0d0d1a,#1a1a2e)", border: `1.5px solid ${color}44`, borderRadius: "24px", padding: "40px 32px", maxWidth: "380px", width: "100%", textAlign: "center", position: "relative" }}>
            <button onClick={() => setShowShare(false)} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: "rgba(255,255,255,.4)", fontSize: 24, cursor: "pointer" }}>×</button>
            <div style={{ fontSize: 52, marginBottom: 10 }}>{VIBES.find(v => v.id === cur.vibe)?.emoji || "✈️"}</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{cur.destination}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>„{cur.teaser}"</div>
            <button onClick={() => { const t = `✈️ Mein Reise-Ich: ${cur.destination}\n„${cur.teaser}"\n\nFinde dein Reise-Ich → traumreise.ai`; if (navigator.share) navigator.share({ text: t }); else navigator.clipboard?.writeText(t); }} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: `linear-gradient(90deg,${color},${color}bb)`, color: "#000", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>📲 Teile dein Reise-Ich</button>
          </div>
        </div>
      )}
      {showEmail && <EmailPopup destination={cur?.destination || ""} onClose={() => setShowEmail(false)} />}
    </>
  );
}

export default function FinderPage() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'Lato',system-ui,sans-serif", color: "#fff", overflowX: "hidden", position: "relative", background: "linear-gradient(160deg,#07070f 0%,#0d1220 50%,#070f07 100%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&family=Lato:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes twinkle{0%,100%{opacity:.08}50%{opacity:.7}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes floatUp{0%{opacity:0;transform:translateY(0) scale(.8)}15%{opacity:.6}85%{opacity:.3}100%{opacity:0;transform:translateY(-300px)}}
        textarea{color:#fff!important}
        textarea::placeholder{color:rgba(255,255,255,.25)!important}
        input[type=date]{color-scheme:dark}
      `}</style>

      {/* Stars */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1 }}>
        {STARS.map((s, i) => <div key={i} style={{ position: "absolute", width: s.w, height: s.w, borderRadius: "50%", background: "#fff", opacity: s.op, top: s.top + "%", left: s.left + "%", animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite` }} />)}
      </div>

      {/* Back link */}
      <div style={{ position: "fixed", top: "16px", left: "16px", zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
          ← Startseite
        </Link>
      </div>

      <div style={{ position: "relative", zIndex: 2, maxWidth: "820px", margin: "0 auto", padding: "80px 20px 80px" }}>
        {page === "home" && <Home onSelect={setPage} />}
        {page === "classic" && <Classic onBack={() => setPage("home")} />}
        {page === "zukunft" && <Zukunft onBack={() => setPage("home")} />}
      </div>
    </div>
  );
}
