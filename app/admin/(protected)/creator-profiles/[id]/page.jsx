import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import CreatorProfileEditClient from '@/components/admin/CreatorProfiles/CreatorProfileEditClient';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Creator-Profil bearbeiten | ApeAround Admin' };

export default async function EditCreatorProfilePage({ params }) {
  const { id } = await params;
  const isNew = id === 'neu';

  let profile = null;
  if (!isNew) {
    try {
      const supabase = createServerClient();
      const { data } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', id)
        .single();
      profile = data;
    } catch {}
    if (!profile) notFound();
  }

  return <CreatorProfileEditClient initialProfile={profile} isNew={isNew} />;
}
