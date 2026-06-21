import { Resend } from 'resend';
import { SITE_URL } from '@/lib/site-config';

const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'ApeAround <newsletter@apearound.de>';

export type MailResult =
  | { sent: true;  id: string }
  | { sent: false; error: string };

export async function sendNewsletterConfirmation(
  email: string,
  token: string,
): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;

  if (!key) {
    const msg =
      'Mailversand nicht konfiguriert: RESEND_API_KEY fehlt. ' +
      'Bitte RESEND_API_KEY (und optional EMAIL_FROM) in .env.local setzen.';
    console.error('[MAIL_SEND] ❌', msg);
    return { sent: false, error: msg };
  }

  const confirmUrl   = `${SITE_URL}/api/newsletter/confirm?token=${token}`;
  const unsubUrl     = `${SITE_URL}/api/newsletter/unsubscribe?token=`;

  console.log(`[MAIL_SEND] Sende DOI-Bestätigungsmail an: ${email}`);
  console.log(`[MAIL_SEND] Confirm-URL: ${confirmUrl}`);
  console.log(`[MAIL_SEND] From: ${FROM_ADDRESS}`);
  console.log(`[MAIL_SEND] SITE_URL: ${SITE_URL}`);

  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      email,
      subject: 'Bitte bestätige deine Anmeldung zum ApeAround-Newsletter',
      html:    buildHtml(confirmUrl, unsubUrl),
    });

    if (error) {
      const msg = `Resend API-Fehler: ${(error as Record<string, unknown>)['message'] ?? JSON.stringify(error)}`;
      console.error('[MAIL_SEND] ❌ Resend Error-Response:', JSON.stringify(error));
      return { sent: false, error: msg };
    }

    console.log(`[MAIL_SEND] ✅ Mail erfolgreich gesendet. Resend-ID: ${data?.id}`);
    return { sent: true, id: data?.id ?? 'unknown' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[MAIL_SEND] ❌ Exception beim Senden:', msg);
    return { sent: false, error: msg };
  }
}

// ── Admin-Benachrichtigung: Creator-Profil eingereicht ────────────────────────

interface CreatorSubmittedPayload {
  id:           string;
  display_name: string;
  slug:         string;
  creator_type: string | null;
  submitted_at: string;
}

export async function sendCreatorProfileSubmittedNotification(
  profile: CreatorSubmittedPayload,
): Promise<MailResult> {
  const key        = process.env.RESEND_API_KEY;
  const notifyMail = process.env.CREATOR_REVIEW_NOTIFY_EMAIL;

  if (!notifyMail) {
    console.log('[CREATOR_NOTIFY] Creator profile submitted, but no CREATOR_REVIEW_NOTIFY_EMAIL configured. Skipping mail.');
    return { sent: false, error: 'CREATOR_REVIEW_NOTIFY_EMAIL not configured' };
  }
  if (!key) {
    console.log('[CREATOR_NOTIFY] Creator profile submitted, but RESEND_API_KEY not configured. Skipping mail.');
    return { sent: false, error: 'RESEND_API_KEY not configured' };
  }

  const adminUrl   = `${SITE_URL}/admin/creator-profiles/${profile.id}`;
  const submittedAt = new Date(profile.submitted_at).toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      notifyMail,
      subject: 'Neues Creator-Profil wartet auf Prüfung',
      html:    buildCreatorSubmittedHtml({ ...profile, adminUrl, submittedAt }),
    });

    if (error) {
      const msg = `Resend API-Fehler: ${(error as Record<string, unknown>)['message'] ?? JSON.stringify(error)}`;
      console.error('[CREATOR_NOTIFY] ❌', msg);
      return { sent: false, error: msg };
    }

    console.log(`[CREATOR_NOTIFY] ✅ Admin-Mail gesendet. Resend-ID: ${data?.id}`);
    return { sent: true, id: data?.id ?? 'unknown' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CREATOR_NOTIFY] ❌ Exception:', msg);
    return { sent: false, error: msg };
  }
}

