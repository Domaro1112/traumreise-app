import { createServerClient } from '@/lib/supabase/server';

export async function insertSubscriber(email, source = 'landing_page') {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .upsert({ email, source }, { onConflict: 'email', ignoreDuplicates: true })
    .select('id')
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getSubscriberByEmail(email) {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('id, email, confirmed, created_at')
    .eq('email', email)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}
