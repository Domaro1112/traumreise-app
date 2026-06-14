'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Edit3, CheckCircle,
  Archive, Trash2, RefreshCw, AlertTriangle,
  Eye, Copy, RotateCcw,
} from 'lucide-react';

const STATUS_CONFIG = {
  published: { label: 'Veröffentlicht', bg: '#ECFDF5', color: '#059669' },
  draft:     { label: 'Entwurf',        bg: '#FEF2F2', color: '#DC2626' },
  archived:  { label: 'Archiviert',     bg: '#F1F5F9', color: '#64748B' },
};

const TOAST_MSG = {
  publish: 'Artikel veröffentlicht.',
  archive: 'Artikel archiviert.',
  restore: 'Artikel wiederhergestellt.',
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

function DeleteModal({ article, isDeleting, onConfirm, onCancel }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && !isDeleting) onCancel(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDeleting, onCancel]);

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

        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          Artikel löschen?
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
          Der Artikel <strong style={{ color: '#0F172A' }}>{article.title}</strong> wird dauerhaft gelöscht.
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              flex: 1, padding: '10px 0',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              fontSize: '14px', fontWeight: 600, color: '#475569',
              cursor: 'pointer',
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              flex: 1, padding: '10px 0',
              borderRadius: '10px',
              border: 'none',
              background: isDeleting ? '#F1F5F9' : '#DC2626',
              fontSize: '14px', fontWeight: 700,
              color: isDeleting ? '#94A3B8' : '#FFFFFF',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
            }}
          >
            {isDeleting ? 'Wird gelöscht…' : 'Endgültig löschen'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Small icon-button with tooltip
function IconBtn({ onClick, title, disabled, color = '#475569', borderColor = '#E2E8F0', bg = '#FFFFFF', children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '32px', height: '32px',
        borderRadius: '8px',
        border: `1.5px solid ${disabled ? '#E2E8F0' : borderColor}`,
        background: disabled ? '#F8FAFC' : bg,
        color: disabled ? '#CBD5E1' : color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        flexShrink: 0,
        transition: 'opacity 0.15s',
      }}
    >
      {children}
    </button>
  );
}

