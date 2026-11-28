import 'server-only';
import { Resend } from 'resend';
import { createServerClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site-config';
import { renderCampaign, personalize } from '@/lib/newsletter/render';
import { unsubscribeUrl } from '@/lib/newsletter/unsubscribe';

// ─────────────────────────────────────────────────────────────────────────────
// Versand von Newsletter-Kampagnen über Resend.
//
// - Empfänger werden in Paketen zu je 100 verschickt (Resend Batch-API).
// - Jede Mail bekommt einen eigenen Abmeldelink und die Header für die
//   Ein-Klick-Abmeldung (Gmail/Yahoo-Pflicht für Massenversender).
// - Bevor ein Paket rausgeht, wird je Empfänger eine Zeile in newsletter_sends
//   angelegt (eindeutig je Kampagne + Empfänger). So bekommt niemand eine
//   Kampagne doppelt – auch wenn zwei Versandläufe gleichzeitig starten.
// - Ein Lauf arbeitet nur bis zur Zeitgrenze; der nächste Lauf (Zeitplan)
//   macht an der gleichen Stelle weiter.
// ─────────────────────────────────────────────────────────────────────────────

const BATCH_SIZE = 100;
const PAUSE_MS = 600; // Resend erlaubt standardmäßig 2 Anfragen pro Sekunde
const LOCK_SECONDS = 120;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function fromAddress() {
  return process.env.NEWSLETTER_FROM || process.env.EMAIL_FROM || 'ApeAround <newsletter@apearound.de>';
}

function resendClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY fehlt – Mailversand ist nicht eingerichtet.');
  return new Resend(key);
}

