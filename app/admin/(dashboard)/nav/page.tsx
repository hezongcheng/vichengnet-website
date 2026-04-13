import { prisma } from '@/lib/prisma';
import NavManager from '@/components/admin/NavManager';
import { getAdminLocale } from '@/lib/i18n/admin';

export const dynamic = 'force-dynamic';

export default async function AdminNavPage() {
  const locale = getAdminLocale();
  const isEn = locale === 'en';

  let categories: Array<{
    id: string;
    key: string;
    label: string;
    labelZh: string | null;
    labelEn: string | null;
    sortOrder: number;
    sites: Array<{
      id: string;
      categoryId: string;
      name: string;
      nameZh: string | null;
      nameEn: string | null;
      url: string;
      description: string | null;
      descriptionZh: string | null;
      descriptionEn: string | null;
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
        <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Directory Management' : '导航管理'}</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {isEn ? 'Maintain categories and links with CRUD and ordering.' : '维护导航分类和站点，支持增删改查与排序。'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a
            href="/nav"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-neutral-600 transition hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {isEn ? 'Open Frontend (ZH)' : '打开前台（中文）'}
          </a>
          <a
            href="/en/nav"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-neutral-200 px-3 py-1.5 text-neutral-600 transition hover:text-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
          >
            {isEn ? 'Open Frontend (EN)' : '打开前台（英文）'}
          </a>
        </div>
      </div>
      <NavManager initialCategories={categories} />
    </div>
  );
}
