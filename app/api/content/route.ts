import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { contentSchema } from '@/lib/validators/content';
import { findContentBlocksByKeys, saveContentBlock } from '@/lib/content-store';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const localeParam = req.nextUrl.searchParams.get('locale') || '';
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const sharedKeys = ['site.footer.domain', 'site.footer.icp'];
  const localeKeys = ['site.name', 'home.hero.title', 'home.hero.description', 'about.body', 'seo.default.title', 'seo.default.description'];
  const [sharedBlocks, localizedBlocks] = await Promise.all([
    findContentBlocksByKeys(sharedKeys, defaultLocale),
    findContentBlocksByKeys(localeKeys, locale),
  ]);
  const blocks = [...localizedBlocks, ...sharedBlocks];
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const localeParam = req.nextUrl.searchParams.get('locale') || '';
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const json = await req.json();
  const parsed = contentSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const saved = await saveContentBlock({
    key: parsed.data.key,
    locale,
    title: parsed.data.title,
    value: parsed.data.value,
    type: parsed.data.type,
  });

  return NextResponse.json(saved);
}
