import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { processDueCampaigns, catchUpWelcomeMails } from '@/lib/newsletter/send';

// Zeitplan für den Newsletter: verschickt geplante Kampagnen, sobald ihr
// Zeitpunkt erreicht ist, setzt angefangene Versände fort und holt
// Willkommensmails nach. Wird alle paar Minuten aufgerufen (siehe
// supabase/newsletter-zeitplan.sql) – geschützt über CRON_SECRET.

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function authorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const got = request.headers.get('authorization') ?? '';
  const want = `Bearer ${secret}`;
  return got.length === want.length && crypto.timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

async function run(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  const deadline = Date.now() + 45_000;
  try {
    const campaigns = await processDueCampaigns(deadline);
    const welcome = await catchUpWelcomeMails(deadline);
    return NextResponse.json({ ok: true, campaigns, welcome });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[NEWSLETTER_CRON]', msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}

export const GET = run;
export const POST = run;
