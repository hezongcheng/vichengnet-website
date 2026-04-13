import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeNavCategoryKey } from '@/lib/nav';
import {
  navCategoryCreateSchema,
  navCategoryReorderSchema,
  navCategoryUpdateSchema,
} from '@/lib/validators/nav';
import { requireAdminApi } from '@/lib/admin-auth';

export async function GET() {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const categories = await prisma.navCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      sites: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const json = await req.json();
  const parsed = navCategoryCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const count = await prisma.navCategory.count();
  const key = normalizeNavCategoryKey(parsed.data.key || parsed.data.labelEn || parsed.data.labelZh);

  if (!key) {
    return NextResponse.json({ error: '分类标识不能为空' }, { status: 400 });
  }

  const exists = await prisma.navCategory.findUnique({ where: { key } });
  if (exists) {
    return NextResponse.json({ error: '分类标识已存在' }, { status: 409 });
  }

  const created = await prisma.navCategory.create({
    data: {
      key,
      label: parsed.data.labelZh.trim(),
      labelZh: parsed.data.labelZh.trim(),
      labelEn: parsed.data.labelEn.trim(),
      sortOrder: count,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const json = await req.json();
  const parsed = navCategoryUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const key = normalizeNavCategoryKey(parsed.data.key);
  if (!key) {
    return NextResponse.json({ error: '分类标识不能为空' }, { status: 400 });
  }

  const conflict = await prisma.navCategory.findFirst({
    where: {
      key,
      id: { not: parsed.data.id },
    },
    select: { id: true },
  });
  if (conflict) {
    return NextResponse.json({ error: '分类标识已存在' }, { status: 409 });
  }

  const updated = await prisma.navCategory.update({
    where: { id: parsed.data.id },
    data: {
      key,
      label: parsed.data.labelZh.trim(),
      labelZh: parsed.data.labelZh.trim(),
      labelEn: parsed.data.labelEn.trim(),
    },
  });

  return NextResponse.json(updated);
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const json = await req.json();
  const parsed = navCategoryReorderSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.navCategory.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
