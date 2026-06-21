import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { saveEmail } from '@/repositories/travel-funnel';
import { generateToken, hashToken } from '@/lib/tokens';
import { sendNewsletterConfirmation } from '@/lib/email';

const CONSENT_TEXT =
  'Ich möchte den ApeAround-Newsletter erhalten und gelegentlich Reiseideen, Tipps, Angebote und ' +
  'Neuigkeiten <strong>für Alleinerziehende per E-Mail</strong> bekommen. Ich kann mich jederzeit wieder abmelden. ' +
  'Die Anmeldung wird erst nach Bestätigung per E-Mail aktiv.';

export async function POST(request: NextRequest) {
  console.log('[FUNNEL_EMAIL] POST /api/funnel/email aufgerufen');

  let body: { sessionId?: string; email?: string; newsletterConsent?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 });
  }

  const { sessionId, email, newsletterConsent } = body;
  console.log(`[FUNNEL_EMAIL] sessionId=${sessionId} email=${email} newsletterConsent=${newsletterConsent}`);

  // ── Validation ────────────────────────────────────────────────────────────
  if (!sessionId?.trim()) {
    return NextResponse.json({ error: 'Session-ID fehlt.' }, { status: 400 });
  }
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Bitte eine gültige E-Mail-Adresse eingeben.' }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase().slice(0, 200);

  // ── 1. E-Mail in Funnel-Session speichern ─────────────────────────────────
  let subscriberSaved = false;
  try {
    console.log(`[FUNNEL_EMAIL] Speichere E-Mail in Session ${sessionId}…`);
    await saveEmail(sessionId, normalizedEmail);
    subscriberSaved = true;
    console.log('[FUNNEL_EMAIL] ✅ E-Mail in Session gespeichert.');
  } catch (err) {
    console.error('[FUNNEL_EMAIL] ❌ saveEmail Fehler:', err);
    return NextResponse.json(
      { error: 'E-Mail konnte nicht gespeichert werden. Bitte erneut versuchen.' },
      { status: 500 },
    );
  }

  // ── 2. Newsletter-DOI (nur bei explizitem Opt-in) ─────────────────────────
  let newsletterQueued = false;
  let tokenCreated     = false;
  let mailSent         = false;
  let mailError: string | null = null;

  if (newsletterConsent === true) {
    console.log('[NEWSLETTER_DOI] Opt-in erkannt — starte DOI-Flow…');

    try {
      // Token generieren
      const confirmToken     = generateToken();
      const unsubscribeToken = generateToken();
      const confirmHash      = hashToken(confirmToken);
      const unsubHash        = hashToken(unsubscribeToken);
      tokenCreated = true;
      console.log('[NEWSLETTER_DOI] ✅ Tokens generiert (Hashes gespeichert, Klartexte nur im Speicher).');

      // IP & UA (gehasht für Audit-Trail, nicht plain text)
      const ipRaw   = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
      const ipHash  = ipRaw ? hashToken(ipRaw.split(',')[0].trim()) : null;
      const ua      = (request.headers.get('user-agent') ?? '').slice(0, 512);

      // Subscriber anlegen/aktualisieren (Upsert on email conflict)
      console.log(`[NEWSLETTER_DOI] Upsert newsletter_subscribers für ${normalizedEmail}…`);
      const supabase = createServerClient();
      const { error: upsertError } = await supabase
        .from('newsletter_subscribers')
        .upsert(
          {
            email:                   normalizedEmail,
            status:                  'pending',
            source:                  'travel_funnel',
            consent_text:            CONSENT_TEXT,
            consent_given_at:        new Date().toISOString(),
            confirmation_token_hash: confirmHash,
            confirmation_sent_at:    new Date().toISOString(),
            unsubscribe_token_hash:  unsubHash,
            confirmed_at:            null,
            unsubscribed_at:         null,
            ip_hash:                 ipHash,
            user_agent:              ua,
          },
          { onConflict: 'email' },
        );

      if (upsertError) {
        console.error('[NEWSLETTER_DOI] ❌ Supabase Upsert Fehler:', JSON.stringify(upsertError));
        throw new Error(upsertError.message);
      }
      console.log('[NEWSLETTER_DOI] ✅ Subscriber in Supabase gespeichert.');

      // Bestätigungsmail senden
      console.log('[NEWSLETTER_DOI] Starte Mailversand…');
      const mailResult = await sendNewsletterConfirmation(normalizedEmail, confirmToken);

      if (mailResult.sent) {
        mailSent         = true;
        newsletterQueued = true;
        console.log(`[NEWSLETTER_DOI] ✅ DOI-Mail gesendet. ID: ${mailResult.id}`);
      } else {
        mailError = mailResult.error;
        console.error('[NEWSLETTER_DOI] ❌ Mailversand fehlgeschlagen:', mailResult.error);
        // Subscriber bleibt in DB mit status=pending — aber mail_error wird in Response zurückgegeben
        // Der Nutzer kann die Ergebnisseite trotzdem sehen (Session wurde gespeichert)
        newsletterQueued = false;
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[NEWSLETTER_DOI] ❌ Unerwarteter Fehler im DOI-Flow:', msg);
      mailError = msg;
      // Newsletter-Fehler blockiert NICHT die Ergebnisseite — Session ist bereits gespeichert
    }
  } else {
    console.log('[NEWSLETTER_DOI] Kein Newsletter-Opt-in — DOI-Flow übersprungen.');
  }

  // ── Response ──────────────────────────────────────────────────────────────
  console.log(`[FUNNEL_EMAIL] Response: subscriberSaved=${subscriberSaved} tokenCreated=${tokenCreated} mailSent=${mailSent} newsletterQueued=${newsletterQueued}`);

  return NextResponse.json(
    {
      success:         true,
      subscriberSaved,
      tokenCreated,
      mailSent,
      newsletterQueued,
      ...(mailError ? { mailError } : {}),
    },
    { status: 200 },
  );
}
