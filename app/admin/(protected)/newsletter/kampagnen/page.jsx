import NewsletterTabs from '@/components/admin/Newsletter/NewsletterTabs';
import SetupNotice from '@/components/admin/Newsletter/SetupNotice';
import CampaignListClient from '@/components/admin/Newsletter/CampaignListClient';
import { listCampaigns, countConfirmedSubscribers } from '@/lib/newsletter/campaigns';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Newsletter-Kampagnen | ApeAround Admin' };

export default async function NewsletterKampagnenPage() {
  let campaigns = [];
  let recipients = 0;
  let missingTable = false;
  try {
    [campaigns, recipients] = await Promise.all([listCampaigns(), countConfirmedSubscribers()]);
  } catch {
    missingTable = true;
  }
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A', margin: '0 0 16px' }}>
        Newsletter
      </h2>
      <NewsletterTabs active="kampagnen" />
      <SetupNotice missingTable={missingTable} missingResend={!process.env.RESEND_API_KEY} missingCron={!process.env.CRON_SECRET} />
      <CampaignListClient initialCampaigns={campaigns.filter(c => c.kind === 'campaign')} recipients={recipients} disabled={missingTable} />
    </div>
  );
}
