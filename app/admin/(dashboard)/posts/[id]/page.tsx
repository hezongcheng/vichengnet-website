import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostEditorForm from '@/components/admin/PostEditorForm';
import { getAdminLocale } from '@/lib/i18n/admin';

export default async function AdminEditPostPage({ params }: { params: { id: string } }) {
  const locale = getAdminLocale();
  const isEn = locale === 'en';
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) return notFound();

  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt.getTime() - post.publishedAt.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : '';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Edit Post' : '编辑文章'}</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {isEn
            ? 'Update title, summary, content, SEO fields, and publishing status.'
            : '修改标题、摘要、正文、SEO 字段与发布状态。'}
        </p>
      </div>

      <PostEditorForm
        mode="edit"
        locale={locale}
        initialValue={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          summary: post.summary || '',
          content: post.content,
          coverImage: post.coverImage || '',
          category: post.category || '',
          tags: post.tags,
          seoTitle: post.seoTitle || '',
          seoDescription: post.seoDescription || '',
          seoKeywords: post.seoKeywords || '',
          status: post.status,
          publishedAt,
        }}
      />
    </div>
  );
}
