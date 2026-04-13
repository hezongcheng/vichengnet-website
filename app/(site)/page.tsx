import { Eye } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import { getPathPvMap, getPopularPostSlugs } from '@/lib/analytics';
import { getContentBlock } from '@/lib/content';
import { getRequestLocale } from '@/lib/i18n/server';
import { withLocalePrefix } from '@/lib/i18n/config';

export default async function HomePage() {
  const locale = getRequestLocale();
  const isEn = locale === 'en';

  const [heroTitle, heroDesc, footerIcp, footerDomain, posts, popularSlugs] = await Promise.all([
    getContentBlock('home.hero.title', locale),
    getContentBlock('home.hero.description', locale),
    getContentBlock('site.footer.icp', locale),
    getContentBlock('site.footer.domain', locale),
    prisma.post.findMany({ where: { status: 'PUBLISHED' }, orderBy: { publishedAt: 'desc' }, take: 6 }),
    getPopularPostSlugs(4),
  ]);

  const popularPostsRaw = popularSlugs.length
    ? await prisma.post.findMany({ where: { status: 'PUBLISHED', slug: { in: popularSlugs } } })
    : [];
  const popularPosts = popularSlugs
    .map((slug) => popularPostsRaw.find((item) => item.slug === slug))
    .filter(Boolean) as typeof popularPostsRaw;

  const pvMap = await getPathPvMap([...posts, ...popularPosts].map((post) => `/posts/${post.slug}`));

  return (
    <main>
      <TrackPageView path="/" />
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <p className="text-sm text-neutral-400 dark:text-neutral-500">{isEn ? "Hi, I'm Vicheng." : '你好，我是维成。'}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
            {heroTitle?.value || (isEn ? 'Vicheng Notes' : '维成小站')}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400 md:text-lg">
            {heroDesc?.value || (isEn ? 'A minimal and content-first personal website.' : '一个简洁、安静、内容优先的个人站点。')}
          </p>
        </section>

        <section className="py-10 md:py-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Recent writing' : '最近文章'}</h2>
            <a
              href={withLocalePrefix('/posts', locale)}
              className="text-sm text-neutral-500 transition hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
            >
              {isEn ? 'more' : '更多'}
            </a>
          </div>

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
                    {post.summary ? (
                      <p className="mt-3 max-w-2xl text-sm leading-8 text-neutral-600 dark:text-neutral-400 md:text-base">
                        {post.summary}
                      </p>
                    ) : null}
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
        </section>

        {popularPosts.length ? (
          <section className="border-t border-neutral-200/80 py-10 dark:border-neutral-800/80 md:py-12">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Popular' : '热门文章'}</h2>
              <span className="text-sm text-neutral-400 dark:text-neutral-500">{isEn ? 'By reading heat' : '按阅读热度'}</span>
            </div>

            <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
              {popularPosts.map((post) => (
                <article key={post.id} className="py-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
                    <div className="min-w-0">
                      <a
                        href={withLocalePrefix(`/posts/${post.slug}`, locale)}
                        className="text-lg font-medium tracking-tight transition hover:opacity-70 md:text-xl"
                      >
                        {post.title}
                      </a>
                      {post.summary ? (
                        <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                          {post.summary}
                        </p>
                      ) : null}
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
          </section>
        ) : null}
      </Container>
      <SiteFooter
        domain={footerDomain?.value || 'vichengnet.com'}
        icp={footerIcp?.value || '蜀ICP备2025127626号-1'}
      />
    </main>
  );
}
