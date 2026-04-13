import { headers } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';

export function getRequestLocale(): Locale {
  const headerStore = headers();
  const value = headerStore.get('x-locale') || '';
  return isLocale(value) ? value : defaultLocale;
}
