import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { defaultLocale, isLocale } from '@/lib/i18n/config';

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
  const items = await prisma.contentBlock.findMany({
    where: {
      locale,
      key: {
        in: ['site.name', 'site.footer.domain', 'site.footer.icp'],
      },
    },
    orderBy: { key: 'asc' },
  });

  return NextResponse.json(items);
}

export async function PUT(req: NextRequest) {
  const locale = getLocale(req);
  const json = await req.json();
  const items: SettingItem[] = Array.isArray(json?.items) ? json.items : [];

  await Promise.all(
    items.map((item: SettingItem) => {
      const key = String(item.key || '').trim();
      if (!key) return Promise.resolve(null);

      return prisma.contentBlock.upsert({
        where: {
          key_locale: {
            key,
            locale,
          },
        },
        update: {
          title: item.title,
          value: item.value,
          type: item.type || 'text',
        },
        create: {
          key,
          locale,
          title: item.title,
          value: item.value,
          type: item.type || 'text',
        },
      });
    })
  );

  return NextResponse.json({ success: true });
}
