import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Nutzt denselben Bucket wie destinations (bereits public & konfiguriert)
const BUCKET = 'destinations';

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing.');
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Public CDN-URL für einen Storage-Pfad. */
export function creatorPublicUrl(path) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !path) return null;
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

/**
 * Upload eines Creator-Profilbilds.
 *
 * Storage-Pfade:
 *   creator-profiles/{profileId}/profile.jpg
 *   creator-profiles/{profileId}/hero.jpg
 *   creator-profiles/{profileId}/gallery-01.jpg …
 *
 * @param {File} file
 * @param {string} profileId   UUID des Creator-Profils
 * @param {'profile'|'hero'|'gallery'} type
 * @param {number} [galleryIndex=0]
 */
export async function uploadCreatorProfileImage(file, profileId, type, galleryIndex = 0) {
  const supabase = getStorageClient();

  const rawExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(rawExt) ? rawExt : 'jpg';

  let filename;
  if (type === 'profile')    filename = `profile.${ext}`;
  else if (type === 'hero')  filename = `hero.${ext}`;
  else {
    const n = String((galleryIndex ?? 0) + 1).padStart(2, '0');
    filename = `gallery-${n}.${ext}`;
  }

  const path = `creator-profiles/${profileId}/${filename}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(error.message);

  return { path, url: creatorPublicUrl(path), filename };
}

/**
 * Upload eines Submission-Bilds (Guide / Tipp / Route).
 *
 * Storage-Pfade:
 *   creator-submissions/{submissionId}/image-01.jpg …
 *   creator-submissions/{submissionId}/station-01.jpg …
 *
 * @param {File} file
 * @param {string} submissionId
 * @param {'image'|'station'} [fileType='image']
 * @param {number} [index=0]
 */
export async function uploadCreatorSubmissionImage(file, submissionId, fileType = 'image', index = 0) {
  const supabase = getStorageClient();

  const rawExt = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(rawExt) ? rawExt : 'jpg';

  const n = String(index + 1).padStart(2, '0');
  const prefix = fileType === 'station' ? 'station' : 'image';
  const filename = `${prefix}-${n}.${ext}`;

  const path = `creator-submissions/${submissionId}/${filename}`;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type || 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(error.message);

  return { path, url: creatorPublicUrl(path), filename };
}

/** Löscht eine Datei aus Creator-Media. */
export async function deleteCreatorFile(path) {
  if (!path) return;
  if (!path.startsWith('creator-profiles/') && !path.startsWith('creator-submissions/')) {
    throw new Error('Ungültiger Pfad.');
  }
  const supabase = getStorageClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
