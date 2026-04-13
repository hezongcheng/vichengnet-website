import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  navSiteCreateSchema,
  navSiteReorderSchema,
  navSiteUpdateSchema,
} from '@/lib/validators/nav';
import { requireAdminApi } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const json = await req.json();
  const parsed = navSiteCreateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const count = await prisma.navSite.count({
    where: { categoryId: parsed.data.categoryId },
  });

  const created = await prisma.navSite.create({
    data: {
      categoryId: parsed.data.categoryId,
      name: parsed.data.nameZh.trim(),
      nameZh: parsed.data.nameZh.trim(),
      nameEn: parsed.data.nameEn.trim(),
      url: parsed.data.url.trim(),
      description: parsed.data.descriptionZh?.trim() || '',
      descriptionZh: parsed.data.descriptionZh?.trim() || '',
      descriptionEn: parsed.data.descriptionEn?.trim() || '',
      tags: parsed.data.tags.map((tag) => tag.trim()).filter(Boolean),
      sortOrder: count,
    },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const json = await req.json();
  const parsed = navSiteUpdateSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.navSite.update({
    where: { id: parsed.data.id },
    data: {
      categoryId: parsed.data.categoryId,
      name: parsed.data.nameZh.trim(),
      nameZh: parsed.data.nameZh.trim(),
      nameEn: parsed.data.nameEn.trim(),
      url: parsed.data.url.trim(),
      description: parsed.data.descriptionZh?.trim() || '',
      descriptionZh: parsed.data.descriptionZh?.trim() || '',
      descriptionEn: parsed.data.descriptionEn?.trim() || '',
      tags: parsed.data.tags.map((tag) => tag.trim()).filter(Boolean),
    },
  });

  return NextResponse.json(updated);
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdminApi();
  if (denied) return denied;

  const json = await req.json();
  const parsed = navSiteReorderSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.navSite.update({
        where: { id },
        data: { sortOrder: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
