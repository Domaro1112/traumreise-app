'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, ChevronDown, UserPlus, Edit2, Copy, CheckCircle } from 'lucide-react';

const STATUS_LABELS = {
  new:      'Neu',
  reviewed: 'Geprüft',
  accepted: 'Angenommen',
  rejected: 'Abgelehnt',
};

const STATUS_COLORS = {
  new:      { bg: 'rgba(14,165,233,0.10)',  color: '#0EA5E9' },
  reviewed: { bg: 'rgba(245,158,11,0.10)',  color: '#D97706' },
  accepted: { bg: 'rgba(5,150,105,0.10)',   color: '#059669' },
  rejected: { bg: 'rgba(239,68,68,0.10)',   color: '#EF4444' },
};

const ALL_STATUSES = ['new', 'reviewed', 'accepted', 'rejected'];

function Badge({ label, color, bg }) {
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '2px 8px',
      borderRadius: '20px', background: bg, color,
    }}>
      {label}
    </span>
  );
}

export default function CreatorApplicationsClient({ initialData, profileMap: initialProfileMap = {} }) {
  const [applications, setApplications] = useState(initialData);
  const [profileMap,   setProfileMap]   = useState(initialProfileMap);
  const [expanded,     setExpanded]     = useState(null);
  const [loading,      setLoading]      = useState(null);
  const [copied,       setCopied]       = useState(null); // item.id wenn gerade kopiert

  const handleStatusChange = async (id, status) => {
    setLoading(id + '_status');
    try {
      const res = await fetch(`/api/creator-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Fehler beim Aktualisieren.');
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  };

  const handleCopyOnboardingLink = async (token, appId) => {
    const url = `${window.location.origin}/creator-onboarding/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(appId);
      setTimeout(() => setCopied(prev => prev === appId ? null : prev), 2000);
    } catch { alert(url); }
  };

  const handleCreateProfile = async (appId) => {
    setLoading(appId + '_profile');
    try {
      const res = await fetch('/api/creator-profiles/from-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId }),
      });
      const json = await res.json();
      if (res.status === 409 && json.profileId) {
        // Profil existiert bereits — Map aktualisieren
        setProfileMap(prev => ({ ...prev, [appId]: { id: json.profileId, slug: json.slug } }));
        return;
      }
      if (!res.ok) throw new Error(json.error ?? 'Fehler beim Erstellen.');
      if (json.profile) {
        setProfileMap(prev => ({ ...prev, [appId]: { id: json.profile.id, slug: json.profile.slug } }));
      }
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bewerbung wirklich löschen?')) return;
    setLoading(id + '_delete');
    try {
      const res = await fetch(`/api/creator-applications/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Fehler beim Löschen.');
      setApplications(prev => prev.filter(a => a.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  };

  if (!applications.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 24px',
        background: '#F8FAFC', borderRadius: '16px',
        border: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '14px',
      }}>
        Noch keine Creator-Bewerbungen eingegangen.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {applications.map(item => {
        const isOpen = expanded === item.id;
        const sc = STATUS_COLORS[item.status] ?? STATUS_COLORS.new;
        const mailtoSubject = encodeURIComponent('Re: Deine ApeAround Creator-Bewerbung');

        return (
          <div key={item.id} style={{
            background: '#FFFFFF', borderRadius: '14px',
            border: '1px solid #E2E8F0', overflow: 'hidden',
          }}>
            {/* Header row */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', cursor: 'pointer' }}
              onClick={() => setExpanded(isOpen ? null : item.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{item.name}</span>
                  {item.creator_type && (
                    <Badge label={item.creator_type} color="#0EA5E9" bg="rgba(14,165,233,0.08)" />
                  )}
                  <Badge label={STATUS_LABELS[item.status] ?? item.status} color={sc.color} bg={sc.bg} />
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                  {item.email}
                  {item.profile_url && (
                    <span> · <a href={item.profile_url} target="_blank" rel="noopener noreferrer" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Profil</a></span>
                  )}
                  <span> · {new Date(item.created_at).toLocaleDateString('de-DE')}</span>
                </div>
              </div>
              <ChevronDown size={16} strokeWidth={2} style={{
                color: '#94A3B8', flexShrink: 0,
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
              }} />
            </div>

            {/* Detail panel */}
            {isOpen && (
              <div style={{ borderTop: '1px solid #F1F5F9', padding: '16px 18px 18px', background: '#FAFBFC' }}>

                {/* Topics */}
                {item.topics?.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Themenschwerpunkte
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {item.topics.map(t => (
                        <span key={t} style={{
                          fontSize: '12px', padding: '3px 10px', borderRadius: '20px',
                          background: 'rgba(14,165,233,0.08)', color: '#0EA5E9', fontWeight: 500,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message */}
                {item.message && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                      Nachricht / Kurzvorstellung
                    </div>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>
                      {item.message}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Status:</span>
                  {ALL_STATUSES.map(s => {
                    const c = STATUS_COLORS[s];
                    return (
                      <button
                        key={s}
                        disabled={loading === item.id + '_status' || item.status === s}
                        onClick={() => handleStatusChange(item.id, s)}
                        style={{
                          padding: '5px 14px', borderRadius: '20px', border: 'none',
                          cursor: item.status === s ? 'default' : 'pointer',
                          fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                          background: item.status === s ? c.bg : '#F1F5F9',
                          color: item.status === s ? c.color : '#64748B',
                        }}
                      >
                        {STATUS_LABELS[s]}
                      </button>
                    );
                  })}
                  <div style={{ flex: 1 }} />
                  {/* Creator-Profil erstellen / bearbeiten */}
                  {item.status === 'accepted' && (() => {
                    const existingProfile = profileMap[item.id];
                    if (existingProfile) {
                      return (
                        <Link
                          href={`/admin/creator-profiles/${existingProfile.id}`}
                          style={{
                            padding: '7px 14px', borderRadius: '10px',
                            background: 'rgba(124,58,237,0.08)', color: '#7C3AED',
                            textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                            border: '1px solid rgba(124,58,237,0.18)',
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                          }}
                        >
                          <Edit2 size={12} strokeWidth={2} />
                          Creator-Profil bearbeiten
                        </Link>
                      );
                    }
                    return (
                      <button
                        disabled={loading === item.id + '_profile'}
                        onClick={() => handleCreateProfile(item.id)}
                        style={{
                          padding: '7px 14px', borderRadius: '10px', border: 'none',
                          background: 'rgba(124,58,237,0.08)', color: '#7C3AED',
                          cursor: loading === item.id + '_profile' ? 'wait' : 'pointer',
                          fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          border: '1px solid rgba(124,58,237,0.18)',
                        }}
                      >
                        <UserPlus size={12} strokeWidth={2} />
                        {loading === item.id + '_profile' ? 'Erstelle…' : 'Creator-Profil erstellen'}
                      </button>
                    );
                  })()}
                  {/* Onboarding-Link kopieren wenn Profil+Token vorhanden */}
                  {profileMap[item.id]?.token && (() => {
                    const isCopied = copied === item.id;
                    return (
                      <button
                        onClick={() => handleCopyOnboardingLink(profileMap[item.id].token, item.id)}
                        style={{
                          padding: '7px 14px', borderRadius: '10px', border: 'none',
                          background: isCopied ? 'rgba(5,150,105,0.08)' : 'rgba(14,165,233,0.08)',
                          color: isCopied ? '#059669' : '#0EA5E9',
                          cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          border: `1px solid ${isCopied ? 'rgba(5,150,105,0.18)' : 'rgba(14,165,233,0.18)'}`,
                        }}
                      >
                        {isCopied ? <CheckCircle size={12} strokeWidth={2} /> : <Copy size={12} strokeWidth={2} />}
                        {isCopied ? 'Kopiert!' : 'Onboarding-Link kopieren'}
                      </button>
                    );
                  })()}
                  <a
                    href={`mailto:${item.email}?subject=${mailtoSubject}`}
                    style={{
                      padding: '7px 16px', borderRadius: '10px',
                      background: 'rgba(14,165,233,0.08)', color: '#0EA5E9',
                      textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                      border: '1px solid rgba(14,165,233,0.18)',
                    }}
                  >
                    Kontaktieren
                  </a>
                  <button
                    disabled={loading === item.id + '_delete'}
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '7px 10px', borderRadius: '10px', border: 'none',
                      background: 'rgba(239,68,68,0.08)', color: '#EF4444',
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '5px',
                      fontSize: '13px', fontWeight: 600,
                    }}
                  >
                    <Trash2 size={13} strokeWidth={2} />
                    Löschen
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
