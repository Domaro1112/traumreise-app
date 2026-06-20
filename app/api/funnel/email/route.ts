import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { saveEmail } from '@/repositories/travel-funnel';
import { generateToken, hashToken } from '@/lib/tokens';
import { sendNewsletterConfirmation } from '@/lib/email';

const CONSENT_TEXT =
  'Ich möchte den ApeAround-Newsletter erhalten und gelegentlich Reiseideen, Tipps, Angebote und ' +
  'Neuigkeiten per E-Mail bekommen. Ich kann mich jederzeit wieder abmelden. ' +
  'Die Anmeldung wird erst nach Bestätigung per E-Mail aktiv.';

export async function POST(request: NextRequest) {
  let body: { sessionId?: string; email?: string; newsletterConsent?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { sessionId, email, newsletterConsent } = body;

  if (!sessionId?.trim()) {
    return NextResponse.json({ error: 'Session-ID fehlt.' }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Bitte eine gültige E-Mail-Adresse eingeben.' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase().slice(0, 200);

  // 1. Save email to funnel session
  try {
    await saveEmail(sessionId, normalizedEmail);
  } catch (err) {
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gespeichert werden. Bitte versuche es erneut.' },
      { status: 500 },
    );
  }

  // 2. Newsletter: only if user explicitly opted in
  let newsletterQueued = false;
  if (newsletterConsent === true) {
    try {
      const confirmToken     = generateToken();
      const unsubscribeToken = generateToken();
      const confirmHash      = hashToken(confirmToken);
      const unsubHash        = hashToken(unsubscribeToken);
      const ipRaw            = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
      const ipHash           = ipRaw ? hashToken(ipRaw.split(',')[0].trim()) : null;
      const userAgent        = (request.headers.get('user-agent') ?? '').slice(0, 512);

      const supabase = createServerClient();
      const { error: upsertError } = await supabase
        .from('newsletter_subscribers')
        .upsert(
          {
            email:                    normalizedEmail,
            status:                   'pending',
            source:                   'travel_funnel',
            consent_text:             CONSENT_TEXT,
            consent_given_at:         new Date().toISOString(),
            confirmation_token_hash:  confirmHash,
            confirmation_sent_at:     new Date().toISOString(),
            unsubscribe_token_hash:   unsubHash,
            confirmed_at:             null,
            unsubscribed_at:          null,
            ip_hash:                  ipHash,
            user_agent:               userAgent,
          },
          { onConflict: 'email' },
        );

      if (upsertError) throw upsertError;

      // Send confirmation email (skipped if RESEND_API_KEY is unset)
      await sendNewsletterConfirmation(normalizedEmail, confirmToken);
      newsletterQueued = true;
    } catch (err) {
      // Newsletter failure must NOT block showing the results
      console.error('[funnel/email] newsletter upsert/send error:', err);
    }
  }

  return NextResponse.json({ success: true, newsletterQueued }, { status: 200 });
}
