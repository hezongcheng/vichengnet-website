import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { contentSchema } from '@/lib/validators/content';

function getLocale(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get('locale') || '';
  return isLocale(localeParam) ? localeParam : defaultLocale;
}

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key);
  const locale = getLocale(req);
  const block = await prisma.contentBlock.findFirst({ where: { key, locale } });

  if (!block) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  }

  return NextResponse.json(block);
}

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key);
  const locale = getLocale(req);
  const json = await req.json();

  const parsed = contentSchema.safeParse({ ...json, key });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const saved = await prisma.contentBlock.upsert({
    where: {
      key_locale: {
        key,
        locale,
      },
    },
    update: {
      title: parsed.data.title,
      value: parsed.data.value,
      type: parsed.data.type,
      locale,
    },
    create: {
      ...parsed.data,
      locale,
    },
  });

  return NextResponse.json(saved);
}
