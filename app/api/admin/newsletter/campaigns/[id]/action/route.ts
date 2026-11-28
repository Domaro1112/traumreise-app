import { NextRequest, NextResponse, after } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { createServerClient } from '@/lib/supabase/server';
import { getCampaign, setCampaignStatus, duplicateCampaign, countConfirmedSubscribers } from '@/lib/newsletter/campaigns';
import { processCampaign } from '@/lib/newsletter/send';
import { sanitizeBlocks } from '@/lib/newsletter/blocks';
import { unauthorized, fail, readJson } from '../../../_shared';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
type Ctx = { params: Promise<{ id: string }> };

const bad = (error: string) => NextResponse.json({ error }, { status: 400 });

function readyToSend(c: { subject?: string; blocks?: unknown }) {
  if (!String(c.subject ?? '').trim()) return 'Bitte zuerst einen Betreff eintragen.';
  if (!sanitizeBlocks(c.blocks).length) return 'Der Newsletter hat noch keinen Inhalt.';
  return null;
}

// POST { action, scheduled_at? }
//   schedule    – zu einem Zeitpunkt versenden (Entwurf oder bereits geplant)
//   send_now    – sofort versenden
//   unschedule  – Planung aufheben, zurück zum Entwurf
//   retry       – nach einem Fehler weiterversenden
//   duplicate   – Kopie als neuer Entwurf
//   activate / deactivate – Willkommensmail ein- oder ausschalten
export async function POST(request: NextRequest, { params }: Ctx) {
  if (!await isAdminRequest(request)) return unauthorized();
  const { id } = await params;
  const body = (await readJson(request)) ?? {};
  const action = String(body.action ?? '');

  try {
    const c = await getCampaign(id);
    if (!c) return NextResponse.json({ error: 'Nicht gefunden.' }, { status: 404 });

    if (c.kind === 'welcome') {
      if (action !== 'activate' && action !== 'deactivate') return bad('Für die Willkommensmail nicht möglich.');
      if (action === 'activate') { const e = readyToSend(c); if (e) return bad(e); }
      // started_at = Zeitpunkt des Einschaltens (ab da werden Willkommensmails nachgeholt)
      const patch = action === 'activate'
        ? { status: 'active', ...(c.status === 'active' ? {} : { started_at: new Date().toISOString() }) }
        : { status: 'inactive' };
      const updated = await setCampaignStatus(id, patch, ['active', 'inactive']);
      return NextResponse.json({ campaign: updated });
    }

    switch (action) {
      case 'schedule': {
        const e = readyToSend(c); if (e) return bad(e);
        const when = new Date(String(body.scheduled_at ?? ''));
        if (Number.isNaN(when.getTime())) return bad('Bitte Datum und Uhrzeit angeben.');
        if (when.getTime() < Date.now() + 60_000) return bad('Der Zeitpunkt muss mindestens eine Minute in der Zukunft liegen.');
        const updated = await setCampaignStatus(id, { status: 'scheduled', scheduled_at: when.toISOString() }, ['draft', 'scheduled']);
        if (!updated) return bad('Diese Kampagne kann nicht mehr geplant werden.');
        return NextResponse.json({ campaign: updated });
      }
      case 'send_now': {
        const e = readyToSend(c); if (e) return bad(e);
        if ((await countConfirmedSubscribers()) === 0) return bad('Es gibt noch keine bestätigten Abonnenten.');
        const updated = await setCampaignStatus(id, { status: 'scheduled', scheduled_at: new Date().toISOString() }, ['draft', 'scheduled']);
        if (!updated) return bad('Diese Kampagne kann nicht mehr versendet werden.');
        after(async () => {
          try { await processCampaign(id, Date.now() + 50_000); } catch (err) { console.error('[NEWSLETTER_SEND]', err); }
        });
        return NextResponse.json({ campaign: { ...updated, status: 'sending' } });
      }
      case 'unschedule': {
        const updated = await setCampaignStatus(id, { status: 'draft', scheduled_at: null }, ['scheduled']);
        if (!updated) return bad('Die Kampagne ist nicht (mehr) geplant – vielleicht läuft der Versand schon.');
        return NextResponse.json({ campaign: updated });
      }
      case 'retry': {
        if (c.status !== 'failed') return bad('Nur nach einem Fehler möglich.');
        const supabase = createServerClient();
        // Fehlgeschlagene Empfänger freigeben, damit sie erneut drankommen
        await supabase.from('newsletter_sends').delete().eq('campaign_id', id).eq('status', 'failed');
        const { data: snap } = await supabase.from('newsletter_campaigns').select('html_snapshot').eq('id', id).single();
        const patch = snap?.html_snapshot
          ? { status: 'sending', last_error: null }
          : { status: 'scheduled', scheduled_at: new Date().toISOString(), last_error: null };
        const updated = await setCampaignStatus(id, patch, ['failed']);
        after(async () => {
          try { await processCampaign(id, Date.now() + 50_000); } catch (err) { console.error('[NEWSLETTER_SEND]', err); }
        });
        return NextResponse.json({ campaign: updated });
      }
      case 'duplicate':
        return NextResponse.json({ campaign: await duplicateCampaign(id) });
      default:
        return bad('Unbekannte Aktion.');
    }
  } catch (err) { return fail(err); }
}
