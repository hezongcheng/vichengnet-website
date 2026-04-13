import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { contentSchema } from '@/lib/validators/content';

export async function GET(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get('locale') || '';
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const blocks = await prisma.contentBlock.findMany({
    where: { locale },
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get('locale') || '';
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const json = await req.json();
  const parsed = contentSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const saved = await prisma.contentBlock.upsert({
    where: {
      key_locale: {
        key: parsed.data.key,
        locale,
      },
    },
    update: { ...parsed.data, locale },
    create: { ...parsed.data, locale },
  });

  return NextResponse.json(saved);
}
