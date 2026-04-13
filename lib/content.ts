import { defaultLocale, type Locale } from '@/lib/i18n/config';
import { findContentBlock } from '@/lib/content-store';

const SHARED_CONTENT_KEYS = new Set(['site.footer.domain', 'site.footer.icp']);

export async function getContentBlock(key: string, locale: Locale) {
  return findContentBlock(key, SHARED_CONTENT_KEYS.has(key) ? defaultLocale : locale);
}

export async function getContentValue(key: string, locale: Locale, fallback = '') {
  const block = await getContentBlock(key, locale);
  return block?.value || fallback;
}
