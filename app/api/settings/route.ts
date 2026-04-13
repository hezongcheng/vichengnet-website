import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { findContentBlocksByKeys, saveContentBlocks } from '@/lib/content-store';
import { requireAdminApi } from '@/lib/admin-auth';

type SettingItem = {
  key: string;
  title?: string;
  value: string;
  type?: string;
};

function getLocale(req: NextRequest) {
  const localeParam = req.nextUrl.searchParams.get('locale') || '';
  return isLocale(localeParam) ? localeParam : defaultLocale;
}

export async function GET(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const locale = getLocale(req);
  const sharedKeys = new Set(['site.footer.domain', 'site.footer.icp']);
  const keys = [
    'site.name',
    'site.footer.domain',
    'site.footer.icp',
    'home.hero.title',
    'home.hero.description',
    'about.body',
    'seo.default.title',
    'seo.default.description',
  ];
  const items = await Promise.all(
    keys.map((key) => findContentBlocksByKeys([key], sharedKeys.has(key) ? defaultLocale : locale).then((list) => list[0]).catch(() => null))
  );

  return NextResponse.json(items.filter(Boolean));
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const locale = getLocale(req);
  const sharedKeys = new Set(['site.footer.domain', 'site.footer.icp']);
  const json = await req.json();
  const items: SettingItem[] = Array.isArray(json?.items) ? json.items : [];

  await saveContentBlocks(
    items
      .map((item: SettingItem) => ({
        key: String(item.key || '').trim(),
        locale: sharedKeys.has(String(item.key || '').trim()) ? defaultLocale : locale,
        title: item.title,
        value: item.value,
        type: item.type || 'text',
      }))
      .filter((item) => item.key)
  );

  return NextResponse.json({ success: true });
}
