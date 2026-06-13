'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

const LS_KEY = (slug) => `blog_voted_${slug}`;

export default function ArticleFeedback({ slug, initialHelpfulCount = 0, initialNotHelpfulCount = 0 }) {
  const [voted, setVoted]             = useState(null); // 'helpful' | 'not_helpful' | null
  const [helpfulCount, setHelpful]    = useState(initialHelpfulCount);
  const [notHelpfulCount, setNotHelp] = useState(initialNotHelpfulCount);
  const [submitting, setSubmitting]   = useState(false);

  // Read previous vote from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY(slug));
      if (stored === 'helpful' || stored === 'not_helpful') setVoted(stored);
    } catch {}
  }, [slug]);

  async function handleVote(vote) {
    if (voted || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${slug}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote }),
      });
      if (!res.ok) return; // silently fail – UX already optimistic
      // Optimistic count update
      if (vote === 'helpful') setHelpful(n => n + 1);
      else setNotHelp(n => n + 1);
      setVoted(vote);
      try { localStorage.setItem(LS_KEY(slug), vote); } catch {}
    } catch {
      // network error – don't block UX
    } finally {
      setSubmitting(false);
    }
  }

  const total = helpfulCount + notHelpfulCount;
  const score = total > 0 ? Math.round((helpfulCount / total) * 100) : null;

  return (
    <div style={{
      marginTop: '48px',
      padding: '28px 32px',
      borderRadius: '16px',
      background: '#F8FAFF',
      border: '1.5px solid #E2E8F0',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
        fontSize: '16px',
        fontWeight: 700,
        color: '#0F172A',
        marginBottom: '20px',
      }}>
        War dieser Artikel hilfreich?
      </p>

      {voted ? (
        <p style={{ fontSize: '15px', fontWeight: 600, color: '#059669', marginBottom: '0' }}>
          Vielen Dank für dein Feedback! 🎉
        </p>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '0' }}>
          <button
            onClick={() => handleVote('helpful')}
            disabled={submitting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              border: '1.5px solid #A7F3D0', background: '#ECFDF5',
              fontSize: '15px', fontWeight: 700, color: '#059669',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: submitting ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#D1FAE5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ECFDF5'; }}
          >
            <ThumbsUp size={18} strokeWidth={2} />
            Ja
          </button>

          <button
            onClick={() => handleVote('not_helpful')}
            disabled={submitting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 24px', borderRadius: '12px',
              border: '1.5px solid #FECACA', background: '#FEF2F2',
              fontSize: '15px', fontWeight: 700, color: '#DC2626',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: submitting ? 0.6 : 1,
            }}
            onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#FEE2E2'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; }}
          >
            <ThumbsDown size={18} strokeWidth={2} />
            Nein
          </button>
        </div>
      )}

      {total > 0 && (
        <p style={{
          marginTop: '16px',
          fontSize: '13px',
          color: '#64748B',
        }}>
          {score !== null
            ? `${score} % der Leser fanden diesen Artikel hilfreich.`
            : `${helpfulCount} Personen fanden diesen Artikel hilfreich.`}
        </p>
      )}
    </div>
  );
}
