"use client";
import { useState, useEffect, useRef } from "react";
import {
  Waves, Mountain, Building2, Landmark, UtensilsCrossed, Leaf,
  Globe, Flower2, Music,
  Plane, Compass, Map, Sparkles,
  MapPin, Mail, ShieldCheck, CheckCircle2,
  Share2, RotateCcw,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VisualTravelWizard from "@/components/finder/VisualTravelWizard";
import { moodOptions, seasonOptions, durationOptions, budgetOptions } from "@/data/finderOptions";

// ── Data constants ────────────────────────────────────────────────────────────
const VIBES = [
  { id: "relax",     Icon: Waves,           label: "Entspannung", color: "#00C9A7" },
  { id: "adventure", Icon: Mountain,        label: "Abenteuer",   color: "#FF6B35" },
  { id: "city",      Icon: Building2,       label: "Städtetrip",  color: "#A78BFA" },
  { id: "culture",   Icon: Landmark,        label: "Kultur",      color: "#F59E0B" },
  { id: "food",      Icon: UtensilsCrossed, label: "Kulinarik",   color: "#F472B6" },
  { id: "nature",    Icon: Leaf,            label: "Natur",       color: "#22C55E" },
  { id: "wellness",  Icon: Flower2,         label: "Wellness",    color: "#06B6D4" },
  { id: "party",     Icon: Music,           label: "Nightlife",   color: "#FB923C" },
];
const LOADING_MSGS = [
  "KI analysiert deine Persönlichkeit…",
  "Dein alternatives Leben wird berechnet…",
  "Wir schreiben deine Geschichte…",
  "Fast fertig — dein Reise-Ich erwacht…",
];

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

// ── AffiliateCard (light design, links/logic unchanged) ───────────────────────
function AffiliateCard({ destination, country, tagline, highlights, bookingUrl, trivagoUrl, skyUrl, gygUrl, check24Url }) {
  const btns = [
    { href: trivagoUrl,  bg: "linear-gradient(90deg,#d00e17,#ff4d57)",  label: "Hotels auf Trivago" },
    { href: bookingUrl,  bg: "linear-gradient(90deg,#003580,#0057b8)",  label: "Hotel auf Booking.com" },
    { href: skyUrl,      bg: "linear-gradient(90deg,#0770e3,#00a0de)",  label: "Flüge auf Skyscanner" },
    { href: gygUrl,      bg: "linear-gradient(90deg,#FF5533,#FF8C00)",  label: "Aktivitäten GetYourGuide" },
    { href: check24Url,  bg: "linear-gradient(90deg,#003399,#e30613)",  label: "Pauschalreise CHECK24" },
  ];
  return (
    <div
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "20px", overflow: "hidden", boxShadow: "0 2px 16px rgba(15,23,42,0.06)", transition: "transform .3s, box-shadow .3s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(14,165,233,0.16)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(15,23,42,0.06)"; }}
    >
      <div style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)", padding: "28px 24px 20px", textAlign: "center", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "#FFFFFF", border: "1.5px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={24} strokeWidth={1.5} color="#0EA5E9" />
          </div>
        </div>
        <div style={{ fontSize: "22px", fontFamily: "var(--font-heading)", fontWeight: 700, color: "#0F172A" }}>{destination}</div>
        <div style={{ fontSize: "13px", color: "#0EA5E9", marginTop: "4px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>{country}</div>
        <div style={{ fontSize: "14px", color: "#64748B", marginTop: "8px", fontStyle: "italic" }}>{tagline}</div>
      </div>
      <div style={{ padding: "16px 24px" }}>
        {highlights.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "8px" }}>
            <CheckCircle2 size={14} strokeWidth={2} color="#0EA5E9" style={{ flexShrink: 0, marginTop: "2px" }} />
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
    background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "24px",
    boxShadow: "0 24px 80px rgba(15,23,42,0.20)", maxWidth: "420px", width: "100%",
  };

  if (done) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...modalCard, padding: "40px 32px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)", border: "1.5px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Mail size={28} strokeWidth={1.5} color="#0EA5E9" />
          </div>
        </div>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "10px" }}>Fast geschafft!</h3>
        <p style={{ color: "#64748B", fontSize: "15px", lineHeight: 1.7, marginBottom: "24px" }}>
          Wir haben dir eine <strong style={{ color: "#0EA5E9" }}>Bestätigungsmail</strong> geschickt.<br />Klick auf den Link — dann bist du dabei!
        </p>
        <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#0EA5E9,#06B6D4)", color: "#fff", fontWeight: 700, fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 16px rgba(14,165,233,0.35)" }}>
          Alles klar
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.72)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ ...modalCard, padding: "36px 32px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 18, background: "none", border: "none", color: "#94A3B8", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)", border: "1.5px solid #BFDBFE", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plane size={24} strokeWidth={1.5} color="#0EA5E9" />
            </div>
          </div>
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
          style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: valid ? "linear-gradient(135deg,#0EA5E9,#06B6D4)" : "#F1F5F9", color: valid ? "#fff" : "#94A3B8", fontWeight: 700, fontSize: "15px", cursor: valid ? "pointer" : "not-allowed", fontFamily: "inherit", boxShadow: valid ? "0 4px 16px rgba(14,165,233,0.35)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Mail size={16} strokeWidth={2} />
          Kostenlos anmelden
        </button>
        <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "12px" }}>
          {[
            { icon: ShieldCheck, text: "Kein Spam" },
            { icon: CheckCircle2, text: "DSGVO-konform" },
          ].map(({ icon: Icon, text }) => (
            <span key={text} style={{ fontSize: "11px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
              <Icon size={11} strokeWidth={2} />
              {text}
            </span>
          ))}
          <span style={{ fontSize: "11px", color: "#94A3B8" }}>Abmelden</span>
        </div>
      </div>
    </div>
  );
}

