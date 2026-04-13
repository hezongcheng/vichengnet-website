import type { Metadata } from 'next';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import { findContentBlock } from '@/lib/content-store';
import { defaultLocale } from '@/lib/i18n/config';
import { getRequestLocale } from '@/lib/i18n/server';
import { parseProjectItems, stringifyProjectItems } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A collection of ongoing product and engineering projects.',
  keywords: ['Projects', 'Engineering', 'Frontend', 'AI'],
  alternates: {
    canonical: '/projects',
    languages: {
      'zh-CN': '/projects',
      'en-US': '/en/projects',
    },
  },
};

export default async function ProjectsPage() {
  const locale = getRequestLocale();
  const isEn = locale === 'en';
  const block = await findContentBlock('projects.items', defaultLocale);
  const projects = parseProjectItems(block?.value || stringifyProjectItems(parseProjectItems('')));

  return (
    <main>
      <SiteHeader />
      <Container>
        <section className="border-b border-neutral-200/80 py-12 dark:border-neutral-800/80 md:py-16">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{isEn ? 'Projects' : '项目'}</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-neutral-600 dark:text-neutral-400">
            {isEn
              ? 'Product and engineering work in progress.'
              : '这里是我正在持续迭代的产品与工程实践。'}
          </p>
        </section>

        <section className="py-8 md:py-10">
          <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
            {projects.map((project, index) => {
              const title = isEn ? project.nameEn || project.nameZh : project.nameZh || project.nameEn;
              const desc = isEn
                ? project.descriptionEn || project.descriptionZh
                : project.descriptionZh || project.descriptionEn;
              return (
                <article key={`${title}-${index}`} className="py-5 md:py-6">
                  <h2 className="text-xl font-medium tracking-tight md:text-2xl">{title}</h2>
                  {desc ? (
                    <p className="mt-3 max-w-2xl text-sm leading-8 text-neutral-600 dark:text-neutral-400 md:text-base">
                      {desc}
                    </p>
                  ) : null}
                  {project.url ? (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex text-sm text-neutral-600 underline transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                    >
                      {isEn ? 'Visit project' : '访问项目'}
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </Container>
      <SiteFooter />
    </main>
  );
}
