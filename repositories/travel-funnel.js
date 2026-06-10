import { createServerClient } from '@/lib/supabase/server';

export async function createSession({ moodSelection, userAgent, referrer }) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('travel_funnel_sessions')
    .insert({
      mood_selection: moodSelection ?? [],
      user_agent: userAgent ?? null,
      referrer: referrer ?? null,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSession(sessionId, { moodSelection, season, budget, duration, generatedDestinations }) {
  const supabase = createServerClient();
  const patch = {};
  if (moodSelection)          patch.mood_selection         = moodSelection;
  if (season)                 patch.season                 = season;
  if (budget)                 patch.budget                 = budget;
  if (duration)               patch.duration               = duration;
  if (generatedDestinations)  patch.generated_destinations = generatedDestinations;
  const { error } = await supabase
    .from('travel_funnel_sessions')
    .update(patch)
    .eq('id', sessionId);
  if (error) throw new Error(error.message);
}

export async function createLead({
  email, consent, consentText,
  sessionId, selectedDestinations,
  moodSelection, season, budget, duration,
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('travel_leads')
    .insert({
      email,
      consent,
      consent_text: consentText ?? null,
      session_id: sessionId ?? null,
      selected_destinations: selectedDestinations ?? [],
      mood_selection: moodSelection ?? [],
      season: season ?? null,
      budget: budget ?? null,
      duration: duration ?? null,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function trackAffiliateClick({
  sessionId, leadId,
  destinationName, provider, affiliateUrl, referrer,
}) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('affiliate_clicks')
    .insert({
      session_id:       sessionId ?? null,
      lead_id:          leadId ?? null,
      destination_name: destinationName,
      provider,
      affiliate_url:    affiliateUrl,
      referrer:         referrer ?? null,
    });
  if (error) console.error('[affiliate_clicks] tracking error:', error.message);
}
