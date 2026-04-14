import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import { getContentBlock } from '@/lib/content';
import { getRequestLocale } from '@/lib/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getRequestLocale();
  const isEn = locale === 'en';
  return {
    title: isEn ? 'About' : '关于',
    description: isEn
      ? 'About the author, writing topics, and long-term publishing plan.'
      : '了解维成小站的内容方向、作者背景与长期更新计划。',
    keywords: isEn ? ['about', 'author', 'tech blog'] : ['关于', '作者介绍', '技术博客'],
    alternates: {
      canonical: '/about',
      languages: {
        'zh-CN': '/about',
        'en-US': '/en/about',
      },
    },
  };
}

export default async function AboutPage() {
  const locale = getRequestLocale();
  const isEn = locale === 'en';
  const about = await getContentBlock('about.body', locale);

  return (
    <main>
      <TrackPageView path="/about" />
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{isEn ? 'About' : '关于'}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">
            {isEn ? 'About the author, writing topics, and long-term publishing plan.' : '介绍作者背景、写作主题与长期更新方向。'}
          </p>
        </section>

        <article className="prose max-w-none whitespace-pre-wrap py-8 md:py-10">
          {about?.value || (isEn ? 'About page content is not available yet.' : '关于页内容正在完善中。')}
        </article>
      </Container>
      <SiteFooter />
    </main>
  );
}
