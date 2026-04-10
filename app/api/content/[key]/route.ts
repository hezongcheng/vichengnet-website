import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contentSchema } from '@/lib/validators/content';

export async function GET(_: NextRequest, { params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key);
  const block = await prisma.contentBlock.findUnique({ where: { key } });

  if (!block) {
    return NextResponse.json({ error: '内容不存在' }, { status: 404 });
  }

  return NextResponse.json(block);
}

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  const key = decodeURIComponent(params.key);
  const json = await req.json();

  const parsed = contentSchema.safeParse({ ...json, key });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const saved = await prisma.contentBlock.upsert({
    where: { key },
    update: {
      title: parsed.data.title,
      value: parsed.data.value,
      type: parsed.data.type,
    },
    create: parsed.data,
  });

  return NextResponse.json(saved);
}
