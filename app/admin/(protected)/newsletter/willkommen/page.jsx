import { createAuthClient } from '@/lib/supabase/auth-server';
import NewsletterTabs from '@/components/admin/Newsletter/NewsletterTabs';
import SetupNotice from '@/components/admin/Newsletter/SetupNotice';
import CampaignEditorClient from '@/components/admin/Newsletter/CampaignEditorClient';
import { getWelcomeCampaign, getCampaign } from '@/lib/newsletter/campaigns';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Willkommensmail | ApeAround Admin' };

export default async function NewsletterWillkommenPage() {
  let campaign = null;
  let missingTable = false;
  try {
    const w = await getWelcomeCampaign();
    campaign = w ? await getCampaign(w.id) : null;
  } catch { missingTable = true; }
  let adminEmail = '';
  try { const s = await createAuthClient(); adminEmail = (await s.auth.getUser()).data.user?.email ?? ''; } catch {}
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800, color: '#0F172A', margin: '0 0 16px' }}>
        Newsletter
      </h2>
      <NewsletterTabs active="willkommen" />
      <SetupNotice missingTable={missingTable || !campaign} missingResend={!process.env.RESEND_API_KEY} />
      {campaign && (
        <>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 20px', lineHeight: 1.6, maxWidth: '760px' }}>
            Diese Mail geht automatisch an jeden, der seine Anmeldung bestätigt – direkt nach dem Klick auf den Bestätigungslink.
            Sie ist erst aktiv, wenn du sie unten einschaltest.
          </p>
          <CampaignEditorClient initial={campaign} recipients={0} adminEmail={adminEmail} />
        </>
      )}
    </div>
  );
}
