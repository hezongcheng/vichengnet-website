import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PostEditorForm from '@/components/admin/PostEditorForm';

export default async function AdminEditPostPage({ params }: { params: { id: string } }) {
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
        <h2 className="text-2xl font-semibold tracking-tight">编辑文章</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          修改标题、摘要、正文、SEO 字段与发布状态
        </p>
      </div>

      <PostEditorForm
        mode="edit"
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