// ── Home screen ───────────────────────────────────────────────────────────────
function Home({ onSelect }) {
  return (
    <div style={{ textAlign: "center", animation: "fadeUp .55s ease both" }}>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 18px", borderRadius: "20px", background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: "12px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#0284C7", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
          <Compass size={13} strokeWidth={2} />
          Dein persönlicher Reise-Kompass
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
          { id: "classic", Icon: Map,      title: "Reiseziel-Finder",         desc: "Schritt für Schritt zum perfekten Reiseziel — mit Interessen, Budget & Affiliate-Links", color: "#0EA5E9", badge: null },
          { id: "zukunft", Icon: Sparkles, title: "Dein Reise-Zukunfts-Ich",  desc: "Sieh wie dein Leben aussieht wenn du diesen Trip machst — emotional & viral", color: "#A78BFA", badge: "Neu" },
        ].map(m => {
          const ModeIcon = m.Icon;
          return (
            <button key={m.id} onClick={() => onSelect(m.id)}
              style={{ padding: "28px 22px", borderRadius: "20px", textAlign: "left", border: "2px solid #E2E8F0", background: "#FFFFFF", cursor: "pointer", transition: "all .25s", position: "relative", fontFamily: "inherit", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
              onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${m.color}`; e.currentTarget.style.boxShadow = `0 8px 32px ${m.color}40`; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.border = "2px solid #E2E8F0"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
              {m.badge && <div style={{ position: "absolute", top: 12, right: 12, fontSize: "10px", background: `${m.color}18`, border: `1px solid ${m.color}44`, color: m.color, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>{m.badge}</div>}
              <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: `${m.color}15`, border: `1.5px solid ${m.color}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                <ModeIcon size={24} strokeWidth={1.5} color={m.color} />
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>{m.title}</div>
              <div style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6 }}>{m.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Classic (visual wizard, ALL affiliate/API logic unchanged) ────────────────
function Classic({ onBack }) {
  const [freeText, setFreeText] = useState("");
  const [interests, setInterests] = useState([]);
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [personality, setPersonality] = useState(null);
  const [error, setError] = useState("");
  const [showEmail, setShowEmail] = useState(false);

  // Immutable defaults for affiliate URL building (no UI in new wizard)
  const adults = 2;
  const children = 0;
  const checkin = "";
  const checkout = "";
  const departure = "";

  const toggleMood = id =>
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length >= 3 ? prev : [...prev, id]
    );

  const canSubmit = interests.length > 0 && !!season && !!duration && !!budget;

  const currentStep = !interests.length ? 1 : !season ? 2 : !duration ? 3 : !budget ? 4 : 5;

  const reset = () => {
    setFreeText(""); setInterests([]); setBudget("");
    setDuration(""); setSeason("");
    setResults(null); setPersonality(null); setError("");
  };

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
      const iL = interests.map(id => moodOptions.find(m => m.id === id)?.label).filter(Boolean).join(", ");
      const prompt = `Du bist ein einfuehlsamer Reise-Experte. Schlage genau 3 Reiseziele vor:\nPERSOENLICHE BESCHREIBUNG: "${freeText}"\nInteressen: ${iL} | Budget: ${budgetOptions.find(b => b.id === budget)?.label} | Dauer: ${durationOptions.find(d => d.id === duration)?.label} | Reisezeit: ${seasonOptions.find(s => s.id === season)?.label} | Reisende: ${adults} Erwachsene${children > 0 ? `, ${children} Kinder` : ""}\nAntworte NUR als JSON ohne Markdown:\n{"personality":{"types":["Emoji Text","Emoji Text","Emoji Text"],"summary":"Poetischer Satz"},"destinations":[{"destination":"Stadtname","country":"Land","tagline":"kurzer Satz max 10 Woerter","highlights":["1","2","3"],"skySearch":"Stadtname englisch","iata":"IATA-Code des naechsten Flughafens zB LIS MUC BCN"}]}`;
      const res = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1200, messages: [{ role: "user", content: prompt }] }) });
      const data = await res.json();
      const parsed = JSON.parse(data.content?.map(b => b.text || "").join("").replace(/```json|```/g, "").trim());
      setPersonality(parsed.personality);
      setResults(parsed.destinations.map(d => ({ ...d, ...buildAffiliateUrls(d) })));
    } catch { setError("Fehler. Bitte nochmal versuchen."); }
    setLoading(false);
  };

  return (
    <>
      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ width: "48px", height: "48px", border: "3px solid #BAE6FD", borderTopColor: "#0EA5E9", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto 18px" }} />
          <div style={{ color: "#64748B", fontSize: "15px", fontWeight: 500 }}>Deine Traumreise wird vorbereitet…</div>
        </div>
      )}

      {/* Results */}
      {!loading && results && (
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
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "11px", color: "#0284C7", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
              <Sparkles size={13} strokeWidth={2} />
              Deine Empfehlungen
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "26px", fontWeight: 700, margin: 0, color: "#0F172A" }}>3 perfekte Reiseziele</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "18px", marginBottom: "24px" }}>
            {results.map((d, i) => <AffiliateCard key={i} {...d} />)}
          </div>

          <div style={{ background: "linear-gradient(135deg,#EFF6FF,#ECFEFF)", border: "1px solid #BAE6FD", borderRadius: "16px", padding: "20px 24px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <Mail size={20} strokeWidth={1.5} color="#0EA5E9" style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A", marginBottom: "4px" }}>Reiseplan per Mail erhalten</div>
                <div style={{ fontSize: "13px", color: "#64748B" }}>Wöchentlich Deals & Inspiration</div>
              </div>
            </div>
            <button onClick={() => setShowEmail(true)} style={{ padding: "11px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#0EA5E9,#06B6D4)", color: "#fff", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(14,165,233,0.35)", whiteSpace: "nowrap" }}>Kostenlos →</button>
          </div>

          <div style={{ textAlign: "center", fontSize: "11px", color: "#94A3B8", marginBottom: "16px" }}>
            * Affiliate-Links — für dich entstehen keine Mehrkosten
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={reset}
              style={{ padding: "11px 26px", borderRadius: "10px", border: "2px solid #E2E8F0", background: "#FFFFFF", color: "#475569", cursor: "pointer", fontSize: "14px", fontFamily: "inherit", boxShadow: "0 1px 4px rgba(15,23,42,0.06)", transition: "all .2s", display: "inline-flex", alignItems: "center", gap: "7px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0EA5E9"; e.currentTarget.style.color = "#0EA5E9"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569"; }}>
              <RotateCcw size={14} strokeWidth={2} />
              Neue Suche
            </button>
          </div>
        </div>
      )}

      {/* Visual wizard form */}
      {!loading && !results && (
        <VisualTravelWizard
          freeText={freeText}
          onFreeTextChange={setFreeText}
          interests={interests}
          onToggleMood={toggleMood}
          season={season}
          onSeasonChange={setSeason}
          duration={duration}
          onDurationChange={setDuration}
          budget={budget}
          onBudgetChange={setBudget}
          currentStep={currentStep}
          canSubmit={canSubmit}
          onSubmit={fetch_}
          onBack={onBack}
          error={error}
        />
      )}

      {showEmail && <EmailPopup destination={results?.[0]?.destination || ""} onClose={() => setShowEmail(false)} />}
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
      const prompt = `Du bist ein poetischer Reise-Storyteller. Erstelle 3 verschiedene Reise-Ich Szenarien.\nBESCHREIBUNG: "${text || "keine"}"\nVIBES: ${vL}\nNUR JSON-Array:\n[{"destination":"Stadt","country":"Land","vibe":"${vibes[0] || "relax"}","identity_title":"Titel","teaser":"1 Satz","story":"3-4 Saetze du-Form Gegenwart emotional","moment":"1 magischer Moment","bookingCity":"englisch","skyCity":"englisch"}]`;
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
  const VibeIcon = cur ? (VIBES.find(v => v.id === cur.vibe)?.Icon || Globe) : Globe;

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
              const VIcon = v.Icon;
              return (
                <button key={v.id} onClick={() => toggle(v.id)}
                  style={{ padding: "14px 8px", borderRadius: "16px", border: `2px solid ${sel ? v.color : "#E2E8F0"}`, background: sel ? `${v.color}15` : "#FFFFFF", cursor: "pointer", transition: "all .25s", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", boxShadow: sel ? `0 4px 16px ${v.color}44` : "0 1px 4px rgba(15,23,42,0.06)", fontFamily: "inherit" }}>
                  <VIcon size={22} strokeWidth={1.5} color={sel ? v.color : "#94A3B8"} />
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
              style={{ padding: "16px 40px", borderRadius: "14px", border: "none", fontSize: "16px", fontWeight: 700, background: vibes.length > 0 ? "linear-gradient(135deg,#A78BFA,#7C3AED)" : "#F1F5F9", color: vibes.length > 0 ? "#fff" : "#94A3B8", cursor: vibes.length > 0 ? "pointer" : "not-allowed", boxShadow: vibes.length > 0 ? "0 6px 28px rgba(167,139,250,.4)" : "none", fontFamily: "inherit", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={16} strokeWidth={2} />
              Zeig mir mein Reise-Ich
            </button>
          </div>
        </div>
      )}

      {/* Step 1 — Loading */}
      {zStep === 1 && (
        <div style={{ textAlign: "center", padding: "90px 0", animation: "fadeIn .4s ease" }}>
          <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 28px" }}>
            <div style={{ width: 80, height: 80, border: "3px solid #EDE9FE", borderTopColor: "#A78BFA", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Sparkles size={28} strokeWidth={1.5} color="#A78BFA" />
            </div>
          </div>
          <div style={{ fontSize: 15, color: "#64748B", fontStyle: "italic", fontWeight: 500 }}>{LOADING_MSGS[msgIdx]}</div>
        </div>
      )}

      {/* Step 2 — Story */}
      {zStep === 2 && cur && (
        <div style={{ animation: "fadeIn .5s ease" }}>
          <div style={{ position: "relative", borderRadius: "24px", overflow: "hidden", backgroundColor: "#FFFFFF", background: `linear-gradient(160deg, ${color}14, ${color}07, transparent)`, border: `2px solid ${color}40`, padding: "36px 28px 28px", marginBottom: "24px", boxShadow: `0 8px 32px ${color}22, 0 2px 8px rgba(15,23,42,0.06)` }}>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ fontSize: "11px", color, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "10px", fontWeight: 700, fontFamily: "var(--font-heading)" }}>
                Dein Reise-Ich · #{idx + 1} von {results.length}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: `${color}18`, border: `1.5px solid ${color}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <VibeIcon size={26} strokeWidth={1.5} color={color} />
                </div>
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
                <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "flex-start", gap: "10px", animation: "fadeUp .5s ease" }}>
                  <Sparkles size={15} strokeWidth={2} color={color} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "15px", color, fontStyle: "italic", fontWeight: 600 }}>{cur.moment}</span>
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
                  { href: cur.trivagoUrl, bg: "linear-gradient(90deg,#d00e17,#ff4d57)", label: "Hotels Trivago" },
                  { href: cur.bookingUrl, bg: "linear-gradient(90deg,#003580,#0057b8)", label: "Booking.com" },
                  { href: cur.skyUrl,     bg: "linear-gradient(90deg,#0770e3,#00a0de)", label: "Flug finden" },
                  { href: cur.gygUrl,     bg: "linear-gradient(90deg,#FF5533,#FF8C00)", label: "Erlebnisse" },
                  { href: cur.check24Url, bg: "linear-gradient(90deg,#003399,#e30613)", label: "CHECK24" },
                ].map(btn => (
                  <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", textAlign: "center", padding: "13px 6px", background: btn.bg, color: "#fff", borderRadius: "12px", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}
                    onMouseEnter={e => e.currentTarget.style.opacity = ".85"} onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    {btn.label}
                  </a>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
                <button onClick={next} style={{ padding: "13px", borderRadius: "12px", border: `2px solid ${color}44`, background: `${color}10`, color, fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                  <RotateCcw size={14} strokeWidth={2} />
                  Alternatives Leben
                </button>
                <button onClick={() => setShowShare(true)} style={{ padding: "13px", borderRadius: "12px", border: "2px solid #E2E8F0", background: "#FFFFFF", color: "#475569", fontWeight: 700, fontSize: "14px", cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                  <Share2 size={14} strokeWidth={2} />
                  Teilen
                </button>
              </div>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <button onClick={reset} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: "13px", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>
                  ← Neu starten
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
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "20px", background: `${color}15`, border: `1.5px solid ${color}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <VibeIcon size={28} strokeWidth={1.5} color={color} />
              </div>
            </div>
            <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "#0F172A", marginBottom: 10 }}>{cur.destination}</div>
            <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>„{cur.teaser}"</div>
            <button
              onClick={() => { const t = `Mein Reise-Ich: ${cur.destination}\n„${cur.teaser}"\n\nFinde dein Reise-Ich → traumreise.ai`; if (navigator.share) navigator.share({ text: t }); else navigator.clipboard?.writeText(t); }}
              style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: `linear-gradient(135deg,${color},${color}bb)`, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Share2 size={16} strokeWidth={2} />
              Teile dein Reise-Ich
            </button>
          </div>
        </div>
      )}

      {showEmail && <EmailPopup destination={cur?.destination || ""} onClose={() => setShowEmail(false)} />}
    </>
  );
}

// ── FinderPage wrapper ────────────────────────────────────────────────────────
export default function FinderPage() {
  const [page, setPage] = useState("home");
  const isClassic = page === "classic";

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
        <div style={{
          maxWidth: isClassic ? "1320px" : "860px",
          margin: "0 auto",
          padding: `${isClassic ? "40px" : "60px"} clamp(16px,4vw,40px) 80px`,
          transition: "max-width 0.4s ease",
        }}>
          <div style={{
            background: "#FFFFFF",
            borderRadius: "28px",
            border: "1px solid #E2E8F0",
            boxShadow: "0 8px 48px rgba(15,23,42,0.08)",
            padding: isClassic ? "clamp(24px,4vw,40px)" : "clamp(28px,5vw,48px)",
          }}>
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
