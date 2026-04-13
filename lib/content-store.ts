import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { defaultLocale, type Locale } from '@/lib/i18n/config';

type ContentInput = {
  key: string;
  locale: Locale;
  title?: string;
  value: string;
  type?: string;
};

function isMissingLocaleColumnError(error: unknown) {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code !== 'P2022') return false;
  const column = String((error.meta as Record<string, unknown> | undefined)?.column || '');
  return column.includes('ContentBlock.locale') || String(error.message).includes('ContentBlock.locale');
}

export async function findContentBlock(key: string, locale: Locale) {
  try {
    const [localized, fallback] = await Promise.all([
      prisma.contentBlock.findFirst({ where: { key, locale } }),
      locale === defaultLocale ? Promise.resolve(null) : prisma.contentBlock.findFirst({ where: { key, locale: defaultLocale } }),
    ]);
    return localized || fallback;
  } catch (error) {
    if (!isMissingLocaleColumnError(error)) throw error;
    return prisma.contentBlock.findFirst({ where: { key } });
  }
}

export async function findContentBlocksByKeys(keys: string[], locale: Locale) {
  try {
    const localized = await prisma.contentBlock.findMany({
      where: { key: { in: keys }, locale },
    });

    if (locale === defaultLocale) return localized;

    const missingKeys = keys.filter((key) => !localized.some((item) => item.key === key));
    if (!missingKeys.length) return localized;

    const fallback = await prisma.contentBlock.findMany({
      where: { key: { in: missingKeys }, locale: defaultLocale },
    });
    return [...localized, ...fallback];
  } catch (error) {
    if (!isMissingLocaleColumnError(error)) throw error;
    return prisma.contentBlock.findMany({
      where: { key: { in: keys } },
    });
  }
}

export async function saveContentBlock(input: ContentInput) {
  const payload = {
    key: input.key,
    title: input.title,
    value: input.value,
    type: input.type || 'text',
  };

  try {
    return await prisma.contentBlock.upsert({
      where: {
        key_locale: {
          key: input.key,
          locale: input.locale,
        },
      },
      update: {
        ...payload,
        locale: input.locale,
      },
      create: {
        ...payload,
        locale: input.locale,
      },
    });
  } catch (error) {
    if (!isMissingLocaleColumnError(error)) throw error;

    const existing = await prisma.contentBlock.findFirst({
      where: { key: input.key },
      select: { id: true },
    });

    if (existing) {
      return prisma.contentBlock.update({
        where: { id: existing.id },
        data: payload,
      });
    }

    return prisma.contentBlock.create({
      data: payload,
    });
  }
}

export async function saveContentBlocks(items: ContentInput[]) {
  return Promise.all(items.map((item) => saveContentBlock(item)));
}
