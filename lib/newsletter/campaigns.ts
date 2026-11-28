import 'server-only';
import { createServerClient } from '@/lib/supabase/server';
import { sanitizeBlocks } from '@/lib/newsletter/blocks';

// Datenzugriff für Newsletter-Kampagnen (nur Server, service_role).

export const CAMPAIGN_FIELDS =
  'id, kind, title, subject, preheader, blocks, status, scheduled_at, started_at, sent_at, last_error, created_at, updated_at';

export async function listCampaigns() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .select(CAMPAIGN_FIELDS)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  const stats = await sendStats(rows.map(r => r.id));
  return rows.map(r => ({ ...r, stats: stats[r.id] ?? { sent: 0, failed: 0 } }));
}

export async function getCampaign(id: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('newsletter_campaigns').select(CAMPAIGN_FIELDS).eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const stats = await sendStats([id]);
  return { ...data, stats: stats[id] ?? { sent: 0, failed: 0 } };
}

export async function getWelcomeCampaign() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('newsletter_campaigns').select(CAMPAIGN_FIELDS).eq('kind', 'welcome').maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createCampaign(fields: Record<string, unknown> = {}) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .insert({
      kind: 'campaign',
      title: String(fields.title ?? '').slice(0, 200) || 'Neuer Newsletter',
      subject: String(fields.subject ?? '').slice(0, 200),
      preheader: String(fields.preheader ?? '').slice(0, 250),
      blocks: sanitizeBlocks(fields.blocks),
      status: 'draft',
    })
    .select(CAMPAIGN_FIELDS)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Inhalt speichern – nur solange die Kampagne nicht versendet wird/wurde. */
export async function updateCampaignContent(id: string, fields: Record<string, unknown>) {
  const current = await getCampaign(id);
  if (!current) throw new Error('Kampagne nicht gefunden.');
  if (['sending', 'sent'].includes(current.status)) throw new Error('Versendete Kampagnen können nicht mehr geändert werden.');
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if ('title' in fields) patch.title = String(fields.title ?? '').slice(0, 200);
  if ('subject' in fields) patch.subject = String(fields.subject ?? '').slice(0, 200);
  if ('preheader' in fields) patch.preheader = String(fields.preheader ?? '').slice(0, 250);
  if ('blocks' in fields) patch.blocks = sanitizeBlocks(fields.blocks);
  const supabase = createServerClient();
  const { data, error } = await supabase.from('newsletter_campaigns').update(patch).eq('id', id).select(CAMPAIGN_FIELDS).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function setCampaignStatus(id: string, patch: Record<string, unknown>, allowedFrom: string[]) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .in('status', allowedFrom)
    .select(CAMPAIGN_FIELDS)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCampaign(id: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('newsletter_campaigns')
    .delete()
    .eq('id', id)
    .eq('kind', 'campaign')
    .in('status', ['draft', 'scheduled', 'failed'])
    .select('id');
  if (error) throw new Error(error.message);
  if (!data?.length) throw new Error('Nur Entwürfe, geplante und fehlgeschlagene Kampagnen können gelöscht werden.');
}

export async function duplicateCampaign(id: string) {
  const src = await getCampaign(id);
  if (!src) throw new Error('Kampagne nicht gefunden.');
  return createCampaign({
    title: `${src.title || 'Newsletter'} (Kopie)`,
    subject: src.subject, preheader: src.preheader, blocks: src.blocks,
  });
}

export async function countConfirmedSubscribers(): Promise<number> {
  const supabase = createServerClient();
  const { count, error } = await supabase
    .from('newsletter_subscribers')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'confirmed');
  if (error) throw new Error(error.message);
  return count ?? 0;
}

async function sendStats(ids: string[]) {
  const out: Record<string, { sent: number; failed: number }> = {};
  if (!ids.length) return out;
  const supabase = createServerClient();
  // Je Kampagne zwei Zählabfragen – bei wenigen Kampagnen völlig ausreichend
  await Promise.all(ids.map(async id => {
    const [sent, failed] = await Promise.all(['sent', 'failed'].map(status =>
      supabase.from('newsletter_sends').select('id', { count: 'exact', head: true }).eq('campaign_id', id).eq('status', status),
    ));
    out[id] = { sent: sent.count ?? 0, failed: failed.count ?? 0 };
  }));
  return out;
}
