import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">文章管理</h2>
          <p className="mt-1 text-sm text-neutral-500">创建、编辑、发布和归档文章</p>
        </div>
        <Link href="/admin/posts/new" className="rounded-xl bg-neutral-900 px-4 py-2 text-sm text-white">
          新建文章
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">状态</th>
              <th className="px-4 py-3">更新时间</th>
              <th className="px-4 py-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">{post.status}</td>
                <td className="px-4 py-3">{post.updatedAt.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/posts/${post.id}`} className="text-neutral-900 underline">
                    编辑
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
