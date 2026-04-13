import { prisma } from '@/lib/prisma';
import { getDailyTrends } from '@/lib/analytics';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';

export default async function AdminAnalyticsPage() {
  const totalPv = await prisma.visitEvent.count();
  const totalUv = (await prisma.visitEvent.findMany({ distinct: ['visitorId'], select: { visitorId: true } })).length;

  const referrers = await prisma.visitEvent.groupBy({
    by: ['refererHost'],
    _count: { refererHost: true },
    orderBy: { _count: { refererHost: 'desc' } },
    take: 8,
  });

  const visitors = await prisma.visitEvent.groupBy({
    by: ['ip', 'country', 'city'],
    _count: { ip: true },
    orderBy: { _count: { ip: 'desc' } },
    take: 20,
  });

  const trends = await getDailyTrends(7);

  const referrerData = referrers.map((item) => ({
    name: item.refererHost || 'direct',
    value: item._count.refererHost,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">访问统计</h2>
        <p className="mt-1 text-sm text-neutral-500">PV、UV、来源、IP 与访客趋势分析</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm text-neutral-500">总 PV</div>
          <div className="mt-2 text-3xl font-semibold">{totalPv}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm text-neutral-500">总 UV</div>
          <div className="mt-2 text-3xl font-semibold">{totalUv}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm text-neutral-500">来源数</div>
          <div className="mt-2 text-3xl font-semibold">{referrerData.length}</div>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <div className="text-sm text-neutral-500">记录 IP</div>
          <div className="mt-2 text-3xl font-semibold">{visitors.filter((item) => item.ip).length}</div>
        </div>
      </div>

      <AnalyticsCharts trends={trends} referrers={referrerData} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-lg font-medium">来源明细</h3>
          <div className="mt-4 space-y-3 text-sm">
            {referrers.map((item, index) => (
              <div key={`${item.refererHost}-${index}`} className="flex items-center justify-between">
                <span>{item.refererHost || 'direct'}</span>
                <span>{item._count.refererHost}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5">
          <h3 className="text-lg font-medium">IP / 地域明细</h3>
          <div className="mt-4 space-y-3 text-sm">
            {visitors.map((item, index) => (
              <div key={`${item.ip}-${index}`} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate font-medium">{item.ip || 'Unknown IP'}</div>
                  <div className="text-neutral-500">{[item.country, item.city].filter(Boolean).join(' / ') || '未知地区'}</div>
                </div>
                <span>{item._count.ip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
