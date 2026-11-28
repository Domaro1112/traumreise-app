import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { listCampaigns, createCampaign, countConfirmedSubscribers } from '@/lib/newsletter/campaigns';
import { unauthorized, fail, readJson } from '../_shared';

export const dynamic = 'force-dynamic';

// GET /api/admin/newsletter/campaigns – alle Kampagnen + Anzahl bestätigter Abonnenten
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) return unauthorized();
  try {
    const [campaigns, recipients] = await Promise.all([listCampaigns(), countConfirmedSubscribers()]);
    return NextResponse.json({ campaigns, recipients });
  } catch (err) { return fail(err); }
}

// POST /api/admin/newsletter/campaigns – neuen Entwurf anlegen
export async function POST(request: NextRequest) {
  if (!await isAdminRequest(request)) return unauthorized();
  const body = (await readJson(request)) ?? {};
  try {
    return NextResponse.json({ campaign: await createCampaign(body) });
  } catch (err) { return fail(err); }
}
