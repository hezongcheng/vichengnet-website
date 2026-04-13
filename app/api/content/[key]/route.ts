import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { contentSchema } from '@/lib/validators/content';
import { findContentBlock, saveContentBlock } from '@/lib/content-store';

function getLocale(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get('locale') || '';
  return isLocale(localeParam) ? localeParam : defaultLocale;
}

export async function GET(req: NextRequest, { params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key);
  const locale = getLocale(req);
  const block = await findContentBlock(key, locale);

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

  const saved = await saveContentBlock({
    key,
    locale,
    title: parsed.data.title,
    value: parsed.data.value,
    type: parsed.data.type,
  });

  return NextResponse.json(saved);
}
