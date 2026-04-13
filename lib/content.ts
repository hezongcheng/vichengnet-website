import type { Locale } from '@/lib/i18n/config';
import { findContentBlock } from '@/lib/content-store';

export async function getContentBlock(key: string, locale: Locale) {
  return findContentBlock(key, locale);
}

export async function getContentValue(key: string, locale: Locale, fallback = '') {
  const block = await findContentBlock(key, locale);
  return block?.value || fallback;
}
