import type { Locale } from '@/lib/i18n/config';

function pickHeader(headers: Headers, keys: string[]) {
  for (const key of keys) {
    const value = headers.get(key);
    if (value && value.trim()) return value.trim();
  }
  return null;
}

export function normalizeGeoValue(value: string | null | undefined) {
  if (!value) return null;

  let text = value.trim().replace(/\+/g, ' ');
  if (!text) return null;

  // Some edge providers return URL-encoded city names (e.g. Hong%20Kong).
  for (let i = 0; i < 2; i++) {
    if (!text.includes('%')) break;
    try {
      const decoded = decodeURIComponent(text);
      if (decoded === text) break;
      text = decoded;
    } catch {
      break;
    }
  }

  return text;
}

export function getCountryCode(headers: Headers) {
  const value = pickHeader(headers, [
    'x-vercel-ip-country',
    'cf-ipcountry',
    'x-country-code',
    'x-geo-country',
  ]);
  return value ? value.toUpperCase() : null;
}

export function getCity(headers: Headers) {
  return normalizeGeoValue(pickHeader(headers, ['x-vercel-ip-city', 'x-geo-city', 'x-city']));
}

export function isMainlandChina(countryCode: string | null) {
  return countryCode === 'CN';
}

export function localeByCountry(
  headers: Headers,
  fallback: Locale = 'zh',
  acceptLanguage?: string | null
): Locale {
  const countryCode = getCountryCode(headers);
  if (countryCode) {
    return isMainlandChina(countryCode) ? 'zh' : 'en';
  }

  const lowerLang = (acceptLanguage || '').toLowerCase();
  if (lowerLang.startsWith('zh') || lowerLang.includes(',zh')) return 'zh';
  if (lowerLang.startsWith('en') || lowerLang.includes(',en')) return 'en';

  return fallback;
}

export function getClientIp(headers: Headers) {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') || null;
}
