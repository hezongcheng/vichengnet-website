import type { Metadata } from 'next';
import { Eye } from 'lucide-react';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import { prisma } from '@/lib/prisma';
import Container from '@/components/site/Container';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import TrackPageView from '@/components/site/TrackPageView';
import PostToc from '@/components/site/PostToc';
import CommentsGiscus from '@/components/site/CommentsGiscus';
import PostContent from '@/components/site/PostContent';
import { extractTocFromHtml, injectHeadingIds } from '@/lib/toc';
import { countWordsAndReadingTime } from '@/lib/reading';
import { getPathPvMap } from '@/lib/analytics';
import { getRequestLocale } from '@/lib/i18n/server';
import { withLocalePrefix } from '@/lib/i18n/config';
import { absoluteUrl, SITE_NAME_EN, SITE_NAME_ZH } from '@/lib/seo';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });
  if (!post) return { title: '文章不存在' };

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.summary || post.title;
  const keywords = post.seoKeywords?.split(',').map((s) => s.trim()).filter(Boolean);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/zh/posts/${post.slug}`,
      languages: {
        'zh-CN': `/zh/posts/${post.slug}`,
        'en-US': `/en/posts/${post.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/posts/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: post.coverImage ? 'summary_large_image' : 'summary',
      title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const locale = getRequestLocale();
  const isEn = locale === 'en';

  const post = await prisma.post.findFirst({ where: { slug: params.slug, status: 'PUBLISHED' } });
  if (!post) return notFound();

  const sanitizedHtml = DOMPurify.sanitize(post.content || '');
  const htmlWithIds = injectHeadingIds(sanitizedHtml);
  const htmlWithAnchorTargets = htmlWithIds.replace(/<a\b([^>]*)>/gi, (_match, attrs) => {
    const nextAttrs = attrs
      .replace(/\s*target\s*=\s*(['"]).*?\1/gi, '')
      .replace(/\s*rel\s*=\s*(['"]).*?\1/gi, '');
    return `<a${nextAttrs} target="_blank" rel="noopener noreferrer">`;
  });

  const tocItems = extractTocFromHtml(htmlWithAnchorTargets);
  const stats = countWordsAndReadingTime(post.content || '');

  const relatedPosts = post.tags.length
    ? await prisma.post.findMany({
        where: {
          status: 'PUBLISHED',
          id: { not: post.id },
          OR: post.tags.map((tag) => ({ tags: { has: tag } })),
        },
        orderBy: { publishedAt: 'desc' },
        take: 4,
      })
    : [];

  const pvMap = await getPathPvMap([`/posts/${post.slug}`, ...relatedPosts.map((item) => `/posts/${item.slug}`)]);
  const pageViews = pvMap.get(`/posts/${post.slug}`) || 0;
  const postUrl = absoluteUrl(withLocalePrefix(`/posts/${post.slug}`, locale));
  const siteName = isEn ? SITE_NAME_EN : SITE_NAME_ZH;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seoDescription || post.summary || post.title,
    author: {
      '@type': 'Person',
      name: isEn ? 'Vicheng' : '维成',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: absoluteUrl('/'),
    },
    mainEntityOfPage: postUrl,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    keywords: post.tags.join(', '),
    image: post.coverImage ? [post.coverImage] : undefined,
    articleSection: post.category || undefined,
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: isEn ? 'Home' : '首页',
        item: absoluteUrl(withLocalePrefix('/', locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isEn ? 'Articles' : '文章',
        item: absoluteUrl(withLocalePrefix('/posts', locale)),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <TrackPageView path={`/posts/${post.slug}`} />
      <SiteHeader />
      <Container>
        <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="min-w-0 lg:max-w-3xl">
            <article>
              <header className="border-b border-neutral-200/80 pb-8 dark:border-neutral-800/80">
                <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{post.title}</h1>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                  <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'zh-CN') : isEn ? 'Unpublished' : '未发布'}</span>
                  <span>{isEn ? `${stats.totalCount} words` : `${stats.totalCount} 字`}</span>
                  <span>{isEn ? `${stats.minutes} min read` : `${stats.minutes} 分钟阅读`}</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye size={14} />
                    {pageViews}
                  </span>
                </div>

                {post.summary ? <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-400">{post.summary}</p> : null}

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-neutral-400 dark:text-neutral-500">
                  {post.category ? (
                    <a href={withLocalePrefix(`/categories/${encodeURIComponent(post.category)}`, locale)} className="transition hover:text-neutral-900 dark:hover:text-neutral-100">
                      /{post.category}
                    </a>
                  ) : null}
                  {post.tags?.map((tag) => (
                    <a key={tag} href={withLocalePrefix(`/tags/${encodeURIComponent(tag)}`, locale)} className="transition hover:text-neutral-900 dark:hover:text-neutral-100">
                      #{tag}
                    </a>
                  ))}
                </div>

                {post.coverImage ? (
                  <div className="mt-8 overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80">
                    <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
                  </div>
                ) : null}
              </header>

              <PostContent html={htmlWithAnchorTargets} />
              <CommentsGiscus />
            </article>

            {relatedPosts.length ? (
              <section className="mt-12 border-t border-neutral-200/80 py-10 dark:border-neutral-800/80">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Related Articles' : '相关文章'}</h2>
                  <span className="text-sm text-neutral-400 dark:text-neutral-500">{isEn ? 'Continue reading' : '继续阅读'}</span>
                </div>
                <div className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80">
                  {relatedPosts.map((item) => (
                    <article key={item.id} className="py-5">
                      <a href={withLocalePrefix(`/posts/${item.slug}`, locale)} className="text-lg font-medium tracking-tight transition hover:opacity-70">
                        {item.title}
                      </a>
                      <p className="mt-2 text-sm leading-7 text-neutral-600 dark:text-neutral-400">{item.summary}</p>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <PostToc items={tocItems} />
              <div className="text-sm text-neutral-400 dark:text-neutral-500">
                <div>{isEn ? `Views ${pageViews}` : `阅读 ${pageViews}`}</div>
                <div className="mt-2">{isEn ? `Reading ${stats.minutes} min` : `阅读时长 ${stats.minutes} 分钟`}</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <SiteFooter />
    </main>
  );
}