function buildCreatorSubmittedHtml(p: {
  display_name: string; slug: string; creator_type: string | null;
  submittedAt: string; adminUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden;max-width:100%;">
        <tr><td style="background:linear-gradient(135deg,#0F172A 0%,#12324a 60%,#0EA5E9 160%);padding:28px 32px;text-align:center;">
          <p style="margin:0;font-size:24px;">🐒✈️</p>
          <p style="margin:6px 0 0;color:#38BDF8;font-weight:700;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">ApeAround Admin</p>
        </td></tr>
        <tr><td style="padding:32px 32px 24px;">
          <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0F172A;line-height:1.3;">Neues Creator-Profil zur Prüfung</h1>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">Ein Creator hat sein Profil vollständig ausgefüllt und zur Prüfung eingereicht.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;overflow:hidden;margin:0 0 24px;">
            <tr><td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Creator-Name</p>
              <p style="margin:4px 0 0;font-size:15px;color:#0F172A;font-weight:700;">${p.display_name}</p>
            </td></tr>
            <tr><td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Profil-Slug</p>
              <p style="margin:4px 0 0;font-size:14px;color:#64748B;font-family:monospace;">/creator/${p.slug}</p>
            </td></tr>
            ${p.creator_type ? `<tr><td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Creator-Typ</p>
              <p style="margin:4px 0 0;font-size:14px;color:#0F172A;">${p.creator_type}</p>
            </td></tr>` : ''}
            <tr><td style="padding:14px 18px;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Eingereicht am</p>
              <p style="margin:4px 0 0;font-size:14px;color:#0F172A;">${p.submittedAt} Uhr</p>
            </td></tr>
          </table>
          <div style="text-align:center;">
            <a href="${p.adminUrl}" style="display:inline-block;padding:13px 28px;border-radius:12px;background:linear-gradient(135deg,#0EA5E9,#06B6D4);color:#FFFFFF;font-weight:700;font-size:15px;text-decoration:none;">
              Profil jetzt prüfen →
            </a>
          </div>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:14px 32px;text-align:center;">
          <p style="margin:0;color:#94A3B8;font-size:11px;">ApeAround Admin · Diese E-Mail wurde automatisch generiert.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

// ── Admin-Benachrichtigung: Creator-Inhalt eingereicht ───────────────────────

interface ContentSubmittedPayload {
  creator_name:  string;
  content_type:  string;
  title:         string;
  destination:   string | null;
  submission_id: string;
  submitted_at:  string;
}

export async function sendCreatorContentSubmittedNotification(
  payload: ContentSubmittedPayload,
): Promise<MailResult> {
  const key        = process.env.RESEND_API_KEY;
  const notifyMail = process.env.CREATOR_REVIEW_NOTIFY_EMAIL;

  if (!notifyMail) {
    console.log('[CONTENT_NOTIFY] No CREATOR_REVIEW_NOTIFY_EMAIL configured. Skipping.');
    return { sent: false, error: 'CREATOR_REVIEW_NOTIFY_EMAIL not configured' };
  }
  if (!key) {
    console.log('[CONTENT_NOTIFY] No RESEND_API_KEY configured. Skipping.');
    return { sent: false, error: 'RESEND_API_KEY not configured' };
  }

  const adminUrl = `${SITE_URL}/admin/creator-submissions/${payload.submission_id}`;
  const submittedAt = new Date(payload.submitted_at).toLocaleString('de-DE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const typeLabel = payload.content_type === 'guide' ? 'Reiseguide'
    : payload.content_type === 'tip' ? 'Reisetipp' : 'Reiseroute';

  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({
      from:    FROM_ADDRESS,
      to:      notifyMail,
      subject: `Neuer ${typeLabel} wartet auf Prüfung`,
      html:    `<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden;max-width:100%;">
        <tr><td style="background:linear-gradient(135deg,#0F172A 0%,#12324a 60%,#0EA5E9 160%);padding:28px 32px;text-align:center;">
          <p style="margin:0;font-size:24px;">🐒✈️</p>
          <p style="margin:6px 0 0;color:#38BDF8;font-weight:700;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;">ApeAround Admin</p>
        </td></tr>
        <tr><td style="padding:32px 32px 24px;">
          <h1 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#0F172A;">Neuer ${typeLabel} zur Prüfung</h1>
          <p style="margin:0 0 24px;color:#475569;font-size:15px;line-height:1.6;">${payload.creator_name} hat einen neuen Inhalt eingereicht.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;border:1px solid #E2E8F0;overflow:hidden;margin:0 0 24px;">
            <tr><td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Titel</p>
              <p style="margin:4px 0 0;font-size:15px;color:#0F172A;font-weight:700;">${payload.title}</p>
            </td></tr>
            <tr><td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Creator</p>
              <p style="margin:4px 0 0;font-size:14px;color:#0F172A;">${payload.creator_name}</p>
            </td></tr>
            ${payload.destination ? `<tr><td style="padding:14px 18px;border-bottom:1px solid #E2E8F0;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Ziel</p>
              <p style="margin:4px 0 0;font-size:14px;color:#0F172A;">${payload.destination}</p>
            </td></tr>` : ''}
            <tr><td style="padding:14px 18px;">
              <p style="margin:0;font-size:12px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;font-weight:700;">Eingereicht am</p>
              <p style="margin:4px 0 0;font-size:14px;color:#0F172A;">${submittedAt} Uhr</p>
            </td></tr>
          </table>
          <div style="text-align:center;">
            <a href="${adminUrl}" style="display:inline-block;padding:13px 28px;border-radius:12px;background:linear-gradient(135deg,#0EA5E9,#06B6D4);color:#FFFFFF;font-weight:700;font-size:15px;text-decoration:none;">
              Inhalt jetzt prüfen →
            </a>
          </div>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:14px 32px;text-align:center;">
          <p style="margin:0;color:#94A3B8;font-size:11px;">ApeAround Admin · Diese E-Mail wurde automatisch generiert.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`,
    });

    if (error) {
      const msg = `Resend API-Fehler: ${(error as Record<string, unknown>)['message'] ?? JSON.stringify(error)}`;
      console.error('[CONTENT_NOTIFY] ❌', msg);
      return { sent: false, error: msg };
    }

    console.log(`[CONTENT_NOTIFY] ✅ Admin-Mail gesendet. Resend-ID: ${data?.id}`);
    return { sent: true, id: data?.id ?? 'unknown' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[CONTENT_NOTIFY] ❌ Exception:', msg);
    return { sent: false, error: msg };
  }
}

// ── Newsletter-Bestätigung ─────────────────────────────────────────────────────

function buildHtml(confirmUrl: string, unsubUrl: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;border:1px solid #E2E8F0;overflow:hidden;max-width:100%;">
        <tr><td style="background:linear-gradient(135deg,#0F172A 0%,#12324a 60%,#0EA5E9 160%);padding:32px;text-align:center;">
          <p style="margin:0;font-size:28px;">🐒✈️</p>
          <p style="margin:8px 0 0;color:#38BDF8;font-weight:700;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;">ApeAround</p>
        </td></tr>
        <tr><td style="padding:36px 32px;">
          <h1 style="margin:0 0 16px;font-size:22px;font-weight:800;color:#0F172A;line-height:1.3;">Fast geschafft!</h1>
          <p style="margin:0 0 14px;color:#475569;font-size:15px;line-height:1.7;">
            Du hast dich für den <strong>ApeAround-Newsletter</strong> angemeldet.
            Bitte bestätige deine Anmeldung über den Button – erst danach erhältst du Reiseideen, Tipps und Neuigkeiten.
          </p>
          <div style="margin:28px 0;text-align:center;">
            <a href="${confirmUrl}"
               style="display:inline-block;padding:14px 28px;border-radius:12px;
                      background:linear-gradient(135deg,#0EA5E9,#06B6D4);
                      color:#FFFFFF;font-weight:700;font-size:15px;text-decoration:none;">
              Newsletter-Anmeldung bestätigen
            </a>
          </div>
          <p style="margin:0 0 8px;color:#94A3B8;font-size:13px;line-height:1.6;">
            Falls der Button nicht funktioniert, kopiere diesen Link in deinen Browser:
          </p>
          <p style="margin:0 0 24px;word-break:break-all;">
            <a href="${confirmUrl}" style="color:#0EA5E9;font-size:13px;">${confirmUrl}</a>
          </p>
          <hr style="border:none;border-top:1px solid #F1F5F9;margin:0 0 20px;">
          <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.6;">
            Falls du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren – es werden keine weiteren Mails gesendet.
          </p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#94A3B8;font-size:11px;">
            © ApeAround ·
            <a href="${SITE_URL}/datenschutz" style="color:#94A3B8;">Datenschutz</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}
