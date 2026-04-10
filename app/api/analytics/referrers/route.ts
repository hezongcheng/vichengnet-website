import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.visitEvent.groupBy({
    by: ['refererHost'],
    _count: { refererHost: true },
    orderBy: { _count: { refererHost: 'desc' } },
    take: 20,
  });

  return NextResponse.json(rows);
}
