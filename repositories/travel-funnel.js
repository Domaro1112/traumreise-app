import { createServerClient } from '@/lib/supabase/server';

export async function createSession({ moodSelection, season, budget, duration, personalNote, userAgent, referrer, funnelType, source }) {
  const supabase = createServerClient();
  const patch = {
    mood_selection: moodSelection ?? [],
    user_agent:     userAgent ?? null,
    referrer:       referrer  ?? null,
  };
  if (season)       patch.season        = season;
  if (budget)       patch.budget        = budget;
  if (duration)     patch.duration      = duration;
  if (personalNote) patch.personal_note = personalNote;
  if (funnelType)   patch.funnel_type   = funnelType;
  if (source)       patch.source        = source;

  const { data, error } = await supabase
    .from('travel_funnel_sessions')
    .insert(patch)
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Saves the email address to a session (called from the EmailGate on /traumreise/[id]).
// Returns the updated row.
export async function saveEmail(sessionId, email) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('travel_funnel_sessions')
    .update({
      email,
      email_submitted_at: new Date().toISOString(),
      privacy_notice_accepted: true,
    })
    .eq('id', sessionId)
    .select('id, email, email_submitted_at')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Returns only the fields needed to generate or display results — no lead data.
export async function getSession(sessionId) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('travel_funnel_sessions')
    .select('id, mood_selection, season, budget, duration, personal_note, funnel_type, source, generated_destinations, email, email_submitted_at')
    .eq('id', sessionId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// Saves the matching result (Traumreise-Ergebnis) to an existing session.
export async function saveAnalysis(sessionId, analysis) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('travel_funnel_sessions')
    .update({ generated_destinations: analysis })
    .eq('id', sessionId);
  if (error) throw new Error(error.message);
}

export async function createLead({
  email, consent, consentText,
  sessionId, selectedDestinations,
  moodSelection, season, budget, duration, personalNote,
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('travel_leads')
    .insert({
      email,
      consent,
      consent_text:          consentText ?? null,
      session_id:            sessionId ?? null,
      selected_destinations: selectedDestinations ?? [],
      mood_selection:        moodSelection ?? [],
      season:                season        ?? null,
      budget:                budget        ?? null,
      duration:              duration      ?? null,
      personal_note:         personalNote  ?? null,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function trackAffiliateClick({
  sessionId, leadId,
  destinationName, destinationCountry, destinationRegion,
  provider, affiliateUrl, searchQuery, referrer,
}) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('affiliate_clicks')
    .insert({
      session_id:          sessionId          ?? null,
      lead_id:             leadId             ?? null,
      destination_name:    destinationName,
      destination_country: destinationCountry ?? null,
      destination_region:  destinationRegion  ?? null,
      provider,
      affiliate_url:       affiliateUrl,
      search_query:        searchQuery        ?? null,
      referrer:            referrer           ?? null,
    });
  if (error) console.error('[affiliate_clicks] tracking error:', error.message);
}
