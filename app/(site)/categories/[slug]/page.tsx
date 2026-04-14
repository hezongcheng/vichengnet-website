import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import { getRequestLocale } from '@/lib/i18n/server';
import { withLocalePrefix } from '@/lib/i18n/config';

type Props = {
  params: { slug: string };
};

function decodeSlug(slug: string) {
  return decodeURIComponent(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getRequestLocale();
  const isEn = locale === 'en';
  const category = decodeSlug(params.slug);
  return {
    title: isEn ? `Category: ${category}` : `分类：${category}`,
    description: isEn ? `Posts under category "${category}".` : `查看“${category}”分类下的全部文章。`,
    keywords: [category, isEn ? 'category posts' : '分类文章'],
  };
}

export default async function CategoryPostsPage({ params }: Props) {
  const locale = getRequestLocale();
  const isEn = locale === 'en';
  const category = decodeSlug(params.slug);

  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      ...(isEn ? { categoryEn: category } : { category }),
    },
    orderBy: { publishedAt: 'desc' },
  });

  if (!posts.length) return notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <TrackPageView path={`/categories/${params.slug}`} />
      <SiteHeader />

      <section className="border-b py-10">
        <h1 className="text-4xl font-bold tracking-tight">{isEn ? `Category: ${category}` : `分类：${category}`}</h1>
        <p className="mt-4 text-base leading-8 text-neutral-600 dark:text-neutral-400">
          {isEn ? `${posts.length} related posts found.` : `共 ${posts.length} 篇相关文章。`}
        </p>
      </section>

      <section className="py-10">
        <div className="space-y-2">
          {posts.map((post) => (
            <a key={post.id} href={withLocalePrefix(`/posts/${post.slug}`, locale)} className="block border-t py-5 last:border-b">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight">{isEn ? post.titleEn || post.title : post.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                    {isEn ? post.summaryEn || post.summary : post.summary}
                  </p>
                </div>
                <time className="shrink-0 pt-1 text-sm text-neutral-400">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'zh-CN') : '--'}
                </time>
              </div>
            </a>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
