import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdminApi } from '@/lib/admin-auth';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const site = await prisma.navSite.findUnique({
    where: { id: params.id },
    select: { categoryId: true },
  });

  if (!site) {
    return NextResponse.json({ error: '站点不存在' }, { status: 404 });
  }

  await prisma.navSite.delete({
    where: { id: params.id },
  });

  const remain = await prisma.navSite.findMany({
    where: { categoryId: site.categoryId },
    orderBy: { sortOrder: 'asc' },
    select: { id: true },
  });

  await prisma.$transaction(
    remain.map((item, index) =>
      prisma.navSite.update({
        where: { id: item.id },
        data: { sortOrder: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
