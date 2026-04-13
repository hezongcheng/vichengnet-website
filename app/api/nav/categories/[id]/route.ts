import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.navCategory.delete({
    where: { id: params.id },
  });

  const categories = await prisma.navCategory.findMany({
    orderBy: { sortOrder: 'asc' },
    select: { id: true },
  });

  await prisma.$transaction(
    categories.map((category, index) =>
      prisma.navCategory.update({
        where: { id: category.id },
        data: { sortOrder: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
