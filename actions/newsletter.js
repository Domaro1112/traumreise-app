'use server';

import { isValidEmail } from '@/lib/utils';
import { insertSubscriber } from '@/repositories/newsletter';

export async function subscribeToNewsletter(prevState, formData) {
  const email = formData.get('email')?.toString().trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return { success: false, error: 'Bitte gib eine gültige E-Mail-Adresse ein.' };
  }

  try {
    await insertSubscriber(email, 'landing_page');
    return { success: true, error: null };
  } catch (err) {
    // Supabase not configured yet — log server-side only
    console.error('[newsletter] insertSubscriber failed:', err.message);
    return {
      success: false,
      error: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    };
  }
}
