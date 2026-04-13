import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { getRequestLocale } from '@/lib/i18n/server';
import { withLocalePrefix } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: '搜索',
  description: '搜索维成小站的技术文章，快速定位前端开发、AI 工具与建站相关内容。',
  keywords: ['站内搜索', '技术文章搜索', '前端', 'AI 工具', '建站'],
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/zh/search',
    languages: {
      'zh-CN': '/zh/search',
      'en-US': '/en/search',
    },
  },
};

type Props = { searchParams?: { q?: string } };

export default async function SearchPage({ searchParams }: Props) {
  const locale = getRequestLocale();
  const isEn = locale === 'en';
  const q = String(searchParams?.q || '').trim();

  const posts = q
    ? await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
            { content: { contains: q, mode: 'insensitive' } },
          ],
        },
        orderBy: { publishedAt: 'desc' },
        take: 20,
      })
    : [];

  return (
    <main>
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{isEn ? 'Search' : '搜索'}</h1>
          <form action={withLocalePrefix('/search', locale)} method="get" className="mt-6 max-w-2xl">
            <label className="flex items-center gap-3 border-b border-neutral-300 py-3 dark:border-neutral-700">
              <Search size={18} className="text-neutral-400" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={isEn ? 'Search title, summary, or full content...' : '搜索文章标题、摘要或正文...'}
                className="w-full bg-transparent outline-none placeholder:text-neutral-400"
              />
            </label>
          </form>
        </section>

        <section className="py-8 md:py-10">
          <div className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">
            {q
              ? isEn
                ? `Found ${posts.length} results for "${q}"`
                : `共找到 ${posts.length} 条与“${q}”相关的内容`
              : isEn
                ? 'Enter a keyword to start searching'
                : '请输入关键词开始搜索'}
          </div>

          {q && !posts.length ? (
            <div className="rounded-2xl border border-neutral-200/80 px-5 py-6 text-sm text-neutral-500 dark:border-neutral-800/80 dark:text-neutral-400">
              {isEn ? 'No matching content found. Try another keyword.' : '暂时没有找到相关内容，试试换一个关键词。'}
            </div>
          ) : null}

          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {posts.map((post) => (
              <article key={post.id} className="py-5 md:py-6">
                <a
                  href={withLocalePrefix(`/posts/${post.slug}`, locale)}
                  className="text-xl font-medium tracking-tight transition hover:opacity-70 md:text-2xl"
                >
                  {post.title}
                </a>
                <p className="mt-3 max-w-2xl text-sm leading-8 text-neutral-600 dark:text-neutral-400 md:text-base">
                  {post.summary}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>
      <SiteFooter />
    </main>
  );
}
