import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const rows = await prisma.visitEvent.groupBy({
    by: ['ip', 'country', 'city'],
    _count: { ip: true },
    orderBy: { _count: { ip: 'desc' } },
    take: 50,
  });

  return NextResponse.json(rows);
}