export default function BlogListClient({ initialArticles }) {
  const router = useRouter();
  const [articles, setArticles] = useState(initialArticles ?? []);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionBusy, setActionBusy] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = useMemo(() => {
    let list = articles;
    if (statusFilter !== 'all') list = list.filter(a => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.slug?.toLowerCase().includes(q) ||
        a.category?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [articles, search, statusFilter]);

  // Generic status-change action (publish / archive / restore)
  async function doAction(id, action) {
    setActionBusy(id + action);
    try {
      const res = await fetch(`/api/admin/blog/${id}/${action}`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      setArticles(prev => prev.map(a => a.id === id ? { ...a, ...json.article } : a));
      showToast(TOAST_MSG[action] ?? 'Aktion erfolgreich.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionBusy(null);
    }
  }

  // Duplicate → redirect to new article editor
  async function doDuplicate(id) {
    setActionBusy(id + 'duplicate');
    try {
      const res = await fetch(`/api/admin/blog/${id}/duplicate`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      showToast(`Artikel dupliziert als Entwurf: „${json.article.title}"`);
      // Add the new article to the top of the list, then navigate
      setArticles(prev => [json.article, ...prev]);
      setTimeout(() => router.push(`/admin/blog/${json.article.id}`), 800);
    } catch (err) {
      showToast(err.message, 'error');
      setActionBusy(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      setArticles(prev => prev.filter(a => a.id !== deleteTarget.id));
      showToast('Artikel gelöscht.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  }

  const counts = useMemo(() => ({
    all:       articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft:     articles.filter(a => a.status === 'draft').length,
    archived:  articles.filter(a => a.status === 'archived').length,
  }), [articles]);

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 300,
          padding: '14px 20px',
          borderRadius: '12px',
          background: toast.type === 'error' ? '#FEF2F2' : '#ECFDF5',
          border: `1.5px solid ${toast.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
          color: toast.type === 'error' ? '#DC2626' : '#059669',
          fontSize: '14px', fontWeight: 600,
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
          display: 'flex', alignItems: 'center', gap: '10px',
          maxWidth: '420px',
        }}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>Reiseblog</h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>{counts.all} Artikel gesamt · {counts.published} veröffentlicht</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => router.refresh()}
            title="Aktualisieren"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px',
              borderRadius: '10px',
              border: '1.5px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#64748B',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={16} />
          </button>
          <Link
            href="/admin/blog/neu"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#FFFFFF',
              fontSize: '14px', fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(14,165,233,0.30)',
            }}
          >
            <Plus size={16} />
            Neuer Artikel
          </Link>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { key: 'all',       label: `Alle (${counts.all})` },
          { key: 'published', label: `Veröffentlicht (${counts.published})` },
          { key: 'draft',     label: `Entwurf (${counts.draft})` },
          { key: 'archived',  label: `Archiviert (${counts.archived})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: statusFilter === tab.key ? '#0EA5E9' : '#E2E8F0',
              background: statusFilter === tab.key ? '#F0F9FF' : '#FFFFFF',
              color: statusFilter === tab.key ? '#0284C7' : '#64748B',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
        <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Titel, Slug oder Kategorie suchen…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 40px',
            borderRadius: '10px',
            border: '1.5px solid #E2E8F0',
            background: '#F8FAFC',
            fontSize: '14px',
            color: '#0F172A',
            outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'auto', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 32px', textAlign: 'center', color: '#94A3B8', fontSize: '15px' }}>
            Keine Artikel gefunden.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                {['Titel', 'Kategorie', 'Status', 'Feedback', 'Erstellt', 'Veröffentlicht', 'Aktionen'].map(h => (
                  <th key={h} style={{
                    padding: '12px 14px', textAlign: 'left',
                    fontSize: '11px', fontWeight: 700, color: '#64748B',
                    letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((article, i) => (
                <tr
                  key={article.id}
                  style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                >
                  {/* Titel */}
                  <td style={{ padding: '14px 14px', maxWidth: '280px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.title}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      /{article.slug}
                    </div>
                  </td>

                  {/* Kategorie */}
                  <td style={{ padding: '14px 14px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>
                    {article.category || '–'}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                    <StatusBadge status={article.status} />
                  </td>

                  {/* Feedback */}
                  <td style={{ padding: '14px 14px', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {(() => {
                      const h = article.helpful_count ?? 0;
                      const n = article.not_helpful_count ?? 0;
                      if (h + n === 0) return <span style={{ color: '#CBD5E1' }}>–</span>;
                      return <span>{h} 👍 · {n} 👎</span>;
                    })()}
                  </td>

                  {/* Erstellt */}
                  <td style={{ padding: '14px 14px', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {fmtDate(article.created_at)}
                  </td>

                  {/* Veröffentlicht */}
                  <td style={{ padding: '14px 14px', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {fmtDate(article.published_at)}
                  </td>

                  {/* Aktionen */}
                  <td style={{ padding: '14px 14px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>

                      {/* Bearbeiten */}
                      <Link
                        href={`/admin/blog/${article.id}`}
                        title="Bearbeiten"
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '32px', height: '32px',
                          borderRadius: '8px',
                          border: '1.5px solid #E2E8F0',
                          background: '#FFFFFF',
                          color: '#475569',
                          textDecoration: 'none',
                          flexShrink: 0,
                        }}
                      >
                        <Edit3 size={14} />
                      </Link>

                      {/* Vorschau */}
                      <Link
                        href={`/admin/blog/${article.id}/preview`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Vorschau"
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '32px', height: '32px',
                          borderRadius: '8px',
                          border: '1.5px solid #BAE6FD',
                          background: '#F0F9FF',
                          color: '#0284C7',
                          textDecoration: 'none',
                          flexShrink: 0,
                        }}
                      >
                        <Eye size={14} />
                      </Link>

                      {/* Duplizieren */}
                      <IconBtn
                        onClick={() => doDuplicate(article.id)}
                        disabled={actionBusy === article.id + 'duplicate'}
                        title="Duplizieren"
                        color="#7C3AED"
                        borderColor="#DDD6FE"
                        bg="#F5F3FF"
                      >
                        <Copy size={14} />
                      </IconBtn>

                      {/* Veröffentlichen (nur Entwurf) */}
                      {article.status === 'draft' && (
                        <IconBtn
                          onClick={() => doAction(article.id, 'publish')}
                          disabled={actionBusy === article.id + 'publish'}
                          title="Veröffentlichen"
                          color="#059669"
                          borderColor="#A7F3D0"
                          bg="#ECFDF5"
                        >
                          <CheckCircle size={14} />
                        </IconBtn>
                      )}

                      {/* Archivieren (nur Veröffentlicht) */}
                      {article.status === 'published' && (
                        <IconBtn
                          onClick={() => doAction(article.id, 'archive')}
                          disabled={actionBusy === article.id + 'archive'}
                          title="Archivieren"
                          color="#64748B"
                          borderColor="#E2E8F0"
                          bg="#F1F5F9"
                        >
                          <Archive size={14} />
                        </IconBtn>
                      )}

                      {/* Wiederherstellen (nur Archiviert) */}
                      {article.status === 'archived' && (
                        <IconBtn
                          onClick={() => doAction(article.id, 'restore')}
                          disabled={actionBusy === article.id + 'restore'}
                          title="Wiederherstellen (→ Entwurf)"
                          color="#D97706"
                          borderColor="#FDE68A"
                          bg="#FFFBEB"
                        >
                          <RotateCcw size={14} />
                        </IconBtn>
                      )}

                      {/* Löschen */}
                      <IconBtn
                        onClick={() => setDeleteTarget(article)}
                        title="Löschen"
                        color="#DC2626"
                        borderColor="#FECACA"
                        bg="#FEF2F2"
                      >
                        <Trash2 size={14} />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Aktionen-Legende */}
      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '11px', color: '#94A3B8' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Edit3 size={11} /> Bearbeiten</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Eye size={11} color="#0284C7" /> Vorschau</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Copy size={11} color="#7C3AED" /> Duplizieren</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle size={11} color="#059669" /> Veröffentlichen</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Archive size={11} color="#64748B" /> Archivieren</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><RotateCcw size={11} color="#D97706" /> Wiederherstellen</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Trash2 size={11} color="#DC2626" /> Löschen</span>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          article={deleteTarget}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
