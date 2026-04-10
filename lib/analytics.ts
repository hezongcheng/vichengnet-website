import { prisma } from './prisma';

function formatDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function getDailyTrends(days = 7) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const events = await prisma.visitEvent.findMany({
    where: { createdAt: { gte: start } },
    select: { createdAt: true, visitorId: true },
    orderBy: { createdAt: 'asc' },
  });

  const map = new Map<string, { pv: number; visitorSet: Set<string> }>();

  for (let i = 0; i < days; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    map.set(formatDate(day), { pv: 0, visitorSet: new Set() });
  }

  for (const item of events) {
    const key = formatDate(item.createdAt);
    const bucket = map.get(key);
    if (!bucket) continue;
    bucket.pv += 1;
    bucket.visitorSet.add(item.visitorId);
  }

  return Array.from(map.entries()).map(([date, value]) => ({
    date,
    pv: value.pv,
    uv: value.visitorSet.size,
  }));
}

export async function getPathPvMap(paths: string[]) {
  if (!paths.length) return new Map<string, number>();

  const groups = await prisma.visitEvent.groupBy({
    by: ['path'],
    where: { path: { in: paths } },
    _count: { path: true },
  });

  const map = new Map<string, number>();
  for (const row of groups) {
    map.set(row.path, row._count.path);
  }
  return map;
}

export async function getPostPv(slug: string) {
  return prisma.visitEvent.count({
    where: { path: `/posts/${slug}` },
  });
}

export async function getPopularPostSlugs(limit = 5) {
  const groups = await prisma.visitEvent.groupBy({
    by: ['path'],
    where: { path: { startsWith: '/posts/' } },
    _count: { path: true },
    orderBy: { _count: { path: 'desc' } },
    take: limit * 3,
  });

  const slugs = groups
    .map((row) => row.path.replace(/^\/posts\//, ''))
    .filter(Boolean);

  return Array.from(new Set(slugs)).slice(0, limit);
}
