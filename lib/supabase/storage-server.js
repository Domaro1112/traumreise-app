import 'server-only';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'destinations';

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing.');
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Public CDN URL for a storage path. Requires the bucket to be public. */
export function getPublicUrl(path) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !path) return null;
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** Extract the storage path from a full public URL. Returns null if not a Supabase URL. */
export function pathFromPublicUrl(url) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !base) return null;
  const prefix = `${base}/storage/v1/object/public/${BUCKET}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
}

/**
 * Upload a File object to Supabase Storage.
 * @param {File} file
 * @param {string} slug  destination slug (used as folder name)
 * @param {'hero'|'og'|'twitter'|'gallery'} type
 * @returns {{ path: string, url: string, filename: string }}
 */
export async function uploadDestinationImage(file, slug, type) {
  const supabase = getStorageClient();

  const rawExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(rawExt) ? rawExt : 'jpg';

  let filename;
  if (type === 'hero')    filename = `hero.${ext}`;
  else if (type === 'og') filename = `og.${ext}`;
  else if (type === 'twitter') filename = `twitter.${ext}`;
  else filename = `gallery-${Date.now()}.${ext}`;

  // Semantic folder: destinations/{slug}/hero.jpg
  const path = `${slug}/${filename}`;

  const bytes  = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(error.message);

  return { path, url: getPublicUrl(path), filename };
}

/**
 * Delete a file from Supabase Storage by its storage path.
 */
export async function deleteStorageFile(path) {
  const supabase = getStorageClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}

/**
 * List all files for a given destination slug folder.
 */
export async function listDestinationFiles(slug) {
  const supabase = getStorageClient();
  const { data, error } = await supabase.storage.from(BUCKET).list(slug, {
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error) return [];
  return (data ?? [])
    .filter(item => item.name && !item.name.startsWith('.'))
    .map(item => ({
      name:     item.name,
      path:     `${slug}/${item.name}`,
      url:      getPublicUrl(`${slug}/${item.name}`),
      size:     item.metadata?.size ?? 0,
      mimetype: item.metadata?.mimetype ?? 'image/jpeg',
    }));
}
