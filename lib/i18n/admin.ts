import { cookies } from 'next/headers';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';

export function getAdminLocale(searchLocale?: string): Locale {
  if (searchLocale && isLocale(searchLocale)) return searchLocale;
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value || '';
  return isLocale(cookieLocale) ? cookieLocale : defaultLocale;
}
