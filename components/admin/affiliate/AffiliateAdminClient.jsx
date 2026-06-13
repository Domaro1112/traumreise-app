'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Settings, BarChart2, Save, CheckCircle, AlertCircle,
  RefreshCw, Hotel, Compass, ShoppingCart, Sun, ShoppingBag,
  Plane, TrendingUp, MapPin, ToggleLeft, ToggleRight,
} from 'lucide-react';

const PROVIDERS = [
  {
    id:          'booking',
    name:        'Booking.com',
    icon:        Hotel,
    param:       'aid',
    placeholder: 'z.B. 1234567',
    color:       '#003580',
    bg:          '#EEF3FB',
    href:        'https://partner.booking.com',
  },
  {
    id:          'getyourguide',
    name:        'GetYourGuide',
    icon:        Compass,
    param:       'partner_id',
    placeholder: 'z.B. P12345AB',
    color:       '#FF5533',
    bg:          '#FFF3F0',
    href:        'https://partner.getyourguide.com',
  },
  {
    id:          'check24',
    name:        'CHECK24',
    icon:        ShoppingCart,
    param:       'pid',
    placeholder: 'z.B. 123456',
    color:       '#E2001A',
    bg:          '#FEF2F2',
    href:        'https://www.check24.de/partner',
  },
  {
    id:          'holidaycheck',
    name:        'HolidayCheck',
    icon:        Sun,
    param:       'ref',
    placeholder: 'z.B. HC-REF-123',
    color:       '#F97316',
    bg:          '#FFF7ED',
    href:        'https://www.holidaycheck.de/affiliate',
  },
  {
    id:          'amazon',
    name:        'Amazon',
    icon:        ShoppingBag,
    param:       'tag',
    placeholder: 'z.B. apearound-21',
    color:       '#FF9900',
    bg:          '#FFFBEB',
    href:        'https://partnernet.amazon.de',
  },
  {
    id:          'expedia',
    name:        'Expedia',
    icon:        Plane,
    param:       'affcid',
    placeholder: 'z.B. EXPDE123',
    color:       '#00355F',
    bg:          '#EFF6FF',
    href:        'https://affiliates.expediagroup.com',
  },
];

const PROVIDER_LABELS = Object.fromEntries(PROVIDERS.map(p => [p.id, p.name]));

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: '#F8FAFF',
      border: '1.5px solid #E2E8F0',
      borderRadius: '16px',
      padding: '20px 24px',
      flex: '1 1 140px',
    }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 6px' }}>
        {label}
      </p>
      <p style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: '0 0 2px', letterSpacing: '-0.04em' }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>{sub}</p>}
    </div>
  );
}

