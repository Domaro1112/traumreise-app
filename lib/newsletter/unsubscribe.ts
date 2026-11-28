import 'server-only';
import crypto from 'crypto';
import { SITE_URL } from '@/lib/site-config';

// Abmeldelinks für Newsletter-Kampagnen.
//
// Die Datenbank speichert Tokens nur als Hash – für Massenmails brauchen wir
// aber einen Link je Empfänger. Deshalb wird der Link aus der Abonnenten-ID
// und einer HMAC-Signatur gebildet: nicht erratbar, aber jederzeit
// nachrechenbar, ohne etwas zu speichern.

function secret(): string {
  const s = process.env.NEWSLETTER_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error('NEWSLETTER_SECRET fehlt (Umgebungsvariable).');
  return s;
}

export function signSubscriber(subscriberId: string): string {
  return crypto.createHmac('sha256', secret()).update(`unsub:${subscriberId}`).digest('hex').slice(0, 32);
}

export function verifySubscriber(subscriberId: string, signature: string): boolean {
  if (!subscriberId || !signature || signature.length !== 32) return false;
  const expected = signSubscriber(subscriberId);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export function unsubscribeUrl(subscriberId: string): string {
  return `${SITE_URL}/api/newsletter/unsubscribe?u=${encodeURIComponent(subscriberId)}&s=${signSubscriber(subscriberId)}`;
}
