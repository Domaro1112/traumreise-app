import { Resend } from 'resend';
import { SITE_URL } from '@/lib/site-config';

const FROM_ADDRESS = 'ApeAround <newsletter@apearound.de>';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set — email sending skipped.');
    return null;
  }
  return new Resend(key);
}

export async function sendNewsletterConfirmation(
  email: string,
  token: string,
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?token=${token}`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to:   email,
    subject: 'Bitte bestätige deine Anmeldung zum ApeAround-Newsletter',
    html: `
<!DOCTYPE html>
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
            Bitte bestätige deine Anmeldung über den folgenden Link.
            Erst danach erhältst du Reiseideen, Tipps und Neuigkeiten von ApeAround.
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
            Falls du dich nicht angemeldet hast, kannst du diese E-Mail ignorieren.
            Es werden keine weiteren E-Mails von uns gesendet.
          </p>
        </td></tr>
        <tr><td style="background:#F8FAFC;padding:16px 32px;text-align:center;">
          <p style="margin:0;color:#94A3B8;font-size:11px;">© ApeAround · <a href="${SITE_URL}/datenschutz" style="color:#94A3B8;">Datenschutz</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
  });
}