function mailFor(snapshot: Snapshot, subscriberId: string, to: string) {
  const unsub = unsubscribeUrl(subscriberId);
  const replyTo = process.env.NEWSLETTER_REPLY_TO;
  return {
    from: fromAddress(),
    to,
    subject: snapshot.subject,
    html: personalize(snapshot.html, unsub),
    text: personalize(snapshot.text, unsub),
    ...(replyTo ? { replyTo } : {}),
    headers: {
      'List-Unsubscribe': `<${unsub}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  };
}

type Snapshot = { subject: string; html: string; text: string };

// ── Testmail ─────────────────────────────────────────────────────────────────

export async function sendTestMail(campaign: Record<string, unknown>, to: string) {
  const r = await renderCampaign(campaign);
  const resend = resendClient();
  const testUnsub = `${SITE_URL}/api/newsletter/unsubscribe?test=1`;
  const { data, error } = await resend.emails.send({
    from: fromAddress(),
    to,
    subject: `[Test] ${r.subject}`,
    html: personalize(r.html, testUnsub),
    text: personalize(r.text, testUnsub),
  });
  if (error) throw new Error(`Resend: ${error.message ?? JSON.stringify(error)}`);
  return data?.id ?? null;
}

// ── Versand einer Kampagne ───────────────────────────────────────────────────

async function claim(id: string): Promise<boolean> {
  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('newsletter_claim', { p_campaign: id, p_seconds: LOCK_SECONDS });
  if (error) throw new Error(error.message);
  return data === true;
}

async function release(id: string) {
  const supabase = createServerClient();
  await supabase.from('newsletter_campaigns').update({ locked_until: null }).eq('id', id);
}

/**
 * Versendet eine fällige Kampagne (Status „geplant“ und Zeitpunkt erreicht)
 * oder setzt einen angefangenen Versand fort. Gibt zurück, wie viele Mails in
 * diesem Lauf rausgingen und ob die Kampagne fertig ist.
 */
export async function processCampaign(id: string, deadline: number) {
  const supabase = createServerClient();
  if (!(await claim(id))) return { id, skipped: 'gesperrt' as const };

  try {
    const { data: c } = await supabase
      .from('newsletter_campaigns')
      .select('id, kind, title, subject, preheader, blocks, status, scheduled_at, html_snapshot')
      .eq('id', id)
      .maybeSingle();
    if (!c || c.kind !== 'campaign') return { id, skipped: 'unbekannt' as const };

    if (c.status === 'scheduled') {
      if (!c.scheduled_at || new Date(c.scheduled_at).getTime() > Date.now()) return { id, skipped: 'noch nicht fällig' as const };
      // Inhalt einfrieren: alle Empfänger bekommen exakt dieselbe Mail
      const r = await renderCampaign(c);
      const snapshot: Snapshot = { subject: r.subject, html: r.html, text: r.text };
      await supabase.from('newsletter_campaigns').update({
        status: 'sending', started_at: new Date().toISOString(),
        html_snapshot: JSON.stringify(snapshot), last_error: null,
      }).eq('id', id);
      c.status = 'sending';
      c.html_snapshot = JSON.stringify(snapshot);
    }
    if (c.status !== 'sending') return { id, skipped: 'nicht im Versand' as const };

    const snapshot: Snapshot = JSON.parse(c.html_snapshot);
    const resend = resendClient();
    let sentNow = 0;

    while (Date.now() < deadline) {
      const { data: recipients, error: rErr } = await supabase.rpc('newsletter_next_recipients', { p_campaign: id, p_limit: BATCH_SIZE });
      if (rErr) throw new Error(rErr.message);
      if (!recipients?.length) {
        await supabase.from('newsletter_campaigns').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', id);
        return { id, sentNow, done: true };
      }

      // Empfänger reservieren – nur Zeilen, die wirklich neu angelegt wurden, gehören diesem Lauf
      const { data: reserved, error: qErr } = await supabase
        .from('newsletter_sends')
        .upsert(recipients.map((r: { id: string }) => ({ campaign_id: id, subscriber_id: r.id, status: 'queued' })),
          { onConflict: 'campaign_id,subscriber_id', ignoreDuplicates: true })
        .select('id, subscriber_id');
      if (qErr) throw new Error(qErr.message);
      if (!reserved?.length) continue;

      const byId = new Map(recipients.map((r: { id: string; email: string }) => [r.id, r.email]));
      const batch = reserved.map(row => ({ row, mail: mailFor(snapshot, row.subscriber_id, byId.get(row.subscriber_id) as string) }));

      const { data, error } = await resend.batch.send(batch.map(b => b.mail), {
        idempotencyKey: `nl-${id}-${reserved[0].id}`,
      });
      const now = new Date().toISOString();

      if (error) {
        const msg = error.message ?? JSON.stringify(error);
        await supabase.from('newsletter_sends').update({ status: 'failed', error: msg.slice(0, 500) }).in('id', reserved.map(r => r.id));
        // Wenn gleich das erste Paket scheitert, liegt meist ein Einrichtungsfehler vor → anhalten
        await supabase.from('newsletter_campaigns').update({ status: 'failed', last_error: msg.slice(0, 500) }).eq('id', id);
        return { id, sentNow, done: false, error: msg };
      }

      const ids = data?.data ?? [];
      await Promise.all(batch.map((b, i) => supabase
        .from('newsletter_sends')
        .update({ status: 'sent', resend_id: ids[i]?.id ?? null, sent_at: now })
        .eq('id', b.row.id)));
      sentNow += batch.length;
      await sleep(PAUSE_MS);
    }
    return { id, sentNow, done: false };
  } finally {
    await release(id);
  }
}

/** Alle fälligen und angefangenen Kampagnen abarbeiten (für den Zeitplan). */
export async function processDueCampaigns(deadline: number) {
  const supabase = createServerClient();
  const nowIso = new Date().toISOString();
  const [sending, due] = await Promise.all([
    supabase.from('newsletter_campaigns').select('id, scheduled_at').eq('kind', 'campaign').eq('status', 'sending'),
    supabase.from('newsletter_campaigns').select('id, scheduled_at').eq('kind', 'campaign').eq('status', 'scheduled')
      .lte('scheduled_at', nowIso).order('scheduled_at', { ascending: true }),
  ]);
  if (sending.error) throw new Error(sending.error.message);
  if (due.error) throw new Error(due.error.message);
  const results = [];
  for (const c of [...(sending.data ?? []), ...(due.data ?? [])]) {
    if (Date.now() >= deadline) break;
    results.push(await processCampaign(c.id, deadline));
  }
  return results;
}

// ── Willkommensmail ──────────────────────────────────────────────────────────

export async function sendWelcomeMail(subscriberId: string) {
  const supabase = createServerClient();
  const [{ data: welcome }, { data: sub }] = await Promise.all([
    supabase.from('newsletter_campaigns').select('id, title, subject, preheader, blocks, status').eq('kind', 'welcome').maybeSingle(),
    supabase.from('newsletter_subscribers').select('id, email, status, welcome_sent_at').eq('id', subscriberId).maybeSingle(),
  ]);
  if (!welcome || welcome.status !== 'active') return { sent: false, reason: 'Willkommensmail ist ausgeschaltet' };
  if (!sub || sub.status !== 'confirmed' || sub.welcome_sent_at) return { sent: false, reason: 'nicht nötig' };

  // Reservieren, damit sie nie doppelt rausgeht
  const { data: reserved } = await supabase
    .from('newsletter_sends')
    .upsert({ campaign_id: welcome.id, subscriber_id: sub.id, status: 'queued' }, { onConflict: 'campaign_id,subscriber_id', ignoreDuplicates: true })
    .select('id');
  if (!reserved?.length) return { sent: false, reason: 'bereits versendet' };

  try {
    const r = await renderCampaign(welcome);
    const { data, error } = await resendClient().emails.send(mailFor({ subject: r.subject, html: r.html, text: r.text }, sub.id, sub.email));
    if (error) throw new Error(error.message ?? JSON.stringify(error));
    const now = new Date().toISOString();
    await Promise.all([
      supabase.from('newsletter_sends').update({ status: 'sent', resend_id: data?.id ?? null, sent_at: now }).eq('id', reserved[0].id),
      supabase.from('newsletter_subscribers').update({ welcome_sent_at: now }).eq('id', sub.id),
    ]);
    return { sent: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await supabase.from('newsletter_sends').update({ status: 'failed', error: msg.slice(0, 500) }).eq('id', reserved[0].id);
    return { sent: false, reason: msg };
  }
}

/** Nachholen: bestätigte Abonnenten der letzten 7 Tage ohne Willkommensmail. */
export async function catchUpWelcomeMails(deadline: number) {
  const supabase = createServerClient();
  const { data: welcome } = await supabase.from('newsletter_campaigns').select('id, status, started_at').eq('kind', 'welcome').maybeSingle();
  if (!welcome || welcome.status !== 'active') return 0;
  // Nur wer nach dem Einschalten bestätigt hat (höchstens 7 Tage zurück) –
  // ältere Abonnenten bekommen beim Einschalten keine nachträgliche Willkommensmail
  const week = Date.now() - 7 * 864e5;
  const activated = welcome.started_at ? new Date(welcome.started_at).getTime() : Date.now();
  const since = new Date(Math.max(week, activated)).toISOString();
  const { data: subs } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('status', 'confirmed')
    .is('welcome_sent_at', null)
    .gte('confirmed_at', since)
    .limit(50);
  let n = 0;
  for (const s of subs ?? []) {
    if (Date.now() >= deadline) break;
    const r = await sendWelcomeMail(s.id);
    if (r.sent) n++;
    await sleep(PAUSE_MS);
  }
  return n;
}
