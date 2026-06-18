'use client';

import { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';

const STATUS_LABELS  = { new: 'Neu', answered: 'Beantwortet', closed: 'Abgeschlossen' };
const STATUS_COLORS  = {
  new:      { bg: 'rgba(14,165,233,0.10)',   color: '#0EA5E9' },
  answered: { bg: 'rgba(16,185,129,0.10)',   color: '#059669' },
  closed:   { bg: 'rgba(100,116,139,0.12)',  color: '#475569' },
};

export default function ContactInquiriesClient({ initialData }) {
  const [inquiries, setInquiries] = useState(initialData);
  const [expanded,  setExpanded]  = useState(null);
  const [loading,   setLoading]   = useState(null);

  const handleStatusChange = async (id, status) => {
    setLoading(id + '_status');
    try {
      const res = await fetch(`/api/contact-inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Fehler beim Aktualisieren.');
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Anfrage wirklich löschen?')) return;
    setLoading(id + '_delete');
    try {
      const res = await fetch(`/api/contact-inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Fehler beim Löschen.');
      setInquiries(prev => prev.filter(i => i.id !== id));
      if (expanded === id) setExpanded(null);
    } catch (e) { alert(e.message); }
    finally { setLoading(null); }
  };

  if (!inquiries.length) {
    return (
      <div style={{
        textAlign: 'center', padding: '60px 24px',
        background: '#F8FAFC', borderRadius: '16px',
        border: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '14px',
      }}>
        Noch keine Kontakt-Anfragen eingegangen.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {inquiries.map(item => {
        const isOpen = expanded === item.id;
        const sc = STATUS_COLORS[item.status] || STATUS_COLORS.new;
        const mailtoSubject = encodeURIComponent(`Re: ${item.subject}`);

        return (
          <div key={item.id} style={{
            background: '#FFFFFF', borderRadius: '14px',
            border: '1px solid #E2E8F0', overflow: 'hidden',
          }}>
            {/* Header */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', cursor: 'pointer' }}
              onClick={() => setExpanded(isOpen ? null : item.id)}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{item.name}</span>
                  {item.inquiry_type && (
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                      borderRadius: '20px', background: 'rgba(14,165,233,0.08)', color: '#0EA5E9',
                    }}>{item.inquiry_type}</span>
                  )}
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                    borderRadius: '20px', background: sc.bg, color: sc.color,
                  }}>{STATUS_LABELS[item.status]}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
                  {item.email}
                  {item.subject && <span> · {item.subject}</span>}
                  <span> · {new Date(item.created_at).toLocaleDateString('de-DE')}</span>
                </div>
              </div>
              <ChevronDown size={16} strokeWidth={2} style={{
                color: '#94A3B8', flexShrink: 0,
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
              }} />
            </div>

            {/* Detail */}
            {isOpen && (
              <div style={{ borderTop: '1px solid #F1F5F9', padding: '16px 18px 18px', background: '#FAFBFC' }}>
                {item.message && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Nachricht</div>
                    <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{item.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#94A3B8' }}>Status:</span>
                  {['new', 'answered', 'closed'].map(s => (
                    <button
                      key={s}
                      disabled={loading === item.id + '_status' || item.status === s}
                      onClick={() => handleStatusChange(item.id, s)}
                      style={{
                        padding: '5px 14px', borderRadius: '20px', border: 'none',
                        cursor: item.status === s ? 'default' : 'pointer',
                        fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                        background: item.status === s ? STATUS_COLORS[s].bg : '#F1F5F9',
                        color: item.status === s ? STATUS_COLORS[s].color : '#64748B',
                      }}
                    >{STATUS_LABELS[s]}</button>
                  ))}
                  <div style={{ flex: 1 }} />
                  <a
                    href={`mailto:${item.email}?subject=${mailtoSubject}`}
                    style={{
                      padding: '7px 16px', borderRadius: '10px',
                      background: 'rgba(14,165,233,0.08)', color: '#0EA5E9',
                      textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                      border: '1px solid rgba(14,165,233,0.18)',
                    }}
                  >
                    Antworten
                  </a>
                  <button
                    disabled={loading === item.id + '_delete'}
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: '7px 10px', borderRadius: '10px', border: 'none',
                      background: 'rgba(239,68,68,0.08)', color: '#EF4444',
                      cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '6px',
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
