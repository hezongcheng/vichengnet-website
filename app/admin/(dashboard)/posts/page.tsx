import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getAdminLocale } from '@/lib/i18n/admin';

type Props = { searchParams?: { q?: string; page?: string } };

export default async function AdminPostsPage({ searchParams }: Props) {
  const locale = getAdminLocale();
  const isEn = locale === 'en';
  const q = String(searchParams?.q || '').trim();
  const page = Math.max(Number(searchParams?.page || '1'), 1);
  const pageSize = 12;

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: 'insensitive' as const } },
          { slug: { contains: q, mode: 'insensitive' as const } },
          { summary: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  function listHref(targetPage: number) {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (targetPage > 1) params.set('page', String(targetPage));
    const query = params.toString();
    return query ? `/admin/posts?${query}` : '/admin/posts';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Post Management' : '文章管理'}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {isEn ? 'Create, edit, publish, archive, and quickly locate posts.' : '创建、编辑、发布、归档，并快速检索文章。'}
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-neutral-900"
        >
          {isEn ? 'New Post' : '新建文章'}
        </Link>
      </div>

      <form action="/admin/posts" method="get" className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            name="q"
            defaultValue={q}
            placeholder={isEn ? 'Search by title, slug, or summary...' : '按标题、slug 或摘要搜索...'}
            className="w-full rounded-xl border border-neutral-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-neutral-900 dark:border-neutral-700 dark:focus:border-neutral-200"
          />
          <button
            type="submit"
            className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
          >
            {isEn ? 'Search' : '搜索'}
          </button>
        </div>
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          {isEn ? `Total ${total} result(s)` : `共 ${total} 条结果`}
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500 dark:bg-neutral-900/60 dark:text-neutral-400">
            <tr>
              <th className="px-4 py-3">{isEn ? 'Title' : '标题'}</th>
              <th className="px-4 py-3">{isEn ? 'Status' : '状态'}</th>
              <th className="px-4 py-3">{isEn ? 'Updated At' : '更新时间'}</th>
              <th className="px-4 py-3">{isEn ? 'Action' : '操作'}</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">{post.title}</div>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{post.slug}</div>
                </td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{post.status}</td>
                <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{post.updatedAt.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/posts/${post.id}`} className="text-neutral-900 underline dark:text-neutral-100">
                    {isEn ? 'Edit' : '编辑'}
                  </Link>
                </td>
              </tr>
            ))}
            {!posts.length ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400">
                  {isEn ? 'No posts found.' : '未找到文章。'}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <Link
          href={hasPrev ? listHref(page - 1) : '#'}
          className={hasPrev ? 'transition hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
        >
          {isEn ? 'Previous' : '上一页'}
        </Link>
        <span>{isEn ? `Page ${page} / ${totalPages}` : `第 ${page} / ${totalPages} 页`}</span>
        <Link
          href={hasNext ? listHref(page + 1) : '#'}
          className={hasNext ? 'transition hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
        >
          {isEn ? 'Next' : '下一页'}
        </Link>
      </div>
    </div>
  );
}
