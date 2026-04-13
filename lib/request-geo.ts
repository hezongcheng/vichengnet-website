import type { Locale } from '@/lib/i18n/config';

function pickHeader(headers: Headers, keys: string[]) {
  for (const key of keys) {
    const value = headers.get(key);
    if (value && value.trim()) return value.trim();
  }
  return null;
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
  return pickHeader(headers, ['x-vercel-ip-city', 'x-geo-city', 'x-city']);
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
