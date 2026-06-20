import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { hashToken } from '@/lib/tokens';
import { SITE_URL } from '@/lib/site-config';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token || token.length < 10) {
    return new NextResponse(page('⚠️', 'Ungültiger Abmelde-Link.', 400), {
      status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const tokenHash = hashToken(token);
  const supabase  = createServerClient();

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, status, unsubscribed_at')
    .eq('unsubscribe_token_hash', tokenHash)
    .single();

  if (error || !data) {
    return new NextResponse(page('⚠️', 'Dieser Abmelde-Link ist ungültig oder bereits verwendet.', 404), {
      status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (data.status === 'unsubscribed') {
    return new NextResponse(page('✅', 'Du hast dich bereits abgemeldet. Du erhältst keine weiteren Newsletter von ApeAround.', 200), {
      status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const { error: updateError } = await supabase
    .from('newsletter_subscribers')
    .update({
      status:                 'unsubscribed',
      unsubscribed_at:        new Date().toISOString(),
      unsubscribe_token_hash: null,
    })
    .eq('id', data.id);

  if (updateError) {
    return new NextResponse(page('⚠️', 'Abmeldung fehlgeschlagen. Bitte versuche es erneut.', 500), {
      status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new NextResponse(
    page('✅', 'Du wurdest erfolgreich vom ApeAround-Newsletter abgemeldet. Du erhältst ab jetzt keine weiteren E-Mails mehr.', 200),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

function page(icon: string, msg: string, status: number): string {
  const title = status === 200 ? 'Abmeldung erfolgreich' : 'Fehler';
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ApeAround Newsletter – ${title}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#F8FAFC;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border-radius:20px;border:1.5px solid #E2E8F0;max-width:480px;width:100%;padding:40px 32px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
    h1{font-size:22px;font-weight:800;color:#0F172A;margin:16px 0 12px}
    p{font-size:15px;color:#64748B;line-height:1.7;margin:0 0 24px}
    a{color:#0EA5E9;font-size:13px}
  </style>
</head>
<body>
  <div class="card">
    <div style="font-size:40px">${icon}</div>
    <h1>${title}</h1>
    <p>${msg}</p>
    <a href="${SITE_URL}">Zur ApeAround-Startseite</a>
  </div>
</body>
</html>`;
}
