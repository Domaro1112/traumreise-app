import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { hashToken } from '@/lib/tokens';
import { SITE_URL } from '@/lib/site-config';
import { verifySubscriber } from '@/lib/newsletter/unsubscribe';

// Abmeldung vom Newsletter.
//
// Zwei Linkarten:
//   ?token=…        – alter Einmal-Link (Hash in der Datenbank)
//   ?u=<id>&s=<sig> – Link aus Newsletter-Kampagnen (signiert, siehe lib/newsletter/unsubscribe)
//
// Bei Kampagnen-Links zeigt GET erst eine Bestätigungsseite: Viele Firmen-
// Mailfilter rufen Links automatisch auf – sonst würden Leute ungewollt
// abgemeldet. POST meldet sofort ab; das nutzen auch Gmail & Co. für die
// Ein-Klick-Abmeldung (Header List-Unsubscribe-Post).

const HTML = { 'Content-Type': 'text/html; charset=utf-8' };

async function unsubscribeById(id: string) {
  const supabase = createServerClient();
  const { data } = await supabase.from('newsletter_subscribers').select('id, status').eq('id', id).maybeSingle();
  if (!data) return 'notfound' as const;
  if (data.status === 'unsubscribed') return 'already' as const;
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString(), unsubscribe_token_hash: null })
    .eq('id', id);
  return error ? ('error' as const) : ('done' as const);
}

function resultPage(r: 'notfound' | 'already' | 'done' | 'error' | 'invalid') {
  switch (r) {
    case 'done':     return page('✅', 'Abmeldung erfolgreich', 'Du wurdest vom ApeAround-Newsletter abgemeldet und erhältst ab jetzt keine weiteren E-Mails mehr.', 200);
    case 'already':  return page('✅', 'Bereits abgemeldet', 'Du hast dich bereits abgemeldet. Du erhältst keine weiteren Newsletter von ApeAround.', 200);
    case 'notfound': return page('⚠️', 'Nicht gefunden', 'Zu diesem Link gibt es keine Anmeldung (mehr).', 404);
    case 'invalid':  return page('⚠️', 'Ungültiger Link', 'Dieser Abmeldelink ist ungültig. Schreib uns gern, dann tragen wir dich von Hand aus.', 400);
    default:         return page('⚠️', 'Fehler', 'Die Abmeldung ist fehlgeschlagen. Bitte versuche es gleich noch einmal.', 500);
  }
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  if (sp.get('test') === '1') {
    return page('🧪', 'Testmail', 'Das war eine Testmail – der Abmeldelink funktioniert erst in echten Newsletter-Mails.', 200);
  }

  const u = sp.get('u'); const s = sp.get('s');
  if (u || s) {
    if (!u || !s || !verifySubscriber(u, s)) return resultPage('invalid');
    const action = `${SITE_URL}/api/newsletter/unsubscribe?u=${encodeURIComponent(u)}&amp;s=${encodeURIComponent(s)}`;
    return page('✋', 'Vom Newsletter abmelden?',
      'Schade, dass du gehen möchtest. Mit einem Klick auf den Button wirst du sofort abgemeldet.', 200,
      `<form method="post" action="${action}"><button type="submit" class="btn">Ja, abmelden</button></form>`);
  }

  // Alter Einmal-Link
  const token = sp.get('token');
  if (!token || token.length < 10) return resultPage('invalid');
  const supabase = createServerClient();
  const { data } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('unsubscribe_token_hash', hashToken(token))
    .maybeSingle();
  if (!data) return resultPage('notfound');
  return resultPage(await unsubscribeById(data.id));
}

export async function POST(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const u = sp.get('u'); const s = sp.get('s');
  if (!u || !s || !verifySubscriber(u, s)) return resultPage('invalid');
  return resultPage(await unsubscribeById(u));
}

function page(icon: string, title: string, msg: string, status: number, extra = '') {
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="robots" content="noindex">
  <title>ApeAround Newsletter – ${title}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#F8FAFC;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border-radius:20px;border:1.5px solid #E2E8F0;max-width:480px;width:100%;padding:40px 32px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
    h1{font-size:22px;font-weight:800;color:#0F172A;margin:16px 0 12px}
    p{font-size:15px;color:#64748B;line-height:1.7;margin:0 0 24px}
    .btn{display:inline-block;padding:13px 28px;border-radius:12px;border:0;background:#0EA5E9;color:#fff;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;margin:0 0 20px}
    a{color:#0EA5E9;font-size:13px}
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size:40px">${icon}</div>
    <h1>${title}</h1>
    <p>${msg}</p>
    ${extra}
    <div><a href="${SITE_URL}">Zur ApeAround-Startseite</a></div>
  </div>
</body>
</html>`;
  return new NextResponse(html, { status, headers: HTML });
}
