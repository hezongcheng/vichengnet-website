import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import NavDirectory from '@/components/site/nav/NavDirectory';
import { prisma } from '@/lib/prisma';
import { mapDbCategoriesToNav } from '@/lib/nav';
import { getRequestLocale } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: '导航',
  description: '精选开发、设计、AI 与效率工具网站导航，支持按主题快速查找高质量资源。',
  keywords: ['网站导航', '开发工具', 'AI 工具', '设计资源', '效率工具'],
  alternates: {
    canonical: '/nav',
    languages: {
      'zh-CN': '/nav',
      'en-US': '/en/nav',
    },
  },
};

export const dynamic = 'force-dynamic';

export default async function NavPage() {
  const locale = getRequestLocale();
  const isEn = locale === 'en';

  let categories: ReturnType<typeof mapDbCategoriesToNav> = [];
  let loadFailed = false;
  try {
    const categoriesRaw = await prisma.navCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        sites: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    categories = mapDbCategoriesToNav(locale, categoriesRaw);
  } catch {
    loadFailed = true;
  }

  return (
    <main>
      <TrackPageView path="/nav" />
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{isEn ? 'Resource Directory' : '资源导航'}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">
            {isEn
              ? 'A curated collection of developer tools, AI products, and design resources.'
              : '按主题整理常用开发工具、AI 产品与设计资源，帮助你快速定位高价值站点。'}
          </p>
          {categories.length ? (
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              {categories.map((category) => (
                <a
                  key={category.key}
                  href={`#${category.key}`}
                  className="rounded-full border border-neutral-200 px-3 py-1.5 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                >
                  {category.label}
                </a>
              ))}
            </div>
          ) : null}
        </section>

        {loadFailed ? (
          <section className="py-10 text-sm text-neutral-500 dark:text-neutral-400">
            {isEn
              ? 'Failed to load directory data. Please check database connection and try again.'
              : '导航数据加载失败，请检查数据库连接后重试。'}
          </section>
        ) : categories.length === 0 ? (
          <section className="py-10 text-sm text-neutral-500 dark:text-neutral-400">
            {isEn
              ? 'No directory data yet. Please add categories and links in Admin > Directory Management.'
              : '暂无导航数据，请先在后台「导航管理」中新增分类与站点。'}
          </section>
        ) : (
          <NavDirectory categories={categories} locale={locale} />
        )}
      </Container>
      <SiteFooter />
    </main>
  );
}
