'use client';

import { useState, useMemo, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Edit3, Eye, Globe, CheckCircle,
  Archive, Trash2, RefreshCw, FileJson, AlertTriangle,
} from 'lucide-react';

const STATUS_CONFIG = {
  published: { label: 'Veröffentlicht', bg: '#ECFDF5', color: '#059669' },
  draft:     { label: 'Entwurf',        bg: '#FEF2F2', color: '#DC2626' },
  archived:  { label: 'Archiviert',     bg: '#F1F5F9', color: '#64748B' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 700,
      background: cfg.bg,
      color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

function fmtDate(iso) {
  if (!iso) return '–';
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ── Delete confirmation modal ──────────────────────────────────────────────────
function DeleteModal({ dest, isDeleting, onConfirm, onCancel }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && !isDeleting) onCancel(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDeleting, onCancel]);

  const isPublished = dest.status === 'published';

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(15,23,42,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
    >
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
      }}>
        {/* Icon */}
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '12px',
          background: '#FEF2F2',
          border: '1.5px solid #FECACA',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <Trash2 size={22} color="#DC2626" strokeWidth={2} />
        </div>

        <h2 style={{
          fontSize: '18px', fontWeight: 700, color: '#0F172A',
          margin: '0 0 8px',
          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        }}>
          Reiseziel löschen
        </h2>

        <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: `0 0 ${isPublished ? '12px' : '24px'}` }}>
          Möchtest du <strong style={{ color: '#0F172A' }}>{dest.name}</strong> wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        {isPublished && (
          <div style={{
            display: 'flex', gap: '10px',
            padding: '12px 14px',
            borderRadius: '10px',
            background: '#FFFBEB',
            border: '1.5px solid #FDE68A',
            marginBottom: '24px',
          }}>
            <AlertTriangle size={16} color="#D97706" strokeWidth={2} style={{ flexShrink: 0, marginTop: '1px' }} />
            <p style={{ fontSize: '13px', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
              Dieses Reiseziel ist aktuell veröffentlicht und öffentlich sichtbar. Das Löschen entfernt es sofort von der Website.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              background: '#FAFAFA',
              color: '#64748B',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '9px 20px',
              borderRadius: '10px',
              border: 'none',
              background: '#DC2626',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 700,
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              opacity: isDeleting ? 0.7 : 1,
              minWidth: '140px',
              transition: 'opacity 0.15s',
            }}
          >
            {isDeleting ? 'Wird gelöscht…' : 'Endgültig löschen'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function DestinationsListClient({ initialData }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialData ?? []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, name, status }
  const [isDeleting, setIsDeleting] = useState(false);

  // Auto-dismiss success message after 4 s
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(''), 4000);
    return () => clearTimeout(t);
  }, [successMessage]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter(d => {
      const matchSearch = !q
        || d.name?.toLowerCase().includes(q)
        || d.slug?.toLowerCase().includes(q)
        || d.country?.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || d.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rows, search, statusFilter]);

  // ── Counts for filter tabs ─────────────────────────────────────────────────
  const counts = useMemo(() => ({
    all:       rows.length,
    published: rows.filter(d => d.status === 'published').length,
    draft:     rows.filter(d => d.status === 'draft').length,
    archived:  rows.filter(d => d.status === 'archived').length,
  }), [rows]);

  // ── Generic action helper ──────────────────────────────────────────────────
  async function apiAction(id, path, method = 'POST') {
    setActionError('');
    const res = await fetch(`/api/admin/destinations/${id}${path}`, { method });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setActionError(json.error ?? 'Fehler beim Ausführen der Aktion.');
      return false;
    }
    return json;
  }

  function patchRow(id, fields) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, ...fields } : r));
  }

  async function handlePublish(id) {
    const json = await apiAction(id, '/publish');
    if (json) patchRow(id, { status: 'published', published_at: json.destination?.published_at });
  }

  async function handleArchive(id) {
    if (!confirm('Dieses Reiseziel archivieren?')) return;
    const json = await apiAction(id, '/archive');
    if (json) patchRow(id, { status: 'archived' });
  }

  // ── Delete: open modal ─────────────────────────────────────────────────────
  function openDeleteModal(dest) {
    setActionError('');
    setConfirmDelete({ id: dest.id, name: dest.name, status: dest.status });
  }

  // ── Delete: execute after modal confirmation ───────────────────────────────
  async function doDelete() {
    if (!confirmDelete) return;
    setIsDeleting(true);
    setActionError('');
    try {
      const res = await fetch(`/api/admin/destinations/${confirmDelete.id}`, { method: 'DELETE' });
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = {}; }
      if (!res.ok) {
        setActionError(json.error ?? `Löschen fehlgeschlagen (${res.status}).`);
        return;
      }
      setRows(prev => prev.filter(r => r.id !== confirmDelete.id));
      setSuccessMessage(`„${confirmDelete.name}" wurde erfolgreich gelöscht.`);
    } catch {
      setActionError('Netzwerkfehler beim Löschen. Bitte erneut versuchen.');
    } finally {
      setIsDeleting(false);
      setConfirmDelete(null);
    }
  }

  function handleRefresh() {
    startTransition(() => router.refresh());
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Delete confirmation modal ── */}
      {confirmDelete && (
        <DeleteModal
          dest={confirmDelete}
          isDeleting={isDeleting}
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* ── Toolbar ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '12px',
        alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '20px',
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '360px' }}>
          <Search
            size={14}
            strokeWidth={2}
            color="#94A3B8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Name, Slug oder Land…"
            style={{
              width: '100%',
              padding: '9px 12px 9px 34px',
              border: '1.5px solid #E2E8F0',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#0F172A',
              background: '#FAFAFA',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleRefresh}
            disabled={isPending}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '8px 12px',
              border: '1.5px solid #E2E8F0',
              borderRadius: '10px',
              background: '#FAFAFA',
              color: '#64748B',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={13} strokeWidth={2} style={{ transform: isPending ? 'rotate(360deg)' : 'none', transition: 'transform 0.5s' }} />
            Aktualisieren
          </button>

          <Link
            href="/admin/reiseziele/import"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              background: '#F8FAFF',
              color: '#334155',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: 'inherit',
              border: '1.5px solid #E2E8F0',
            }}
          >
            <FileJson size={14} strokeWidth={2} />
            JSON importieren
          </Link>

          <Link
            href="/admin/reiseziele/neu"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(14,165,233,0.30)',
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Neues Reiseziel
          </Link>
        </div>
      </div>

      {/* ── Status filter tabs ── */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { key: 'all',       label: `Alle (${counts.all})` },
          { key: 'published', label: `Veröffentlicht (${counts.published})` },
          { key: 'draft',     label: `Entwürfe (${counts.draft})` },
          { key: 'archived',  label: `Archiviert (${counts.archived})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: statusFilter === tab.key ? '#0EA5E9' : '#E2E8F0',
              background: statusFilter === tab.key ? '#EFF6FF' : '#FAFAFA',
              color: statusFilter === tab.key ? '#0EA5E9' : '#64748B',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Success banner ── */}
      {successMessage && (
        <div style={{
          marginBottom: '14px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          fontSize: '13px',
          color: '#166534',
          fontWeight: 500,
        }}>
          {successMessage}
        </div>
      )}

      {/* ── Error banner ── */}
      {actionError && (
        <div style={{
          marginBottom: '14px',
          padding: '10px 14px',
          borderRadius: '10px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          fontSize: '13px',
          color: '#DC2626',
          fontWeight: 500,
        }}>
          {actionError}
        </div>
      )}

      {/* ── Table ── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1.5px solid #E2E8F0',
        overflow: 'hidden',
      }}>
        {filtered.length === 0 ? (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: '14px',
          }}>
            {rows.length === 0
              ? 'Noch keine Reiseziele im CMS. Erstelle das erste mit „Neues Reiseziel".'
              : 'Keine Reiseziele gefunden.'}
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #F1F5F9' }}>
                  {['Reiseziel', 'Land', 'Status', 'Geändert', 'Aktionen'].map(col => (
                    <th key={col} style={{
                      padding: '10px 14px',
                      textAlign: 'left',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#94A3B8',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}>
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((dest, i) => (
                  <tr
                    key={dest.id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? '1px solid #F8FAFF' : 'none',
                    }}
                  >
                    {/* Name + slug */}
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>
                        {dest.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                        /{dest.slug}
                      </div>
                    </td>
                    {/* Country */}
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>
                      {dest.country || '–'}
                    </td>
                    {/* Status */}
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={dest.status} />
                    </td>
                    {/* Date */}
                    <td style={{ padding: '12px 14px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                      {fmtDate(dest.updated_at)}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap' }}>
                        {/* Edit */}
                        <Link
                          href={`/admin/reiseziele/${dest.id}`}
                          title="Bearbeiten"
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '30px', height: '30px',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            background: '#F8FAFF',
                            color: '#0EA5E9',
                            textDecoration: 'none',
                          }}
                        >
                          <Edit3 size={13} strokeWidth={2} />
                        </Link>

                        {/* Preview */}
                        <a
                          href={`/reiseziele/${dest.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Vorschau"
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '30px', height: '30px',
                            borderRadius: '8px',
                            border: '1px solid #E2E8F0',
                            background: '#F8FAFF',
                            color: '#64748B',
                            textDecoration: 'none',
                          }}
                        >
                          <Eye size={13} strokeWidth={2} />
                        </a>

                        {/* Publish (only for drafts) */}
                        {dest.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(dest.id)}
                            title="Veröffentlichen"
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: '30px', height: '30px',
                              borderRadius: '8px',
                              border: '1px solid #BBF7D0',
                              background: '#F0FDF4',
                              color: '#059669',
                              cursor: 'pointer',
                            }}
                          >
                            <Globe size={13} strokeWidth={2} />
                          </button>
                        )}

                        {/* Re-publish (for archived) */}
                        {dest.status === 'archived' && (
                          <button
                            onClick={() => handlePublish(dest.id)}
                            title="Wieder veröffentlichen"
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: '30px', height: '30px',
                              borderRadius: '8px',
                              border: '1px solid #BBF7D0',
                              background: '#F0FDF4',
                              color: '#059669',
                              cursor: 'pointer',
                            }}
                          >
                            <CheckCircle size={13} strokeWidth={2} />
                          </button>
                        )}

                        {/* Archive (only for published) */}
                        {dest.status === 'published' && (
                          <button
                            onClick={() => handleArchive(dest.id)}
                            title="Archivieren"
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              width: '30px', height: '30px',
                              borderRadius: '8px',
                              border: '1px solid #E2E8F0',
                              background: '#F8FAFF',
                              color: '#64748B',
                              cursor: 'pointer',
                            }}
                          >
                            <Archive size={13} strokeWidth={2} />
                          </button>
                        )}

                        {/* Delete — visible for all statuses */}
                        <button
                          onClick={() => openDeleteModal(dest)}
                          title="Löschen"
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '30px', height: '30px',
                            borderRadius: '8px',
                            border: '1px solid #FECACA',
                            background: '#FEF2F2',
                            color: '#DC2626',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={13} strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '10px' }}>
        {filtered.length} von {rows.length} Reiseziel{rows.length !== 1 ? 'en' : ''}
      </p>
    </div>
  );
}
