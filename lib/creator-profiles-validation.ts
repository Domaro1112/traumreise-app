const ALLOWED_STATUSES = ['draft', 'submitted', 'published', 'archived'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SLUG_RE  = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

type ProfileInput = Record<string, unknown>;
type ValidationError = { error: string };

export function validateProfileBody(body: ProfileInput, opts?: { partial?: boolean }): Record<string, unknown> | ValidationError {
  const partial = opts?.partial ?? false;

  // display_name
  if (!partial && !body.display_name) return { error: 'display_name ist ein Pflichtfeld.' };
  if (typeof body.display_name === 'string' && body.display_name.length > 200) {
    return { error: 'display_name darf maximal 200 Zeichen haben.' };
  }

  // slug
  if (!partial && !body.slug) return { error: 'slug ist ein Pflichtfeld.' };
  if (body.slug !== undefined) {
    const s = String(body.slug).trim().toLowerCase();
    if (!SLUG_RE.test(s)) return { error: 'slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten.' };
    if (s.length > 100) return { error: 'slug darf maximal 100 Zeichen haben.' };
  }

  // status
  if (body.status !== undefined && !(ALLOWED_STATUSES as readonly string[]).includes(body.status as string)) {
    return { error: 'Ungültiger Status.' };
  }

  // email
  if (body.contact_email && typeof body.contact_email === 'string' && body.contact_email.trim()) {
    if (!EMAIL_RE.test(body.contact_email)) return { error: 'Ungültige E-Mail-Adresse.' };
  }

  // length limits
  const textLimits: Record<string, number> = {
    bio: 8000, short_bio: 400, internal_notes: 4000,
    display_name: 200, creator_type: 100, cta_label: 120, cta_url: 500,
    website_url: 500, profile_image_url: 500, hero_image_url: 500,
  };
  for (const [field, max] of Object.entries(textLimits)) {
    if (typeof body[field] === 'string' && (body[field] as string).length > max) {
      return { error: `${field} darf maximal ${max} Zeichen haben.` };
    }
  }

  // Build clean output — only known fields
  const out: Record<string, unknown> = {};
  const textFields = [
    'display_name', 'slug', 'contact_email', 'bio', 'short_bio',
    'profile_image_url', 'hero_image_url', 'creator_type',
    'website_url', 'cta_label', 'cta_url', 'internal_notes',
    'status', 'published_at',
  ];
  for (const f of textFields) {
    if (body[f] !== undefined) {
      const val = body[f];
      out[f] = (typeof val === 'string' && val.trim() === '') ? null : val;
    }
  }
  if (body.slug) out.slug = String(body.slug).trim().toLowerCase();

  const arrayFields = ['topics', 'destinations', 'travel_styles', 'gallery_images'];
  for (const f of arrayFields) {
    if (Array.isArray(body[f])) out[f] = (body[f] as unknown[]).map(String).filter(Boolean);
  }

  if (body.social_links !== undefined && typeof body.social_links === 'object' && !Array.isArray(body.social_links)) {
    out.social_links = body.social_links;
  }

  if (Array.isArray(body.featured_tips)) out.featured_tips = body.featured_tips;
  if (body.application_id !== undefined) out.application_id = body.application_id;

  return out;
}
