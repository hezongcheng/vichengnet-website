import { prisma } from '@/lib/prisma';
import { getDailyTrends } from '@/lib/analytics';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { getAdminLocale } from '@/lib/i18n/admin';

type Props = {
  searchParams?: {
    days?: '7' | '30' | 'all';
    sourcePage?: string;
    ipPage?: string;
  };
};

function toPage(value: string | undefined) {
  return Math.max(1, Number(value || '1') || 1);
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  const locale = getAdminLocale();
  const isEn = locale === 'en';
  const days = searchParams?.days === '30' || searchParams?.days === 'all' ? searchParams.days : '7';
  const sourcePage = toPage(searchParams?.sourcePage);
  const ipPage = toPage(searchParams?.ipPage);
  const sourcePageSize = 6;
  const ipPageSize = 6;

  const startDate =
    days === 'all'
      ? null
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() - (Number(days) - 1));
          d.setHours(0, 0, 0, 0);
          return d;
        })();

  const eventWhere = startDate ? { createdAt: { gte: startDate } } : undefined;

  const [
    postCount,
    publishedCount,
    totalPv,
    uvRows,
    allReferrers,
    allVisitors,
    topPathsRaw,
    trends,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.visitEvent.count({ where: eventWhere }),
    prisma.visitEvent.findMany({ where: eventWhere, distinct: ['visitorId'], select: { visitorId: true } }),
    prisma.visitEvent.groupBy({
      by: ['refererHost'],
      where: eventWhere,
      _count: { refererHost: true },
      orderBy: { _count: { refererHost: 'desc' } },
    }),
    prisma.visitEvent.groupBy({
      by: ['ip', 'country', 'city'],
      where: eventWhere,
      _count: { ip: true },
      orderBy: { _count: { ip: 'desc' } },
    }),
    prisma.visitEvent.groupBy({
      by: ['path'],
      where: {
        ...(eventWhere || {}),
        path: { startsWith: '/' },
      },
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    getDailyTrends(days === 'all' ? 30 : Number(days)),
  ]);

  const totalUv = uvRows.length;
  const topPaths = topPathsRaw.map((item) => ({
    path: item.path || '/',
    value: item._count.path,
  }));

  const sourceTotalPages = Math.max(1, Math.ceil(allReferrers.length / sourcePageSize));
  const ipTotalPages = Math.max(1, Math.ceil(allVisitors.length / ipPageSize));
  const sourcePageSafe = Math.min(sourcePage, sourceTotalPages);
  const ipPageSafe = Math.min(ipPage, ipTotalPages);

  const referrers = allReferrers.slice((sourcePageSafe - 1) * sourcePageSize, sourcePageSafe * sourcePageSize);
  const visitors = allVisitors.slice((ipPageSafe - 1) * ipPageSize, ipPageSafe * ipPageSize);

  function href(nextDays: '7' | '30' | 'all', nextSourcePage = sourcePageSafe, nextIpPage = ipPageSafe) {
    const params = new URLSearchParams();
    params.set('days', nextDays);
    if (nextSourcePage > 1) params.set('sourcePage', String(nextSourcePage));
    if (nextIpPage > 1) params.set('ipPage', String(nextIpPage));
    return `/admin?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{isEn ? 'Dashboard' : '仪表盘'}</h2>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {isEn ? 'Overview of site content and traffic performance.' : '查看站点内容与访问数据的整体概况。'}
          </p>
        </div>
        <div className="inline-flex rounded-full border border-neutral-200 p-1 text-sm dark:border-neutral-800">
          {([
            ['7', isEn ? '7 days' : '最近7天'],
            ['30', isEn ? '30 days' : '最近30天'],
            ['all', isEn ? 'All' : '全部'],
          ] as Array<['7' | '30' | 'all', string]>).map(([value, label]) => (
            <a
              key={value}
              href={href(value, 1, 1)}
              className={[
                'rounded-full px-3 py-1.5 transition',
                days === value
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              ].join(' ')}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">{isEn ? 'Total Posts' : '文章总数'}</div>
          <div className="mt-2 text-3xl font-semibold">{postCount}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">{isEn ? 'Published' : '已发布'}</div>
          <div className="mt-2 text-3xl font-semibold">{publishedCount}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">PV</div>
          <div className="mt-2 text-3xl font-semibold">{totalPv}</div>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">UV</div>
          <div className="mt-2 text-3xl font-semibold">{totalUv}</div>
        </div>
      </div>

      <AnalyticsCharts trends={trends} topPaths={topPaths} locale={locale} days={days} />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-medium">{isEn ? 'Traffic Source Details' : '来源明细'}</h3>
          <div className="mt-4 space-y-3 text-sm">
            {referrers.map((item, index) => (
              <div key={`${item.refererHost}-${index}`} className="flex items-center justify-between">
                <span>{item.refererHost || 'direct'}</span>
                <span>{item._count.refererHost}</span>
              </div>
            ))}
            {!referrers.length ? (
              <div className="text-neutral-500 dark:text-neutral-400">{isEn ? 'No data' : '暂无数据'}</div>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <a
              href={sourcePageSafe > 1 ? href(days, sourcePageSafe - 1, ipPageSafe) : '#'}
              className={sourcePageSafe > 1 ? 'hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
            >
              {isEn ? 'Previous' : '上一页'}
            </a>
            <span>{isEn ? `Page ${sourcePageSafe}/${sourceTotalPages}` : `第 ${sourcePageSafe}/${sourceTotalPages} 页`}</span>
            <a
              href={sourcePageSafe < sourceTotalPages ? href(days, sourcePageSafe + 1, ipPageSafe) : '#'}
              className={sourcePageSafe < sourceTotalPages ? 'hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
            >
              {isEn ? 'Next' : '下一页'}
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-medium">{isEn ? 'IP / Geo Details' : 'IP / 地域明细'}</h3>
          <div className="mt-4 space-y-3 text-sm">
            {visitors.map((item, index) => (
              <div key={`${item.ip}-${index}`} className="flex items-center justify-between gap-4">
                <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-4">
                  <span className="truncate font-medium">{item.ip || 'Unknown IP'}</span>
                  <span className="truncate whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                    {[item.country, item.city].filter(Boolean).join(' / ') || (isEn ? 'Unknown area' : '未知地区')}
                  </span>
                </div>
                <span>{item._count.ip}</span>
              </div>
            ))}
            {!visitors.length ? (
              <div className="text-neutral-500 dark:text-neutral-400">{isEn ? 'No data' : '暂无数据'}</div>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <a
              href={ipPageSafe > 1 ? href(days, sourcePageSafe, ipPageSafe - 1) : '#'}
              className={ipPageSafe > 1 ? 'hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
            >
              {isEn ? 'Previous' : '上一页'}
            </a>
            <span>{isEn ? `Page ${ipPageSafe}/${ipTotalPages}` : `第 ${ipPageSafe}/${ipTotalPages} 页`}</span>
            <a
              href={ipPageSafe < ipTotalPages ? href(days, sourcePageSafe, ipPageSafe + 1) : '#'}
              className={ipPageSafe < ipTotalPages ? 'hover:text-neutral-900 dark:hover:text-neutral-100' : 'pointer-events-none opacity-40'}
            >
              {isEn ? 'Next' : '下一页'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
