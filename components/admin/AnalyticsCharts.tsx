'use client';

import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

type TrendItem = { date: string; pv: number; uv: number };
type PathItem = { path: string; value: number };

export default function AnalyticsCharts({
  trends,
  topPaths,
  locale,
  days,
}: {
  trends: TrendItem[];
  topPaths: PathItem[];
  locale: 'zh' | 'en';
  days: '7' | '30' | 'all';
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const colors = useMemo(
    () =>
      isDark
        ? {
            grid: '#3f3f46',
            axis: '#a1a1aa',
            tooltipBg: '#18181b',
            tooltipBorder: '#3f3f46',
            pv: '#f5f5f5',
            uv: '#93c5fd',
          }
        : {
            grid: '#e5e7eb',
            axis: '#6b7280',
            tooltipBg: '#ffffff',
            tooltipBorder: '#e5e7eb',
            pv: '#111827',
            uv: '#6b7280',
          },
    [isDark]
  );
  const t = locale === 'en'
    ? {
        trend: days === 'all' ? 'PV / UV Trend (All)' : `PV / UV Trend (${days} days)`,
        topPath: 'Top Internal URLs',
        noData: 'No data',
      }
    : {
        trend: days === 'all' ? '全部时间 PV / UV 趋势' : `近 ${days} 天 PV / UV 趋势`,
        topPath: '站内 URL 访问排行',
        noData: '暂无数据',
      };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-medium">{t.trend}</h3>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="date" stroke={colors.axis} />
              <YAxis stroke={colors.axis} />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.tooltipBg,
                  borderColor: colors.tooltipBorder,
                  borderRadius: 12,
                }}
              />
              <Line type="monotone" dataKey="pv" stroke={colors.pv} strokeWidth={2} />
              <Line type="monotone" dataKey="uv" stroke={colors.uv} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="text-lg font-medium">{t.topPath}</h3>
        <div className="mt-4 space-y-3 text-sm">
          {topPaths.map((item) => (
            <div key={item.path} className="flex items-center justify-between gap-4">
              <a
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition hover:text-neutral-900 dark:text-neutral-300 dark:decoration-neutral-700 dark:hover:text-neutral-100"
              >
                {item.path}
              </a>
              <span>{item.value}</span>
            </div>
          ))}
          {!topPaths.length ? (
            <div className="text-neutral-500 dark:text-neutral-400">{t.noData}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
