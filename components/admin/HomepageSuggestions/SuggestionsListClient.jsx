'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit3, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';

const BADGE_COLORS = {
  Beliebt:    { bg: '#FFF7ED', color: '#C2410C' },
  Traumziel:  { bg: '#F5F3FF', color: '#6D28D9' },
  Geheimtipp: { bg: '#F0FDF4', color: '#15803D' },
  Trending:   { bg: '#ECFEFF', color: '#0E7490' },
};

function fmtDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function DeleteModal({ item, onConfirm, onCancel, isDeleting }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,23,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
      onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
    >
      <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '32px', maxWidth: '420px', width: '100%', boxShadow: '0 24px 64px rgba(15,23,42,0.18)' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FEF2F2', border: '1.5px solid #FECACA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <Trash2 size={22} color="#DC2626" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px', fontFamily: 'var(--font-heading)' }}>
          Karte löschen
        </h2>
        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: '0 0 24px' }}>
          Möchtest du <strong style={{ color: '#0F172A' }}>{item.title}</strong> wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1.5px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: isDeleting ? '#FCA5A5' : '#DC2626', color: '#FFFFFF', fontSize: '14px', fontWeight: 700, cursor: isDeleting ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            {isDeleting ? 'Wird gelöscht…' : 'Löschen'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuggestionsListClient({ initialData = [] }) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState(initialData);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState('');
  const [, startTransition] = useTransition();

  const handleToggleActive = async (item) => {
    setTogglingId(item.id);
    setError('');
    try {
      const res = await fetch(`/api/admin/homepage-suggestions/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Fehler beim Speichern');
      }
      const { suggestion } = await res.json();
      setSuggestions(prev => prev.map(s => s.id === suggestion.id ? suggestion : s));
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e.message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/homepage-suggestions/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || 'Fehler beim Löschen');
      }
      setSuggestions(prev => prev.filter(s => s.id !== deleteTarget.id));
      setDeleteTarget(null);
      startTransition(() => router.refresh());
    } catch (e) {
      setError(e.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (suggestions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 24px', background: '#F8FAFF', borderRadius: '16px', border: '1.5px dashed #CBD5E1' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          Noch keine Karten angelegt
        </h3>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
          Erstelle deine erste Reisekarte für die Startseite.
        </p>
        <Link
          href="/admin/homepage-suggestions/neu"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #0EA5E9, #06B6D4)', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}
        >
          Erste Karte anlegen
        </Link>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div style={{ marginBottom: '16px', padding: '12px 16px', borderRadius: '10px', background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {suggestions.map((item) => {
          const badgeStyle = BADGE_COLORS[item.badge] ?? { bg: '#F8FAFF', color: '#475569' };
          const isToggling = togglingId === item.id;

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: '#FFFFFF',
                borderRadius: '14px',
                border: `1.5px solid ${item.is_active ? '#E2E8F0' : '#F1F5F9'}`,
                opacity: item.is_active ? 1 : 0.65,
                boxShadow: '0 1px 4px rgba(15,23,42,0.05)',
              }}
            >
              {/* Drag handle (visual only) */}
              <GripVertical size={16} color="#CBD5E1" style={{ flexShrink: 0, cursor: 'grab' }} />

              {/* Thumbnail */}
              <div style={{ width: '56px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#F1F5F9' }}>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.image_alt || item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                    {item.title}
                  </span>
                  {item.country && (
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{item.country}</span>
                  )}
                  {item.badge && (
                    <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, background: badgeStyle.bg, color: badgeStyle.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Reihenfolge: {item.sort_order}
                  </span>
                  {item.link_mode && (
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                      Link: {item.link_mode}{item.provider_key ? ` (${item.provider_key})` : ''}
                    </span>
                  )}
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                    {fmtDate(item.updated_at)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {/* Active toggle */}
                <button
                  onClick={() => handleToggleActive(item)}
                  disabled={isToggling}
                  title={item.is_active ? 'Deaktivieren' : 'Aktivieren'}
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '8px',
                    border: '1.5px solid',
                    borderColor: item.is_active ? '#BBF7D0' : '#E2E8F0',
                    background: item.is_active ? '#F0FDF4' : '#F8FAFF',
                    color: item.is_active ? '#15803D' : '#94A3B8',
                    cursor: isToggling ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {item.is_active ? <Eye size={15} strokeWidth={2} /> : <EyeOff size={15} strokeWidth={2} />}
                </button>

                {/* Edit */}
                <Link
                  href={`/admin/homepage-suggestions/${item.id}`}
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '8px',
                    border: '1.5px solid #E2E8F0',
                    background: '#F8FAFF',
                    color: '#64748B',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                  title="Bearbeiten"
                >
                  <Edit3 size={15} strokeWidth={2} />
                </Link>

                {/* Delete */}
                <button
                  onClick={() => setDeleteTarget(item)}
                  title="Löschen"
                  style={{
                    width: '34px', height: '34px',
                    borderRadius: '8px',
                    border: '1.5px solid #FEE2E2',
                    background: '#FFF5F5',
                    color: '#DC2626',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Trash2 size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <DeleteModal
          item={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
