import { Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import { getPathPvMap } from '@/lib/analytics';

type Props = { searchParams?: { page?: string } };

export default async function PostsPage({ searchParams }: Props) {
  const page = Math.max(Number(searchParams?.page || '1'), 1);
  const pageSize = 10;

  const [total, posts] = await Promise.all([
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(total / pageSize), 1);
  const pvMap = await getPathPvMap(posts.map((post) => `/posts/${post.slug}`));

  return (
    <main>
      <TrackPageView path="/posts" />
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">文章</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">记录技术、建站、项目与一些长期的思考。</p>
        </section>

        <section className="py-8 md:py-10">
          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {posts.map((post) => (
              <article key={post.id} className="py-5 md:py-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                  <div className="min-w-0">
                    <a href={`/posts/${post.slug}`} className="text-xl font-medium tracking-tight transition hover:opacity-70 md:text-2xl">{post.title}</a>
                    <p className="mt-3 max-w-2xl text-sm leading-8 text-neutral-600 dark:text-neutral-400 md:text-base">{post.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                      {post.category ? <a href={`/categories/${encodeURIComponent(post.category)}`} className="transition hover:text-neutral-900 dark:hover:text-neutral-100">/{post.category}</a> : null}
                      {post.tags?.slice(0, 4).map((tag) => (
                        <a key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="transition hover:text-neutral-900 dark:hover:text-neutral-100">#{tag}</a>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm text-neutral-400 dark:text-neutral-500 md:text-right">
                    <div>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('zh-CN') : '--'}</div>
                    <div className="mt-2 inline-flex items-center gap-1"><Eye size={13} />{pvMap.get(`/posts/${post.slug}`) || 0}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <a href={page > 1 ? `/posts?page=${page - 1}` : '#'} className={page > 1 ? 'transition hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}>
              ← 上一页
            </a>
            <span>第 {page} / {totalPages} 页</span>
            <a href={page < totalPages ? `/posts?page=${page + 1}` : '#'} className={page < totalPages ? 'transition hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}>
              下一页 →
            </a>
          </div>
        </section>
      </Container>
      <SiteFooter />
    </main>
  );
}
