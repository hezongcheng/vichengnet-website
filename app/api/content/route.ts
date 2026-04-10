import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contentSchema } from '@/lib/validators/content';

export async function GET() {
  const blocks = await prisma.contentBlock.findMany({
    orderBy: { updatedAt: 'desc' },
  });
  return NextResponse.json(blocks);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = contentSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const saved = await prisma.contentBlock.upsert({
    where: { key: parsed.data.key },
    update: parsed.data,
    create: parsed.data,
  });

  return NextResponse.json(saved);
}
