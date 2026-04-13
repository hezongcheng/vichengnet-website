import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import NavDirectory from '@/components/site/nav/NavDirectory';
import { prisma } from '@/lib/prisma';
import { defaultNavCategories, mapDbCategoriesToNav } from '@/lib/nav';
import { getRequestLocale } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: '导航',
  description: '收集常用网站与工具，按主题分组，方便快速访问。',
  alternates: {
    canonical: '/nav',
    languages: {
      'zh-CN': '/zh/nav',
      'en-US': '/en/nav',
    },
  },
};

export const dynamic = 'force-dynamic';

export default async function NavPage() {
  const locale = getRequestLocale();
  const isEn = locale === 'en';

  let categories = defaultNavCategories;
  try {
    const categoriesRaw = await prisma.navCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        sites: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (categoriesRaw.length) {
      categories = mapDbCategoriesToNav(locale, categoriesRaw);
    }
  } catch {
    categories = defaultNavCategories;
  }

  return (
    <main>
      <TrackPageView path="/nav" />
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{isEn ? 'Directory' : '导航'}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">
            {isEn
              ? 'A curated directory of frequently used websites and tools.'
              : '参考导航站的信息结构，结合当前站点风格整理的常用链接目录。'}
          </p>
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
        </section>

        <NavDirectory categories={categories} />
      </Container>
      <SiteFooter />
    </main>
  );
}
