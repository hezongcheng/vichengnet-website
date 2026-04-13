import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import { getContentBlock } from '@/lib/content';
import { getRequestLocale } from '@/lib/i18n/server';

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
            {isEn ? 'About Vicheng Notes and the author behind it.' : '关于维成小站与站点作者。'}
          </p>
        </section>

        <article className="prose max-w-none whitespace-pre-wrap py-8 md:py-10">
          {about?.value || (isEn ? 'About page content is not set yet.' : '这里还没有填写关于页内容。')}
        </article>
      </Container>
      <SiteFooter />
    </main>
  );
}
