"use client";
import { useState, useEffect, useRef } from "react";
import {
  Globe,
  Plane, Map, Sparkles,
  MapPin, Mail, ShieldCheck, CheckCircle2,
  Share2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VisualTravelWizard from "@/components/finder/VisualTravelWizard";
import FinderStartHero from "@/components/finder/FinderStartHero";
import FinderModeCard from "@/components/finder/FinderModeCard";
import FutureSelfWizard from "@/components/finder/FutureSelfWizard";
import FutureLoadingState from "@/components/finder/FutureLoadingState";
import FutureStoryResult from "@/components/finder/FutureStoryResult";
import { moodOptions, seasonOptions, durationOptions, budgetOptions, zukunftVibeOptions } from "@/data/finderOptions";


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
    <div style={{ animation: "fadeUp .55s ease both", padding: "clamp(16px,3vw,32px) 0" }}>
      <div style={{ textAlign: "center", marginBottom: "clamp(24px,4vw,36px)" }}>
        <p style={{ fontSize: "clamp(12px,1.5vw,14px)", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "#0284C7", marginBottom: "8px", fontFamily: "var(--font-heading)", margin: "0 0 8px" }}>
          Wähle dein Erlebnis
        </p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", margin: 0 }}>
          Wie möchtest du starten?
        </h2>
      </div>
      <div className="finder-mode-grid">
        <article>
          <FinderModeCard
            imageUrl="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80"
            color="#0EA5E9"
            badge="Beliebt"
            title="Reiseziel-Finder"
            description="Beantworte ein paar Fragen zu Stimmung, Reisezeit, Dauer und Budget — unsere KI findet deine 3 perfekten Reiseziele mit Hotels & Flügen."
            ctaLabel="Jetzt starten"
            onClick={() => onSelect("classic")}
          />
        </article>
        <article>
          <FinderModeCard
            imageUrl="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"
            color="#A78BFA"
            badge="Neu"
            title="Dein Reise-Zukunfts-Ich"
            description="Entdecke, wie sich dein Leben anfühlt, wenn du diese Reise wirklich machst — emotional, persönlich und unvergesslich."
            ctaLabel="Erlebe dich"
            onClick={() => onSelect("zukunft")}
          />
        </article>
      </div>

      {/* Semantic nav links for SEO/GEO/AEO — visually subtle */}
      <nav
        aria-label="Weitere Angebote"
        style={{
          marginTop: "clamp(28px,4vw,44px)",
          paddingTop: "22px",
          borderTop: "1px solid #F1F5F9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "6px 20px",
        }}
      >
        <span style={{ fontSize: "12px", color: "#94A3B8", fontWeight: 500 }}>
          Mehr entdecken:
        </span>
        {[
          { href: "/reiseblog", label: "Reise-Inspiration im Blog" },
          { href: "/inspiration", label: "Reiseideen" },
          { href: "/so-funktionierts", label: "So funktioniert's" },
        ].map(({ href, label }) => (
          <a
            key={href}
            href={href}
            style={{
              fontSize: "12px",
              color: "#64748B",
              textDecoration: "none",
              fontWeight: 500,
              borderBottom: "1px solid #CBD5E1",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "#0EA5E9")}
            onMouseLeave={e => (e.currentTarget.style.color = "#64748B")}
          >
            {label}
          </a>
        ))}
      </nav>
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

  // Restore state pre-filled from homepage wizard (via sessionStorage)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("traumreise_finder_state");
      if (stored) {
        const s = JSON.parse(stored);
        if (Array.isArray(s.interests) && s.interests.length) setInterests(s.interests);
        if (s.season) setSeason(s.season);
        if (s.duration) setDuration(s.duration);
        if (s.budget) setBudget(s.budget);
        if (s.freeText) setFreeText(s.freeText);
        sessionStorage.removeItem("traumreise_finder_state");
      }
    } catch {}
  }, []);
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
    const nights = { weekend: 4, week: 7, twoweeks: 14, long: 21 }[duration] || 7;
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

// ── Zukunft (premium visual, ALL API/affiliate logic unchanged) ──────────────
function Zukunft({ onBack }) {
  const [vibes, setVibes] = useState([]);
  const [text, setText] = useState("");
  const [zStep, setZStep] = useState(0);
  const [results, setResults] = useState([]);
  const [idx, setIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [err, setErr] = useState("");

  const toggle = id => setVibes(p => p.includes(id) ? p.filter(v => v !== id) : [...p, id]);
  const reset = () => { setZStep(0); setVibes([]); setText(""); setResults([]); setIdx(0); };
  const next = () => setIdx(n => (n + 1) % results.length);

  const fetch_ = async () => {
    setZStep(1); setErr(""); setIdx(0);
    try {
      const vL = vibes.map(id => zukunftVibeOptions.find(v => v.id === id)?.label).join(", ");
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
  const color = cur ? (zukunftVibeOptions.find(v => v.id === cur.vibe)?.color || "#A78BFA") : "#A78BFA";
  const VibeIcon = cur ? (zukunftVibeOptions.find(v => v.id === cur.vibe)?.Icon || Globe) : Globe;

  return (
    <>
      {zStep === 0 && (
        <FutureSelfWizard
          vibes={vibes}
          onToggleVibe={toggle}
          text={text}
          onTextChange={setText}
          onSubmit={fetch_}
          onBack={onBack}
          error={err}
        />
      )}

      {zStep === 1 && <FutureLoadingState />}

      {zStep === 2 && cur && (
        <FutureStoryResult
          key={idx}
          cur={cur}
          idx={idx}
          total={results.length}
          color={color}
          VibeIcon={VibeIcon}
          onNext={next}
          onReset={reset}
          onShare={() => setShowShare(true)}
        />
      )}

      {/* Share modal — unchanged logic */}
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
  const isHome = page === "home";

  // Auto-open Classic when arriving from the homepage wizard
  useEffect(() => {
    try {
      if (sessionStorage.getItem("traumreise_finder_state")) {
        setPage("classic");
      }
    } catch {}
  }, []);

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
        {/* Hero — only visible on home selection screen */}
        {isHome && <FinderStartHero />}

        <div style={{
          maxWidth: isClassic ? "1320px" : "860px",
          margin: "0 auto",
          padding: `${isClassic ? "40px" : "40px"} clamp(16px,4vw,40px) 80px`,
          transition: "max-width 0.4s ease",
        }}>
          {isHome ? (
            <Home onSelect={setPage} />
          ) : (
            <div style={{
              background: "#FFFFFF",
              borderRadius: "28px",
              border: "1px solid #E2E8F0",
              boxShadow: "0 8px 48px rgba(15,23,42,0.08)",
              padding: isClassic ? "clamp(24px,4vw,40px)" : "clamp(28px,5vw,48px)",
            }}>
              {page === "classic" && <Classic onBack={() => setPage("home")} />}
              {page === "zukunft" && <Zukunft onBack={() => setPage("home")} />}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
