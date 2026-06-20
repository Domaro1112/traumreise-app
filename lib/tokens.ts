import crypto from 'crypto';

/** 48-character URL-safe token (24 random bytes → hex) */
export function generateToken(): string {
  return crypto.randomBytes(24).toString('hex');
}

/** SHA-256 hex digest — used to store tokens without reversibility */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
