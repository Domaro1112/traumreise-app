import { notFound } from 'next/navigation';
import { createAuthClient } from '@/lib/supabase/auth-server';
import NewsletterTabs from '@/components/admin/Newsletter/NewsletterTabs';
import SetupNotice from '@/components/admin/Newsletter/SetupNotice';
import CampaignEditorClient from '@/components/admin/Newsletter/CampaignEditorClient';
import { getCampaign, countConfirmedSubscribers } from '@/lib/newsletter/campaigns';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Newsletter bearbeiten | ApeAround Admin' };

export default async function NewsletterKampagneEditPage({ params }) {
  const { id } = await params;
  const [campaign, recipients] = await Promise.all([getCampaign(id).catch(() => null), countConfirmedSubscribers().catch(() => 0)]);
  if (!campaign || campaign.kind !== 'campaign') notFound();
  let adminEmail = '';
  try { const s = await createAuthClient(); adminEmail = (await s.auth.getUser()).data.user?.email ?? ''; } catch {}
  return (
    <div>
      <NewsletterTabs active="kampagnen" />
      <SetupNotice missingResend={!process.env.RESEND_API_KEY} missingCron={!process.env.CRON_SECRET} />
      <CampaignEditorClient initial={campaign} recipients={recipients} adminEmail={adminEmail} />
    </div>
  );
}
