import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type SettingItem = {
  key: string;
  title?: string;
  value: string;
  type?: string;
};

export async function GET() {
  const items = await prisma.contentBlock.findMany({
    where: {
      key: {
        in: ['site.name', 'site.footer.domain', 'site.footer.icp'],
      },
    },
    orderBy: { key: 'asc' },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const items: SettingItem[] = await req.json();

  await Promise.all(
    items.map((item: SettingItem) => {
      const key = String(item.key || '').trim();
      if (!key) return Promise.resolve(null);

      return prisma.contentBlock.upsert({
        where: { key },
        update: {
          title: item.title,
          value: item.value,
          type: item.type || 'text',
        },
        create: {
          key,
          title: item.title,
          value: item.value,
          type: item.type || 'text',
        },
      });
    })
  );

  return NextResponse.json({ success: true });
}