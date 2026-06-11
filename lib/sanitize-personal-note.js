/**
 * Sanitizes the user's optional free-text travel note before it reaches Claude.
 *
 * Returns the trimmed note if it looks travel-relevant, null otherwise.
 * Claude is additionally instructed to use only travel-relevant parts,
 * so borderline inputs are safe to pass through.
 */

// Short inputs that are clearly meaningless
const JUNK_EXACT = new Set([
  'test', 'asdf', 'qwerty', 'egal', 'keine ahnung', 'nein', 'ja', 'ok',
  'okay', 'nope', 'bla', 'blabla', 'nix', 'nope', 'weiß nicht', 'weis nicht',
  'idk', 'dunno', 'whatever', 'nothing', 'none', 'na', 'n/a', '-', '.',
  '...', 'lol', 'haha', 'hmm', '?', '??', '???', 'abc', '123',
]);

// Pattern-based junk detection
const JUNK_PATTERNS = [
  /^(.)\1{4,}$/,              // 5+ repeated chars: "aaaaa", "....."
  /^[0-9\s\W]+$/,             // only numbers / punctuation, no letters
  /^[^a-zA-ZäöüÄÖÜß]{1,10}$/, // < 10 chars with no German/Latin letters
];

// Content that should be silently dropped
const BLOCKLIST = [
  /\b(fick|scheiß|scheiss|arsch|hurensohn|wichser|fotze|vollidi)\b/i,
  /\b(fuck|shit|bitch|asshole|cunt|dick|cock|twat)\b/i,
  /\b(nazi|fascist|fascismus|terrorist|rassist|rassismus)\b/i,
  /\b(töte|kill|murder|bomb|suicide|selbstmord|vergewalt)\b/i,
  /\b(porn|porno|sex|nackt|nude|nsfw|erotik|fetisch)\b/i,
];

/**
 * @param {string|null|undefined} note
 * @returns {string|null}  trimmed sanitized note, or null if unusable
 */
export function sanitizePersonalNote(note) {
  if (!note || typeof note !== 'string') return null;

  // Server-side length cap (matches client maxLength)
  const trimmed = note.trim().slice(0, 500);

  // Too short to carry useful information
  if (trimmed.length < 8) return null;

  // Exact junk matches (case-insensitive)
  if (JUNK_EXACT.has(trimmed.toLowerCase())) return null;

  // Pattern-based junk
  for (const re of JUNK_PATTERNS) {
    if (re.test(trimmed)) return null;
  }

  // Blocklisted content — silently discard, funnel continues normally
  for (const re of BLOCKLIST) {
    if (re.test(trimmed)) return null;
  }

  return trimmed;
}
