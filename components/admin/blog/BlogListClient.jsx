'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Edit3, CheckCircle,
  Archive, Trash2, RefreshCw, AlertTriangle,
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
    setTimeout(() => setToast(null), 3000);
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

  async function doAction(id, action) {
    setActionBusy(id + action);
    try {
      const res = await fetch(`/api/admin/blog/${id}/${action}`, { method: 'POST' });
      const text = await res.text();
      const json = JSON.parse(text);
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      setArticles(prev => prev.map(a => a.id === id ? { ...a, ...json.article } : a));
      showToast(action === 'publish' ? 'Artikel veröffentlicht.' : 'Artikel archiviert.');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionBusy(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${deleteTarget.id}`, { method: 'DELETE' });
      const text = await res.text();
      const json = JSON.parse(text);
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
    all: articles.length,
    published: articles.filter(a => a.status === 'published').length,
    draft: articles.filter(a => a.status === 'draft').length,
    archived: articles.filter(a => a.status === 'archived').length,
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
            onClick={() => { router.refresh(); }}
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
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '60px 32px', textAlign: 'center', color: '#94A3B8', fontSize: '15px' }}>
            Keine Artikel gefunden.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                {['Titel', 'Kategorie', 'Status', 'Feedback', 'Erstellt', 'Veröffentlicht', 'Aktionen'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
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
                  <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {article.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{article.slug}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#475569', whiteSpace: 'nowrap' }}>
                    {article.category || '–'}
                  </td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <StatusBadge status={article.status} />
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {(() => {
                      const h = article.helpful_count ?? 0;
                      const n = article.not_helpful_count ?? 0;
                      if (h + n === 0) return <span style={{ color: '#CBD5E1' }}>–</span>;
                      return <span>{h} 👍 | {n} 👎</span>;
                    })()}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {fmtDate(article.created_at)}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {fmtDate(article.published_at)}
                  </td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {/* Edit */}
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
                        }}
                      >
                        <Edit3 size={14} />
                      </Link>

                      {/* Publish */}
                      {article.status === 'draft' && (
                        <button
                          onClick={() => doAction(article.id, 'publish')}
                          disabled={actionBusy === article.id + 'publish'}
                          title="Veröffentlichen"
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px',
                            borderRadius: '8px',
                            border: '1.5px solid #A7F3D0',
                            background: '#ECFDF5',
                            color: '#059669',
                            cursor: 'pointer',
                          }}
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}

                      {/* Archive */}
                      {article.status === 'published' && (
                        <button
                          onClick={() => doAction(article.id, 'archive')}
                          disabled={actionBusy === article.id + 'archive'}
                          title="Archivieren"
                          style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px',
                            borderRadius: '8px',
                            border: '1.5px solid #E2E8F0',
                            background: '#F1F5F9',
                            color: '#64748B',
                            cursor: 'pointer',
                          }}
                        >
                          <Archive size={14} />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(article)}
                        title="Löschen"
                        style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '32px', height: '32px',
                          borderRadius: '8px',
                          border: '1.5px solid #FECACA',
                          background: '#FEF2F2',
                          color: '#DC2626',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
