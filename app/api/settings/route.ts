import { NextRequest, NextResponse } from 'next/server';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { findContentBlocksByKeys, saveContentBlocks } from '@/lib/content-store';

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
  const locale = getLocale(req);
  const items = await findContentBlocksByKeys(['site.name', 'site.footer.domain', 'site.footer.icp'], locale);

  return NextResponse.json(items);
}

export async function PUT(req: NextRequest) {
  const locale = getLocale(req);
  const json = await req.json();
  const items: SettingItem[] = Array.isArray(json?.items) ? json.items : [];

  await saveContentBlocks(
    items
      .map((item: SettingItem) => ({
        key: String(item.key || '').trim(),
        locale,
        title: item.title,
        value: item.value,
        type: item.type || 'text',
      }))
      .filter((item) => item.key)
  );

  return NextResponse.json({ success: true });
}