function TopTable({ title, icon: Icon, rows, keyField, labelField }) {
  if (!rows?.length) return null;
  const max = rows[0]?.[keyField] ?? 1;
  return (
    <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '20px 24px', flex: '1 1 260px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Icon size={15} strokeWidth={2} color="#0EA5E9" />
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{title}</h3>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((row, i) => {
          const label = PROVIDER_LABELS[row[labelField]] ?? row[labelField];
          const pct = Math.round((row[keyField] / max) * 100);
          return (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{label}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{row[keyField]}</span>
              </div>
              <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #0EA5E9, #06B6D4)', borderRadius: '4px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AffiliateAdminClient() {
  const [activeTab, setActiveTab] = useState('settings');

  // Settings state
  const [settings, setSettings] = useState(() =>
    PROVIDERS.map(p => ({ provider: p.id, affiliate_id: '', enabled: true }))
  );
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState(null);

  // Load settings on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/affiliate/settings');
        if (!res.ok) throw new Error('Fehler beim Laden.');
        const { settings: rows } = await res.json();
        // Merge DB rows into PROVIDERS order (DB might have fewer rows)
        setSettings(PROVIDERS.map(p => {
          const row = rows.find(r => r.provider === p.id);
          return { provider: p.id, affiliate_id: row?.affiliate_id ?? '', enabled: row?.enabled ?? true };
        }));
      } catch {
        // Keep defaults on error
      } finally {
        setSettingsLoading(false);
      }
    }
    load();
  }, []);

  // Load stats when tab opens
  const loadStats = useCallback(async () => {
    if (stats) return;
    setStatsLoading(true);
    setStatsError(null);
    try {
      const res = await fetch('/api/admin/affiliate/stats');
      if (!res.ok) throw new Error('Fehler beim Laden der Statistiken.');
      setStats(await res.json());
    } catch (err) {
      setStatsError(err.message ?? 'Unbekannter Fehler.');
    } finally {
      setStatsLoading(false);
    }
  }, [stats]);

  useEffect(() => {
    if (activeTab === 'stats') loadStats();
  }, [activeTab, loadStats]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const res = await fetch('/api/admin/affiliate/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Fehler beim Speichern.');
      }
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3500);
    }
  };

  const updateField = (provider, field, value) => {
    setSettings(prev => prev.map(s => s.provider === provider ? { ...s, [field]: value } : s));
  };

  const tabStyle = (id) => ({
    padding: '8px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: activeTab === id ? 700 : 500,
    color: activeTab === id ? '#0EA5E9' : '#64748B',
    background: activeTab === id ? '#EFF6FF' : 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    transition: 'all 0.12s',
  });

  return (
    <div>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '1px' }}>
        <button style={tabStyle('settings')} onClick={() => setActiveTab('settings')}>
          <Settings size={14} strokeWidth={2} />
          Affiliate-IDs
        </button>
        <button style={tabStyle('stats')} onClick={() => setActiveTab('stats')}>
          <BarChart2 size={14} strokeWidth={2} />
          Statistiken
        </button>
      </div>

      {/* ── SETTINGS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'settings' && (
        <div>
          <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px', lineHeight: 1.6 }}>
            Affiliate-IDs werden automatisch in alle Links injiziert. Leere Felder werden übersprungen.
          </p>

          {settingsLoading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
              <RefreshCw size={20} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {PROVIDERS.map(p => {
                const row = settings.find(s => s.provider === p.id) ?? { affiliate_id: '', enabled: true };
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    style={{
                      background: '#FFFFFF',
                      border: `1.5px solid ${row.enabled ? '#E2E8F0' : '#F1F5F9'}`,
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      opacity: row.enabled ? 1 : 0.55,
                      transition: 'opacity 0.15s, border-color 0.15s',
                    }}
                  >
                    {/* Provider icon + name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '160px', flex: '0 0 auto' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={16} strokeWidth={2} color={p.color} />
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0 }}>{p.name}</p>
                        <p style={{ fontSize: '11px', color: '#94A3B8', margin: 0, fontFamily: 'monospace' }}>?{p.param}=…</p>
                      </div>
                    </div>

                    {/* ID input */}
                    <div style={{ flex: '1 1 200px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748B', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Affiliate-ID
                      </label>
                      <input
                        type="text"
                        value={row.affiliate_id}
                        onChange={e => updateField(p.id, 'affiliate_id', e.target.value)}
                        placeholder={p.placeholder}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid #E2E8F0',
                          fontSize: '14px',
                          fontFamily: 'monospace',
                          color: '#0F172A',
                          background: '#F8FAFF',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Enabled toggle */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: '0 0 auto' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Aktiv
                      </span>
                      <button
                        onClick={() => updateField(p.id, 'enabled', !row.enabled)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: row.enabled ? '#0EA5E9' : '#CBD5E1' }}
                        aria-label={row.enabled ? `${p.name} deaktivieren` : `${p.name} aktivieren`}
                      >
                        {row.enabled
                          ? <ToggleRight size={28} strokeWidth={2} />
                          : <ToggleLeft  size={28} strokeWidth={2} />
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Save button + feedback */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={saving || settingsLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 24px',
                borderRadius: '12px',
                background: saving ? '#94A3B8' : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                border: 'none',
                cursor: saving ? 'wait' : 'pointer',
                fontFamily: 'inherit',
                transition: 'opacity 0.15s',
              }}
            >
              {saving
                ? <RefreshCw size={14} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
                : <Save size={14} strokeWidth={2} />
              }
              {saving ? 'Speichern…' : 'Einstellungen speichern'}
            </button>

            {saveStatus === 'success' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#059669', fontWeight: 600 }}>
                <CheckCircle size={15} strokeWidth={2} />
                Gespeichert
              </span>
            )}
            {saveStatus === 'error' && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#DC2626', fontWeight: 600 }}>
                <AlertCircle size={15} strokeWidth={2} />
                Fehler beim Speichern
              </span>
            )}
          </div>

          {/* Example URL card */}
          <div style={{ background: '#F0F9FF', border: '1.5px solid #BAE6FD', borderRadius: '14px', padding: '16px 20px', marginTop: '28px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>
              Redirect-Beispiel
            </p>
            <p style={{ fontSize: '13px', color: '#0F172A', margin: '0 0 4px', fontFamily: 'monospace' }}>
              /go/booking?url=https://www.booking.com/hotel/de/...
            </p>
            <p style={{ fontSize: '13px', color: '#0F172A', margin: 0, fontFamily: 'monospace' }}>
              → https://www.booking.com/hotel/de/...?aid=<em style={{ color: '#0284C7' }}>IHRE_ID</em>
            </p>
          </div>
        </div>
      )}

      {/* ── STATS TAB ────────────────────────────────────────────────────────── */}
      {activeTab === 'stats' && (
        <div>
          {statsLoading && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#94A3B8' }}>
              <RefreshCw size={20} strokeWidth={1.5} style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }} />
              <p style={{ fontSize: '14px', marginTop: '12px' }}>Lade Statistiken…</p>
            </div>
          )}

          {statsError && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '14px', padding: '16px 20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertCircle size={16} strokeWidth={2} color="#DC2626" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: '14px', color: '#DC2626', margin: 0 }}>{statsError}</p>
            </div>
          )}

          {stats && (
            <>
              {/* Click counts */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <StatCard label="Heute"   value={stats.today} sub="Affiliate-Klicks" />
                <StatCard label="7 Tage"  value={stats.week}  sub="Affiliate-Klicks" />
                <StatCard label="30 Tage" value={stats.month} sub="Affiliate-Klicks" />
              </div>

              {/* Top tables */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <TopTable
                  title="Top Anbieter (30 Tage)"
                  icon={TrendingUp}
                  rows={stats.topProviders}
                  keyField="clicks"
                  labelField="provider"
                />
                <TopTable
                  title="Top Reiseziele (30 Tage)"
                  icon={MapPin}
                  rows={stats.topDestinations}
                  keyField="clicks"
                  labelField="destination"
                />
              </div>

              {stats.month === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                  <BarChart2 size={32} strokeWidth={1} style={{ marginBottom: '12px', display: 'block', margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', margin: 0 }}>Noch keine Klicks in den letzten 30 Tagen.</p>
                </div>
              )}

              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <button
                  onClick={() => { setStats(null); loadStats(); }}
                  style={{ fontSize: '13px', color: '#0EA5E9', background: 'none', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontFamily: 'inherit' }}
                >
                  <RefreshCw size={12} strokeWidth={2} />
                  Aktualisieren
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
