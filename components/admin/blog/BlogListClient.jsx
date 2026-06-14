'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Search, Edit3, CheckCircle,
  Archive, Trash2, RefreshCw, AlertTriangle,
  Eye, Copy, RotateCcw, TrendingUp, BarChart2,
} from 'lucide-react';
import { scoreBadgeStyle } from '@/lib/blog-scores';

const STATUS_CONFIG = {
  published: { label: 'Veröffentlicht', bg: '#ECFDF5', color: '#059669' },
  draft:     { label: 'Entwurf',        bg: '#FEF9C3', color: '#92400E' },
  archived:  { label: 'Archiviert',     bg: '#F1F5F9', color: '#64748B' },
};

const TOAST_MSG = {
  publish: 'Artikel veröffentlicht.',
  archive: 'Artikel archiviert.',
  restore: 'Artikel wiederhergestellt.',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 9px', borderRadius: '5px',
      fontSize: '11px', fontWeight: 700, background: cfg.bg, color: cfg.color,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

function ScorePill({ label, score }) {
  if (score == null) return null;
  const style = scoreBadgeStyle(score);
  return (
    <span title={`${label}-Score: ${score}/100 — ${style.label}`} style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 8px', borderRadius: '5px',
      fontSize: '11px', fontWeight: 700,
      background: style.bg, color: style.color,
      whiteSpace: 'nowrap', cursor: 'default',
    }}>
      {label} {score}
    </span>
  );
}

function ViewStat({ icon: Icon, value, label }) {
  return (
    <span title={label} style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      fontSize: '11px', color: '#64748B',
    }}>
      <Icon size={11} strokeWidth={2} />
      {value.toLocaleString('de-DE')}
    </span>
  );
}

function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function ActionBtn({ onClick, href, target, rel, title, icon: Icon, label, color, borderColor, bg, disabled }) {
  const style = {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '6px 10px', borderRadius: '7px',
    border: `1.5px solid ${disabled ? '#E2E8F0' : borderColor}`,
    background: disabled ? '#F8FAFC' : bg,
    color: disabled ? '#CBD5E1' : color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap',
    textDecoration: 'none', flexShrink: 0,
    transition: 'filter 0.12s ease', fontFamily: 'inherit',
  };
  if (href) {
    return (
      <Link href={href} target={target} rel={rel} title={title} style={style}>
        <Icon size={13} strokeWidth={2} />
        {label}
      </Link>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} title={title} style={style}>
      <Icon size={13} strokeWidth={2} />
      {label}
    </button>
  );
}

function DeleteModal({ article, isDeleting, onConfirm, onCancel }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape' && !isDeleting) onCancel(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isDeleting, onCancel]);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(15,23,42,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
      }}
    >
      <div style={{
        background: '#FFFFFF', borderRadius: '16px', padding: '32px',
        maxWidth: '440px', width: '100%',
        boxShadow: '0 24px 64px rgba(15,23,42,0.18)',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: '#FEF2F2', border: '1.5px solid #FECACA',
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
        }}>
          <Trash2 size={22} color="#DC2626" strokeWidth={2} />
        </div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
          Artikel löschen?
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>
          <strong style={{ color: '#0F172A' }}>{article.title}</strong> wird dauerhaft gelöscht.
          Diese Aktion kann nicht rückgängig gemacht werden.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '10px',
              border: '1.5px solid #E2E8F0', background: '#FFFFFF',
              fontSize: '14px', fontWeight: 600, color: '#475569', cursor: 'pointer',
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
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

