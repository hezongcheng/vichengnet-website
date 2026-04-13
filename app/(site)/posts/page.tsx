import type { Metadata } from 'next';
import { Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import { getPathPvMap } from '@/lib/analytics';
import { getRequestLocale } from '@/lib/i18n/server';
import { withLocalePrefix } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: '文章',
  description: '浏览维成小站全部技术文章，涵盖前端开发、AI 工具、项目实践与建站经验。',
  keywords: ['技术文章', '前端开发', 'Next.js', 'AI 工具', '建站'],
  alternates: {
    canonical: '/zh/posts',
    languages: {
      'zh-CN': '/zh/posts',
      'en-US': '/en/posts',
    },
  },
};

type Props = { searchParams?: { page?: string } };

export default async function PostsPage({ searchParams }: Props) {
  const locale = getRequestLocale();
  const isEn = locale === 'en';
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
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{isEn ? 'Articles' : '文章'}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">
            {isEn
              ? 'In-depth posts on frontend engineering, AI tooling, and real-world project lessons.'
              : '系统记录前端开发、AI 工具实践、建站经验与项目复盘。'}
          </p>
        </section>

        <section className="py-8 md:py-10">
          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {posts.map((post) => (
              <article key={post.id} className="py-5 md:py-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                  <div className="min-w-0">
                    <a
                      href={withLocalePrefix(`/posts/${post.slug}`, locale)}
                      className="text-xl font-medium tracking-tight transition hover:opacity-70 md:text-2xl"
                    >
                      {post.title}
                    </a>
                    <p className="mt-3 max-w-2xl text-sm leading-8 text-neutral-600 dark:text-neutral-400 md:text-base">{post.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                      {post.category ? (
                        <a
                          href={withLocalePrefix(`/categories/${encodeURIComponent(post.category)}`, locale)}
                          className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                          /{post.category}
                        </a>
                      ) : null}
                      {post.tags?.slice(0, 4).map((tag) => (
                        <a
                          key={tag}
                          href={withLocalePrefix(`/tags/${encodeURIComponent(tag)}`, locale)}
                          className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                          #{tag}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm text-neutral-400 dark:text-neutral-500 md:text-right">
                    <div>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'zh-CN') : '--'}</div>
                    <div className="mt-2 inline-flex items-center gap-1">
                      <Eye size={13} />
                      {pvMap.get(`/posts/${post.slug}`) || 0}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <a
              href={page > 1 ? withLocalePrefix(`/posts?page=${page - 1}`, locale) : '#'}
              className={page > 1 ? 'transition hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
            >
              {isEn ? 'Previous Page' : '上一页'}
            </a>
            <span>{isEn ? `Page ${page} / ${totalPages}` : `第 ${page} / ${totalPages} 页`}</span>
            <a
              href={page < totalPages ? withLocalePrefix(`/posts?page=${page + 1}`, locale) : '#'}
              className={page < totalPages ? 'transition hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
            >
              {isEn ? 'Next Page' : '下一页'}
            </a>
          </div>
        </section>
      </Container>
      <SiteFooter />
    </main>
  );
}
