export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatPrice(price) {
  return new Intl.NumberFormat('de-DE').format(price);
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