// ─── Main component ────────────────────────────────────────────────────────────

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

  async function doDuplicate(id) {
    setActionBusy(id + 'duplicate');
    try {
      const res = await fetch(`/api/admin/blog/${id}/duplicate`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      showToast(`Dupliziert: „${json.article.title}"`);
      setArticles(prev => [
        { ...json.article, total_views: 0, views_30d: 0, seo_score: 0, llmo_score: 0 },
        ...prev,
      ]);
      setTimeout(() => router.push(`/admin/blog/${json.article.id}`), 900);
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

  const totalViews = useMemo(
    () => articles.reduce((acc, a) => acc + (a.total_views ?? 0), 0),
    [articles]
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 300,
          padding: '14px 20px', borderRadius: '12px',
          background: toast.type === 'error' ? '#FEF2F2' : '#ECFDF5',
          border: `1.5px solid ${toast.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
          color: toast.type === 'error' ? '#DC2626' : '#059669',
          fontSize: '14px', fontWeight: 600,
          boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
          display: 'flex', alignItems: 'center', gap: '10px', maxWidth: '380px',
        }}>
          {toast.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Reiseblog</h1>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: '#64748B' }}>
              {counts.all} Artikel · {counts.published} veröffentlicht
            </span>
            <span style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BarChart2 size={12} />
              {totalViews.toLocaleString('de-DE')} Gesamtaufrufe
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => router.refresh()}
            title="Aktualisieren"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '38px', height: '38px', borderRadius: '9px',
              border: '1.5px solid #E2E8F0', background: '#FFFFFF',
              color: '#64748B', cursor: 'pointer',
            }}
          >
            <RefreshCw size={15} />
          </button>
          <Link
            href="/admin/blog/neu"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '9px',
              background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
              color: '#FFFFFF', fontSize: '13px', fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 4px 12px rgba(14,165,233,0.30)',
            }}
          >
            <Plus size={15} />
            Neuer Artikel
          </Link>
        </div>
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
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
              padding: '6px 14px', borderRadius: '7px', border: '1.5px solid',
              borderColor: statusFilter === tab.key ? '#0EA5E9' : '#E2E8F0',
              background:  statusFilter === tab.key ? '#F0F9FF' : '#FFFFFF',
              color:       statusFilter === tab.key ? '#0284C7' : '#64748B',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '380px' }}>
        <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          placeholder="Titel, Slug oder Kategorie…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '9px 12px 9px 36px',
            borderRadius: '9px', border: '1.5px solid #E2E8F0',
            background: '#F8FAFC', fontSize: '13px', color: '#0F172A', outline: 'none',
          }}
        />
      </div>

      {/* Article list */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: '#FFFFFF', borderRadius: '14px',
        border: '1.5px solid #E2E8F0', overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto', gap: '12px',
          padding: '10px 20px', background: '#F8FAFC',
          borderBottom: '1.5px solid #E2E8F0',
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Artikel</span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Aktionen</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>
            Keine Artikel gefunden.
          </div>
        ) : (
          filtered.map((article, i) => (
            <div
              key={article.id}
              style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px', padding: '14px 20px',
                borderBottom: i < filtered.length - 1 ? '1px solid #F1F5F9' : 'none',
                flexWrap: 'wrap',
              }}
            >
              {/* Left: article info */}
              <div style={{ flex: 1, minWidth: 0 }}>

                {/* Row 1: title + status + category */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span style={{
                    fontWeight: 700, fontSize: '14px', color: '#0F172A',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: '380px',
                  }}>
                    {article.title}
                  </span>
                  <StatusBadge status={article.status} />
                  {article.category && (
                    <span style={{
                      fontSize: '11px', color: '#94A3B8', background: '#F1F5F9',
                      padding: '1px 7px', borderRadius: '4px', whiteSpace: 'nowrap',
                    }}>
                      {article.category}
                    </span>
                  )}
                </div>

                {/* Row 2: slug + date */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '7px' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>/{article.slug}</span>
                  {fmtDate(article.published_at) && (
                    <>
                      <span style={{ fontSize: '11px', color: '#CBD5E1' }}>·</span>
                      <span style={{ fontSize: '11px', color: '#94A3B8' }}>veröff. {fmtDate(article.published_at)}</span>
                    </>
                  )}
                </div>

                {/* Row 3: views + scores */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <ViewStat icon={Eye} value={article.total_views ?? 0} label="Gesamtaufrufe" />
                  <span style={{ fontSize: '11px', color: '#CBD5E1' }}>·</span>
                  <span title="Aufrufe letzte 30 Tage" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94A3B8' }}>
                    <TrendingUp size={11} strokeWidth={2} />
                    {(article.views_30d ?? 0).toLocaleString('de-DE')} / 30T
                  </span>
                  <span style={{ fontSize: '11px', color: '#CBD5E1' }}>·</span>
                  <ScorePill label="SEO" score={article.seo_score} />
                  <ScorePill label="LLMO" score={article.llmo_score} />
                </div>

              </div>

              {/* Right: action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>

                <ActionBtn
                  href={`/admin/blog/${article.id}`}
                  title="Bearbeiten" icon={Edit3} label="Bearbeiten"
                  color="#475569" borderColor="#E2E8F0" bg="#FFFFFF"
                />
                <ActionBtn
                  href={`/admin/blog/${article.id}/preview`}
                  target="_blank" rel="noopener noreferrer"
                  title="Vorschau" icon={Eye} label="Vorschau"
                  color="#0284C7" borderColor="#BAE6FD" bg="#F0F9FF"
                />
                <ActionBtn
                  onClick={() => doDuplicate(article.id)}
                  disabled={actionBusy === article.id + 'duplicate'}
                  title="Duplizieren" icon={Copy} label="Duplizieren"
                  color="#7C3AED" borderColor="#DDD6FE" bg="#F5F3FF"
                />

                {article.status === 'draft' && (
                  <ActionBtn
                    onClick={() => doAction(article.id, 'publish')}
                    disabled={actionBusy === article.id + 'publish'}
                    title="Veröffentlichen" icon={CheckCircle} label="Veröffentlichen"
                    color="#059669" borderColor="#A7F3D0" bg="#ECFDF5"
                  />
                )}
                {article.status === 'published' && (
                  <ActionBtn
                    onClick={() => doAction(article.id, 'archive')}
                    disabled={actionBusy === article.id + 'archive'}
                    title="Archivieren" icon={Archive} label="Archivieren"
                    color="#64748B" borderColor="#E2E8F0" bg="#F8FAFC"
                  />
                )}
                {article.status === 'archived' && (
                  <ActionBtn
                    onClick={() => doAction(article.id, 'restore')}
                    disabled={actionBusy === article.id + 'restore'}
                    title="Wiederherstellen (→ Entwurf)" icon={RotateCcw} label="Wiederherstellen"
                    color="#D97706" borderColor="#FDE68A" bg="#FFFBEB"
                  />
                )}

                <ActionBtn
                  onClick={() => setDeleteTarget(article)}
                  title="Löschen" icon={Trash2} label="Löschen"
                  color="#DC2626" borderColor="#FECACA" bg="#FEF2F2"
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete confirmation modal */}
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
