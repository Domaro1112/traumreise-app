'use server';

import { headers } from 'next/headers';
import { isValidEmail } from '@/lib/utils';
import { startDoubleOptIn } from '@/lib/newsletter/doi';

export async function subscribeToNewsletter(prevState, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  }

  try {
    const h = await headers();
    const ip = (h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? '').split(',')[0].trim() || null;
    const result = await startDoubleOptIn({
      email,
      source: 'landing_page',
      ip,
      userAgent: h.get('user-agent'),
    });
    if (result.status === 'already_confirmed') {
      return { success: true, alreadySubscribed: true, error: null };
    }
    if (!result.mailSent) {
      console.error('[newsletter] Bestätigungsmail nicht versendet:', result.error);
      return { success: false, error: 'Die Bestätigungsmail konnte gerade nicht verschickt werden. Bitte versuche es später erneut.' };
    }
    return { success: true, error: null };
  } catch (err) {
    console.error('[newsletter] Anmeldung fehlgeschlagen:', err?.message);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    };
  }
}
