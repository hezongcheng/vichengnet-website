import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = String(searchParams.get('q') || '').trim();
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Number(searchParams.get('pageSize') || '10');

  if (!q) {
    return NextResponse.json({ items: [], total: 0, page, pageSize, totalPages: 0 });
  }

  const where = {
    status: 'PUBLISHED' as const,
    OR: [
      { title: { contains: q, mode: 'insensitive' as const } },
      { summary: { contains: q, mode: 'insensitive' as const } },
      { content: { contains: q, mode: 'insensitive' as const } },
    ],
  };

  const [total, items] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        coverImage: true,
        publishedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
