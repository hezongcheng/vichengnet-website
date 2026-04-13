import { prisma } from '@/lib/prisma';
import NavManager from '@/components/admin/NavManager';

export const dynamic = 'force-dynamic';

export default async function AdminNavPage() {
  let categories: Array<{
    id: string;
    key: string;
    label: string;
    sortOrder: number;
    sites: Array<{
      id: string;
      categoryId: string;
      name: string;
      url: string;
      description: string | null;
      tags: string[];
      sortOrder: number;
    }>;
  }> = [];
  try {
    categories = await prisma.navCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        sites: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  } catch {
    categories = [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">导航管理</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          维护导航分类和站点，支持增删改查与排序。
        </p>
      </div>
      <NavManager initialCategories={categories} />
    </div>
  );
}
