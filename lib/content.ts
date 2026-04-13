import type { Locale } from '@/lib/i18n/config';
import { defaultLocale } from '@/lib/i18n/config';
import { prisma } from '@/lib/prisma';

export async function getContentBlock(key: string, locale: Locale) {
  const [localized, fallback] = await Promise.all([
    prisma.contentBlock.findFirst({
      where: { key, locale },
    }),
    locale === defaultLocale
      ? Promise.resolve(null)
      : prisma.contentBlock.findFirst({
          where: { key, locale: defaultLocale },
        }),
  ]);

  return localized || fallback;
}

export async function getContentValue(key: string, locale: Locale, fallback = '') {
  const block = await getContentBlock(key, locale);
  return block?.value || fallback;
}
