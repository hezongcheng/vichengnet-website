import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postSchema } from '@/lib/validators/post';

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = postSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;

  const created = await prisma.post.create({
    data: {
      ...data,
      publishedAt: data.status === 'PUBLISHED' ? new Date(data.publishedAt || Date.now()) : null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
