'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, FileText, Home, SearchCode, Settings } from 'lucide-react';

const items = [
  { href: '/admin', label: '仪表盘', icon: Home },
  { href: '/admin/posts', label: '文章管理', icon: FileText },
  { href: '/admin/analytics', label: '访问统计', icon: BarChart3 },
  { href: '/admin/seo', label: 'SEO 配置', icon: SearchCode },
  { href: '/admin/settings', label: '系统设置', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-neutral-200 bg-white/90 p-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90 lg:min-h-screen lg:border-b-0 lg:border-r lg:p-6">
      <div className="mb-4 hidden lg:block">
        <div className="text-lg font-semibold">维成小站</div>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">Admin Panel</div>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === '/admin'
            ? pathname === '/admin'
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'inline-flex min-w-fit items-center gap-2 rounded-2xl px-4 py-3 text-sm transition',
                active
                  ? 'bg-neutral-900 text-white shadow-sm dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800',
              ].join(' ')}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
