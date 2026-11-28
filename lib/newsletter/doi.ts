import 'server-only';
import { createServerClient } from '@/lib/supabase/server';
import { generateToken, hashToken } from '@/lib/tokens';
import { sendNewsletterConfirmation } from '@/lib/email';

// Anmeldung mit Double-Opt-In: Eintrag als „ausstehend“ speichern und die
// Bestätigungsmail schicken. Bereits bestätigte Adressen bleiben unverändert.

// Genau der Wortlaut, der unter dem Anmeldeformular steht (components/landing/NewsletterSection.jsx)
export const DEFAULT_CONSENT_TEXT =
  'Mit „Jetzt anmelden“ willige ich ein, den ApeAround-Newsletter mit Reiseideen, Tipps und Angeboten per E-Mail zu erhalten. ' +
  'Ich kann mich jederzeit wieder abmelden. Die Anmeldung wird erst nach Bestätigung per E-Mail aktiv.';

export async function startDoubleOptIn(opts: {
  email: string; source: string; consentText?: string; ip?: string | null; userAgent?: string | null;
}): Promise<{ status: 'pending' | 'already_confirmed'; mailSent: boolean; error?: string }> {
  const email = opts.email.trim().toLowerCase().slice(0, 200);
  const supabase = createServerClient();

  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('status')
    .eq('email', email)
    .maybeSingle();
  if (existing?.status === 'confirmed') return { status: 'already_confirmed', mailSent: false };

  const confirmToken = generateToken();
  const now = new Date().toISOString();
  const { error } = await supabase.from('newsletter_subscribers').upsert({
    email,
    status: 'pending',
    source: opts.source,
    consent_text: opts.consentText ?? DEFAULT_CONSENT_TEXT,
    consent_given_at: now,
    confirmation_token_hash: hashToken(confirmToken),
    confirmation_sent_at: now,
    unsubscribe_token_hash: hashToken(generateToken()),
    confirmed_at: null,
    unsubscribed_at: null,
    ip_hash: opts.ip ? hashToken(opts.ip) : null,
    user_agent: (opts.userAgent ?? '').slice(0, 512) || null,
  }, { onConflict: 'email' });
  if (error) throw new Error(error.message);

  const mail = await sendNewsletterConfirmation(email, confirmToken);
  return mail.sent ? { status: 'pending', mailSent: true } : { status: 'pending', mailSent: false, error: mail.error };
}
