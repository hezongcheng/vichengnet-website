import type { Metadata } from 'next';
import { Eye } from 'lucide-react';
import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import { getPathPvMap, getPopularPostSlugs } from '@/lib/analytics';
import { findContentBlocksByKeys } from '@/lib/content-store';
import { getRequestLocale } from '@/lib/i18n/server';
import { defaultLocale, type Locale, withLocalePrefix } from '@/lib/i18n/config';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const isEn = locale === 'en';

  return {
    title: isEn ? 'Home' : '首页',
    description: isEn
      ? 'Vicheng Blog homepage with latest frontend, AI tooling, and website engineering posts.'
      : '维成小站首页，持续更新前端开发、AI 工具实践、建站经验与项目复盘内容。',
    keywords: isEn
      ? ['home', 'tech blog', 'frontend', 'AI tools', 'website engineering']
      : ['首页', '技术博客', '前端开发', 'AI 工具', '建站经验'],
    alternates: {
      canonical: '/',
      languages: {
        'zh-CN': '/',
        'en-US': '/en',
      },
    },
  };
}

const getHomePageData = unstable_cache(
  async (locale: Locale) => {
    const [localizedContent, sharedContent, posts, popularSlugs] = await Promise.all([
      findContentBlocksByKeys(['home.hero.title', 'home.hero.description'], locale),
      findContentBlocksByKeys(['site.footer.icp', 'site.footer.domain'], defaultLocale),
      prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 6 }),
      getPopularPostSlugs(4),
    ]);

    const contentByKey = [...localizedContent, ...sharedContent].reduce<Record<string, string>>((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    const popularPostsRaw = popularSlugs.length
      ? await prisma.post.findMany({ where: { status: 'PUBLISHED', slug: { in: popularSlugs } } })
      : [];
    const popularPosts = popularSlugs
      .map((slug) => popularPostsRaw.find((item) => item.slug === slug))
      .filter(Boolean) as typeof popularPostsRaw;

    const pvMap = await getPathPvMap([...posts, ...popularPosts].map((post) => `/posts/${post.slug}`));
    const pvByPath = Object.fromEntries(pvMap.entries());

    return {
      posts,
      popularPosts,
      pvByPath,
      heroTitle: contentByKey['home.hero.title'] || '',
      heroDesc: contentByKey['home.hero.description'] || '',
      footerIcp: contentByKey['site.footer.icp'] || '',
      footerDomain: contentByKey['site.footer.domain'] || '',
    };
  },
  ['home-page-data'],
  { revalidate: 300 },
);

export default async function HomePage() {
  const locale = getRequestLocale();
  const isEn = locale === 'en';

  const { heroTitle, heroDesc, footerIcp, footerDomain, posts, popularPosts, pvByPath } = await getHomePageData(locale);

  return (
    <main>
      <TrackPageView path="/" />
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            {isEn ? "Hi, I'm Vicheng." : '你好，我是维成。'}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            {heroTitle || (isEn ? 'Vicheng Notes' : '维成小站')}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400 md:text-lg">
            {heroDesc ||
              (isEn
                ? 'A minimal, content-first tech blog.'
                : '专注前端开发、AI 工具实践与建站经验的内容型博客。')}
          </p>
        </section>

        <section className="py-10 md:py-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Latest Articles' : '最新文章'}</h2>
            <a
              href={withLocalePrefix('/posts', locale)}
              className="text-sm text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {isEn ? 'View all' : '查看全部'}
            </a>
          </div>

          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {posts.map((post) => {
              const title = isEn ? post.titleEn || post.title : post.title;
              const summary = isEn ? post.summaryEn || post.summary : post.summary;
              const category = isEn ? post.categoryEn || post.category : post.category;
              return (
                <article key={post.id} className="py-5 md:py-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                    <div className="min-w-0">
                      <a
                        href={withLocalePrefix(`/posts/${post.slug}`, locale)}
                        className="text-xl font-medium tracking-tight transition hover:opacity-70 md:text-2xl"
                      >
                        {title}
                      </a>
                      {summary ? (
                        <p className="mt-3 max-w-2xl text-sm leading-8 text-neutral-600 dark:text-neutral-400 md:text-base">
                          {summary}
                        </p>
                      ) : null}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-400 dark:text-neutral-500">
                        {category ? (
                          <a
                            href={withLocalePrefix(`/categories/${encodeURIComponent(category)}`, locale)}
                            className="transition hover:text-neutral-900 dark:hover:text-neutral-100"
                          >
                            /{category}
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
                        {pvByPath[`/posts/${post.slug}`] || 0}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {popularPosts.length ? (
          <section className="border-t border-neutral-200/80 py-10 dark:border-neutral-800/80 md:py-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Popular Reads' : '热门阅读'}</h2>
              <span className="text-sm text-neutral-400 dark:text-neutral-500">{isEn ? 'Most viewed posts' : '按阅读量排序'}</span>
            </div>

            <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
              {popularPosts.map((post) => {
                const title = isEn ? post.titleEn || post.title : post.title;
                const summary = isEn ? post.summaryEn || post.summary : post.summary;
                return (
                  <article key={post.id} className="py-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                      <div className="min-w-0">
                        <a
                          href={withLocalePrefix(`/posts/${post.slug}`, locale)}
                          className="text-lg font-medium tracking-tight transition hover:opacity-70 md:text-xl"
                        >
                          {title}
                        </a>
                        {summary ? (
                          <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                            {summary}
                          </p>
                        ) : null}
                      </div>
                      <div className="shrink-0 text-sm text-neutral-400 dark:text-neutral-500 md:text-right">
                        <div>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'zh-CN') : '--'}</div>
                      <div className="mt-2 inline-flex items-center gap-1">
                        <Eye size={13} />
                        {pvByPath[`/posts/${post.slug}`] || 0}
                      </div>
                    </div>
                  </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </Container>
      <SiteFooter
        domain={footerDomain || 'vichengnet.com'}
        icp={footerIcp || '蜀ICP备2025127626号-1'}
      />
    </main>
  );
}
