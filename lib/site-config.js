// Central site URL — set NEXT_PUBLIC_SITE_URL in your environment to override.
// Works in both server and client components (NEXT_PUBLIC_ prefix is required).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://apearound.de';

// Hostname only, e.g. "apearound.de" — used for SERP preview display.
export const SITE_HOST = SITE_URL.replace(/^https?:\/\/(www\.)?/, '');
