import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const totalPv = await prisma.visitEvent.count();

  const uvRows = await prisma.visitEvent.findMany({
    distinct: ['visitorId'],
    select: { visitorId: true },
  });

  const last7DaysPv = await prisma.visitEvent.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });

  const topPages = await prisma.visitEvent.groupBy({
    by: ['path'],
    _count: { path: true },
    orderBy: { _count: { path: 'desc' } },
    take: 10,
  });

  return NextResponse.json({
    totalPv,
    totalUv: uvRows.length,
    last7DaysPv,
    topPages,
  });
}
