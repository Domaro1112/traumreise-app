import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { hashToken } from '@/lib/tokens';
import { SITE_URL } from '@/lib/site-config';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token || token.length < 10) {
    return new NextResponse(errorPage('Ungültiger Bestätigungslink.'), {
      status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const tokenHash = hashToken(token);
  const supabase  = createServerClient();

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, status, confirmed_at')
    .eq('confirmation_token_hash', tokenHash)
    .single();

  if (error || !data) {
    return new NextResponse(errorPage('Dieser Bestätigungslink ist ungültig oder wurde bereits verwendet.'), {
      status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  if (data.status === 'confirmed' && data.confirmed_at) {
    return new NextResponse(successPage(true), {
      status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  const { error: updateError } = await supabase
    .from('newsletter_subscribers')
    .update({
      status:                  'confirmed',
      confirmed_at:            new Date().toISOString(),
      confirmation_token_hash: null,
    })
    .eq('id', data.id);

  if (updateError) {
    return new NextResponse(errorPage('Bestätigung fehlgeschlagen. Bitte versuche es erneut.'), {
      status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }

  return new NextResponse(successPage(false), {
    status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>ApeAround Newsletter</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#F8FAFC;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border-radius:20px;border:1.5px solid #E2E8F0;max-width:480px;width:100%;padding:40px 32px;text-align:center;box-shadow:0 4px 24px rgba(0,0,0,0.06)}
    h1{font-size:22px;font-weight:800;color:#0F172A;margin:20px 0 12px}
    p{font-size:15px;color:#64748B;line-height:1.7;margin:0 0 24px}
    a.btn{display:inline-block;padding:13px 26px;border-radius:12px;background:linear-gradient(135deg,#0EA5E9,#06B6D4);color:#fff;font-weight:700;font-size:14px;text-decoration:none}
    a.link{color:#0EA5E9;font-size:13px}
  </style>
</head>
<body><div class="card">${content}</div></body>
</html>`;
}

function successPage(alreadyDone: boolean): string {
  return layout(`
    <div style="font-size:40px">✅</div>
    <h1>${alreadyDone ? 'Bereits bestätigt' : 'Anmeldung bestätigt!'}</h1>
    <p>${alreadyDone
      ? 'Du hast deine Newsletter-Anmeldung bereits bestätigt.'
      : 'Herzlich willkommen! Du erhältst ab jetzt Reiseideen, Tipps und Neuigkeiten von ApeAround.'
    }</p>
    <a class="btn" href="${SITE_URL}">Zur ApeAround-Startseite</a>
  `);
}

function errorPage(msg: string): string {
  return layout(`
    <div style="font-size:40px">⚠️</div>
    <h1>Link ungültig</h1>
    <p>${msg}</p>
    <a class="link" href="${SITE_URL}">Zur Startseite</a>
  `);
}
