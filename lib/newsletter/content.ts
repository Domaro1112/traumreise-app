import 'server-only';
import { createServerClient } from '@/lib/supabase/server';
import { idealSeasonsFor } from '@/lib/destination-seasons';

// Inhalte für Newsletter-Bausteine: veröffentlichte Reiseziele und Blogartikel,
// auf die Felder reduziert, die eine Mail braucht.

export type NlDestination = {
  slug: string; name: string; country: string; image: string;
  description: string; idealSeasons: string[];
};
export type NlArticle = {
  slug: string; title: string; excerpt: string; image: string; date: string;
};

export async function loadDestinations(): Promise<NlDestination[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('destinations')
    .select('slug, name, country, hero_image, gallery_images, short_description, best_travel_time, quick_facts')
    .eq('status', 'published')
    .order('name');
  if (error) throw new Error(error.message);
  return (data ?? []).map(r => ({
    slug: r.slug,
    name: r.name ?? r.slug,
    country: r.country ?? '',
    image: r.hero_image || (Array.isArray(r.gallery_images) && r.gallery_images[0]) || `/images/destinations/${r.slug}.jpg`,
    description: r.short_description ?? '',
    idealSeasons: idealSeasonsFor({
      slug: r.slug, name: r.name,
      bestTravelTime: r.best_travel_time, quickFacts: r.quick_facts ?? {},
    }),
  }));
}

export async function loadArticles(): Promise<NlArticle[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('blog_articles')
    .select('slug, title, excerpt, cover_image_url, hero_image_url, published_at, date')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(r => ({
    slug: r.slug,
    title: r.title ?? r.slug,
    excerpt: r.excerpt ?? '',
    image: r.cover_image_url || r.hero_image_url || '',
    date: r.published_at ?? r.date ?? '',
  }));
}
