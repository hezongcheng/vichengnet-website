import { prisma } from '@/lib/prisma';

export default async function AdminDashboardPage() {
  const postCount = await prisma.post.count();
  const publishedCount = await prisma.post.count({ where: { status: 'PUBLISHED' } });
  const pv = await prisma.visitEvent.count();
  const uv = (await prisma.visitEvent.findMany({ distinct: ['visitorId'], select: { visitorId: true } })).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">仪表盘</h2>
        <p className="mt-1 text-sm text-neutral-500">查看站点运营概况</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5"><div className="text-sm text-neutral-500">文章总数</div><div className="mt-2 text-3xl font-semibold">{postCount}</div></div>
        <div className="rounded-2xl border bg-white p-5"><div className="text-sm text-neutral-500">已发布</div><div className="mt-2 text-3xl font-semibold">{publishedCount}</div></div>
        <div className="rounded-2xl border bg-white p-5"><div className="text-sm text-neutral-500">总 PV</div><div className="mt-2 text-3xl font-semibold">{pv}</div></div>
        <div className="rounded-2xl border bg-white p-5"><div className="text-sm text-neutral-500">总 UV</div><div className="mt-2 text-3xl font-semibold">{uv}</div></div>
      </div>
    </div>
  );
}
